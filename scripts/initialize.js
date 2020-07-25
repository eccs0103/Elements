//#region Loading
document.addEventListener
("DOMContentLoaded", 
	function(event)
	{
		setTimeout
		(
			function()
			{
				document.getElementById("loading_block").style.visibility = "hidden";
				document.getElementById("loading_block").style.transform = "translateY(-100%)";
				document.getElementById("loading_block").style.transition = "visibility 0s " + Interface.loadingTime + "s, transform " + Interface.loadingTime + "s";
				document.body.style.overflow = "auto";
				
			}, 
			Interface.loadingTime * 1000
		);
	}
);
//#endregion

//#region Navigation
Pages.id = Files.load("Pages.id", 0);
//#endregion

//#region P5
function setup() 
{
	frameRate(60);
	let canvas = createCanvas(Board.sizePixels, Board.sizePixels);
	canvas.parent("div_game");
	background(255, 255, 255);
	if(Interface.borders)
	{
		stroke(150, 150, 150);
	}
	else
	{
		noStroke();
	}

	Board.createMatrix();
	Board.generateBoard();
	Board.drawElements();
}

function draw() 
{
	if(Game.execute)
	{
		Board.drawElements();
	}

	if (Game.stats)
	{
		Board.updateStatistics();
	}
}
//#endregion

//#region Game
Game.play = false;
Game.stats = Files.load("Game.stats", true);

Board.voidC = 90;
Board.grassC = 4;
Board.fireC = 2;
Board.waterC = 2;
Board.lavaC = 1;
Board.iceC = 1;
//#endregion

//#region Settings
Interface.darkTheme = Files.load("Interface.darkTheme", false);
//Interface.borders = Files.load("Interface.borders", true);

let boardSize = Files.load("Board.size", 25);
Board.sizeCells = boardSize;
document.getElementById("input_size").value = boardSize;
//#endregion