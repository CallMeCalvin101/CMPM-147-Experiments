"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
    adJustColor
    adjustBack
*/

const colFactor = 0.005;
let rCol = 10;
let bCol = 10;
let horizInversion = 1;
let vertInversion = 1;

let backCol = [255, 255, 255];
let backInv = [1, 1, 1];
let backFactor = [1, 1, 1];

function p3_preload() {}

function p3_setup() {
  background(floor(random(255)), floor(random(255)), floor(random(255)));
  frameRate(60);
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {}

function p3_drawBefore() {}

function adJustColor(r, b) {
  if (rCol >= 255) {
    horizInversion *= -1;
    rCol = 255;
  } else if (rCol <= 0) {
    horizInversion *= -1;
    rCol = 0;
  }

  if (bCol >= 255) {
    vertInversion *= -1;
    bCol = 255;
  } else if (bCol <= 0) {
    vertInversion *= -1;
    bCol = 0;
  }

  rCol += r * horizInversion;
  bCol += b * vertInversion;
}

function adjustBack() {
  const scale = floor(random(3));
  backCol[scale] -= colFactor * backInv[scale] * backFactor[scale];
  if (backCol[scale] <= 0) {
    backInv[scale] *= -1;
    backCol[scale] = 0;
    backFactor[scale] = floor(random(10));
  } else if (backCol[scale] >= 255) {
    backInv[scale] *= -1;
    backCol[scale] = 255;
    backFactor[scale] = floor(random(10));
  }
}

function p3_drawTile(i, j) {
  if (keyIsDown(LEFT_ARROW)) {
    adJustColor(-1 * colFactor, 0);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    adJustColor(colFactor, 0);
  }
  if (keyIsDown(DOWN_ARROW)) {
    adJustColor(0, -1 * colFactor);
  }
  if (keyIsDown(UP_ARROW)) {
    adJustColor(0, colFactor);
  }

  adjustBack();
  noStroke();
  push();

  fill(backCol);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Adapted from https://p5js.org/reference/#/p5/noise
  let noiseLevel = 255;
  let noiseScale = 0.005;
  let nt = noiseScale * frameCount;
  const gNoiseVal = noiseLevel * noise(i, j, nt);
  translate(0, (-1 * gNoiseVal) / 10);

  fill(floor(rCol), gNoiseVal, floor(bCol));
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j) {}

function p3_drawAfter() {}
