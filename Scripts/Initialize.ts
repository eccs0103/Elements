document.addEventListener
("DOMContentLoaded", 
	function(Event)
	{
		//#region Loading
		Interface.DarkTheme = Files.Load("Interface.DarkTheme", false);

		setTimeout
		(
			function()
			{
				document.getElementById("DivLoading").style.visibility = "hidden";
				document.getElementById("DivLoading").style.transform = "translateY(-100%)";
				document.getElementById("DivLoading").style.transition = "visibility 0s " + Interface.LoadingTime + "s, transform " + Interface.LoadingTime + "s";
				document.body.style.overflow = "auto";
				
			}, 
			Interface.LoadingTime * 1000
		);
		//#endregion

		//#region Navigation
		Navigate.Id = Files.Load("Navigate.Id", 0);
		//#endregion

		//#region Program
		Program.Canvas.width = Program.SizePixels;
		Program.Canvas.height = Program.SizePixels;

		Program.SizeCells = Files.Load("Program.Size", 25);
		Program.Execute = false;
		Program.Stats = Files.Load("Program.Stats", false);

		Program.VoidC = Files.Load("Program.VoidC", 90);
		Program.GrassC = Files.Load("Program.GrassC", 4);
		Program.FireC = Files.Load("Program.FireC", 2);
		Program.WaterC = Files.Load("Program.WaterC", 2);
		Program.LavaC = Files.Load("Program.LavaC", 1);
		Program.IceC = Files.Load("Program.IceC", 1);

		Program.GenerateBoard();
		Program.DrawElements();

		setInterval
		(
			function()
			{ 
				//#region Execute
				if(Program.Execute)
				{
					Program.DrawElements();
					Program.ExecuteFrame();
				}
				//#endregion
		
				//#region Stats
				let VoidCount = 0;
				let GrassCount = 0;
				let FireCount = 0;
				let WaterCount = 0;
				let LavaCount = 0;
				let IceCount = 0;

				for (let Y = 0; Y < Program.HeightCells; Y++)
				{
					for (let X = 0; X < Program.WidthCells; X++)
					{
						let element = Program.Matrix[Y][X];
						if (element instanceof Void)
						{
							VoidCount++;
						}
						else if(element instanceof Grass)
						{
							GrassCount++;
						}
						else if(element instanceof Fire)
						{
							FireCount++;
						}
						else if(element instanceof Water)
						{
							WaterCount++;
						}
						else if(element instanceof Lava)
						{
							LavaCount++;
						}
						else if(element instanceof Ice)
						{
							IceCount++;
						}
					}
				}

				if (Program.Stats)
				{
					document.getElementById("TextVoid").textContent = String(VoidCount);
					document.getElementById("TextGrass").textContent = String(GrassCount);
					document.getElementById("TextFire").textContent = String(FireCount);
					document.getElementById("TextWater").textContent = String(WaterCount);
					document.getElementById("TextLava").textContent = String(LavaCount);
					document.getElementById("TextIce").textContent = String(IceCount);
					document.getElementById("TextAll").textContent = String(Program.WidthCells * Program.HeightCells);
				}
				//#endregion
			}, 
			1000 / Program.FramesCount
		);
		//#endregion

		//#region Settings
		document.getElementById("InputSize").value = Program.WidthCells;

		document.getElementById("InputVoidC").value = Program.VoidC;
		document.getElementById("InputGrassC").value = Program.GrassC;
		document.getElementById("InputFireC").value = Program.FireC;
		document.getElementById("InputWaterC").value = Program.WaterC;
		document.getElementById("InputLavaC").value = Program.LavaC;
		document.getElementById("InputIceC").value = Program.IceC;
		//#endregion
	}
);