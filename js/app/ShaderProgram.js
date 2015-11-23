/**
 * Created by work on 2015/11/12.
 */
define(function(){
    var ShaderProgram = function(gl,id){
        var shaderProgram = gl.createProgram();
        var fragmentShader = getShader(gl, id+"-fs");
        var vertexShader = getShader(gl, id+"-vs");

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        //绑定着色器attribute的位置到shaderProgram对象上
        //shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        //绑定着色器uniform的位置到shaderProgram对象上
        //shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        //shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        return shaderProgram;
    };

    /**
     * 根据id创建相应的着色器
     * @param gl
     * @param id  xxx-vs or xxx-fs 代表定点着色器和片源着色器
     * @returns shader 着色器对象
     */
    function getShader(gl, id) {

        var ids = id.split("-");
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (ids[1] == "fs") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (ids[1] == "vs") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    return ShaderProgram;
});
