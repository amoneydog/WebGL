
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

GLX.Load_P3C4 = function () {
    if (GLX.P3C4) return GLX.P3C4;
    var vs = GLX.CreateShader(gl.VERTEX_SHADER, "\n\
            attribute highp vec3 position;\n\
            attribute lowp vec4 color;\n\
            uniform highp mat4 world;\n\
            varying lowp vec4 outColor;\n\
            void main()\n\
            {\n\
                outColor = color;\n\
                gl_Position = world * vec4(position, 1);\n\
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
    var attrPos = gl.getAttribLocation(program, "position");
    var attrColor = gl.getAttribLocation(program, "color");
    var unifWorld = gl.getUniformLocation(program, "world");
    GLX.P3C4 = {
        begin: function () {
            gl.useProgram(program);
            gl.enableVertexAttribArray(attrPos);
            gl.enableVertexAttribArray(attrColor);
        },
        end: function () {
            gl.disableVertexAttribArray(attrPos);
            gl.disableVertexAttribArray(attrColor);
            gl.useProgram(null);
        },
        setPositionVBO: function (vbo, stride, offset) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(attrPos, 3, gl.FLOAT, false, stride ? 0 : stride, offset ? 0 : offset);
        },
        setColorVBO: function (vbo, stride, offset) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(attrColor, 4, gl.FLOAT, false, stride ? 0 : stride, offset ? 0 : offset);
        },
        setWorldMat: function (mat) {
            gl.uniformMatrix4fv(unifWorld, false, mat.data);
        }
    };
    return GLX.P3C4;
};


GLX.Load_P3UC4 = function () {
    if (GLX.P3UC4) return GLX.P3UC4;
    var vs = GLX.CreateShader(gl.VERTEX_SHADER, "\n\
            attribute highp vec3 position;\n\
            uniform highp mat4 world;\n\
            void main()\n\
            {\n\
                gl_Position = world * vec4(position, 1);\n\
            }\n\
        ");
    var fs = GLX.CreateShader(gl.FRAGMENT_SHADER, "\n\
            uniform lowp vec4 color;\n\
            void main()\n\
            {\n\
                gl_FragColor = color;\n\
            }\n\
        ");
    var program = GLX.CreateProgram(vs, fs);
    var attrPos = gl.getAttribLocation(program, "position");
    var unifColor = gl.getUniformLocation(program, "color");
    var unifWorld = gl.getUniformLocation(program, "world");
    GLX.P3UC4 = {
        begin: function () {
            gl.useProgram(program);
            gl.enableVertexAttribArray(attrPos);
        },
        end: function () {
            gl.disableVertexAttribArray(attrPos);
            gl.useProgram(null);
        },
        setPositionVBO: function (vbo, stride, offset) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(attrPos, 3, gl.FLOAT, false, stride ? 0 : stride, offset ? 0 : offset);
        },
        setColor: function (r, g, b, a) {
            gl.uniform4f(unifColor, r, g, b, a);
        },
        setWorldMat: function (mat) {
            gl.uniformMatrix4fv(unifWorld, false, mat.data);
        }
    };
    return GLX.P3UC4;
};
