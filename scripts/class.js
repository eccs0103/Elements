//#region Default
class Element
{
	//#region Constructor
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	//#endregion
}
//#endregion

//#region Elements
class Void extends Element
{
	//#region Constructor
	constructor(x, y)
	{
		super(x, y);
	}
	//#endregion
}

class Grass extends Element
{
	//#region Constructor
	constructor(x, y)
	{
		super(x, y);
		this.directions = 
		[
			[this.x - 1, this.y - 1],
			[this.x    , this.y - 1],
			[this.x + 1, this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x - 1, this.y + 1],
			[this.x    , this.y + 1],
			[this.x + 1, this.y + 1]
		];
		this.growCountdownMax = 10;
		this.growCountdown = this.growCountdownMax;
	}
	//#endregion

	//#region Grow
	grow() 
	{
		if(this.growCountdown > 0)
		{
			this.growCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Void)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Grass(x, y);
				this.growCountdown = this.growCountdownMax;
			}
		}
	}
	//#endregion
}

class Fire extends Element
{
	//#region Constructor
	constructor(x, y)
	{
		super(x, y);
		this.directions = 
		[
			[this.x    , this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x    , this.y + 1],
		];
		this.lifespanMax = 16;
		this.lifespan = this.lifespanMax;
		this.burnCountdownMax = 4;
		this.burnCountdown = this.burnCountdownMax;
	}
	//#endregion

	//#region Burn
	burn()
	{
		if(this.burnCountdown > 0)
		{
			this.burnCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Grass)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Fire(x, y);
				this.lifespan = this.lifespanMax;
			}
			this.burnCountdown = this.burnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	fade()
	{
		if(this.lifespan > 0)
		{
			this.lifespan--;
		}
		else
		{
			Board.matrix[this.y][this.x] = new Void(this.x, this.y);
		}
	}
	//#endregion Fade
}

class Water extends Element
{
	//#region Constructor
	constructor(x, y)
	{
		super(x, y);
		this.directions = 
		[
			[this.x - 1, this.y - 1],
			[this.x    , this.y - 1],
			[this.x + 1, this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x - 1, this.y + 1],
			[this.x    , this.y + 1],
			[this.x + 1, this.y + 1],
		];
		this.flowCountdownMax = 8;
		this.flowCountdown = this.flowCountdownMax;
		this.evaporateCountdownMax = 4;
		this.evaporateCountdown = this.evaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	flow()
	{
		if(this.flowCountdown > 0)
		{
			this.flowCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Void)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Water(x, y);
			}
			this.flowCountdown = this.flowCountdownMax;
		}
	}
	//#endregion

	//#region Evaporate
	evaporate()
	{
		let moves = [];
		for (let index = 0; index < this.directions.length; index++) 
		{
			let cell = this.directions[index];
			let x = cell[0];
			let y = cell[1];
			if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
			{
				if(Board.matrix[y][x] instanceof Fire)
				{
					moves.push(cell);
				}
			}
		}
		if(moves.length > 0)
		{
			if(this.evaporateCountdown > 0)
			{
				this.evaporateCountdown--;
			}
			else
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Void(x, y);
				Board.matrix[this.y][this.x] = new Void(this.x, this.y);
			}
		}
	}
	//#endregion
}

class Lava extends Element
{
	//#region Constructor
	constructor(x, y, density)
	{
		super(x, y);
		this.directions = 
		[
			[this.x    , this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x    , this.y + 1],
		];
		this.density = density;
		this.flowCountdownMax = 15;
		this.flowCountdown = this.flowCountdownMax;
		this.burnCountdownMax = 8;
		this.burnCountdown = this.burnCountdownMax;
		this.fadeCountdownMax = 4;
		this.fadeCountdown = this.fadeCountdownMax;
	}
	//#endregion

	//#region Flow
	flow()
	{
		if(this.flowCountdown > 0)
		{
			this.flowCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Void)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0 && this.density > 1)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Lava(x, y, this.density - 1);
			}
			this.flowCountdown = this.flowCountdownMax;
		}
	}
	//#endregion

	//#region Burn
	burn()
	{
		if(this.burnCountdown > 0)
		{
			this.burnCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Grass)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Fire(x, y);
			}
			this.burnCountdown = this.burnCountdownMax;
		}
	}
	//#endregion

	//#region Fade
	fade()
	{
		let moves = [];
		for (let index = 0; index < this.directions.length; index++) 
		{
			let cell = this.directions[index];
			let x = cell[0];
			let y = cell[1];
			if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
			{
				if(Board.matrix[y][x] instanceof Water)
				{
					moves.push(cell);
				}
			}
		}
		if(moves.length > 0)
		{
			if(this.fadeCountdown > 0)
			{
				this.fadeCountdown--;
			}
			else
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Void(x, y);
				this.density--;
				if(this.density <= 0)
				{
					Board.matrix[this.y][this.x] = new Void(this.x, this.y);
				}
			}
		}
	}
	//#endregion
}

class Ice extends Element
{
	//#region Constructor
	constructor(x, y, density)
	{
		super(x, y);
		this.directions =
		[
			[this.x    , this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x    , this.y + 1],
		];
		this.density = density;
		this.flowCountdownMax = 12;
		this.flowCountdown = this.flowCountdownMax;
		this.meltCountdownMax = 4;
		this.meltCountdown = this.meltCountdownMax;
		this.evaporateCountdownMax = 4;
		this.evaporateCountdown = this.evaporateCountdownMax;
	}
	//#endregion

	//#region Flow
	flow()
	{
		if(this.flowCountdown > 0)
		{
			this.flowCountdown--;
		}
		else
		{
			let moves = [];
			for (let index = 0; index < this.directions.length; index++) 
			{
				let cell = this.directions[index];
				let x = cell[0];
				let y = cell[1];
				if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
				{
					if(Board.matrix[y][x] instanceof Void)
					{
						moves.push(cell);
					}
				}
			}
			if(moves.length > 0 && this.density > 1)
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				Board.matrix[y][x] = new Ice(x, y, this.density - 1);
			}
			this.flowCountdown = this.flowCountdownMax;
		}
	}
	//#endregion

	//#region Melt
	melt()
	{
		let moves = [];
		for (let index = 0; index < this.directions.length; index++) 
		{
			let cell = this.directions[index];
			let x = cell[0];
			let y = cell[1];
			if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
			{
				if(Board.matrix[y][x] instanceof Fire)
				{
					moves.push(cell);
				}
			}
		}
		if(moves.length > 0)
		{
			let move = random(moves);
			let x = move[0];
			let y = move[1];
			if(this.meltCountdown > 0)
			{
				this.meltCountdown--;
			}
			else
			{
				Board.matrix[y][x] = new Void(x, y);
				this.density--;
				if(this.density <= 0)
				{
					Board.matrix[this.y][this.x] = new Water(this.x, this.y);
				}
			}
		}
	}
	//#endregion

	//#region Evaporate
	evaporate()
	{
		let moves = [];
		for (let index = 0; index < this.directions.length; index++) 
		{
			let cell = this.directions[index];
			let x = cell[0];
			let y = cell[1];
			if( 0 <= y && y < Board.heightCells && 0 <= x && x < Board.widthCells)
			{
				if(Board.matrix[y][x] instanceof Lava)
				{
					moves.push(cell);
				}
			}
		}
		if(moves.length > 0)
		{
			if(this.evaporateCountdown > 0)
			{
				this.evaporateCountdown--;
			}
			else
			{
				let move = random(moves);
				let x = move[0];
				let y = move[1];
				let loss = Math.min(Board.matrix[y][x].density, this.density);
				Board.matrix[y][x].density -= loss;
				this.density -= loss;
				if(Board.matrix[y][x].density <= 0)
				{
					Board.matrix[y][x] = new Void(x, y);
				}
				if(this.density <= 0)
				{
					Board.matrix[this.y][this.x] = new Water(this.x, this.y);
				}
			}
		}
	}
	//#endregion
}
//#endregion