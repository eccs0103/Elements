//#region Canvas
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

document.getElementById("div_home").addEventListener
("click", 
	function(event)
	{
		Pages.id = 0;
	}
);

document.getElementById("div_settings").addEventListener
("click", 
	function(event)
	{
		Pages.id = 1;
	}
);

document.getElementById("div_information").addEventListener
("click", 
	function(event)
	{
		Pages.id = 2;
	}
);
//#endregion

//#region Game
Game.play = false;
document.getElementById("div_play").addEventListener
("click", 
	function()
	{
		Game.play = !Game.play;
	}
);

document.getElementById("div_reset").addEventListener
("click", 
	function(event)
	{
		Board.createMatrix();
		Board.generateBoard();
		Board.drawElements();
	}
);

Game.showResults = true;
document.getElementById("div_statistics").addEventListener
("click", 
	function(event)
	{
		Game.showStatistics = !Game.showStatistics;
	}
);
//#endregion

//#region Settings
Interface.darkTheme = false;

document.getElementById("div_theme").addEventListener
("click",
	function(event)
	{
		Interface.darkTheme = !Interface.darkTheme;
	}
);

// document.getElementById("input_number_widthCells").addEventListener
// ("input",
// 	function(event)
// 	{
		
// 	}
// );

// document.getElementById("input_number_heightCells").addEventListener
// ("input",
// 	function(event)
// 	{
		
// 	}
// );
//#endregion