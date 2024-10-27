import { createWebGLProgram } from "../../utils/shaders";
import renderingVertexShaderCode from "!!raw-loader!./render/vertex.glsl";
import renderingFragmentShaderCode from "!!raw-loader!./render/fragment.glsl";

export interface RenderingProgram {
  program: WebGLProgram;

  positionLoc: GLuint;
  texCoordLoc: GLuint;
}

export function createRenderingProgram(gl: WebGLRenderingContext): RenderingProgram {
  const simulationProgram = createWebGLProgram(gl, renderingVertexShaderCode, renderingFragmentShaderCode);

  const positionLoc = gl.getAttribLocation(simulationProgram, 'a_position');
  const texCoord = gl.getAttribLocation(simulationProgram, 'a_texCoord');
  return {
    program: simulationProgram,
    positionLoc: positionLoc,
    texCoordLoc: texCoord,
  }
}