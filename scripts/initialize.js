//#region Loading
setTimeout
(
	function()
	{
		document.getElementById("loading_block").style.display = "none";
	}, 
	Interface.loadingTime * 1000
);
//#endregion

//#region P5
function setup() 
{
	frameRate(60);
	let canvas = createCanvas(Board.widthPixels, Board.heightPixels);
	canvas.parent("div_game");
	background(255, 255, 255);
	stroke(150, 150, 150);

	Board.createMatrix();
	Board.generateBoard();
	Board.drawElements();
}

function draw() 
{
	if(Game.play)
	{
		Board.drawElements();
	}

	if (Game.showStatistics)
	{
		Board.updateStatistics();
	}
}
//#endregion

//#region Navigation
Pages.id = 0;
//#endregion

//#region Game
Game.play = false;
Game.showResults = true;
//#endregion

//#region Settings
Interface.darkTheme = false;
//#endregion