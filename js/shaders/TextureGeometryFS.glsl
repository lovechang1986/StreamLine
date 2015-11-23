    precision mediump float;
    uniform sampler2D uSampler;
    varying vec2 vTextureCoord;
    void main(void) {
        //gl_FragColor = texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));
        vec4 color = texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));
        if(color.a > 1.0){
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }else if(color.a > 0.0){
            gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        }else if(color.a > -1.0){
            gl_FragColor = vec4(0.0,0.0,1.0,1.0);
        }else{
            gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
    }