//#region Navigation
document.getElementById("div_home").addEventListener
("click", 
	function(event)
	{
		Navigate.id = 0;
		Files.save("Navigate.id", Navigate.id);
	}
);

document.getElementById("div_settings").addEventListener
("click", 
	function(event)
	{
		Navigate.id = 1;
		Files.save("Navigate.id", Navigate.id);
	}
);

document.getElementById("div_information").addEventListener
("click", 
	function(event)
	{
		Navigate.id = 2;
		Files.save("Navigate.id", Navigate.id);
	}
);
//#endregion

//#region Program
document.getElementById("div_execute").addEventListener
("click", 
	function()
	{
		Program.execute = !Program.execute;
	}
);

document.getElementById("div_reset").addEventListener
("click", 
	function(event)
	{
		Program.createMatrix();
		Program.generateBoard();
		Program.drawElements();
	}
);

document.getElementById("div_stats").addEventListener
("click", 
	function(event)
	{
		Program.stats = !Program.stats;
		Files.save("Program.stats", Program.stats);
	}
);
//#endregion

//#region Settings
document.getElementById("div_theme").addEventListener
("click",
	function(event)
	{
		Interface.darkTheme = !Interface.darkTheme;
		Files.save("Interface.darkTheme", Interface.darkTheme);
	}
);

document.getElementById("input_size").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");

		if
		(
			event.target.value >= Program.minSizeCells && 
			event.target.value <= Program.maxSizeCells
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.sizeCells = event.target.value;
			Files.save("Program.size", event.target.value);

			Program.execute = false;
			Program.createMatrix();
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);

document.getElementById("input_grassC").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		let number = parseInt(event.target.value);

		if
		(
			number >= 0 && 
			number + Program.fireC + Program.waterC + Program.lavaC + Program.iceC <= Program.fullC
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.grassC = number;
			Files.save("Program.grassC", number);
			Program.voidC = Program.fullC - Program.grassC - Program.fireC - Program.waterC - Program.lavaC - Program.iceC;
			Files.save("Program.voidC", Program.voidC);

			Program.execute = false;
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);
document.getElementById("input_fireC").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		let number = parseInt(event.target.value);

		if
		(
			number >= 0 && 
			number + Program.grassC + Program.waterC + Program.lavaC + Program.iceC <= Program.fullC
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.fireC = number;
			Files.save("Program.fireC", number);
			Program.voidC = Program.fullC - Program.grassC - Program.fireC - Program.waterC - Program.lavaC - Program.iceC;
			Files.save("Program.voidC", Program.voidC);

			Program.execute = false;
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);
document.getElementById("input_waterC").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		let number = parseInt(event.target.value);

		if
		(
			number >= 0 && 
			number + Program.grassC + Program.fireC + Program.lavaC + Program.iceC <= Program.fullC
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.waterC = number;
			Files.save("Program.waterC", number);
			Program.voidC = Program.fullC - Program.grassC - Program.fireC - Program.waterC - Program.lavaC - Program.iceC;
			Files.save("Program.voidC", Program.voidC);

			Program.execute = false;
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);
document.getElementById("input_lavaC").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		let number = parseInt(event.target.value);

		if
		(
			number >= 0 && 
			number + Program.grassC + Program.fireC + Program.waterC + Program.iceC <= Program.fullC
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.lavaC = number;
			Files.save("Program.lavaC", number);
			Program.voidC = Program.fullC - Program.grassC - Program.fireC - Program.waterC - Program.lavaC - Program.iceC;
			Files.save("Program.voidC", Program.voidC);

			Program.execute = false;
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);
document.getElementById("input_iceC").addEventListener
("input",
	function(event)
	{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
		let number = parseInt(event.target.value);

		if
		(
			number >= 0 && 
			number + Program.grassC + Program.fireC + Program.waterC + Program.lavaC <= Program.fullC
		)
		{
			if(event.target.classList.contains("denied"))
			{
				event.target.classList.replace("denied", "block");
			}
			Program.iceC = number;
			Files.save("Program.iceC", number);
			Program.voidC = Program.fullC - Program.grassC - Program.fireC - Program.waterC - Program.lavaC - Program.iceC;
			Files.save("Program.voidC", Program.voidC);

			Program.execute = false;
			Program.generateBoard();
			Program.drawElements();
		}
		else
		{
			if(event.target.classList.contains("block"))
			{
				event.target.classList.replace("block", "denied");
			}
		}
	}
);
//#endregion