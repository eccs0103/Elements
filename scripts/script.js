//#region Canvas
function setup() 
{
	frameRate(60);
	let canvas = createCanvas(Board.widthPixels, Board.heightPixels);
	canvas.parent("game");
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

	if (Game.showResults)
	{
		Board.updateResults();
	}
}
//#endregion

//#region Navigation
Pages.id = 0;

document.getElementById("homeIcon").addEventListener
("click", 
	function(event)
	{
		Pages.id = 0;
	}
);

document.getElementById("settingsIcon").addEventListener
("click", 
	function(event)
	{
		Pages.id = 1;
	}
);

document.getElementById("informationIcon").addEventListener
("click", 
	function(event)
	{
		Pages.id = 2;
	}
);
//#endregion

//#region Game
Game.play = false;
document.getElementById("statusIcon").addEventListener
("click", 
	function()
	{
		Game.play = !Game.play;
	}
);

document.getElementById("refreshIcon").addEventListener
("click", 
	function(event)
	{
		Board.createMatrix();
		Board.generateBoard();
		Board.drawElements();
	}
);

Game.showResults = true;
document.getElementById("resultsIcon").addEventListener
("click", 
	function(event)
	{
		Game.showResults = !Game.showResults;
	}
);
//#endregion

//#region Settings
document.getElementById("saveCButton").addEventListener
("click", 
	function(event)
	{
		let voidCTest = parseInt(document.getElementById("voidInput").value), 
			grassCTest = parseInt(document.getElementById("grassInput").value),
			fireCTest = parseInt(document.getElementById("fireInput").value),
			waterCTest = parseInt(document.getElementById("waterInput").value),
			lavaCTest = parseInt(document.getElementById("lavaInput").value),
			iceCTest = parseInt(document.getElementById("iceInput").value);

		if
		(
			voidCTest == "NaN" ||
			grassCTest == "NaN" ||
			fireCTest == "NaN" ||
			waterCTest == "NaN" ||
			lavaCTest == "NaN" ||
			iceCTest == "NaN"
		)
		{
			window.alert("Введены неверные данные. Настройки не сохранены.");
		}
		else if
		(
			voidCTest < 0 || voidCTest > 100 ||
			grassCTest < 0 || grassCTest > 100 ||
			fireCTest < 0 || fireCTest > 100 ||
			waterCTest < 0 || waterCTest > 100 ||
			lavaCTest < 0 || lavaCTest > 100 ||
			iceCTest < 0 || iceCTest > 100
		)
		{
			window.alert("Данные должны быть от 0 до 100. Настройки не сохранены.");
		}
		else
		{
			Board.voidC = voidCTest;
			Board.grassC = grassCTest;
			Board.fireC = fireCTest;
			Board.waterC = waterCTest;
			Board.lavaC = lavaCTest;
			Board.iceC = iceCTest;
			Board.fullC = voidCTest + grassCTest + fireCTest + waterCTest + lavaCTest + iceCTest;

			Board.createMatrix();
			Board.generateBoard();
			Board.drawElements();
			Game.play = false;

			alert("Настройки сохранены.");
		}
	}
)
//#endregion