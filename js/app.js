requirejs.config({
    baseUrl : 'js',
    paths : {
    },
    shim : {}
});
var jsArray = ['app/WebglContext','app/StreamLine', 'lib/jquery' ];
require(jsArray, function(WebglContext,Noise) {
    "use strict";
    var context = new WebglContext("streamline");
    var gl = context.gl;
    var square = new Noise(gl);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    tick();
    function tick(){
        requestAnimationFrame(tick);
        gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        square.draw();
    }
    /**
     *
     */
    //$("#hello").html("欢迎使用require");
});
