/**
 * Created by work on 2015/11/19.
 */
define(["app/ShaderProgram","app/NoiseFrame","app/Vector","lib/glMatrix-0.9.5.min"],function(ShaderProgram,NoiseFrame,Vector){
    var StreamLine = function(gl){
        console.log(Vector);
        var width = 31;
        var height = 31;
        Vector.width = width;
        Vector.height = height;
        var shaderProgram = new ShaderProgram(gl,"streamline");
        //将attribute、uniform位置绑定到shaderProgram上
        var buffers = createBuffers(gl);
        var uniforms = createUniforms(gl);
        //var texture = new ImageTexture(gl,"sources/crate.gif");
        var noiseFrame = new NoiseFrame(gl);
        var texture = noiseFrame.texture;
        var dataTexture = createDataTexture(gl,Vector,31,31);
        bindingLocation(gl,shaderProgram);
        this.bindBuffers = function(){
            gl.enableVertexAttribArray(shaderProgram.vertexNumberAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.number);
            gl.vertexAttribPointer(shaderProgram.vertexNumberAttribute, buffers.number.itemSize, gl.FLOAT, false, 0, 0);
            //gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
            //gl.bindBuffer(gl.ARRAY_BUFFER, buffers.coord);
            //gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffers.coord.itemSize, gl.FLOAT, false, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D,dataTexture);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.index);
        };
        this.setUniforms = function(){
            //gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, uniforms.pMatrix);
            //gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, uniforms.mvMatrix);
            gl.uniform1f(shaderProgram.uWidthUniform,uniforms.width);
            gl.uniform1f(shaderProgram.uHeightUniform,uniforms.height);
            gl.uniform1i(shaderProgram.uSamplerUniform,0);
            gl.uniform1i(shaderProgram.uDataUniform,1);
    };
        this.draw = function(){
            gl.useProgram(shaderProgram);
            this.bindBuffers();
            this.setUniforms();
            //gl.drawArrays(gl.TRIANGLE_STRIP,0,buffers.position.numItems);
            gl.drawElements(gl.POINTS,buffers.index.numItems,gl.UNSIGNED_SHORT,0);
        };
    };

    /**
     * 根据传入的四维向量的数组，生成浮点型纹理
     * @param gl webgl上下文
     * @param array 数组，每四个一组
     * @param width 生成纹理的宽度
     * @param height 生成纹理的高度  一般width*height就是数组的长度*4
     * @return texture webgl纹理
     */
    function createDataTexture(gl,array,width,height){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var float_ext = gl.getExtension("OES_texture_float");
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.FLOAT,new Float32Array(array));
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D,null);
        return texture;
    }
    //将着色器中attribute、uniform位置绑定到shaderProgram对象上
    //不同的着色器处理方式有差异，同时会影响到draw
    function bindingLocation(gl,shaderProgram){
        shaderProgram.vertexNumberAttribute = gl.getAttribLocation(shaderProgram,"aVertexNumber");
        //shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram,"aTextureCoord");
        //shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        //shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.uSamplerUniform = gl.getUniformLocation(shaderProgram,"uSampler");
        shaderProgram.uDataUniform = gl.getUniformLocation(shaderProgram,"uData");
        shaderProgram.uWidthUniform = gl.getUniformLocation(shaderProgram,"uWidth");
        shaderProgram.uHeightUniform = gl.getUniformLocation(shaderProgram,"uHeight");
    }
    function createBuffers(gl){
        var buffers = {};
        var dataLen = Vector.length/4;
        var numbers = [];
        for(var i=0;i<dataLen;i++){
            numbers.push(i);
        }
        var width = Vector.width;
        var height = Vector.height;
        var indices = createIndices(width,height);
        //indices = [620];
        buffers.number = createBuffer(gl,numbers,1);
        buffers.index = createElementBuffer(gl,indices);
        return buffers;
    }
    function createIndices(width,height){
        var indices = [];
        for(var i=0;i<height-1;i++){
            for(var j=0;j<width-1;j++){
                var first = i * width + j;
                var second = first + width;
                indices.push(second);
                indices.push(first);
                indices.push(second+1);
                indices.push(second+1);
                indices.push(first);
                indices.push(first+1);
            }
        }
        return indices;
    }
    function createUniforms(gl){
        var uniforms = {};
        uniforms.width = Vector.width;
        uniforms.height = Vector.height;
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