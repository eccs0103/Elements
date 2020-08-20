//#region Interface
class Interface
{
	//#region Theme
	private static _DarkTheme: boolean;
	public static get DarkTheme(): boolean
	{
		return this._DarkTheme;
	}
	public static set DarkTheme(Value: boolean)
	{
		if(Value)
		{
			document.documentElement.classList.replace("Light", "Dark");
			document.getElementById("ButtonTheme").classList.replace("Foreground", "Background");
			document.getElementById("ButtonTheme").classList.replace("Unbordered", "Bordered");
			document.getElementById("TextTheme").textContent = "Выключить";
		}
		else if(!Value)
		{
			document.documentElement.classList.replace("Dark", "Light");
			document.getElementById("ButtonTheme").classList.replace("Background", "Foreground");
			document.getElementById("ButtonTheme").classList.replace("Bordered", "Unbordered");
			document.getElementById("TextTheme").textContent = "Включить";
		}
		this._DarkTheme = Value;
		Files.Save("Interface.DarkTheme", this._DarkTheme);
	}
	//#endregion

	//#region Slide
	private static _SlideTime: number;
	public static get SlideTime(): number
	{
		return this._SlideTime;
	} 
	public static set SlideTime(Value: number)
	{
		this._SlideTime = Value;
		Files.Save("Interface.SlideTime", this._SlideTime);
	}
	//#endregion

	//#region  Console
	private static _ConsoleTime: number;
	public static get ConsoleTime(): number
	{
		return this._ConsoleTime;
	} 
	public static set ConsoleTime(Value: number)
	{
		this._ConsoleTime = Value;
		Files.Save("Interface.ConsoleTime", this._ConsoleTime);
	}
	//#endregion
}
//#endregion

//#region Navigate
class Navigate
{
	//#region List
	private static _List = 
	[
		[document.getElementById("PageHome"), document.getElementById("ButtonHome")],
		[document.getElementById("PageSettings"), document.getElementById("ButtonSettings")],
		[document.getElementById("PageInformation"), document.getElementById("ButtonInformation")],
	];
	//#endregion

	//#region Id
	private static _Id: number;
	public static get Id(): number
	{
		return this._Id;
	}
	public static set Id (Value: number)
	{
		if(0 <= Value && Value < this._List.length)
		{
			for (let index = 0; index < this._List.length; index++) 
			{
				this._List[index][0].style.display = "none";
				if(this._List[index][1].classList.contains("Background"))
				{
					this._List[index][1].classList.replace("Background", "Foreground");
				}
				if(this._List[index][1].classList.contains("Bordered"))
				{
					this._List[index][1].classList.replace("Bordered", "Unbordered");
				}
			}
			this._List[Value][0].style.display = "flex";
			this._List[Value][1].classList.replace("Foreground", "Background");
			this._List[Value][1].classList.replace("Unbordered", "Bordered");
			this._Id = Value;
			Files.Save("Navigate.Id", this._Id);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	//#endregion
};
//#endregion

//#region Program
class Program
{
	//#region Elements
	public static Canvas = document.getElementById("CanvasProgram");
	public static Desk = document.getElementById("CanvasProgram").getContext("2d");
	//#endregion

	//#region Matrix
	public static Matrix: any[][] = [];
	//#endregion

	//#region Frames Count
	private static _FramesCount: number;
	private static _MinFramesCount: number = 30;
	private static _MaxFramesCount: number = 120;
	public static get FramesCount(): number
	{
		return this._FramesCount;
	}
	public static set FramesCount(Value: number)
	{
		if(this._MinFramesCount <= Value && Value <= this._MaxFramesCount)
		{
			this._FramesCount = Value;
			Files.Save("Program.FramesCount", this._FramesCount);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	//#endregion

	//#region Size
	private static _WidthCells: number;
	private static _MinWidthCells: number = 10;
	private static _MaxWidthCells: number = 50;
	public static get WidthCells(): number
	{
		return this._WidthCells;
	}
	public static set WidthCells(Value: number)
	{
		if(this._MinWidthCells <= Value && Value <= this._MaxWidthCells)
		{
			this._WidthCells = Value;

			this.Matrix = [];
			for (let Y = 0; Y < this._HeightCells; Y++)
			{
				this.Matrix[Y] = [];
			}
			Files.Save("Program.WidthCells", this._WidthCells);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	private static _HeightCells: number;
	private static _MinHeightCells: number = 10;
	private static _MaxHeightCells: number = 50;
	public static get HeightCells(): number
	{
		return this._HeightCells;
	}
	public static set HeightCells(Value: number)
	{
		if(this._MinHeightCells <= Value && Value <= this._MaxHeightCells)
		{
			this._HeightCells = Value;

			this.Matrix = [];
			for (let Y = 0; Y < this._HeightCells; Y++)
			{
				this.Matrix[Y] = [];
			}
			Files.Save("Program.HeightCells", this._HeightCells);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	//#endregion

	//#region Resolution
	private static _WidthPixels: number = document.documentElement.clientWidth - 40;
	private static _HeightPixels: number = document.getElementById("DivProgram").clientHeight - 20 - document.getElementById("DivProgramContol").scrollHeight;
	public static SizePixels: number = Math.min
	(
		Program._WidthPixels,
		Program._HeightPixels
	);
	//#endregion

	//#region Coefficents
	private static _FullC: number = 100;
	public static get FullC(): number
	{
		return this._FullC;
	}

	private static _VoidC: number;
	public static get VoidC(): number
	{
		return this._VoidC;
	}

	private static _GrassC: number;
	public static get GrassC(): number
	{
		return this._GrassC;
	}

	private static _FireC: number;
	public static get FireC(): number
	{
		return this._FireC;
	}

	private static _WaterC: number;
	public static get WaterC(): number
	{
		return this._WaterC;
	}

	private static _LavaC: number;
	public static get LavaC(): number
	{
		return this._LavaC;
	}

	private static _IceC: number;
	public static get IceC(): number
	{
		return this._IceC;
	}

	public static Coefficents(GrassC: number, FireC: number, WaterC: number, LavaC: number, IceC: number)
	{
		let TotalC: number = GrassC + FireC + WaterC + LavaC + IceC;
		if(0 <= TotalC && TotalC <= this._FullC)
		{
			this._VoidC = this._FullC - TotalC;
			this._GrassC = GrassC;
			this._FireC = FireC;
			this._WaterC = WaterC;
			this._LavaC = LavaC;
			this._IceC = IceC;

			this.Execute = false;
			this.GenerateBoard();
			this.DrawElements();

			Files.Save("Program.VoidC", this._VoidC);
			Files.Save("Program.GrassC", this._GrassC);
			Files.Save("Program.FireC", this._FireC);
			Files.Save("Program.WaterC", this._WaterC);
			Files.Save("Program.LavaC", this._LavaC);
			Files.Save("Program.IceC", this._IceC);
		}
		else
		{
			throw new RangeError(String(GrassC + ", " + FireC + ", " + WaterC + ", " + LavaC + ", " + IceC));
		}
	}
	//#endregion

	//#region Functions
	public static GenerateBoard()
	{
		for (let Y = 0; Y < this.HeightCells; Y++) 
		{
			for (let X = 0; X < this.WidthCells; X++) 
			{
				let RandomElement = Random.Integer(0, this.FullC);
				if (RandomElement >= 0 && RandomElement < this.VoidC)
				{
					this.Matrix[Y][X] = new Void(X, Y);
				}
				else if (RandomElement >= this.VoidC && RandomElement < this.VoidC + this.GrassC) 
				{
					this.Matrix[Y][X] = new Grass(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC && RandomElement < this.VoidC + this.GrassC+ this.FireC) 
				{
					this.Matrix[Y][X] = new Fire(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC+ this.FireC && RandomElement < this.VoidC + this.GrassC+ this.FireC + this.WaterC) 
				{
					this.Matrix[Y][X] = new Water(X, Y);
				}
				else if (RandomElement >= this.VoidC + this.GrassC+ this.FireC + this.WaterC && RandomElement < this.VoidC + this.GrassC+ this.FireC + this.WaterC + this.LavaC) 
				{
					this.Matrix[Y][X] = new Lava(X, Y, 3);
				}
				else if (RandomElement >= this.VoidC + this.GrassC+ this.FireC + this.WaterC + this.LavaC && RandomElement < this.FullC) 
				{
					this.Matrix[Y][X] = new Ice(X, Y, 3);
				}
			}
		}
	}

	public static DrawElements()
	{
		let CellWidth = document.getElementById("CanvasProgram").width / Program.WidthCells;
		let CellHeight = document.getElementById("CanvasProgram").height / Program.HeightCells;

		for (let Y = 0; Y < Program.HeightCells; Y++) 
		{
			for (let X = 0; X < Program.WidthCells; X++) 
			{
				let Element = Program.Matrix[Y][X];
				if (Element instanceof Void)
				{
					this.Desk.fillStyle = "rgb(225, 225, 225)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Grass)
				{
					this.Desk.fillStyle = "rgb(0, 128, 0)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Fire)
				{
					this.Desk.fillStyle = "rgb(255, 150, 0)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Water)
				{
					this.Desk.fillStyle = "rgb(0, 50, 255)";
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Lava)
				{
					if(Element.Density == 3)
					{
						this.Desk.fillStyle = "rgb(255, 0, 0)";
					}
					else if(Element.Density == 2)
					{
						this.Desk.fillStyle = "rgb(255, 50, 0)";
					}
					else if(Element.Density == 1)
					{
						this.Desk.fillStyle = "rgb(255, 100, 0)";
					}
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
				else if (Element instanceof Ice)
				{
					if(Element.Density == 3)
					{
						this.Desk.fillStyle = "rgb(0, 200, 255)";
					}
					else if(Element.Density == 2)
					{
						this.Desk.fillStyle = "rgb(0, 150, 255)";
					}
					else if(Element.Density == 1)
					{
						this.Desk.fillStyle = "rgb(0, 100, 255)";
					}
					this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
				}
			}
		}
	}

	public static ExecuteFrame()
	{
		for (let Y = 0; Y < Program.HeightCells; Y++) 
		{
			for (let X = 0; X < Program.WidthCells; X++) 
			{
				let Element = Program.Matrix[Y][X];
				if (Element instanceof Void)
				{

				}
				else if (Element instanceof Grass)
				{
					Element.Grow();
				}
				else if (Element instanceof Fire)
				{
					Element.Burn();
					Element.Fade();
				}
				else if (Element instanceof Water)
				{
					Element.Flow();
					Element.Evaporate();
				}
				else if (Element instanceof Lava)
				{
					Element.Flow();
					Element.Burn();
					Element.Fade();
				}
				else if (Element instanceof Ice)
				{
					Element.Flow();
					Element.Melt();
					Element.Evaporate();
				}
			}
		}
	}
	//#endregion

	//#region Execute
	private static _Eexecute: boolean = false;
	public static get Execute(): boolean
	{
		return this._Eexecute;
	}
	public static set Execute(Value: boolean)
	{
		if(Value)
		{
			document.getElementById("ImagePlay").src = "../Resources/Pause.png";
			document.getElementById("ImagePlay").alt = "Пауза";
		}
		else if(!Value)
		{
			document.getElementById("ImagePlay").src = "../Resources/PlayArrow.png";
			document.getElementById("ImagePlay").alt = "Старт";
		}
		this._Eexecute = Value;
	}
	//#endregion

	//#region Stats
	private static _Stats: boolean = true;
	public static get Stats(): boolean
	{
		return this._Stats;
	}	
	public static set Stats(Value: boolean)
	{
		if(Value)
		{
			document.getElementById("DivStats").style.display = "flex";
			document.getElementById("ButtonStats").classList.replace("Foreground", "Background");
			document.getElementById("ButtonStats").classList.replace("Unbordered", "Bordered");
			document.getElementById("TextStats").textContent = "Скрыть";
		}
		else if(!Value)
		{
			document.getElementById("DivStats").style.display = "none";
			document.getElementById("ButtonStats").classList.replace("Background", "Foreground");
			document.getElementById("ButtonStats").classList.replace("Bordered", "Unbordered");
			document.getElementById("TextStats").textContent = "Показать";
		}
		this._Stats = Value;
		Files.Save("Program.Stats", this._Stats);
	}
	//#endregion
}
//#endregion

//#region Default
class Default
{
	private static _SlideTime: number = 0.5;
	public static get SlideTime(): number
	{
		return this._SlideTime;
	}

	private static _ConsoleTime: number = 2;
	public static get ConsoleTime(): number
	{
		return this._ConsoleTime;
	}

	private static _DarkTheme: boolean = false;
	public static get DarkTheme(): boolean
	{
		return this._DarkTheme;
	}

	private static _NavigateId: number = 0;
	public static get NavigateId(): number
	{
		return this._NavigateId;
	}

	private static _WidthCells: number = 25;
	public static get WidthCells(): number
	{
		return this._WidthCells;
	}

	private static _HeightCells: number = 25;
	public static get HeightCells(): number
	{
		return this._HeightCells;
	}

	private static _FramesCount: number = 60;
	public static get FramesCount(): number
	{
		return this._FramesCount;
	}

	private static _Stats: boolean = false;
	public static get Stats(): boolean
	{
		return this._Stats;
	}

	private static _GrassC: number = 4;
	public static get GrassC(): number
	{
		return this._GrassC;
	}

	private static _FireC: number = 2;
	public static get FireC(): number
	{
		return this._FireC;
	}

	private static _WaterC: number = 2;
	public static get WaterC(): number
	{
		return this._WaterC;
	}

	private static _LavaC: number = 1;
	public static get LavaC(): number
	{
		return this._LavaC;
	}

	private static _IceC: number = 1;
	public static get IceC(): number
	{
		return this._IceC;
	}

	private static _GrassGrowCountdownMax: number = 10;
	public static get GrassGrowCountdownMax(): number
	{
		return this._GrassGrowCountdownMax;
	}

	private static _FireLifespanMax: number = 16;
	public static get FireLifespanMax(): number
	{
		return this._FireLifespanMax;
	}
	
	private static _FireBurnCountdownMax: number = 4;
	public static get FireBurnCountdownMax(): number
	{
		return this._FireBurnCountdownMax;
	}

	private static _WaterFlowCountdownMax: number = 8;
	public static get WaterFlowCountdownMax(): number
	{
		return this._WaterFlowCountdownMax;
	}

	private static _WaterEvaporateCountdownMax: number = 4;
	public static get WaterEvaporateCountdownMax(): number
	{
		return this._WaterEvaporateCountdownMax;
	}

	private static _LavaFlowCountdownMax: number = 15;
	public static get LavaFlowCountdownMax(): number
	{
		return this._LavaFlowCountdownMax;
	}

	private static _LavaBurnCountdownMax: number = 8;
	public static get LavaBurnCountdownMax(): number
	{
		return this._LavaBurnCountdownMax;
	}

	private static _LavaFadeCountdownMax: number = 4;
	public static get LavaFadeCountdownMax(): number
	{
		return this._LavaFadeCountdownMax;
	}

	private static _IceFlowCountdownMax: number = 12;
	public static get IceFlowCountdownMax(): number
	{
		return this._IceFlowCountdownMax;
	}

	private static _IceMeltCountdownMax: number = 4;
	public static get IceMeltCountdownMax(): number
	{
		return this._IceMeltCountdownMax;
	}

	private static _IceEvaporateCountdownMax: number = 4;
	public static get IceEvaporateCountdownMax(): number
	{
		return this._IceEvaporateCountdownMax;
	}
}
//#endregion