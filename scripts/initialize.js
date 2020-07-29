document.addEventListener
("DOMContentLoaded", 
	function(event)
	{
		//#region Loading
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
		//#endregion

		//#region Navigation
		Navigate.id = Files.load("Navigate.id", 0);
		//#endregion

		//#region Program
		Program.play = false;
		Program.stats = Files.load("Program.stats", true);
		Program.grassC = Files.load("Program.grassC", 4);
		Program.fireC = Files.load("Program.fireC", 2);
		Program.waterC = Files.load("Program.waterC", 2);
		Program.lavaC = Files.load("Program.lavaC", 1);
		Program.iceC = Files.load("Program.iceC", 1);
		//#endregion

		//#region Settings
		Interface.darkTheme = Files.load("Interface.darkTheme", false);
		Program.sizeCells = Files.load("Program.size", 25);
		document.getElementById("input_size").value = Files.load("Program.size", 25);
		document.getElementById("input_grassC").value = Files.load("Program.grassC", 4);
		document.getElementById("input_fireC").value = Files.load("Program.fireC", 2);
		document.getElementById("input_waterC").value = Files.load("Program.waterC", 2);
		document.getElementById("input_lavaC").value = Files.load("Program.lavaC", 1);
		document.getElementById("input_iceC").value = Files.load("Program.iceC", 1);
		//#endregion
	}
);

//#region P5
function setup() 
{
	frameRate(60);
	let canvas = createCanvas(Program.sizePixels, Program.sizePixels);
	canvas.parent("div_program");
	background(255, 255, 255);
	stroke(150, 150, 150);

	Program.createMatrix();
	Program.generateBoard();
	Program.drawElements();
}

function draw() 
{
	if(Program.execute)
	{
		Program.drawElements();
	}

	if (Program.stats)
	{
		Program.updateStatistics();
	}
}
//#endregion