//#region Default
class Pixel
{
	//#region Constructor
	public X: number;
	public Y:number;

	constructor(X: number, Y: number)
	{
		this.X = X;
		this.Y = Y;
	}
	//#endregion
}
//#endregion

//#region Elements
class Void extends Pixel
{
	//#region Constructor
	constructor(X: number, Y: number)
	{
		super(X, Y);
	}
	//#endregion
}

class Grass extends Pixel
{
	//#region Constructor
	private _Directions: number[][];
	private static _MinDuration: number = 1;
	private static _MaxDuration: number = 30;
	private _GrowCountdown: number;
	private static _GrowCountdownMax: number;
	public static get GrowCountdownMax(): number
	{
		return this._GrowCountdownMax;
	}
	public static set GrowCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._GrowCountdownMax = Value;
			Files.Save("Grass.GrowCountdownMax", this._GrowCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this._Directions = 
		[
			[this.X - 1, this.Y - 1],
			[this.X    , this.Y - 1],
			[this.X + 1, this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X - 1, this.Y + 1],
			[this.X    , this.Y + 1],
			[this.X + 1, this.Y + 1]
		];
		//this._GrowCountdownMax = 10;
		this._GrowCountdown = Grass._GrowCountdownMax;
	}
	//#endregion

	//#region Grow
	public Grow() 
	{
		if(this._GrowCountdown > 0)
		{
			this._GrowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Void)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Grass(X, Y);
				this._GrowCountdown = Grass._GrowCountdownMax;
			}
		}
	}
	//#endregion
}

class Fire extends Pixel
{
	//#region Constructor
	private _Directions: number[][];
	private static _MinDuration: number = 1;
	private static _MaxDuration: number = 30;
	private _Lifespan: number;
	private static _LifespanMax: number;
	public static get LifespanMax(): number
	{
		return this._LifespanMax;
	}
	public static set LifespanMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._LifespanMax = Value;
			Files.Save("Fire.LifespanMax", this._LifespanMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _BurnCountdown: number;
	private static _BurnCountdownMax: number;
	public static get BurnCountdownMax(): number
	{
		return this._BurnCountdownMax;
	}
	public static set BurnCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._BurnCountdownMax = Value;
			Files.Save("Fire.BurnCountdownMax", this._BurnCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this._Directions = 
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		//this._LifespanMax = 16;
		this._Lifespan = Fire._LifespanMax;
		//this._BurnCountdownMax = 4;
		this._BurnCountdown = Fire._BurnCountdownMax;
	}
	//#endregion

	//#region Burn
	public Burn()
	{
		if(this._BurnCountdown > 0)
		{
			this._BurnCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Grass)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Fire(X, Y);
				this._Lifespan = Fire._LifespanMax;
			}
			this._BurnCountdown = Fire._BurnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	public Fade()
	{
		if(this._Lifespan > 0)
		{
			this._Lifespan--;
		}
		else
		{
			Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
		}
	}
	//#endregion Fade
}

class Water extends Pixel
{
	//#region Constructor
	private _Directions: number[][];
	private static _MinDuration: number = 1;
	private static _MaxDuration: number = 30;
	private _FlowCountdown: number;
	private static _FlowCountdownMax: number;
	public static get FlowCountdownMax(): number
	{
		return this._FlowCountdownMax;
	}
	public static set FlowCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._FlowCountdownMax = Value;
			Files.Save("Water.FlowCountdownMax", this._FlowCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _EvaporateCountdown: number;
	private static _EvaporateCountdownMax: number;
	public static get EvaporateCountdownMax(): number
	{
		return this._EvaporateCountdownMax;
	}
	public static set EvaporateCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._EvaporateCountdownMax = Value;
			Files.Save("Water.EvaporateCountdownMax", this._EvaporateCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this._Directions = 
		[
			[this.X - 1, this.Y - 1],
			[this.X    , this.Y - 1],
			[this.X + 1, this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X - 1, this.Y + 1],
			[this.X    , this.Y + 1],
			[this.X + 1, this.Y + 1],
		];
		//this._FlowCountdownMax = 8;
		this._FlowCountdown = Water._FlowCountdownMax;
		//this._EvaporateCountdownMax = 4;
		this._EvaporateCountdown = Water._EvaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this._FlowCountdown > 0)
		{
			this._FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Void)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Water(X, Y);
				//Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
			}
			this._FlowCountdown = Water._FlowCountdownMax;
		}
	}
	//#endregion

	//#region Evaporate
	public Evaporate()
	{
		let Moves = [];
		for (let Index = 0; Index < this._Directions.length; Index++) 
		{
			let Cell = this._Directions[Index];
			let X = Cell[0];
			let Y = Cell[1];
			if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
			{
				if(Program.Matrix[Y][X] instanceof Fire)
				{
					Moves.push(Cell);
				}
			}
		}
		if(Moves.length > 0)
		{
			if(this._EvaporateCountdown > 0)
			{
				this._EvaporateCountdown--;
			}
			else
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Void(X, Y);
				Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
			}
		}
	}
	//#endregion
}

class Lava extends Pixel
{
	//#region Constructor
	private _Directions: number[][];
	private static _MinDuration: number = 1;
	private static _MaxDuration: number = 30;
	private _Density: number;
	public get Density(): number
	{
		return this._Density;
	}
	private _FlowCountdown: number;
	private static _FlowCountdownMax: number;
	public static get FlowCountdownMax(): number
	{
		return this._FlowCountdownMax;
	}
	public static set FlowCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._FlowCountdownMax = Value;
			Files.Save("Lava.FlowCountdownMax", this._FlowCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _BurnCountdown: number;
	private static _BurnCountdownMax: number;
	public static get BurnCountdownMax(): number
	{
		return this._BurnCountdownMax;
	}
	public static set BurnCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._BurnCountdownMax = Value;
			Files.Save("Lava.BurnCountdownMax", this._BurnCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _FadeCountdown: number;
	private static _FadeCountdownMax: number;
	public static get FadeCountdownMax(): number
	{
		return this._FadeCountdownMax;
	}
	public static set FadeCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._FadeCountdownMax = Value;
			Files.Save("Lava.FadeCountdownMax", this._FadeCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	constructor(X: number, Y: number, Density: number)
	{
		super(X, Y);
		this._Directions = 
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		this._Density = Density;
		//this._FlowCountdownMax = 15;
		this._FlowCountdown = Lava._FlowCountdownMax;
		//this._BurnCountdownMax = 8;
		this._BurnCountdown = Lava._BurnCountdownMax;
		//this._FadeCountdownMax = 4;
		this._FadeCountdown = Lava._FadeCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this._FlowCountdown > 0)
		{
			this._FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Void)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0 && this._Density > 1)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Lava(X, Y, this._Density - 1);
			}
			this._FlowCountdown = Lava._FlowCountdownMax;
		}
	}
	//#endregion

	//#region Burn
	public Burn()
	{
		if(this._BurnCountdown > 0)
		{
			this._BurnCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Grass)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Fire(X, Y);
			}
			this._BurnCountdown = Lava._BurnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	public Fade()
	{
		let Moves = [];
		for (let Index = 0; Index < this._Directions.length; Index++) 
		{
			let Cell = this._Directions[Index];
			let X = Cell[0];
			let Y = Cell[1];
			if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
			{
				if(Program.Matrix[Y][X] instanceof Water)
				{
					Moves.push(Cell);
				}
			}
		}
		if(Moves.length > 0)
		{
			if(this._FadeCountdown > 0)
			{
				this._FadeCountdown--;
			}
			else
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Void(X, Y);
				this._Density--;
				if(this._Density <= 0)
				{
					Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
				}
			}
		}
	}
	//#endregion
}

class Ice extends Pixel
{
	//#region Constructor
	private _Directions: number[][];
	private static _MinDuration: number = 1;
	private static _MaxDuration: number = 30;
	private _Density: number;
	public get Density(): number
	{
		return this._Density;
	}
	private _FlowCountdown: number;
	private static _FlowCountdownMax: number;
	public static get FlowCountdownMax(): number
	{
		return this._FlowCountdownMax;
	}
	public static set FlowCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._FlowCountdownMax = Value;
			Files.Save("Ice.FlowCountdownMax", this._FlowCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _MeltCountdown: number;
	private static _MeltCountdownMax: number;
	public static get MeltCountdownMax(): number
	{
		return this._MeltCountdownMax;
	}
	public static set MeltCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._MeltCountdownMax = Value;
			Files.Save("Ice.MeltCountdownMax", this._MeltCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}
	private _EvaporateCountdown: number;
	private static _EvaporateCountdownMax: number;
	public static get EvaporateCountdownMax(): number
	{
		return this._EvaporateCountdownMax;
	}
	public static set EvaporateCountdownMax(Value: number)
	{
		if(this._MinDuration <= Value && Value <= this._MaxDuration)
		{
			this._EvaporateCountdownMax = Value;
			Files.Save("Ice.EvaporateCountdownMax", this._EvaporateCountdownMax);
		}
		else
		{
			throw new RangeError(String(Value));
		}
	}

	constructor(X: number, Y: number, Density: number)
	{
		super(X, Y);
		this._Directions =
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		this._Density = Density;
		//this._FlowCountdownMax = 12;
		this._FlowCountdown = Ice._FlowCountdownMax;
		//this._MeltCountdownMax = 4;
		this._MeltCountdown = Ice._MeltCountdownMax;
		//this._EvaporateCountdownMax = 4;
		this._EvaporateCountdown = Ice._EvaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this._FlowCountdown > 0)
		{
			this._FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this._Directions.length; Index++) 
			{
				let Cell = this._Directions[Index];
				let X = Cell[0];
				let Y = Cell[1];
				if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
				{
					if(Program.Matrix[Y][X] instanceof Void)
					{
						Moves.push(Cell);
					}
				}
			}
			if(Moves.length > 0 && this._Density > 1)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Ice(X, Y, this._Density - 1);
			}
			this._FlowCountdown = Ice._FlowCountdownMax;
		}
	}
	//#endregion

	//#region Melt
	public Melt()
	{
		let Moves = [];
		for (let Index = 0; Index < this._Directions.length; Index++) 
		{
			let Cell = this._Directions[Index];
			let X = Cell[0];
			let Y = Cell[1];
			if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
			{
				if(Program.Matrix[Y][X] instanceof Fire)
				{
					Moves.push(Cell);
				}
			}
		}
		if(Moves.length > 0)
		{
			let Move = Random.Element(Moves);
			let X = Move[0];
			let Y = Move[1];
			if(this._MeltCountdown > 0)
			{
				this._MeltCountdown--;
			}
			else
			{
				Program.Matrix[Y][X] = new Void(X, Y);
				this._Density--;
				if(this._Density <= 0)
				{
					Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
				}
			}
		}
	}
	//#endregion

	//#region Evaporate
	public Evaporate()
	{
		let Moves = [];
		for (let Index = 0; Index < this._Directions.length; Index++) 
		{
			let Cell = this._Directions[Index];
			let X = Cell[0];
			let Y = Cell[1];
			if( 0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells)
			{
				if(Program.Matrix[Y][X] instanceof Lava)
				{
					Moves.push(Cell);
				}
			}
		}
		if(Moves.length > 0)
		{
			if(this._EvaporateCountdown > 0)
			{
				this._EvaporateCountdown--;
			}
			else
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				let Loss = Math.min(Program.Matrix[Y][X].density, this._Density);
				Program.Matrix[Y][X].density -= Loss;
				this._Density -= Loss;
				if(Program.Matrix[Y][X].density <= 0)
				{
					Program.Matrix[Y][X] = new Void(X, Y);
				}
				if(this._Density <= 0)
				{
					Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
				}
			}
		}
	}
	//#endregion
}
//#endregion