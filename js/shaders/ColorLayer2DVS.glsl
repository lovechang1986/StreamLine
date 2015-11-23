	attribute float aVertexNumber;
	uniform float uWidth;
	uniform float uHeight;
	uniform sampler2D uSampler;
	uniform vec4 uNodeValue1;
	uniform vec4 uNodeValue2;
	varying vec4 vColor;
	vec2 coordFromVertexNumber(float aVertexNumber,float uWidth, float uHeight){
		vec2 texCoord;
		float i,j;
		i = floor(aVertexNumber / uWidth);
		j = mod(aVertexNumber,uWidth);
		return vec2(1.0/uWidth*(j+0.5), 1.0/uHeight*(i+0.5));
	}
	vec4 computePosition(vec2 degrees){
		return vec4(-1.0+2.0*degrees.x/360.0,2.0*degrees.y/180.0,.0,1.0);
	}
	vec4 interpolateColor(float x,float edgef0,float edgef1,vec4 color0,vec4 color1){
		float t;
		t = clamp((x-edgef0)/(edgef1-edgef0),0.0,1.0);
		vec4 color;
		color = vec4(t)*(color1-color0)+color0;
		return color;
	}
	vec4 computeColor(vec2 values){
		vec4 color;
		float vertexValue = length(values);
		float nodeValues[7];
		vec4 colorValues[7];
		float noDataValue = uNodeValue2.a;
		nodeValues[0] = uNodeValue1.x;
		nodeValues[1] = uNodeValue1.y;
		nodeValues[2] = uNodeValue1.z;
		nodeValues[3] = uNodeValue1.w;
		nodeValues[4] = uNodeValue2.x;
		nodeValues[5] = uNodeValue2.y;
		nodeValues[6] = uNodeValue2.z;
		colorValues[0] = vec4(139.0/255.0,0.0,1.0,1.0);
		colorValues[1] = vec4(0.0,0.0,1.0,1.0);
		colorValues[2] = vec4(0.0,127.0/255.0,1.0,1.0);
		colorValues[3] = vec4(0.0,1.0,0.0,1.0);
		colorValues[4] = vec4(1.0,1.0,0.0,1.0);
		colorValues[5] = vec4(1.0,165.0/255.0,0.0,1.0);
		colorValues[6] = vec4(1.0,0.0,0.0,1.0);
		if(vertexValue > 32766.0 || vertexValue <= -32766.0){
			color=vec4(0.0,0.0,0.0,0.0);
		}else if(vertexValue < nodeValues[0]){
			color=vec4(139.0/255.0,0.0,1.0,1.0);
		}else if(vertexValue < nodeValues[1]){
			color = interpolateColor(vertexValue,nodeValues[0],nodeValues[1],colorValues[0],colorValues[1]);
		}else if(vertexValue < nodeValues[2]){
			color = interpolateColor(vertexValue,nodeValues[1],nodeValues[2],colorValues[1],colorValues[2]);
		}else if(vertexValue < nodeValues[3]){
			color = interpolateColor(vertexValue,nodeValues[2],nodeValues[3],colorValues[2],colorValues[3]);
		}else if(vertexValue < nodeValues[4]){
			color = interpolateColor(vertexValue,nodeValues[3],nodeValues[4],colorValues[3],colorValues[4]);
		}else if(vertexValue < nodeValues[5]){
			color = interpolateColor(vertexValue,nodeValues[4],nodeValues[5],colorValues[4],colorValues[5]);
		}else{
			color = interpolateColor(vertexValue,nodeValues[5],nodeValues[6],colorValues[5],colorValues[6]);
		}
		return color;
	}
	void main(void){
		vec2 texCoord;
		texCoord = coordFromVertexNumber(aVertexNumber,uWidth,uHeight);
		vec4 texValues = texture2D(uSampler,texCoord);
		vec2 values = texValues.ba;
		vec2 degrees = texValues.rg;
		gl_Position = computePosition(degrees);
		vColor = computeColor(values);
	}