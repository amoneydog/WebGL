
var Shaps = {d:{}};

Shaps.Cube = function (){
    if (Shaps.d.cube) return Shaps.d.cube;
    const vertexs = [
        -0.5, -0.5, +0.5,   /**     5-----------6   **/
        -0.5, +0.5, +0.5,   /**    /|          /|   **/
        +0.5, +0.5, +0.5,   /**   1 --------- 2 |   **/
        +0.5, -0.5, +0.5,   /**   | |         | |   **/
        -0.5, -0.5, -0.5,   /**   | |         | |   **/
        -0.5, +0.5, -0.5,   /**   | 4---------|-7   **/
        +0.5, +0.5, -0.5,   /**   |/          |/    **/
        +0.5, -0.5, -0.5,   /**   0-----------3     **/
    ];
    const linesIndices = [
        0, 1, 1, 2, 2, 3, 3, 0,
        4, 5, 5, 6, 6, 7, 7, 4,
        0, 4, 1, 5, 3, 7, 2, 6
    ];
    Shaps.d.cube = {
        vbo: GLX.CreateVBO(new Float32Array(vertexs)),
        VBO_TYPE: gl.FLOAT,
        linesIBO: GLX.CreateIBO(new Uint8Array(linesIndices)),
        IBO_TYPE: gl.UNSIGNED_BYTE,
        LinesIndicesCount: linesIndices.length
    };
    return Shaps.d.cube;
}