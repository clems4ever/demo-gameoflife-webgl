import { createRenderingProgram, RenderingProgram } from "./rendering_program";
import { createSimulationProgram, SimulationProgram } from "./simulation_program";

function setValue(arr: Uint8Array, width: number, x: number, y: number, v: number) {
  arr[y * width + x] = v;
}

interface SimulationState {
  State: number;
  SourceTexture: WebGLTexture,
  TargetTexture: WebGLTexture,
  Framebuffer: WebGLFramebuffer,
}

export function run(gl: WebGLRenderingContext, gridWidth: number, gridHeight: number, intervalMs: number) {
  const simulationProgram = createSimulationProgram(gl);
  const renderProgram = createRenderingProgram(gl);

  setGeometry(gl, simulationProgram.positionLoc);
  setGeometry(gl, renderProgram.positionLoc);
  setTexCoord(gl, renderProgram.texCoordLoc);

  const input = new Uint8Array(gridWidth * gridHeight * 4);
  for (let i = 0; i < gridWidth * gridHeight; i ++) {
    const x = i % gridWidth;
    const y = Math.floor(i / gridWidth);
    const v = (Math.random() > 0.5) ? 255.0 : 0.0;
    setValue(input, gridWidth, x * 4, y * 4, v);
  }

  const tex1 = createTextureWithGridData(gl, input, gridWidth, gridHeight);
  const tex2 = createTextureWithGridData(gl, null, gridWidth, gridHeight);

  const fb1 = createFramebuffer(gl);
  const fb2 = createFramebuffer(gl);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);

  let state1: SimulationState = {
    State: 1,
    SourceTexture: tex1,
    TargetTexture: tex2,
    Framebuffer: fb2,
  };
  let state2: SimulationState = {
    State: 2,
    SourceTexture: tex2,
    TargetTexture: tex1,
    Framebuffer: fb1,
  };
  let state = state1;


  gl.useProgram(simulationProgram.program);
  gl.uniform1i(simulationProgram.textureLoc, 0);  // tell the shader the src texture is on texture unit 0
  gl.uniform2f(simulationProgram.textureDimsLoc, gridWidth, gridHeight);

  gl.useProgram(renderProgram.program);

  const interval = setInterval(() => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, state.Framebuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.SourceTexture);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, state.TargetTexture);

    render(gl, simulationProgram, renderProgram, gridWidth, gridHeight);

    state = (state === state1) ? state2 : state1;
  }, intervalMs);
  return () => clearInterval(interval);
}

function render(
  gl: WebGLRenderingContext,
  simulationProgram: SimulationProgram,
  renderProgram: RenderingProgram,
  gridWidth: number,
  gridHeight: number,
) {
  // ===============  simulate ======================
  gl.useProgram(simulationProgram.program);

  gl.viewport(0, 0, gridWidth, gridHeight);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // ================== render =====================
  gl.useProgram(renderProgram.program);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setTexCoord(gl: WebGLRenderingContext, location: GLuint) {
  let texCoordArr = new Float32Array([
      0.0, 0.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0
     ])

  // Create a buffer for texcoords.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    texCoordArr,
    gl.STATIC_DRAW);

  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
}

function setGeometry(gl: WebGLRenderingContext, location: GLuint) {
  // create the position buffer. We render a square so we just need two triangles.
  const simulationPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, simulationPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    -1,  1,
     1, -1,
     1,  1,
    -1,  1,
     1, -1,
  ]), gl.STATIC_DRAW);

  // setup our attributes to tell WebGL how to pull
  // the data from the buffer above to the position attribute
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(
      location,
      2,         // size (num components)
      gl.FLOAT,  // type of data in buffer
      false,     // normalize
      0,         // stride (0 = auto)
      0,         // offset
  );
}

function createTexture(gl: WebGLRenderingContext) {
  const tex = gl.createTexture();
  if (tex === null) {
    throw Error("failed to create texture");
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function createTextureWithGridData(gl: WebGLRenderingContext, arr: ArrayBufferView | null, width: number, height: number) {
  const srcWidth = width;
  const srcHeight = height;

  const tex = createTexture(gl);

  gl.texImage2D(
      gl.TEXTURE_2D,
      0,                // mip level
      gl.RGBA,          // internal format
      srcWidth,
      srcHeight,
      0,                // border
      gl.RGBA,          // format
      gl.UNSIGNED_BYTE, // type
      arr);
  return tex;
}

function createFramebuffer(gl: WebGLRenderingContext): WebGLFramebuffer {
  const fb = gl.createFramebuffer();
  if (fb === null) {
    throw Error("failed to create framebuffer");
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  return fb;
}