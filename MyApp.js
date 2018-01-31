var keystate = {};
window.onkeydown = function (ev) { keystate[ev.key] = true; };
window.onkeyup = function (ev) { keystate[ev.key] = false; };

function ProcessKeyboard(fElapsed) {
    //TODO: on process key event.
}

function main() {
    window.boxFactory = new CubeFactory();
    window.context = {
        bordered: false,
        eye: new Vector3(0, 0, 100),
        target: new Vector3(0, 0, 0),
        up: new Vector3(0, 1, 0),
        matMVP: new Float32Array(new Matrix().data)
    };

    var lastTime = 0;
    var FPS = document.getElementById("FPS");

    boxFactory.addBox([10, 10, 10], [0, 0, 0], [0, 0, 0, 1], [153 / 255, 155 / 255, 204 / 255, 1]);
    boxFactory.addBox([10, 10, 10], [20, 0, 0], [0, 0, 0, 1], [204/255, 153/255, 153/255, 1]);

    function Render(timestamp) {

        var fElapsed = (timestamp - lastTime) / 1000;
        ProcessKeyboard(fElapsed);

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        var matV = Matrix.lookAt(context.eye, context.target, context.up);
        var matP = Matrix.perspective(30, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100000);
        context.matMVP = new Float32Array(Matrix.mul(matV, matP).data);

        //TODO:
        window.boxFactory.onRender(context);

        gl.flush();
        requestAnimationFrame(Render);
        var fps = 1 / fElapsed;
        lastTime = timestamp;
        FPS.innerText = "FPS: " + fps.toFixed(3);
    }
    Render(0);
}