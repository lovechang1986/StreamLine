    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    uniform sampler2D uSampler;
    varying vec4 vColor;
    void main(void) {
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
        vColor = texture2D(uSampler,vec2(aTextureCoord.s,aTextureCoord.t));
        if(vColor.r < 3.0){
        	vColor = vec4(1.0,.0,.0,1.0);
        }else if(vColor.r < 6.0){
        	vColor = vec4(.0,1.0,.0,1.0);
        }else{
        	vColor = vec4(.0,.0,1.0,1.0);
        }
    }