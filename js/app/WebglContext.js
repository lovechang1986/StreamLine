/**
 * Created by work on 2015/11/12.
 */
define(function(){
    var WebglContext = function(id){
        var canvas = document.getElementById(id);
        var gl = initGL(canvas);
        this.gl = gl;
    };
    function initGL(canvas) {
        try {
            var gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        return gl;
    }
    return WebglContext;
});
