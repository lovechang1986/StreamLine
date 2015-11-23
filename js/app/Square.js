/**
 * Created by work on 2015/11/16.
 */
define(["app/ShaderProgram","lib/glMatrix-0.9.5.min"],function(ShaderProgram){
    var Square = function(gl){
        this.gl = gl;
        var shaderProgram = new ShaderProgram(gl,"square");
        //将attribute、uniform位置绑定到shaderProgram上
        var buffers = createBuffers(gl);
        var uniforms = createUniforms(gl);
        bindingLocation(gl,shaderProgram);
        this.bindBuffers = function(){
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffers.position.itemSize, gl.FLOAT, false, 0, 0);

        };
        this.setUniforms = function(){
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, uniforms.pMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, uniforms.mvMatrix);
        };
        this.draw = function(){
            gl.useProgram(shaderProgram);
            this.bindBuffers();
            this.setUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP,0,buffers.position.numItems);
        };
    };
    //将着色器中attribute、uniform位置绑定到shaderProgram对象上
    //不同的着色器处理方式有差异，同时会影响到draw
    function bindingLocation(gl,shaderProgram){
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,"aVertexPosition");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }
    function createBuffers(gl){
        var buffers = {};
        var positions = [
            1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
            1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        buffers.position = createBuffer(gl,positions,3);
        return buffers;
    }
    function createUniforms(gl){
        var uniforms = {};
        uniforms.mvMatrix = mat4.create();
        uniforms.pMatrix = mat4.create();
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, uniforms.pMatrix);
        mat4.identity(uniforms.mvMatrix);

        mat4.translate(uniforms.mvMatrix, [-0.0, 0.0, -7.0]);
        return uniforms;
    }
    function createBuffer(gl,values,itemSize){
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
        buffer.itemSize = itemSize;
        buffer.numItems = values.length/itemSize;
        return buffer;
    }

    return Square;
});