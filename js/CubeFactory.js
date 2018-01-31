function CubeFactory() {
    this.instances = [];
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
    const trianglesIndices = [
        0, 1, 2, 2, 3, 0,
        4, 5, 6, 6, 7, 4,
        4, 5, 1, 1, 0, 4,
        7, 6, 2, 2, 3, 7,
        1, 5, 6, 6, 2, 1,
        0, 4, 7, 7, 3, 0
    ];
    this.boxVBO = GLX.CreateVBO(new Float32Array(vertexs));
    this.linesIBO = GLX.CreateIBO(new Uint8Array(linesIndices));
    this.trianglesIBO = GLX.CreateIBO(new Uint8Array(trianglesIndices));
    this.linesIndicesCount = linesIndices.length;
    this.trianglesIndicesCount = trianglesIndices.length;
}

CubeFactory.prototype.addBox = function(size, pos, rot, color) {
    this.instances.push(pos[0]);
    this.instances.push(pos[1]);
    this.instances.push(pos[2]);
    this.instances.push(size[0]);
    this.instances.push(size[1]);
    this.instances.push(size[2]);
    this.instances.push(rot[0]);
    this.instances.push(rot[1]);
    this.instances.push(rot[2]);
    this.instances.push(rot[3]);
    this.instances.push(color[0]);
    this.instances.push(color[1]);
    this.instances.push(color[2]);
    this.instances.push(color[3]);
    this.needRecreateInstance = true;
};

CubeFactory.prototype.setBoxPos = function(index, pos){
    this.instances[index * 14] = pos[0];
    this.instances[index * 14 + 1] = pos[1];
    this.instances[index * 14 + 2] = pos[2];
    if (! this.needRecreateInstance) {
        if (this.instancesVBO) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.instancesVBO);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * 56, new Float32Array(pos));
        }else this.needRecreateInstance = true;
    }
};

CubeFactory.prototype.setBoxSize = function(index, size){
    this.instances[index * 14 + 3] = size[0];
    this.instances[index * 14 + 4] = size[1];
    this.instances[index * 14 + 5] = size[2];
    if (! this.needRecreateInstance) {
        if (this.instancesVBO) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.instancesVBO);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * 56 + 12, new Float32Array(size));
        }else this.needRecreateInstance = true;
    }
};

CubeFactory.prototype.setBoxRot = function(index, rot){
    this.instances[index * 14 + 6] = rot[0];
    this.instances[index * 14 + 7] = rot[1];
    this.instances[index * 14 + 8] = rot[2];
    this.instances[index * 14 + 9] = rot[3];
    if (! this.needRecreateInstance) {
        if (this.instancesVBO) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.instancesVBO);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * 56 + 24, new Float32Array(rot));
        }else this.needRecreateInstance = true;
    }
};

CubeFactory.prototype.setBoxColor = function(index, color){
    this.instances[index * 14 + 10] = color[0];
    this.instances[index * 14 + 11] = color[1];
    this.instances[index * 14 + 12] = color[2];
    this.instances[index * 14 + 13] = color[3];
    if (! this.needRecreateInstance) {
        if (this.instancesVBO) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.instancesVBO);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * 56 + 40, new Float32Array(color));
        }else this.needRecreateInstance = true;
    }
};

CubeFactory.prototype.removeBox = function (index) {
    this.instances.splice(index * 14, 14);
    this.needRecreateInstance = true;
};

CubeFactory.prototype.instanceCount = function () {
    return this.instances.length / 14;
};

CubeFactory.prototype.onRender = function (context) {
    if (this.needRecreateInstance) {
        if (this.instancesVBO) gl.deleteBuffer(this.instancesVBO);
        this.instancesVBO = GLX.CreateVBO(new Float32Array(this.instances));
        this.needRecreateInstance = false;
    }
    var pro = GLX.Load_P3C4_INST();
    pro.begin();
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.boxVBO);
        gl.vertexAttribPointer(pro.attrPosition, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instancesVBO);
        gl.vertexAttribPointer(pro.attrInstPos, 3, gl.FLOAT, false, 56, 0);
        gl.vertexAttribPointer(pro.attrInstScale, 3, gl.FLOAT, false, 56, 12);
        gl.vertexAttribPointer(pro.attrInstRot, 4, gl.FLOAT, false, 56, 24);
        gl.vertexAttribPointer(pro.attrInstColor, 4, gl.FLOAT, false, 56, 40);
        gl.uniformMatrix4fv(pro.unifMVP, false, context.matMVP);
        if (context.bordered){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.linesIBO);
            gl.drawElementsInstanced(gl.LINES, this.linesIndicesCount, gl.UNSIGNED_BYTE, 0, this.instanceCount());
        }else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIBO);
            gl.drawElementsInstanced(gl.TRIANGLES, this.trianglesIndicesCount, gl.UNSIGNED_BYTE, 0, this.instanceCount());
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    pro.end();
};