//#region Menu
let pageId = -1
//#endregion

//#region Game
let gameStatus = false;
let resultsStatus = true;
//#endregion

//#region Board
let size = Math.min
(
	document.documentElement.clientWidth - 70,
	document.documentElement.clientHeight - 165
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

// #region Save and Restore
// if (localStorage.getItem('data') === null) 
// {
// 	pageId = -1;
// 	width = 25;
// 	height = 25;
// 	voidC = 90;
// 	grassC = 4;
// 	fireC = 2;
// 	waterC = 2;
// 	lavaC = 1;
// 	iceC = 1;
// }
// else
// {
// 	let dataFile = localStorage.getItem('data');
// 	pageId = dataFile[0];
// 	width = dataFile[1];
// 	height = dataFile[2];
// 	voidC = dataFile[3];
// 	grassC = dataFile[4];
// 	fireC = dataFile[5];
// 	waterC = dataFile[6];
// 	lavaC = dataFile[7];
// 	iceC = dataFile[8];
// }
// fullC = voidC + grassC + fireC + waterC + lavaC + iceC;

// window.addEventListener
// ('beforeunload', 
// 	function (event) 
// 	{
// 		let dataFile = 
// 		[
// 			pageId,
// 			width,
// 			height,
// 			voidC,
// 			grassC,
// 			fireC,
// 			waterC,
// 			lavaC,
// 			iceC,
// 		];

// 		localStorage.setItem(dataFile, "data")
// 	}
// );
//#endregion