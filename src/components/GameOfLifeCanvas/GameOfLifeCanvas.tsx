import React, { useEffect, useRef } from "react";
import { run } from "./program_info";

interface GameOfLifeCanvasProps {
  canvasWidth: number;
  canvasHeight: number;

  gridWidth: number;
  gridHeight: number;

  intervalMs?: number;
}

export function GameOfLifeCanvas(props: GameOfLifeCanvasProps) {
  const {
    canvasWidth,
    canvasHeight,
    gridWidth,
    gridHeight,
    intervalMs,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalMsOrDefault = intervalMs ? intervalMs : 500;

  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }
    const gl: WebGLRenderingContext | null = canvasRef.current && canvasRef.current.getContext("webgl");
    if (!gl) {
      console.log("no webgl context");
      return;
    }
    return run(gl, gridWidth, gridHeight, intervalMsOrDefault);
  }, [gridWidth, gridHeight, intervalMsOrDefault])


  return (
    <canvas id="gameoflife-canvas" ref={canvasRef} width={canvasWidth} height={canvasHeight} />
  );
}