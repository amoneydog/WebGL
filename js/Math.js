
/************** Vector3 *****************/

/**
 * Vector3
 * @constructor
 */
function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

/**
 * Clone self
 * @returns {Vector3} The new Vector
 */
Vector3.prototype.clone = function () {
    return new Vector3(this.x, this.y, this.z);
};

/**
 * Set the value of index, 0 is x, 1 is y, 2 is z
 * @param i The index
 * @param v The value
 */
Vector3.prototype.set = function (i, v) {
    switch (i) {
        case 0:
            this.x = v;
            break;
        case 1:
            this.y = v;
            break;
        case 2:
            this.z = v;
            break
    }
};

/**
 * Get the value by index, 0 is x, 1 is y, 2 is z
 * @param i The index
 * @returns {*} the value
 */
Vector3.prototype.get = function (i) {
    switch (i) {
        case 0:
            return this.x;
        case 1:
            return this.y;
        case 2:
            return this.z;
    }
};

/**
 * Get the vector length
 * @returns {*} the value
 */
Vector3.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
 * Normalize this vector
 */
Vector3.prototype.normalize = function () {
    var k = this.length();
    this.x /= k;
    this.y /= k;
    this.z /= k;
    return this;
};

Vector3.toArray = function (v) {
    if (v instanceof Vector3) return [v.x, v.y, v.z];
    else return [v, v, v];
};

/**
 * Vector add operator
 * @param l The left side
 * @param r The right side
 * @returns {Vector3} The result vector
 */
Vector3.add = function (l, r) {
    var v1 = Vector3.toArray(l), v2 = Vector3.toArray(r);
    return new Vector3(v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]);
};

/**
 * Vector sub operator
 * @param l The left side
 * @param r The right side
 * @returns {Vector3} The result vector
 */
Vector3.sub = function (l, r) {
    var v1 = Vector3.toArray(l), v2 = Vector3.toArray(r);
    return new Vector3(v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]);
};

/**
 * Vector mul operator
 * @param l The left side
 * @param r The right side
 * @returns {Vector3} The result vector
 */
Vector3.mul = function (l, r) {
    var v1 = Vector3.toArray(l), v2 = Vector3.toArray(r);
    return new Vector3(v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]);
};

/**
 * Vector div operator
 * @param l The left side
 * @param r The right side
 * @returns {Vector3} The result vector
 */
Vector3.div = function (l, r) {
    var v1 = Vector3.toArray(l), v2 = Vector3.toArray(r);
    return new Vector3(v1[0] / v2[0], v1[1] / v2[1], v1[2] / v2[2]);
};

/**
 * Vector dot operator
 * @param l The left side
 * @param r The right side
 * @returns {number} The result
 */
Vector3.dot = function (l, r) {
    return l.x * r.x + l.y * r.y + l.z * r.z;
};

/**
 * The ratio between radian and degree
 * @type {number}
 */
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;

/**
 * Get the angle between two vectors
 * @param l The left side
 * @param r The right side
 * @returns {number} The angle on degree
 */
Vector3.angleBetween = function (l, r) {
    return Math.acos(Vector3.dot(l, r) / (l.length() * r.length())) * R2D;
};

/**
 * Get the cross vector between two vectors
 * @param l The left side
 * @param r The right side
 * @returns {Vector3} The result vector
 */
Vector3.cross = function (l, r) {
    return new Vector3(l.y * r.z - l.z * r.y, l.z * r.x - l.x * r.z, l.x * r.y - l.y * r.z);
};

/**
 * Vector to Float32Array
 * @param a
 * @return {Float32Array}
 */
Vector3.toFloat32Array = function (a) {
    if (a instanceof Array)
    {
        var ret = new Float32Array(a.length * 3);
        for (var i = 0; i < a.length; ++i)
        {
            ret[i * 3] = a[i].x;
            ret[i * 3 + 1] = a[i].y;
            ret[i * 3 + 2] = a[i].z;
        }
        return ret;
    }else{
        return new Float32Array([a.x, a.y, a.z]);
    }
};


/************** Matrix *****************/

/**
 * Matrix
 * @param a The data array, return identify matrix if a not instanceof Array
 * @constructor
 */
function Matrix(a) {
     if (a instanceof Array)
     {
         this.data = new Float32Array(a);
     }else{
         this.data = new Float32Array([
             1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1]);
     }
}

/**
 * Clone this matrix
 * @return {Matrix}
 */
Matrix.prototype.clone = function () {
    return new Matrix(this.data);
};

/**
 * Mul operator
 * @param l The left side
 * @param r The right side
 * @return {Matrix}
 */
Matrix.mul = function (l, r) {
    var arr = new Array(16);
    for (var i = 0; i < 4; ++i) {
        for (var j = 0; j < 4; ++j) {
            arr[i * 4 + j] = l.data[i * 4] * r.data[j]
                + l.data[i * 4 + 1] * r.data[j + 4]
                + l.data[i * 4 + 2] * r.data[j + 8]
                + l.data[i * 4 + 3] * r.data[j + 12];
        }
    }
    return new Matrix(arr);
};

/**
 * Construct a translate matrix
 * @param dx The X offset
 * @param dy The Y offset
 * @param dz The Z offset
 * @return {Matrix}
 */
Matrix.trans = function (dx, dy, dz) {
    return new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        dx, dy, dz, 1]);
};

/**
 * Construct a scale matrix
 * @param kx The X ratio
 * @param ky The Y ratio
 * @param kz The Z ratio
 * @return {Matrix}
 */
Matrix.scale = function (kx, ky, kz) {
    return new Matrix([
        kx, 0, 0, 0,
        0, ky, 0, 0,
        0, 0, kz, 0,
        0, 0, 0, 1]);
};

/**
 * Construct a rotateX matrix
 * @param a The angle on degree
 * @return {Matrix}
 */
Matrix.rotateX = function (a) {
    var r = a * D2R;
    var s = Math.sin(r);
    var c = Math.cos(r);
    return new Matrix([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1]);
};

/**
 * Construct a rotateY matrix
 * @param a The angle on degree
 * @return {Matrix}
 */
Matrix.rotateY = function (a) {
    var r = a * D2R;
    var s = Math.sin(r);
    var c = Math.cos(r);
    return new Matrix([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1]);
};

/**
 * Construct a rotateZ matrix
 * @param a The angle on degree
 * @return {Matrix}
 */
Matrix.rotateZ = function (a) {
    var r = a * D2R;
    var s = Math.sin(r);
    var c = Math.cos(r);
    return new Matrix([
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);
};

/**
 * Construct a ortho matrix
 * @param l The left min
 * @param r The right max
 * @param b The bottom min
 * @param t The top max
 * @param zn The depth min
 * @param zf The depth max
 * @return {Matrix}
 */
Matrix.ortho = function (l, r, b, t, zn, zf) {
    var w = 1 / (r - l);
    var h = 1 / (t - b);
    var d = 1 / (zf - zn);
    return new Matrix([
        2 * w, 0, 0, 0,
        0, 2 * h, 0, 0,
        0, 0, -2 * d, 0,
        -(r + l) * w, -(t + b) * h, -(zf + zn) * d, 1]);
};

/**
 * Construct a lookAt matrix
 * @param eye The eye position
 * @param target The target position
 * @param upDir The eye up dir
 * @return {Matrix}
 */
Matrix.lookAt = function (eye, target, upDir) {
    var forward = Vector3.sub(target, eye).normalize();
    var up = upDir.clone().normalize();
    var side = Vector3.cross(up, forward).normalize();
    up = Vector3.cross(forward, side).normalize();

    return new Matrix([
        side.x, up.x, -forward.x, 0,
        side.y, up.y, -forward.y, 0,
        side.z, up.z, -forward.z, 0,
        -Vector3.dot(side, eye), -Vector3.dot(up, eye), -Vector3.dot(forward, eye), 1
    ]);
};

