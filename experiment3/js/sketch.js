// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#canvasContainer").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#canvasContainer").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#canvasContainer").attribute("rows") | 0;
  numRows = select("#canvasContainer").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);

  reseed();
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("w");
    }
    grid.push(row);
  }

  const numIslands = floor(random((numRows + numCols) / 4)) + 1;
  for (let n = 0; n < numIslands; n++) {
    const height = floor(random(43 - numIslands)) + 3;
    const width = floor(random(43 - numIslands)) + 3;
    const hStart = floor(random(numRows - height));
    const wStart = floor(random(numCols - width));

    const biome = floor(random(6));

    for (let i = hStart; i < hStart + height; i++) {
      for (let j = wStart; j < wStart + width; j++) {
        switch (biome) {
          case 0:
            grid[i][j] = "f";
            break;
          case 1:
            grid[i][j] = "c";
            break;
          case 2:
            grid[i][j] = "F";
            break;
          case 3:
            grid[i][j] = "C";
            break;
          case 4:
            grid[i][j] = "i";
            break;
          case 5:
            grid[i][j] = "l";
            break;
        }
      }
    }
  }

  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, floor(random(4)), 13);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "_") {
        placeTile(i, j, floor(random(4)), 0);
      } else if (grid[i][j] == "f") {
        if (gridCode(grid, i, j, "f") < 15) {
          drawContext(grid, i, j, "f", 9, 0);
        } else {
          placeTile(i, j, floor(random(4)), 0);
        }
      } else if (grid[i][j] == "c") {
        if (gridCode(grid, i, j, "c") < 15) {
          drawContext(grid, i, j, "c", 9, 3);
        } else {
          placeTile(i, j, floor(random(4)), 3);
        }
      } else if (grid[i][j] == "F") {
        if (gridCode(grid, i, j, "F") < 15) {
          drawContext(grid, i, j, "F", 9, 6);
        } else {
          placeTile(i, j, floor(random(4)), 6);
        }
      } else if (grid[i][j] == "C") {
        if (gridCode(grid, i, j, "C") < 15) {
          drawContext(grid, i, j, "C", 9, 9);
        } else {
          placeTile(i, j, floor(random(4)), 9);
        }
      } else if (grid[i][j] == "i") {
        if (gridCode(grid, i, j, "i") < 15) {
          drawContext(grid, i, j, "i", 9, 12);
        } else {
          placeTile(i, j, floor(random(4)), 12);
        }
      } else if (grid[i][j] == "l") {
        if (gridCode(grid, i, j, "l") < 15) {
          drawContext(grid, i, j, "l", 9, 15);
        } else {
          placeTile(i, j, floor(random(4)), 15);
        }
      }
    }
  }

  const floorTiles = ["f", "c", "F", "C", "i", "l"];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (floorTiles.includes(grid[i][j])) {
        if (gridCode(grid, i, j, grid[i][j]) >= 15) {
          if (random(10) > 9) {
            placeTile(i, j, floor(random(2)) + 26, floor(random(4)));
          }
        }
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  return grid[i][j] == target;
}

function gridCode(grid, i, j, target) {
  let val = 0;
  if ((j - 1 > 0 && grid[i][j - 1] == target) || j - 1 <= 0) {
    val += 1;
  }
  if (
    (i + 1 < grid.length && grid[i + 1][j] == target) ||
    i + 1 >= grid.length
  ) {
    val += 8;
  }
  if (
    (j + 1 < grid[0].length && grid[i][j + 1] == target) ||
    j + 1 >= grid[0].length
  ) {
    val += 4;
  }
  if ((i - 1 > 0 && grid[i - 1][j] == target) || i - 1 <= 0) {
    val += 2;
  }
  return val;
}

function drawContext(grid, i, j, target, dti, dtj) {
  const offset = lookup[gridCode(grid, i, j, target)];
  placeTile(i, j, dti + offset[0], dtj + offset[1]);
}

const lookup = [
  [0, 0], // 0
  [0, 0], // 1
  [0, 0], // 2
  [4, 1], // 3 [bot right corner]
  [0, 0], // 4
  [0, 0], // 5
  [3, 1], // 6
  [1, 0], // 7 [bot empty]
  [2, 0], // 8 [bot left corner]
  [4, 0], // 9 [top right corner]
  [0, 0], // 10
  [0, 1], // 11 [right empty]
  [3, 0], // 12 [top left corner]
  [1, 2], // 13 [top empty]
  [2, 1], // 14 [left empty]
  [0, 0], // 15
];
