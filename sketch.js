// MP
const WIDTH = 300;
const HEIGHT = 300;
const SPLITS = 15;
const SECTOR_WIDTH = WIDTH / SPLITS;
const SECTOR_HEIGHT = HEIGHT / SPLITS;
const pixel_threshold = 0.4;
let points = [];
let numPicker;
let pixelData;
let teachingData = { xs: [], labels: [] };
let predictionP;

const model = tf.sequential();

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);
  frameRate(5);
  background("white");

  createModel();
  train(50).then(finishedTraining);

  pixelData = getCompressedPixelData();

  createP("teach:");
  createNumPicker();

  createP("prediction:");
  predictionP = createP();

  createButton("clear").mousePressed(() => background("white"));

  createButton("see").mousePressed(showPixelData);

  createP("TRAINING... please wait");
}

function createNumPicker() {
  numPicker = createSelect();
  for (let i = 0; i < 10; i++) {
    numPicker.option(i);
  }
  numPicker.changed(teach);
}

function teach() {
  let number = +numPicker.value();
  teachingData.xs.push(pixelData);
  teachingData.labels.push(number);
  background("white");
}

function createModel() {
  model.add(
    tf.layers.conv2d({
      inputShape: [SPLITS, SPLITS, 1],
      kernelSize: 3,
      filters: 16,
      activation: "relu"
    })
  );
  model.add(tf.layers.flatten({}));
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

  model.compile({
    optimizer: "rmsprop",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
}

function draw() {
  if (pixelData) {
    predict(pixelData).then(p => predictionP.html(p));
  }
}

function mouseDragged() {
  push();
  strokeWeight(25);
  let pt = points.pop();
  if (pt) {
    line(pt.x, pt.y, mouseX, mouseY);
  }
  points.push({ x: mouseX, y: mouseY });
  pop();
}

function mouseReleased() {
  points.pop();
  pixelData = getCompressedPixelData(true);
}

function getCompressedPixelData() {
  const perSector = SECTOR_WIDTH * SECTOR_HEIGHT;
  let raw_xs = [];
  for (let xStart = 0; xStart < WIDTH; xStart += SECTOR_WIDTH) {
    for (let yStart = 0; yStart < HEIGHT; yStart += SECTOR_HEIGHT) {
      let countDark = 0;
      loadPixels();
      for (let x = xStart; x < xStart + SECTOR_WIDTH; x += 1) {
        for (let y = yStart; y < yStart + SECTOR_HEIGHT; y += 1) {
          let index = 4 * (WIDTH * y + x);
          let value = pixels[index] + pixels[index + 1] + pixels[index + 2];
          if (value < 300) countDark++;
        }
      }
      updatePixels();
      if (countDark > perSector * pixel_threshold) {
        raw_xs.push(1);
      } else {
        raw_xs.push(0);
      }
    }
  }
  return raw_xs;
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

async function predict(raw_xs) {
  return tf.tidy(() => {
    const xs = tf.tensor1d(raw_xs).reshape([1, SPLITS, SPLITS, 1]);
    const ys = model.predict(xs);
    // Show percent confidence
    // ys.print();
    return ys.argMax(1).dataSync();
  });
}

async function train(iterations) {
  const xs = tf.tensor2d(trainingData.xs).reshape([-1, SPLITS, SPLITS, 1]);
  const ys = tf.cast(
    tf.oneHot(tf.tensor1d(trainingData.labels, "int32"), 10),
    "float32"
  );
  for (let i = 1; i < iterations; ++i) {
    const h = await model.fit(xs, ys, { shuffle: true });
    console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
  }
  xs.dispose();
  ys.dispose();
}

function finishedTraining() {
  createP("DONE TRAINING");
}

function keyPressed() {
  if (key == "C") {
    background("white");
  } else if (key == "T") {
    train(5);
  } else if (key == "D") {
    // Download our data
  } else {
    console.log(+key);
    sectorCount(+key);
    clearAndGrid();
  }
}

function clearAndGrid() {
  background("white");
  showGrid();
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
