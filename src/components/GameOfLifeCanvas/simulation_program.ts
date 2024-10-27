import { createWebGLProgram, mustGetUniformLocation } from "../../utils/shaders";
import simulationVertexShaderCode from "!!raw-loader!./simulation/vertex.glsl";
import simulationFragmentShaderCode from "!!raw-loader!./simulation/fragment.glsl";

export interface SimulationProgram {
  program: WebGLProgram;

  positionLoc: number;
  textureDimsLoc: WebGLUniformLocation;
  textureLoc: WebGLUniformLocation;
}

export function createSimulationProgram(gl: WebGLRenderingContext): SimulationProgram {
  const simulationProgram = createWebGLProgram(gl, simulationVertexShaderCode, simulationFragmentShaderCode);

  const positionLoc = gl.getAttribLocation(simulationProgram, 'a_position');
  const textureLoc = mustGetUniformLocation(gl, simulationProgram, 'u_texture');
  const textureDimsLoc = mustGetUniformLocation(gl, simulationProgram, 'u_textureDims');

  return {
    program: simulationProgram,
    positionLoc: positionLoc,
    textureLoc: textureLoc,
    textureDimsLoc: textureDimsLoc,
  }
}