/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
  return [
    {
      name: "mudkip",
      assetUrl: "img/mudkip.png",
    },
    {
      name: "pikachu",
      assetUrl: "img/pikachu.jpg",
    },
    {
      name: "city",
      assetUrl: "img/city.png",
    },
  ];
}

function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $(".image-container"); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`;
  $("#original").empty();
  $("#original").append(imgHTML);

  let scaleFactor = 1;
  console.log(inspiration.image.width);
  while (inspiration.image.width / scaleFactor > 1560) {
    scaleFactor *= 2;
  }
  resizeCanvas(
    inspiration.image.width / scaleFactor,
    inspiration.image.height / scaleFactor
  );
  image(inspiration.image, 0, 0);

  let design = {
    bg: 0,
    elements: [],
  };

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 30; j++) {
      const x = (j * width) / 30;
      const y = (i * height) / 15;
      const r = width / 30;
      design.elements.push({ x: x, y: y, r: r, fill: get(x, y) });
    }
  }

  return design;
}

function renderDesign(design, inspiration) {
  noStroke();
  for (let element of design.elements) {
    fill(element.fill);
    ellipse(element.x, element.y, element.r);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.elements) {
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.r = mut(box.w, width / 30, width / 2, rate);
    box.fill = get(box.x, box.y);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
