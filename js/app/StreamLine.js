/**
 * Created by work on 2015/11/19.
 */
define(["app/ShaderProgram","app/NoiseFrame","app/Vector","lib/glMatrix-0.9.5.min"],function(ShaderProgram,NoiseFrame,Vector){
    var StreamLine = function(){
        console.log(Vector);
        var shaderProgram = new ShaderProgram(gl,"streamline");
        //将attribute、uniform位置绑定到shaderProgram上
        var buffers = createBuffers(gl);
        var uniforms = createUniforms(gl);
        //var texture = new ImageTexture(gl,"sources/crate.gif");
        var noiseFrame = new NoiseFrame(gl);
        var texture = noiseFrame.texture;
        bindingLocation(gl,shaderProgram);
        this.bindBuffers = function(){
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffers.position.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.coord);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffers.coord.itemSize, gl.FLOAT, false, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.index);
        };
        this.setUniforms = function(){
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, uniforms.pMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, uniforms.mvMatrix);
            gl.uniform1i(shaderProgram.uSamplerUniform,false,0);
        };
        this.draw = function(){
            gl.useProgram(shaderProgram);
            this.bindBuffers();
            this.setUniforms();
            //gl.drawArrays(gl.TRIANGLE_STRIP,0,buffers.position.numItems);
            gl.drawElements(gl.TRIANGLES,buffers.index.numItems,gl.UNSIGNED_SHORT,0);
        };
    };
    //将着色器中attribute、uniform位置绑定到shaderProgram对象上
    //不同的着色器处理方式有差异，同时会影响到draw
    function bindingLocation(gl,shaderProgram){
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,"aVertexPosition");
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram,"aTextureCoord");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.uSamplerUniform = gl.getUniformLocation(shaderProgram,"uSampler");
    }
    function createBuffers(gl){
        var buffers = {};
        var positions = [
            -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0,
            1.0,  1.0,  0.0,
            -1.0,  1.0, 0.0
        ];
        var coords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        var indices = [0,1,2,0,2,3];
        buffers.position = createBuffer(gl,positions,3);
        buffers.coord = createBuffer(gl,coords,2);
        buffers.index = createElementBuffer(gl,indices);
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
    function createElementBuffer(gl,values){
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(values), gl.STATIC_DRAW);
        buffer.itemSize = 1;
        buffer.numItems = values.length;
        return buffer;
    }
    return StreamLine;
});