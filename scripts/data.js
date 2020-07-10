//#region Menu
let pageId = -1
//#endregion

//#region Game
let gameStatus = false;
//#endregion

//#region Board
let size = Math.min
(
	document.documentElement.clientWidth - 70,
	document.documentElement.clientHeight - 160
);

let width = 25, height = 25;
let widthPx = size, heightPx = size;

let board = [];
for (let y = 0; y < height; y++)
{
	board[y] = [];
}

let voidC = 90;
let grassC = 4;
let fireC = 2;
let waterC = 2;
let lavaC = 1;
let iceC = 1;
let fullC = voidC + grassC + fireC + waterC + lavaC + iceC;
//#endregion