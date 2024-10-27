
// createWebGLProgram creates a program from the sources of a vertex and fragment shader.
export function createWebGLProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
    const vertexShader = createVertexShader(gl, vertexSource);
    const fragmentShader = createFragmentShader(gl, fragmentSource);

    return createProgram(gl, vertexShader, fragmentShader);
}

function createVertexShader(gl: WebGLRenderingContext, source: string) {
  return createShader(gl, gl.VERTEX_SHADER, source);
}

function createFragmentShader(gl: WebGLRenderingContext, source: string) {
  return createShader(gl, gl.FRAGMENT_SHADER, source);
}

function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  var shader = gl.createShader(type);
  if (!shader) {
    throw Error("failed to create shader")
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  const info = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw Error("failed to compile shader:" + info)
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  var program = gl.createProgram();
  if (!program) {
    throw Error("failed to create program");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  gl.deleteProgram(program);
  throw Error("failed to link program: " + gl.getProgramInfoLog(program))
}

export function mustGetUniformLocation(gl: WebGLRenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation {
    const loc = gl.getUniformLocation(program, name);
  if (loc === null) {
    throw Error("failed to get the location of the texture uniform");
  }
  return loc;
}