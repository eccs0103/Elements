//#region Menu
let pageId = -1
//#endregion

//#region Game
let gameStatus = false;
//#endregion

//#region Board
let width = 25, height = 25;
let widthPx = 450, heightPx = 450;

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