let puzzle;
let solvedBoard;
let puzzleArray;
let hardness = 62;
let solvedpuzzleArray;
let now = [-1, -1, false];
let note = false;
let wrong = 0;
function showPlayScreen(input) {
  let content = '';
  if (input == 'middle') {
    content += '<div id="middleDiv">';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let theclass = '';
        if (i == 0) {
          theclass += 'bigBorderTOP ';
        } else if (i == 8) {
          theclass += 'bigBorderBottom ';
        } else if (i % 3 == 0) {
          theclass += 'smallBorderTOP ';
        } else if (i % 3 == 2) {
          theclass += 'smallBorderBottom ';
        }

        if (j == 0) {
          theclass += 'bigBorderLeft ';
        } else if (j == 8) {
          theclass += 'bigBorderRight ';
        } else if (j % 3 == 0) {
          theclass += 'smallBorderLeft ';
        } else if (j % 3 == 2) {
          theclass += 'smallBorderRight ';
        }

        content += `<button class="${theclass}" id="m${i}m${j}" onclick="choose(${i},${j})">${puzzleArray[i][j]}</button>`;
      }
    }
    content += '</div>';
  } else if (input == 'right') {
    content += '<div id="rightDiv">';
    for (let i = 1; i < 10; i++) {
      content += `<button id="m${i}" onclick="chooseRight(this)"><h4>${i}</h4></button>`;
    }
    content += '</div>';
  } else if (input == 'left') {
    content += '<div id="leftDiv">';
    content += `<button><h1 id="dododo">0</h1><h4>Mistakes</h4></button>`;
    content += `<button onclick="undo()"><img src="images/undo.png"><h4>Undo</h4></button>`;
    content += `<button onclick="erase()"><img src="images/erase.png"><h4>Erase</h4></button>`;
    content += `<button onclick="notes()" id="imgNote"><img src="images/notesOff.png"><h4>Notes</h4></button>`;
    content += '</div>';
  }

  document.getElementById(input).innerHTML = content;
}

const difficultes = {
  62: "easy",
  53: "medium",
  44: "hard",
  35: "very-hard",
  26: "insane",
  17: "inhuman"
};

function difficulty() {
  if (hardness === 17) {
    hardness = 62;
  } else {
    hardness -= 9;
  }
  document.getElementById('ddd').innerHTML = difficultes[hardness].toUpperCase();
  document.getElementById('ddd').className = '';
  document.getElementById('ddd').classList.add(difficultes[hardness]);
}

function stringToArray(puzzleString) {
  const board = [];
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;
      row.push(puzzleString[index] === '.' ? ' ' : parseInt(puzzleString[index], 10));
    }
    board.push(row);
  }
  return board;
}

function go() {
  puzzle = sudoku.generate(hardness);
  solvedBoard = sudoku.solve(puzzle);
  puzzleArray = stringToArray(puzzle);
  solvedpuzzleArray = stringToArray(solvedBoard);
  showPlayScreen('middle');
  showPlayScreen('right');
  showPlayScreen('left');
}

function choose(x, y) {
  now = [x, y, true];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      document.getElementById(`m${i}m${j}`).classList.remove('clicked');
    }
  }

  document.getElementById(`m${x}m${y}`).classList.add('clicked');

  if (puzzleArray[x][y] !== " ") {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzleArray[i][j] === puzzleArray[x][y]) {
          document.getElementById(`m${i}m${j}`).classList.add('clicked');
        }
      }
    }
    now[2] = false;
  }
}

let history = [];

function chooseRight(input) {
  if (now[0] === -1 || now[1] === -1 || puzzleArray[now[0]][now[1]] !== ' ') return;
  if(!note && solvedpuzzleArray[now[0]][now[1]] != input.innerText){
    history.push({
      x: now[0],
      y: now[1],
      prevValue: puzzleArray[now[0]][now[1]],
      prevClass: document.getElementById(`m${now[0]}m${now[1]}`).className,
    });
  }
  
  if (!note) {
    document.getElementById(`m${now[0]}m${now[1]}`).innerHTML = input.innerText;
    if (solvedpuzzleArray[now[0]][now[1]] == input.innerText) {
      document.getElementById(`m${now[0]}m${now[1]}`).classList.remove('addedWrong');
      document.getElementById(`m${now[0]}m${now[1]}`).classList.add('addedRight');
      puzzleArray[now[0]][now[1]] = parseInt(input.innerText);
      history = [];
      choose(now[0], now[1]);
      let isWin = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzleArray[i][j] !== solvedpuzzleArray[i][j]) {
            isWin = false;
            break;
          }
        }
        if (!isWin) break;
      }
      if (isWin) {
        setTimeout(() => {
          document.getElementById('middle').innerHTML = '';
          document.getElementById('left').innerHTML = '';
          document.getElementById('right').innerHTML = '';
      
          document.getElementById('middle').innerHTML = `
            <div style="text-align:center; margin-top: 100px;">
              <h1 style="font-size: 48px; color: #28a745;">🎉 You Win! 🎉</h1>
              <p style="font-size: 20px;">Amazing job solving the Sudoku!</p>
              <button onclick="location.reload()" style="
                margin-top: 30px;
                padding: 10px 20px;
                font-size: 18px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
              ">
                🔄 再玩一次
              </button>
            </div>
          `;
      
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
      
          let duration = 2 * 1000;
          let end = Date.now() + duration;
      
          (function frame() {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 }
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 }
            });
      
            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          })();
        }, 500);
      }
      
    }
    else {
      document.getElementById(`m${now[0]}m${now[1]}`).classList.remove('addedRight');
      document.getElementById(`m${now[0]}m${now[1]}`).classList.add('addedWrong');
      wrong++;
      document.getElementById(`dododo`).innerHTML = wrong;
    }
  } else {
    const i = parseInt(input.innerText);
    if (document.getElementById(`m${now[0]}m${now[1]}`).innerHTML.trim() === '' || document.getElementById(`m${now[0]}m${now[1]}`).innerHTML.indexOf('littleNote') === -1) {
      document.getElementById(`m${now[0]}m${now[1]}`).innerHTML = `<div id='n${now[0]}n${now[1]}' class='littleNote'> </div>`;
      for (let k = 1; k < 10; k++) {
        document.getElementById(`n${now[0]}n${now[1]}`).innerHTML += `<p id='n${now[0]}n${now[1]}n${k}'> </p>`;
      }
    }
    const noteCell = document.getElementById(`n${now[0]}n${now[1]}n${i}`);
    if (noteCell.innerHTML == ' ') {
      noteCell.innerHTML = input.innerText;
    } else {
      noteCell.innerHTML = ' ';
    }
  }
}

function undo() {
  if (history.length === 0) return;
  const lastAction = history.pop();
  puzzleArray[lastAction.x][lastAction.y] = lastAction.prevValue;
  document.getElementById(`m${lastAction.x}m${lastAction.y}`).innerHTML = lastAction.prevValue === ' ' ? '' : lastAction.prevValue;
  document.getElementById(`m${lastAction.x}m${lastAction.y}`).className = lastAction.prevClass;
  choose(lastAction.x, lastAction.y);
  wrong--;
  document.getElementById(`dododo`).innerHTML = wrong;
}


function notes() {
  if (note) {
    document.getElementById('imgNote').innerHTML = '<img src="images/notesOff.png"><h4>Notes</h4>';
  } else {
    document.getElementById('imgNote').innerHTML = '<img src="images/notes.png"><h4>Notes</h4>';
  }
  note = !note;
}

function erase() {
  if (now[0] === -1 || now[1] === -1) return;
  if (puzzleArray[now[0]][now[1]] !== ' ') return;
  document.getElementById(`m${now[0]}m${now[1]}`).innerHTML = ' ';
}
