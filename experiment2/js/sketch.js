/* exported setup, draw */

let seed = 239;
let WIDTH = 750;
let HEIGHT = 750;
const NUM_WAVE_POINTS = 25;
const SHORE = -25;
const HORIZON = 225;
let yOffset = 0;
let noiseChange = 0;

const oceanColor = [102, 205, 217];
const waveColor = [167, 228, 242];
const waveAccents = [206, 222, 242];
const sandColor = [242, 213, 187];
const sunsetColor = [242, 148, 114];
const sunColor = [255, 197, 77];
const boatColor = [180, 128, 40];

function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  WIDTH = canvasContainer.width()
  HEIGHT = canvasContainer.height()
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  frameRate(60);
  //createCanvas(WIDTH, HEIGHT);
}

function draw() {
  randomSeed(seed);
  background(sandColor);

  fill(oceanColor);
  noStroke();
  rect(0, 0, WIDTH, HEIGHT / 2 - 20 - SHORE);

  drawWave(yOffset);
  drawShore();

  fill(sunsetColor);
  rect(0, 0, WIDTH, HORIZON);

  fill(sunColor);
  ellipse(WIDTH / 2, 175, 150);

  const boatPos = drawHorizon();

  createAccents(
    WIDTH / 3 - 45,
    (noise(WIDTH / 3, frameCount / 240) * -300) / 4 + 300
  );
  createAccents(
    (WIDTH * 2) / 3 - 45,
    (noise((WIDTH * 2) / 3, frameCount / 240) * -300) / 4 + 300
  );
  createAccents(
    WIDTH / 2 - 45,
    (noise(WIDTH / 2, frameCount / 240) * -450) / 4 + 450
  );
  createAccents(
    WIDTH / 4 - 45,
    (noise(WIDTH / 4, frameCount / 240) * -450) / 4 + 450
  );
  createAccents(
    (WIDTH * 3) / 4 - 45,
    (noise((WIDTH * 3) / 4, frameCount / 240) * -450) / 4 + 450
  );
  noStroke();

  drawBoat(boatPos);

  yOffset += 1;
  if (yOffset > 200) {
    yOffset = 0;
    noiseChange += 100;
  }
}

function drawShore() {
  let curX = 0;
  const centerY = HEIGHT / 2 - 75 - SHORE;
  const xOffset = WIDTH / 10;

  fill(oceanColor);
  noStroke;
  beginShape();
  curveVertex(-2 * xOffset, centerY);
  curveVertex(-2 * xOffset, centerY);

  for (let i = 0; i < 10 + 3; i++) {
    curveVertex(
      curX,
      centerY * noise(curX * 0.005, frameCount / 120) + centerY + 40
    );
    curX += xOffset;
  }

  curveVertex(curX, centerY);
  curveVertex(curX, centerY);
  endShape();
}

function drawWave(yOffset) {
  let curX = 0;
  const centerY = HEIGHT / 2 - 75 - SHORE;
  const xOffset = WIDTH / NUM_WAVE_POINTS;

  const alpha = ((150 - yOffset) / 150) * 1000;
  fill(waveColor[0], waveColor[1], waveColor[2], alpha);
  strokeWeight(0.25);
  beginShape();
  curveVertex(-2 * xOffset, centerY);
  curveVertex(-2 * xOffset, centerY);

  for (let i = 0; i < NUM_WAVE_POINTS + 3; i++) {
    curveVertex(
      curX,
      centerY * noise(curX * 0.5 + noiseChange, frameCount / 120) +
        centerY +
        yOffset
    );
    curX += xOffset;
  }

  curveVertex(curX, centerY);
  curveVertex(curX, centerY);
  endShape();
}

function drawHorizon() {
  let curX = 0;
  const centerY = HORIZON + 50;
  const xOffset = WIDTH / 5;
  let waveY = 0;

  fill(oceanColor);
  noStroke;
  beginShape();
  curveVertex(-2 * xOffset, centerY);
  curveVertex(-2 * xOffset, centerY);

  for (let i = 0; i < 5 + 3; i++) {
    const yPoint = -centerY * noise(curX * 0.0005, frameCount / 180) + centerY;
    curveVertex(curX, yPoint);
    if (i == 4) {
      waveY = yPoint;
    }
    curX += xOffset;
  }

  curveVertex(curX, centerY);
  curveVertex(curX, centerY);
  endShape();

  return waveY;
}

function createAccents(x, y) {
  let curX = x;
  const centerY = y;
  const xOffset = 30;

  noFill();
  stroke(waveAccents);
  strokeWeight(5);
  beginShape();
  curveVertex(
    x - 2 * xOffset,
    (noise(curX * 0.05, frameCount / 240) * -centerY) / 4 + centerY
  );
  curveVertex(
    x - 2 * xOffset,
    (noise(curX * 0.05, frameCount / 240) * -centerY) / 4 + centerY
  );

  for (let i = 0; i < 3; i++) {
    curveVertex(
      curX,
      (noise(curX * 0.05, frameCount / 240) * -centerY) / 4 + centerY
    );
    curX += xOffset;
  }

  curveVertex(
    curX,
    (noise(curX * 0.05, frameCount / 240) * -centerY) / 4 + centerY
  );
  curveVertex(
    curX,
    (noise(curX * 0.05, frameCount / 240) * -centerY) / 4 + centerY
  );
  endShape();
}

function drawBoat(y) {
  fill(boatColor);
  beginShape();
  vertex(WIDTH / 2 - 40, y - 20);
  vertex(WIDTH / 2 - 2, y - 20);
  vertex(WIDTH / 2 - 2, y - 60);
  vertex(WIDTH / 2 + 2, y - 60);
  vertex(WIDTH / 2 + 2, y - 20);
  vertex(WIDTH / 2 + 40, y - 20);
  vertex(WIDTH / 2 + 20, y);
  vertex(WIDTH / 2 - 20, y);
  endShape(CLOSE);

  fill(waveAccents);
  beginShape();
  vertex(WIDTH / 2 + 2, y - 60);
  vertex(WIDTH / 2 + 2 + 25, y - 45);
  vertex(WIDTH / 2 + 2, y - 30);
  endShape(CLOSE);
}
