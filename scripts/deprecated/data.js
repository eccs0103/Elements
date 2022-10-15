//#region Interface
class Interface {
	//#region Theme
	static #DarkTheme: Boolean;
	static get DarkTheme(): Boolean {
		return this.#DarkTheme;
	}
	static set DarkTheme(Value: Boolean) {
		if (Value) {
			document.documentElement.classList.replace("Light", "Dark");
			document.getElementById("ButtonTheme").classList.replace("Foreground", "Background");
			document.getElementById("ButtonTheme").classList.replace("Unbordered", "Bordered");
			document.getElementById("TextTheme").textContent = "Выключить";
		}
		else if (!Value) {
			document.documentElement.classList.replace("Dark", "Light");
			document.getElementById("ButtonTheme").classList.replace("Background", "Foreground");
			document.getElementById("ButtonTheme").classList.replace("Bordered", "Unbordered");
			document.getElementById("TextTheme").textContent = "Включить";
		}
		this.#DarkTheme = Value;
		Files.Save("Interface.DarkTheme", this.#DarkTheme);
	}
	//#endregion

	//#region Slide
	static #SlideTime: Number;
	static get SlideTime(): Number {
		return this.#SlideTime;
	}
	static set SlideTime(Value: Number) {
		this.#SlideTime = Value;
		Files.Save("Interface.SlideTime", this.#SlideTime);
	}
	//#endregion

	//#region  Console
	static #ConsoleTime: Number;
	static get ConsoleTime(): Number {
		return this.#ConsoleTime;
	}
	static set ConsoleTime(Value: Number) {
		this.#ConsoleTime = Value;
		Files.Save("Interface.ConsoleTime", this.#ConsoleTime);
	}
	//#endregion
}
//#endregion

//#region Navigate
class Navigate {
	//#region List
	static #List =
		[
			[document.getElementById("PageHome"), document.getElementById("ButtonHome")],
			[document.getElementById("PageSettings"), document.getElementById("ButtonSettings")],
			[document.getElementById("PageInformation"), document.getElementById("ButtonInformation")],
		];
	//#endregion

	//#region Id
	static #Id: Number;
	static get Id(): Number {
		return this.#Id;
	}
	static set Id(Value: Number) {
		if (0 <= Value && Value < this.#List.length) {
			for (let index = 0; index < this.#List.length; index++) {
				this.#List[index][0].style.display = "none";
				if (this.#List[index][1].classList.contains("Background")) {
					this.#List[index][1].classList.replace("Background", "Foreground");
				}
				if (this.#List[index][1].classList.contains("Bordered")) {
					this.#List[index][1].classList.replace("Bordered", "Unbordered");
				}
			}
			this.#List[Value][0].style.display = "flex";
			this.#List[Value][1].classList.replace("Foreground", "Background");
			this.#List[Value][1].classList.replace("Unbordered", "Bordered");
			this.#Id = Value;
			Files.Save("Navigate.Id", this.#Id);
		}
		else {
			throw new RangeError(String(Value));
		}
	}
	//#endregion
};
//#endregion

//#region Program
class Program {
	//#region Elements
	static Canvas = document.getElementById("CanvasProgram");
	static Desk = document.getElementById("CanvasProgram").getContext("2d");
	//#endregion

	//#region Matrix
	static Matrix: any[][] = [];
	//#endregion

	//#region Frames Count
	static #FramesCount: Number;
	static #MinFramesCount: Number = 30;
	static #MaxFramesCount: Number = 120;
	static get FramesCount(): Number {
		return this.#FramesCount;
	}
	static set FramesCount(Value: Number) {
		if (this.#MinFramesCount <= Value && Value <= this.#MaxFramesCount) {
			this.#FramesCount = Value;
			Files.Save("Program.FramesCount", this.#FramesCount);
		}
		else {
			throw new RangeError(String(Value));
		}
	}
	//#endregion

	//#region Size
	static #WidthCells: Number;
	static #MinWidthCells: Number = 10;
	static #MaxWidthCells: Number = 50;
	static get WidthCells(): Number {
		return this.#WidthCells;
	}
	static set WidthCells(Value: Number) {
		if (this.#MinWidthCells <= Value && Value <= this.#MaxWidthCells) {
			this.#WidthCells = Value;

			this.Matrix = [];
			for (let Y = 0; Y < this.#HeightCells; Y++) {
				this.Matrix[Y] = [];
			}
			Files.Save("Program.WidthCells", this.#WidthCells);
		}
		else {
			throw new RangeError(String(Value));
		}
	}

	static #HeightCells: Number;
	static #MinHeightCells: Number = 10;
	static #MaxHeightCells: Number = 50;
	static get HeightCells(): Number {
		return this.#HeightCells;
	}
	static set HeightCells(Value: Number) {
		if (this.#MinHeightCells <= Value && Value <= this.#MaxHeightCells) {
			this.#HeightCells = Value;

			this.Matrix = [];
			for (let Y = 0; Y < this.#HeightCells; Y++) {
				this.Matrix[Y] = [];
			}
			Files.Save("Program.HeightCells", this.#HeightCells);
		}
		else {
			throw new RangeError(String(Value));
		}
	}
	//#endregion

	//#region Resolution
	static #WidthPixels: Number = document.documentElement.clientWidth - 40;
	static #HeightPixels: Number = document.getElementById("DivProgram").clientHeight - 20 - document.getElementById("DivProgramContol").scrollHeight;
	static SizePixels: Number = Math.min
		(
			Program.#WidthPixels,
			Program.#HeightPixels
		);
	//#endregion

	//#region Coefficents
	static #FullC: Number = 100;
	static get FullC(): Number {
		return this.#FullC;
	}

	static #VoidC: Number;
	static get VoidC(): Number {
		return this.#VoidC;
	}

	static #GrassC: Number;
	static get GrassC(): Number {
		return this.#GrassC;
	}

	static #FireC: Number;
	static get FireC(): Number {
		return this.#FireC;
	}

	static #WaterC: Number;
	static get WaterC(): Number {
		return this.#WaterC;
	}

	static #LavaC: Number;
	static get LavaC(): Number {
		return this.#LavaC;
	}

	static #IceC: Number;
	static get IceC(): Number {
		return this.#IceC;
	}

	static Coefficents(GrassC: Number, FireC: Number, WaterC: Number, LavaC: Number, IceC: Number) {
		let TotalC: Number = GrassC + FireC + WaterC + LavaC + IceC;
		if (0 <= TotalC && TotalC <= this.#FullC) {
			this.#VoidC = this.#FullC - TotalC;
			this.#GrassC = GrassC;
			this.#FireC = FireC;
			this.#WaterC = WaterC;
			this.#LavaC = LavaC;
			this.#IceC = IceC;

			this.Execute = false;
			this.GenerateBoard();
			this.DrawElements();

			Files.Save("Program.VoidC", this.#VoidC);
			Files.Save("Program.GrassC", this.#GrassC);
			Files.Save("Program.FireC", this.#FireC);
			Files.Save("Program.WaterC", this.#WaterC);
			Files.Save("Program.LavaC", this.#LavaC);
			Files.Save("Program.IceC", this.#IceC);
		}
		else {
			throw new RangeError(String(GrassC + ", " + FireC + ", " + WaterC + ", " + LavaC + ", " + IceC));
		}
	}
	//#endregion

	//#region Functions
	static GenerateBoard() {
		for (let Y = 0; Y < this.HeightCells; Y++) {
			for (let X = 0; X < this.WidthCells; X++) {
				let RandomElement = Random.Integer(0, this.FullC);
				if (RandomElement >= 0 && RandomElement < this.VoidC) {
					this.Matrix[Y][X] = new Void(X, Y);
				}
				else if (RandomElement >= this.VoidC && RandomElement < this.VoidC + this.GrassC) {
					this.Matrix[Y][X] = new Grass(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC && RandomElement < this.VoidC + this.GrassC + this.FireC) {
					this.Matrix[Y][X] = new Fire(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC + this.FireC && RandomElement < this.VoidC + this.GrassC + this.FireC + this.WaterC) {
					this.Matrix[Y][X] = new Water(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC + this.FireC + this.WaterC && RandomElement < this.VoidC + this.GrassC + this.FireC + this.WaterC + this.LavaC) {
					this.Matrix[Y][X] = new Lava(X, Y, 3);
				}
				else if (RandomElement >= this.VoidC + this.GrassC + this.FireC + this.WaterC + this.LavaC && RandomElement < this.FullC) {
					this.Matrix[Y][X] = new Ice(X, Y, 3);
				}
			}
		}
	}

	static DrawElements() {
		let CellWidth = document.getElementById("CanvasProgram").width / Program.WidthCells;
		let CellHeight = document.getElementById("CanvasProgram").height / Program.HeightCells;

		for (let Y = 0; Y < Program.HeightCells; Y++) {
			for (let X = 0; X < Program.WidthCells; X++) {
				let Element = Program.Matrix[Y][X];
				if (Element instanceof Void) {
					this.Desk.fillStyle = "rgb(225, 225, 225)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Grass) {
					this.Desk.fillStyle = "rgb(0, 128, 0)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Fire) {
					this.Desk.fillStyle = "rgb(255, 150, 0)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Water) {
					this.Desk.fillStyle = "rgb(0, 50, 255)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Lava) {
					if (Element.Density == 3) {
						this.Desk.fillStyle = "rgb(255, 0, 0)";
					}
					else if (Element.Density == 2) {
						this.Desk.fillStyle = "rgb(255, 50, 0)";
					}
					else if (Element.Density == 1) {
						this.Desk.fillStyle = "rgb(255, 100, 0)";
					}
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Ice) {
					if (Element.Density == 3) {
						this.Desk.fillStyle = "rgb(0, 200, 255)";
					}
					else if (Element.Density == 2) {
						this.Desk.fillStyle = "rgb(0, 150, 255)";
					}
					else if (Element.Density == 1) {
						this.Desk.fillStyle = "rgb(0, 100, 255)";
					}
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
			}
		}
	}

	static ExecuteFrame() {
		for (let Y = 0; Y < Program.HeightCells; Y++) {
			for (let X = 0; X < Program.WidthCells; X++) {
				let Element = Program.Matrix[Y][X];
				if (Element instanceof Void) {

				}
				else if (Element instanceof Grass) {
					Element.Grow();
				}
				else if (Element instanceof Fire) {
					Element.Burn();
					Element.Fade();
				}
				else if (Element instanceof Water) {
					Element.Flow();
					Element.Evaporate();
				}
				else if (Element instanceof Lava) {
					Element.Flow();
					Element.Burn();
					Element.Fade();
				}
				else if (Element instanceof Ice) {
					Element.Flow();
					Element.Melt();
					Element.Evaporate();
				}
			}
		}
	}
	//#endregion

	//#region Execute
	static #Eexecute: Boolean = false;
	static get Execute(): Boolean {
		return this.#Eexecute;
	}
	static set Execute(Value: Boolean) {
		if (Value) {
			document.getElementById("ImagePlay").src = "../Resources/Pause.png";
			document.getElementById("ImagePlay").alt = "Пауза";
		}
		else if (!Value) {
			document.getElementById("ImagePlay").src = "../Resources/PlayArrow.png";
			document.getElementById("ImagePlay").alt = "Старт";
		}
		this.#Eexecute = Value;
	}
	//#endregion

	//#region Stats
	static #Stats: Boolean = true;
	static get Stats(): Boolean {
		return this.#Stats;
	}
	static set Stats(Value: Boolean) {
		if (Value) {
			document.getElementById("DivStats").style.display = "flex";
			document.getElementById("ButtonStats").classList.replace("Foreground", "Background");
			document.getElementById("ButtonStats").classList.replace("Unbordered", "Bordered");
			document.getElementById("TextStats").textContent = "Скрыть";
		}
		else if (!Value) {
			document.getElementById("DivStats").style.display = "none";
			document.getElementById("ButtonStats").classList.replace("Background", "Foreground");
			document.getElementById("ButtonStats").classList.replace("Bordered", "Unbordered");
			document.getElementById("TextStats").textContent = "Показать";
		}
		this.#Stats = Value;
		Files.Save("Program.Stats", this.#Stats);
	}
	//#endregion
}
//#endregion

//#region Default
class Default {
	static #SlideTime: Number = 0.5;
	static get SlideTime(): Number {
		return this.#SlideTime;
	}

	static #ConsoleTime: Number = 2;
	static get ConsoleTime(): Number {
		return this.#ConsoleTime;
	}

	static #DarkTheme: Boolean = false;
	static get DarkTheme(): Boolean {
		return this.#DarkTheme;
	}

	static #NavigateId: Number = 0;
	static get NavigateId(): Number {
		return this.#NavigateId;
	}

	static #WidthCells: Number = 25;
	static get WidthCells(): Number {
		return this.#WidthCells;
	}

	static #HeightCells: Number = 25;
	static get HeightCells(): Number {
		return this.#HeightCells;
	}

	static #FramesCount: Number = 60;
	static get FramesCount(): Number {
		return this.#FramesCount;
	}

	static #Stats: Boolean = false;
	static get Stats(): Boolean {
		return this.#Stats;
	}

	static #GrassC: Number = 4;
	static get GrassC(): Number {
		return this.#GrassC;
	}

	static #FireC: Number = 2;
	static get FireC(): Number {
		return this.#FireC;
	}

	static #WaterC: Number = 2;
	static get WaterC(): Number {
		return this.#WaterC;
	}

	static #LavaC: Number = 1;
	static get LavaC(): Number {
		return this.#LavaC;
	}

	static #IceC: Number = 1;
	static get IceC(): Number {
		return this.#IceC;
	}

	static #GrassGrowCountdownMax: Number = 10;
	static get GrassGrowCountdownMax(): Number {
		return this.#GrassGrowCountdownMax;
	}

	static #FireLifespanMax: Number = 16;
	static get FireLifespanMax(): Number {
		return this.#FireLifespanMax;
	}

	static #FireBurnCountdownMax: Number = 4;
	static get FireBurnCountdownMax(): Number {
		return this.#FireBurnCountdownMax;
	}

	static #WaterFlowCountdownMax: Number = 8;
	static get WaterFlowCountdownMax(): Number {
		return this.#WaterFlowCountdownMax;
	}

	static #WaterEvaporateCountdownMax: Number = 4;
	static get WaterEvaporateCountdownMax(): Number {
		return this.#WaterEvaporateCountdownMax;
	}

	static #LavaFlowCountdownMax: Number = 15;
	static get LavaFlowCountdownMax(): Number {
		return this.#LavaFlowCountdownMax;
	}

	static #LavaBurnCountdownMax: Number = 8;
	static get LavaBurnCountdownMax(): Number {
		return this.#LavaBurnCountdownMax;
	}

	static #LavaFadeCountdownMax: Number = 4;
	static get LavaFadeCountdownMax(): Number {
		return this.#LavaFadeCountdownMax;
	}

	static #IceFlowCountdownMax: Number = 12;
	static get IceFlowCountdownMax(): Number {
		return this.#IceFlowCountdownMax;
	}

	static #IceMeltCountdownMax: Number = 4;
	static get IceMeltCountdownMax(): Number {
		return this.#IceMeltCountdownMax;
	}

	static #IceEvaporateCountdownMax: Number = 4;
	static get IceEvaporateCountdownMax(): Number {
		return this.#IceEvaporateCountdownMax;
	}
}
//#endregionu