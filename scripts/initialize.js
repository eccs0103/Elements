document.addEventListener
("DOMContentLoaded", 
	function(event)
	{
		//#region Loading
		Interface.darkTheme = Files.load("Interface.darkTheme", false);

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
		Program.canvas.width = Program.sizePixels;
		Program.canvas.height = Program.sizePixels;
		// let squareSize = Math.max(document.getElementById("canvas_program").clientWidth, document.getElementById("canvas_program").clientHeight);
		// document.getElementById("canvas_program").width = squareSize;
		// document.getElementById("canvas_program").height = squareSize;

		Program.sizeCells = Files.load("Program.size", 25);
		Program.play = false;
		Program.stats = Files.load("Program.stats", true);

		Program.voidC = Files.load("Program.voidC", 90);
		Program.grassC = Files.load("Program.grassC", 4);
		Program.fireC = Files.load("Program.fireC", 2);
		Program.waterC = Files.load("Program.waterC", 2);
		Program.lavaC = Files.load("Program.lavaC", 1);
		Program.iceC = Files.load("Program.iceC", 1);

		Program.generateBoard();
		Program.drawElements();

		setInterval
		(
			function()
			{ 
				//#region Execute
				if(Program.execute)
				{
					Program.drawElements();
					Program.executeFrame();
				}
				//#endregion
		
				//#region Stats
				let voidCount = 0;
				let grassCount = 0;
				let fireCount = 0;
				let waterCount = 0;
				let lavaCount = 0;
				let iceCount = 0;

				for (let y = 0; y < Program.heightCells; y++)
				{
					for (let x = 0; x < Program.widthCells; x++)
					{
						let element = Program.matrix[y][x];
						if (element instanceof Void)
						{
							voidCount++;
						}
						else if(element instanceof Grass)
						{
							grassCount++;
						}
						else if(element instanceof Fire)
						{
							fireCount++;
						}
						else if(element instanceof Water)
						{
							waterCount++;
						}
						else if(element instanceof Lava)
						{
							lavaCount++;
						}
						else if(element instanceof Ice)
						{
							iceCount++;
						}
					}
				}

				if (Program.stats)
				{
					document.getElementById("div_void_count").textContent = voidCount;
					document.getElementById("div_grass_count").textContent = grassCount;
					document.getElementById("div_fire_count").textContent = fireCount;
					document.getElementById("div_water_count").textContent = waterCount;
					document.getElementById("div_lava_count").textContent = lavaCount;
					document.getElementById("div_ice_count").textContent = iceCount;
					document.getElementById("div_all_count").textContent = Program.widthCells * Program.heightCells;
				}
				//#endregion
			}, 
			1000 / Program.framesCount
		);
		//#endregion

		//#region Settings
		document.getElementById("input_size").value = Program.widthCells;

		document.getElementById("input_voidC").value = Program.voidC;
		document.getElementById("input_grassC").value = Program.grassC;
		document.getElementById("input_fireC").value = Program.fireC;
		document.getElementById("input_waterC").value = Program.waterC;
		document.getElementById("input_lavaC").value = Program.lavaC;
		document.getElementById("input_iceC").value = Program.iceC;
		//#endregion
	}
);