let gamemap = [];
let canvas;
let moving = false;
let ctx;
let last;
let res = 20;
let gameLoop = null;
let gen = 1;
let gliderSpawning = false;
const grid = false;
const fps = 30;
let span;
let span2;
var rtime;
var timeout = false;
var delta = 400;

window.onload = setup();
window.addEventListener('resize', function(event) {
  stopLoop()
  rtime = new Date();
  if (timeout === false) {
      timeout = true;
      setTimeout(resizeend, delta);
  }
}, true);
function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        windowChange()
    }
}

function setup() {
  canvas = document.getElementById('canvas');
  span = document.getElementById('fps');
  span2 = document.getElementById('gen');

  canvas.addEventListener("mousemove", function(e) {
    if (moving) {getMousePosition(canvas, e)};
  }, false);
  canvas.addEventListener("mousedown", function(e) {
  	getMousePosition(canvas, e);
    moving = true;
  }, false);
  canvas.addEventListener("mouseup", function(e) {
    moving = false;
  }, false);
  canvas.addEventListener("mouseout", function(e) {
    moving = false;
  }, false);

  ctx = canvas.getContext('2d');
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  gameMapRandomise()
  startLoop();
}

function gameMapRandomise() {
  gamemap = [];
  for (let i = 0; i < Math.ceil(canvas.height / res); i++) {
    gamemap.push([]);
    for (let j = 0; j < Math.ceil(canvas.width / res); j++) {
      gamemap[i].push(new Cell(Math.round(Math.random())));
    }
  }
  gen = 0
  draw()
}

function draw() {
  if (canvas.getContext) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let j = 0; j < (gamemap.length); j++) {
      for (let i = 0; i < (gamemap[0].length); i++) {
        if (gamemap[j][i].state == 1) {
          Rect(ctx, i * res, j * res, res, res, gamemap[j][i].color, false);
        } else {
          if(grid) {
            Rect(ctx, i * res, j * res, res, res, "(0, 0, 0, 0.7)", true);
          }
        };
      };
    };
  }
}

function loop() {
  update()

  const time = performance.now();
  const frameTime = (time - last).toFixed(2);
  last = time;

  span.innerText = 'FPS: ' + Math.round(1000 / Number(frameTime));
  //requestAnimationFrame(loop);
}

function update() {
  for (let i = 1; i < (gamemap.length - 1); i++) {
    for (let j = 1; j < gamemap[0].length - 1; j++) {
      gamemap[i][j].setNb(countNeighbors(i, j))
    }
  }
  for (let i = 0; i < (gamemap.length); i++) {
    for (let j = 0; j < gamemap[0].length; j++) {
      gamemap[i][j].updateState()
    }
  }
  draw();
  gen += 1;
  span2.innerText = 'generation: ' + gen;
}

function startLoop() {
  if (gameLoop !== null) {
    return
  }
  gameLoop = setInterval(function() {
    loop();
  }, 1000 / fps)
}

function stopLoop() {
  clearInterval(gameLoop);
  gameLoop = null;
  span.innerText = "fps: 0"
}

function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const y = Math.floor((event.clientX - rect.left) / res);
  const x = Math.floor((event.clientY - rect.top) / res);

  if (!moving) {
    if (!gliderSpawning) {
      gamemap[x][y].changeState()
    } else {gliderSpawner(y,x)}
  } else {
    if (!gliderSpawning) {
      gamemap[x][y].setState(1)
    } else {gliderSpawner(y,x)}
	}
  gen = 0;
  draw()
}

function countNeighbors(x, y) {
  let sum = 0;
  for(let i = -1; i<=1; i++) {
    for(let j = -1;j<=1; j++) {
      sum += gamemap[x+i][y+j].state
    }
  }
  sum -= gamemap[x][y].state
  return sum;
}

function clearMap() {
  for (let i = 0; i < gamemap.length; i++) {
    for (let j = 0; j < gamemap[0].length; j++) {
      gamemap[i][j].setState(0)
    }
  }
  gen = 0;
  draw()
}

function gliderSpawner(x, y) {
  if(x == 0 || x == gamemap[0].length || y == 0 || y == gamemap.length) {
    return
  }
  if(pencilToggle == 1) {
    gamemap[y][x].setState(0)
    gamemap[y-1][x].setState(1)
    gamemap[y][x-1].setState(1)
    gamemap[y+1][x-1].setState(1)
    gamemap[y+1][x].setState(1)
    gamemap[y+1][x+1].setState(1)
  } else if(pencilToggle == 2) {
    gamemap[y][x].setState(0)
    gamemap[y+1][x].setState(1)
    gamemap[y][x+1].setState(1)
    gamemap[y-1][x-1].setState(1)
    gamemap[y-1][x].setState(1)
    gamemap[y-1][x+1].setState(1)
  }
  gen = 0
}

let pencilToggle = 0
function togglePencil() {
  if (pencilToggle == 0) {
    gliderSpawning = true;
    gliderPreview("NW")
    pencilToggle = 1
  } else if(pencilToggle == 1) {
    gliderPreview("SW")
    pencilToggle = 2
  } else {
    pencilToggle = 0
    gliderSpawning = false;
    pencil()
  }
}

function windowChange() {
  const curw = window.innerWidth;
  const curh = window.innerHeight;
  const hasToAddW = Math.ceil(curw / res - gamemap[0].length)
  const hasToAddH = Math.ceil(curh / res - gamemap.length)
  const hasToRemoveW = Math.floor(gamemap[0].length - curw / res);
  const hasToRemoveH = Math.floor(gamemap.length - curh / res);

	if (hasToAddW > 0) {
		for(let i = 0; i<gamemap.length; i++) {
			for(let j = 0; j<hasToAddW; j++) {
				if(j % 2 === 0 ) {
          gamemap[i].push(new Cell(0))
        } else {
          gamemap[i].unshift(new Cell(0))
        }
			}
		}
	}
  if (hasToAddH > 0) {
    for(let i = 0; i<hasToAddH; i++) {
			gamemap.push([])
			for(let j = 0; j<gamemap[0].length; j++) {
				gamemap[gamemap.length - 1].push(new Cell(0))
			}
		}
  }
  if (hasToRemoveW > 0) {
    console.log("smaller width")
		for(let i = 0; i<gamemap.length; i++) {
			for(let j = 0; j<hasToRemoveW; j++) {
        gamemap[i].pop()
			}
		}
	}
  if (hasToRemoveH > 0) {
    console.log("smaller height")
    for(let i = 0; i<hasToRemoveH; i++) {
			gamemap.pop()
		}
  }
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
	draw()
  startLoop()
}


function changeRes() {
  res = document.getElementById("resSlider").value
  windowChange()
}
