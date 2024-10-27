import React from "react";
import "./App.css";
import { GameOfLifeCanvas } from "./components/GameOfLifeCanvas/GameOfLifeCanvas";
import useWindowDimensions from "./hooks/useWindowDimensions";

function App() {
  const {width, height} = useWindowDimensions();
  return (
    <div className="App">
      <GameOfLifeCanvas
        canvasWidth={width ? width : 1024}
        canvasHeight={height ? height : 1024}
        gridHeight={width ? width / 4 : 256}
        gridWidth={height ? height / 4: 256}
        intervalMs={100}
      />
    </div>
  );
}

export default App;
