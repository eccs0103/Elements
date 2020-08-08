//#region Interface
class Interface
{
	//#region Loading
	private static _LoadingTime = 0.5;
	public static get LoadingTime()
	{
		return this._LoadingTime;
	} 
	//#endregion

	//#region Theme
	private static _DarkTheme = false;
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
	private static _Id = 0;
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
	//#region Canvas
	public static Canvas = document.getElementById("CanvasProgram");
	public static Desk = document.getElementById("CanvasProgram").getContext("2d");

	public static Matrix: any[][] = [];

	public static FramesCount: number = 60;

	public static FullC: number = 100;
	public static GrassC: number = 4;
	public static FireC: number = 2;
	public static WaterC: number = 2;
	public static LavaC: number = 1;
	public static IceC: number = 1;
	public static VoidC: number = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
	//#endregion

	//#region Size
	private static _WidthCells: number;
	public static get WidthCells(): number
	{
		return this._WidthCells;
	}

	private static _HeightCells: number;
	public static get HeightCells(): number
	{
		return this._HeightCells;
	}

	public static MinSizeCells: number = 10;
	public static MaxSizeCells: number = 50;
	public static set SizeCells(Value: number)
	{
		if(this.MinSizeCells <= Value && Value <= this.MaxSizeCells)
		{
			this._WidthCells = Value;
			this._HeightCells = Value;

			this.Matrix = [];
			for (let Y = 0; Y < this._HeightCells; Y++)
			{
				this.Matrix[Y] = [];
			}
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	private static _WidthPixels: number = document.documentElement.clientWidth - 40;
	private static _HeightPixels: number = document.getElementById("DivProgram").clientHeight - 20 - document.getElementById("DivProgramContol").scrollHeight;
	public static SizePixels: number = Math.min
	(
		Program._WidthPixels,
		Program._HeightPixels
	);
	//#endregion

	//#region Functions
	public static GenerateBoard()
	{
		for (let Y = 0; Y < this.HeightCells; Y++) 
		{
			for (let X = 0; X < this.WidthCells; X++) 
			{
				let RandomElement = Random.Integer(0, this.FullC)
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
				{RandomElement
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
	private static _Stats = true;
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
	}
	//#endregion
}
//#endregion