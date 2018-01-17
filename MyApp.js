
var pos;
var scale;
var rot;

var keystate = new Map();
window.onkeydown = function (ev) { keystate[ev.key] = true; };
window.onkeyup = function (ev) { keystate[ev.key] = false; };

function ProcessKeyboard(fElapsed) {
    var step = 100 * fElapsed;
    if (keystate['w']) pos.y += step;
    if (keystate['s']) pos.y -= step;
    if (keystate['a']) pos.x -= step;
    if (keystate['d']) pos.x += step;
    if (keystate['i']) pos.z -= step;
    if (keystate['o']) pos.z += step;

    if (keystate['+']) {
        if (keystate['x']) scale.x += step;
        if (keystate['y']) scale.y += step;
        if (keystate['z']) scale.z += step;
        if (keystate['j']) rot.x += step * 0.1;
        if (keystate['k']) rot.y += step * 0.1;
        if (keystate['l']) rot.z += step * 0.1;
    }
    if (keystate['-']) {
        if (keystate['x']) scale.x -= step;
        if (keystate['y']) scale.y -= step;
        if (keystate['z']) scale.z -= step;
        if (keystate['j']) rot.x -= step * 0.1;
        if (keystate['k']) rot.y -= step * 0.1;
        if (keystate['l']) rot.z -= step * 0.1;
    }
}

function main() {
    GLX.Load_P3UC4();

    var cube = Shaps.Cube();

    var lastTime = 0;

    var FPS = document.getElementById("FPS");

    pos = new Vector3(0, 0, 0);
    scale = new Vector3(100, 100, 100);
    rot = new Vector3(0, 0, 0);
    function Render(timestamp) {

        var fElapsed = (timestamp - lastTime) / 1000;
        ProcessKeyboard(fElapsed);

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        GLX.P3UC4.begin();
        {
            GLX.P3UC4.setPositionVBO(cube.vbo);
            GLX.P3UC4.setColor(1, 0, 0, 1);
            var matTrans = Matrix.trans(pos.x, pos.y, pos.z);
            var matScale = Matrix.scale(scale.x, scale.y, scale.z);
            var matRotateX = Matrix.rotateX(rot.x);
            var matRotateY = Matrix.rotateY(rot.y);
            var matRotateZ = Matrix.rotateZ(rot.z);
            var matRot = Matrix.mul(Matrix.mul(matRotateX, matRotateY), matRotateZ);
            var matM = Matrix.mul(Matrix.mul(matRot, matScale), matTrans);
            var matV = Matrix.lookAt(new Vector3(100, 0, 100), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
            var matP = Matrix.ortho(-gl.drawingBufferWidth / 2, gl.drawingBufferWidth / 2, -gl.drawingBufferHeight / 2, gl.drawingBufferHeight / 2, -5000, 5000);
            var mvp = Matrix.mul(Matrix.mul(matM, matV), matP);
            GLX.P3UC4.setWorldMat(mvp);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.linesIBO);
            gl.drawElements(gl.LINES, cube.LinesIndicesCount, cube.IBO_TYPE, 0);
        }
        GLX.P3UC4.end();
        gl.flush();
        requestAnimationFrame(Render);
        var fps = 1 / fElapsed;
        lastTime = timestamp;
        FPS.innerText = "FPS: " + fps.toFixed(3);
    }
    Render(0);
}