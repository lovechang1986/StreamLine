/**
 * Created by work on 2015/11/16.
 */
define([],function(){
    var ImageTexture = function(gl,imgUrl){
        var texture  = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function(){
            handleLoadedTexture(gl,texture);
        };
        texture.image.src = imgUrl;
        return texture;
    };
    function handleLoadedTexture(gl,texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    return ImageTexture;
});