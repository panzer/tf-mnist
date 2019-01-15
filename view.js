// MP
const WIDTH = 300;
const HEIGHT = 300;
const SPLITS = 15;
const SECTOR_WIDTH = WIDTH / SPLITS;
const SECTOR_HEIGHT = HEIGHT / SPLITS;
let pixelData;
let currentNum;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);
  background("white");
  nextData();
}

function nextData() {
  pixelData = trainingData.xs.pop();
  currentNum = trainingData.labels.pop();
}

function showPixelData() {
  push();
  fill(255, 0, 0, 100);
  for (let xIndex = 0; xIndex < SPLITS; xIndex++) {
    for (let yIndex = 0; yIndex < SPLITS; yIndex++) {
      let value = pixelData[xIndex * SPLITS + yIndex];
      if (value === 1) {
        xStart = xIndex * SECTOR_WIDTH;
        yStart = yIndex * SECTOR_HEIGHT;
        rect(xStart, yStart, SECTOR_WIDTH, SECTOR_HEIGHT);
      }
    }
  }
  pop();
}

function keyPressed() {
  if (key == "N") {
    background("white");
    nextData();
    showPixelData();
    console.log(currentNum);
  }
}

function showGrid() {
  push();
  strokeWeight(1);
  for (let x = 0; x < WIDTH; x += SECTOR_WIDTH) {
    line(x, 0, x, HEIGHT);
  }
  for (let y = 0; y < WIDTH; y += SECTOR_HEIGHT) {
    line(0, y, WIDTH, y);
  }
  pop();
}
