let previewCanvas;
let previewRes = 10;
let previewMap = []
window.onload = previewSetup()


function previewSetup() {
  previewCanvas = document.getElementById('previewCanvas');

  pctx = previewCanvas.getContext('2d');

  previewMap = [];
  for (let i = 0; i < Math.ceil(previewCanvas.height / previewRes); i++) {
    previewMap.push([]);
    for (let j = 0; j < Math.ceil(previewCanvas.width / previewRes); j++) {
      previewMap[i].push(0);
    }
  }
  pencil();
}

function pdraw() {
  if (previewCanvas.getContext) {
    pctx.fillStyle = "black";
    pctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    for (let j = 0; j < (previewMap.length); j++) {
      for (let i = 0; i < (previewMap[0].length); i++) {
        if (previewMap[j][i] == 1) {
          pctx.fillStyle = 'white'; // red green blue opacity
          pctx.fillRect(previewRes * i, previewRes * j, previewRes, previewRes); // (x, y, width, height)
        };
      };
    };
  }
}

function gliderPreview(way) {
  clearPreviewMap()
  if(way == "NW") {
    previewMap[3][4] = 1;
    previewMap[4][3] = 1;
    previewMap[5][3] = 1;
    previewMap[5][4] = 1;
    previewMap[5][5] = 1;
  } else if (way == "SW") {
    previewMap[3][3] = 1;
    previewMap[3][4] = 1;
    previewMap[3][5] = 1;
    previewMap[4][5] = 1;
    previewMap[5][4] = 1;
  }
  pdraw()
}
function pencil() {
  clearPreviewMap()
  previewMap[4][4] = 1;
  pdraw();
}

function clearPreviewMap() {
  for (let i = 0; i < previewMap.length; i++) {
    for (let j = 0; j < previewMap[0].length; j++) {
      previewMap[i][j] = 0
    }
  }
  pdraw()
}
