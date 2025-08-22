const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("infoBox");
const popup = document.getElementById("popup");

let cellSize, rows, cols;
let player, exit;
let maze = [];
let stage = 0;
let waitingForA = false;

const stages = [
  { title: "Intro", text: "Welcome to my gamified resume! 🎮 Use arrow keys (or touch controls) to move the blue square. Reach the green exit!" },
  { title: "Education", text: "🎓 B.E in Computer Engineering and Specialized in Game Development." },
  { title: "Work Experience", text: "<b>3+ years of experience as a Unity Game developer.<\b><br>Worked on casual, puzzle games as well as casino games." },
  { title: "Location", text: "📍 Based in Goa,India." },
  { title: "Contact", text: "📧 josenazare611@gmail.com <br>🔗 <a href='https://www.linkedin.com/in/jos%C3%A9-nazar%C3%A9-0a605ab2/' target='_blank'>LinkedIn</a>" },
  { title: "Thanks", text: "🎉 Thanks for playing my resume! <br> Check out my games on <a href='https://gamedev-jose.itch.io/' target='_blank'>Itch.io</a>" }
];

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 600);
  canvas.height = Math.min(window.innerHeight * 0.6, 600);
  cellSize = 40;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  generateMaze();
}

// Maze generation with DFS
function generateMaze() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(0));

  function carve(x, y) {
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]].sort(()=>Math.random()-0.5);
    for (let [dx,dy] of dirs) {
      const nx = x + dx*2, ny = y + dy*2;
      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] === 0) {
        maze[y+dy][x+dx] = 1;
        maze[ny][nx] = 1;
        carve(nx, ny);
      }
    }
  }

  maze[0][0] = 1;
  carve(0,0);

  player = {x:10, y:10, size:20};
  exit = {x: canvas.width - cellSize + 10, y: canvas.height - cellSize + 10, size:25};

  draw();
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Walls
  ctx.fillStyle="red";
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(maze[r][c]===0){
        ctx.fillRect(c*cellSize, r*cellSize, cellSize, cellSize);
      }
    }
  }

  // Player
  ctx.fillStyle="blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Exit
  ctx.fillStyle="green";
  ctx.fillRect(exit.x, exit.y, exit.size, exit.size);
  ctx.fillStyle="white";
  ctx.font="10px 'Press Start 2P'";
  ctx.fillText(stage < stages.length-1 ? "Next":"End", exit.x-5, exit.y-5);
}

function move(dx,dy) {
  if (waitingForA) return;
  let newX = player.x+dx;
  let newY = player.y+dy;
  let cellX = Math.floor(newX/cellSize);
  let cellY = Math.floor(newY/cellSize);

  if (maze[cellY] && maze[cellY][cellX] === 1) {
    player.x = newX;
    player.y = newY;
    checkExit();
  }
  draw();
}

function checkExit() {
  if (player.x+player.size > exit.x && player.y+player.size > exit.y) {
    popup.style.display = "block";
    waitingForA = true;
  }
}

function nextStage() {
  popup.style.display = "none";
  waitingForA = false;
  stage++;
  if(stage < stages.length) {
    updateInfo();
    generateMaze();
  }
}

function updateInfo() {
  infoBox.innerHTML = `<h2>${stages[stage].title}</h2><p>${stages[stage].text}</p>`;
}

// Controls
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp") move(0,-10);
  if(e.key==="ArrowDown") move(0,10);
  if(e.key==="ArrowLeft") move(-10,0);
  if(e.key==="ArrowRight") move(10,0);
  if(waitingForA && (e.key==="a" || e.key==="A")) {
    nextStage();
  }
});

window.addEventListener("resize",resizeCanvas);

resizeCanvas();
updateInfo();
