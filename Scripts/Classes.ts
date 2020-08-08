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
	public Directions: number[][];
	private GrowCountdownMax: number;
	private GrowCountdown: number;

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this.Directions = 
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
		this.GrowCountdownMax = 10;
		this.GrowCountdown = this.GrowCountdownMax;
	}
	//#endregion

	//#region Grow
	public Grow() 
	{
		if(this.GrowCountdown > 0)
		{
			this.GrowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
				this.GrowCountdown = this.GrowCountdownMax;
			}
		}
	}
	//#endregion
}

class Fire extends Pixel
{
	//#region Constructor
	public Directions: number[][];
	private LifespanMax: number;
	private Lifespan: number;
	private BurnCountdownMax: number;
	private BurnCountdown: number;

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this.Directions = 
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		this.LifespanMax = 16;
		this.Lifespan = this.LifespanMax;
		this.BurnCountdownMax = 4;
		this.BurnCountdown = this.BurnCountdownMax;
	}
	//#endregion

	//#region Burn
	public Burn()
	{
		if(this.BurnCountdown > 0)
		{
			this.BurnCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
				this.Lifespan = this.LifespanMax;
			}
			this.BurnCountdown = this.BurnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	public Fade()
	{
		if(this.Lifespan > 0)
		{
			this.Lifespan--;
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
	public Directions: number[][];
	private FlowCountdownMax: number;
	private FlowCountdown: number;
	private EvaporateCountdownMax: number;
	private EvaporateCountdown: number;

	constructor(X: number, Y: number)
	{
		super(X, Y);
		this.Directions = 
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
		this.FlowCountdownMax = 8;
		this.FlowCountdown = this.FlowCountdownMax;
		this.EvaporateCountdownMax = 4;
		this.EvaporateCountdown = this.EvaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this.FlowCountdown > 0)
		{
			this.FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
			this.FlowCountdown = this.FlowCountdownMax;
		}
	}
	//#endregion

	//#region Evaporate
	public Evaporate()
	{
		let Moves = [];
		for (let Index = 0; Index < this.Directions.length; Index++) 
		{
			let Cell = this.Directions[Index];
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
			if(this.EvaporateCountdown > 0)
			{
				this.EvaporateCountdown--;
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
	public Directions: number[][];
	public Density: number;
	private FlowCountdownMax: number;
	private FlowCountdown: number;
	private BurnCountdownMax: number;
	private BurnCountdown: number;
	private FadeCountdownMax: number;
	private FadeCountdown: number;

	constructor(X: number, Y: number, Density: number)
	{
		super(X, Y);
		this.Directions = 
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		this.Density = Density;
		this.FlowCountdownMax = 15;
		this.FlowCountdown = this.FlowCountdownMax;
		this.BurnCountdownMax = 8;
		this.BurnCountdown = this.BurnCountdownMax;
		this.FadeCountdownMax = 4;
		this.FadeCountdown = this.FadeCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this.FlowCountdown > 0)
		{
			this.FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
			if(Moves.length > 0 && this.Density > 1)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Lava(X, Y, this.Density - 1);
			}
			this.FlowCountdown = this.FlowCountdownMax;
		}
	}
	//#endregion

	//#region Burn
	public Burn()
	{
		if(this.BurnCountdown > 0)
		{
			this.BurnCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
			this.BurnCountdown = this.BurnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	public Fade()
	{
		let Moves = [];
		for (let Index = 0; Index < this.Directions.length; Index++) 
		{
			let Cell = this.Directions[Index];
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
			if(this.FadeCountdown > 0)
			{
				this.FadeCountdown--;
			}
			else
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Void(X, Y);
				this.Density--;
				if(this.Density <= 0)
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
	public Directions: number[][];
	public Density: number;
	private FlowCountdownMax: number;
	private FlowCountdown: number;
	private MeltCountdownMax: number;
	private MeltCountdown: number;
	private EvaporateCountdownMax: number;
	private EvaporateCountdown: number;

	constructor(X: number, Y: number, Density: number)
	{
		super(X, Y);
		this.Directions =
		[
			[this.X    , this.Y - 1],
			[this.X - 1, this.Y    ],
			[this.X + 1, this.Y    ],
			[this.X    , this.Y + 1],
		];
		this.Density = Density;
		this.FlowCountdownMax = 12;
		this.FlowCountdown = this.FlowCountdownMax;
		this.MeltCountdownMax = 4;
		this.MeltCountdown = this.MeltCountdownMax;
		this.EvaporateCountdownMax = 4;
		this.EvaporateCountdown = this.EvaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	public Flow()
	{
		if(this.FlowCountdown > 0)
		{
			this.FlowCountdown--;
		}
		else
		{
			let Moves = [];
			for (let Index = 0; Index < this.Directions.length; Index++) 
			{
				let Cell = this.Directions[Index];
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
			if(Moves.length > 0 && this.Density > 1)
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				Program.Matrix[Y][X] = new Ice(X, Y, this.Density - 1);
			}
			this.FlowCountdown = this.FlowCountdownMax;
		}
	}
	//#endregion

	//#region Melt
	public Melt()
	{
		let Moves = [];
		for (let Index = 0; Index < this.Directions.length; Index++) 
		{
			let Cell = this.Directions[Index];
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
			if(this.MeltCountdown > 0)
			{
				this.MeltCountdown--;
			}
			else
			{
				Program.Matrix[Y][X] = new Void(X, Y);
				this.Density--;
				if(this.Density <= 0)
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
		for (let Index = 0; Index < this.Directions.length; Index++) 
		{
			let Cell = this.Directions[Index];
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
			if(this.EvaporateCountdown > 0)
			{
				this.EvaporateCountdown--;
			}
			else
			{
				let Move = Random.Element(Moves);
				let X = Move[0];
				let Y = Move[1];
				let Loss = Math.min(Program.Matrix[Y][X].density, this.Density);
				Program.Matrix[Y][X].density -= Loss;
				this.Density -= Loss;
				if(Program.Matrix[Y][X].density <= 0)
				{
					Program.Matrix[Y][X] = new Void(X, Y);
				}
				if(this.Density <= 0)
				{
					Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
				}
			}
		}
	}
	//#endregion
}
//#endregion