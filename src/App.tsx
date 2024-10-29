import { useState } from "react";
import "./App.css";
import { GameOfLifeCanvas } from "./components/GameOfLifeCanvas/GameOfLifeCanvas";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { FormControlLabel, Grid2, Switch, Typography } from "@mui/material";

function App() {
  const [onePixelActive, setOnePixelActive] = useState(false);
  const { width, height } = useWindowDimensions();
  const cellSize = onePixelActive ? 1 : 4;
  const gridSize = {
    width: width ? width / cellSize : 256,
    height: height ? height / cellSize : 256,
  };
  const cellCount = (gridSize.width * gridSize.height).toLocaleString("en-US", {
    style: "decimal",
  });
  return (
    <div className="App">
      <Grid2 container spacing={1} style={{ padding: 8 }}>
        <Grid2
          style={{
            zIndex: 10,
            padding: 8,
            backgroundColor: "#FFFFFF",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                value={onePixelActive}
                onChange={(e) => setOnePixelActive(e.target.checked)}
              />
            }
            label={`${cellSize}px per cell`}
          />
          <Typography>{cellCount} cells</Typography>
        </Grid2>
        <Grid2 size="grow"></Grid2>
      </Grid2>
      <div style={{ zIndex: -10 }}>
        <GameOfLifeCanvas
          canvasWidth={width ? width : 1024}
          canvasHeight={height ? height : 1024}
          gridWidth={width ? width / cellSize : 256}
          gridHeight={height ? height / cellSize : 256}
          intervalMs={100}
        />
      </div>
    </div>
  );
}

export default App;
