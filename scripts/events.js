//#region Navigation
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

document.getElementById("div_statistics").addEventListener
("click", 
	function(event)
	{
		Game.showStatistics = !Game.showStatistics;
	}
);
//#endregion

//#region Settings
document.getElementById("div_theme").addEventListener
("click",
	function(event)
	{
		Interface.darkTheme = !Interface.darkTheme;
	}
);

// document.getElementById("test").addEventListener
// ("input",
// 	function(event)
// 	{
// 		document.getElementById("test").
// 	}
// );
//#endregion