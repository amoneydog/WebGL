
try { window.gl = new WebGLRenderingContext() }catch(err){ "Just declare the gl type for WebStorm" }

var GLX = new Object();

// bind the gl to window
Window.GLX = GLX;

/********************** Add GLX Function *************************/

GLX.CreateShader = function (type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shader: %s', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

GLX.CreateProgram = function (vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('An error occurred linking the shader program: %s', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
};

GLX.CreateVBO = function (datas, dynamic) {
    var buffer = gl.createBuffer();
    if (datas) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, datas, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    return buffer;
};

GLX.CreateIBO = function (datas, dynamic) {
    var buffer = gl.createBuffer();
    if (datas) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, datas, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    return buffer;
};

/********************** Add GLSL Programs *************************/

GLX.Load_P3C4_INST = function () {
    if (GLX.P3C4_INST) return GLX.P3C4_INST;
    var vs = GLX.CreateShader(gl.VERTEX_SHADER, "\n\
            attribute highp vec3 position;\n\
            // Instanced    \n\
            attribute highp vec3 pos;\n\
            attribute highp vec3 scale;\n\
            attribute highp vec4 rot;\n\
            attribute lowp vec4 color;\n\
            \n\
            uniform highp mat4 mvp;\n\
            varying lowp vec4 outColor;\n\
            mat4 makeTransition(vec3 t, vec3 s, vec4 r){\n\
                return mat4(s.x, 0, 0, 0,\
                    0, s.y, 0, 0,\
                    0, 0, s.z, 0,\
                    t.x, t.y, t.z, 1);\n\
            }\n\
            void main()\n\
            {\n\
                outColor = color;\n\
                mat4 matModel = makeTransition(pos, scale, rot);\
                gl_Position = mvp * matModel * vec4(position, 1);\n\
            }\n\
        ");
    var fs = GLX.CreateShader(gl.FRAGMENT_SHADER, "\n\
            varying lowp vec4 outColor;\n\
            void main()\n\
            {\n\
                gl_FragColor = outColor;\n\
            }\n\
        ");
    var program = GLX.CreateProgram(vs, fs);
    GLX.P3C4_INST = {
        begin: function () {
            gl.useProgram(program);
            gl.enableVertexAttribArray(this.attrPosition);
            gl.enableVertexAttribArray(this.attrInstPos);
            gl.enableVertexAttribArray(this.attrInstScale);
            gl.enableVertexAttribArray(this.attrInstRot);
            gl.enableVertexAttribArray(this.attrInstColor);
            gl.vertexAttribDivisor(this.attrInstPos, 1);
            gl.vertexAttribDivisor(this.attrInstScale, 1);
            gl.vertexAttribDivisor(this.attrInstRot, 1);
            gl.vertexAttribDivisor(this.attrInstColor, 1);
        },
        end: function () {
            gl.disableVertexAttribArray(this.attrPosition);
            gl.disableVertexAttribArray(this.attrInstPos);
            gl.disableVertexAttribArray(this.attrInstScale);
            gl.disableVertexAttribArray(this.attrInstRot);
            gl.disableVertexAttribArray(this.attrInstColor);
            gl.vertexAttribDivisor(this.attrInstPos, 0);
            gl.vertexAttribDivisor(this.attrInstScale, 0);
            gl.vertexAttribDivisor(this.attrInstRot, 0);
            gl.vertexAttribDivisor(this.attrInstColor, 0);
            gl.useProgram(null);
        },
        attrPosition: gl.getAttribLocation(program, "position"),
        attrInstPos: gl.getAttribLocation(program, "pos"),
        attrInstScale: gl.getAttribLocation(program, "scale"),
        attrInstRot: gl.getAttribLocation(program, "rot"),
        attrInstColor: gl.getAttribLocation(program, "color"),
        unifMVP: gl.getUniformLocation(program, "mvp")
    };
    return GLX.P3C4_INST;
};