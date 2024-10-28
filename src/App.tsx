import React from "react";
import "./App.css";
import { GameOfLifeCanvas } from "./components/GameOfLifeCanvas/GameOfLifeCanvas";
import useWindowDimensions from "./hooks/useWindowDimensions";

function App() {
  const {width, height} = useWindowDimensions();
  const cellSize = 4;
  return (
    <div className="App">
      <GameOfLifeCanvas
        canvasWidth={width ? width : 1024}
        canvasHeight={height ? height : 1024}
        gridWidth={width ? width / cellSize : 256}
        gridHeight={height ? height / cellSize: 256}
        intervalMs={100}
      />
    </div>
  );
}

export default App;
