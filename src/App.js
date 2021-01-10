import React, { useState, useRef } from 'react';
import produce from 'immer';

import styled from 'styled-components';

import './App.css';

const cols = 30;
const rows = 30;
const pixelSize = '25px';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${cols}, ${pixelSize});
`;
const Pixel = styled.div`
  height: ${pixelSize};
  border: 1px solid #56598a;
  background: ${(props) => (props.activated === 0 ? '#4f517d' : '#DCCFEC')};
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #1a3a3a;
  color: #bfc0c0;
  height: 40px;
  width: 150px;
  border: 2px solid #bfc0c0;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1em;
  letter-spacing: 1.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #bfc0c0;
    color: #1a3a3a;
  }

  &:focus,
  &:visited,
  &:active {
    border: 2px solid #bfc0c0;
  }
`;

const Controls = styled.nav`
  margin-top: 20px;
  border-radius: 4px;
`;

function App() {
  const [running, setRunning] = useState(false);
  const refRunning = useRef(running);
  refRunning.current = running;

  const [grid, setGrid] = useState(Array(rows).fill(Array(cols).fill(0)));

  const run = () => {
    if (refRunning.current) {
      setGrid((grid) => {
        return produce(grid, (newGrid) => {
          for (let i = 0; i < rows; i++) {
            for (let y = 0; y < cols; y++) {
              let neighbors = 0;
              // top left
              if (i - 1 >= 0 && y - 1 >= 0 && grid[i - 1][y - 1] === 1)
                neighbors++;
              // top
              if (i - 1 >= 0 && grid[i - 1][y] === 1) neighbors++;
              // top right
              if (i - 1 >= 0 && y + 1 <= cols - 1 && grid[i - 1][y + 1] === 1)
                neighbors++;
              // left
              if (y - 1 >= 0 && grid[i][y - 1] === 1) neighbors++;
              // right
              if (y + 1 <= cols - 1 && grid[i][y + 1] === 1) neighbors++;
              // bottom left
              if (i + 1 <= rows - 1 && y - 1 >= 0 && grid[i + 1][y - 1] === 1)
                neighbors++;
              // bottom
              if (i + 1 <= rows - 1 && grid[i + 1][y] === 1) neighbors++;
              //bottom right
              if (
                i + 1 <= rows - 1 &&
                y + 1 <= cols - 1 &&
                grid[i + 1][y + 1] === 1
              )
                neighbors++;

              if (neighbors > 3 || neighbors < 2) {
                newGrid[i][y] = 0;
              } else if (neighbors === 3) {
                newGrid[i][y] = 1;
              }
            }
          }
        });
      });
      setTimeout(run, 100);
    }
  };

  return (
    <div className='App'>
      <Controls>
        <Button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              refRunning.current = true;
              run();
            }
          }}
        >
          {running ? 'Stop' : 'Run'}
        </Button>
      </Controls>
      <Grid>
        {grid.map((row, i) =>
          row.map((pixel, y) => (
            <Pixel
              key={`${i}-${y}`}
              onClick={() => {
                const newGrid = produce(grid, (newGrid) => {
                  newGrid[i][y] = newGrid[i][y] === 0 ? 1 : 0;
                });
                setGrid(newGrid);
              }}
              activated={grid[i][y]}
            ></Pixel>
          ))
        )}
      </Grid>
    </div>
  );
}

export default App;
