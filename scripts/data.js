//#region Pages
class Pages
{
	//#region List
	static #list = 
	[
		[document.getElementById("home"), document.getElementById("homeIcon")],
		[document.getElementById("settings"), document.getElementById("settingsIcon")],
		[document.getElementById("information"), document.getElementById("informationIcon")],
	];
	//#endregion

	//#region Navigation
	static #activePageId = 0;

	static get id()
	{
		return this.#activePageId;
	}
	static set id(value)
	{
		if(0 <= value && value < this.#list.length)
		{
			for (let index = 0; index < this.#list.length; index++) 
			{
				this.#list[index][0].style.display = "none";
				this.#list[index][1].style.backgroundColor = "rgb(255, 255, 255)";
			}
			this.#list[value][0].style.display = "flex";
			this.#list[value][1].style.backgroundColor = "rgb(225, 225, 225)";
			this.#activePageId = value;
		}
		else
		{
			throw new RangeError();
		}
	}
	//#endregion
};
//#endregion

//#region Game
class Game
{
	//#region  Play
	static #playingStatus = false;
	static get play()
	{
		return this.#playingStatus;
	}
	static set play(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				document.getElementById("statusIconImage").src = "../Resources/2x/baseline_pause_black_48dp.png";
				document.getElementById("statusIconImage").alt = "Пауза";
			}
			else if(!value)
			{
				document.getElementById("statusIconImage").src = "../Resources/2x/baseline_play_arrow_black_48dp.png";
				document.getElementById("statusIconImage").alt = "Старт";
			}
			this.#playingStatus = value;
		}
		else
		{
			throw new TypeError();
		}
	}
	//#endregion

	//#region Results
	static #resultsStatus = true;
	static get showResults()
	{
		return this.#resultsStatus;
	}	
	static set showResults(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				document.getElementById("results").style.display = "block";
				document.getElementById("resultsIcon").style.backgroundColor = "rgb(225, 225, 225)";
			}
			else if(!value)
			{
				document.getElementById("results").style.display = "none";
				document.getElementById("resultsIcon").style.backgroundColor = "rgb(255, 255, 255)";
			}
			this.#resultsStatus = value;
		}
		else
		{
			throw new TypeError();
		}
	}
	//#endregion
};
//#endregion

//#region Board
class Board
{
	//#region Size
	static widthCells = 25;
	static heightCells = 25;

	static widthPixels = Math.min
	(
		document.documentElement.clientWidth - 70,
		document.documentElement.clientHeight - 165
	); ;
	static heightPixels = Math.min
	(
		document.documentElement.clientWidth - 70,
		document.documentElement.clientHeight - 165
	);
	//#endregion

	//#region Matrix
	static matrix = [];
	static createMatrix()
	{
		for (let y = 0; y < this.heightCells; y++)
		{
			this.matrix[y] = [];
		}
	}
	//#endregion

	//#region Elements
	static voidC = 90;
	static grassC = 4;
	static fireC = 2;
	static waterC = 2;
	static lavaC = 1;
	static iceC = 1;
	static fullC = this.voidC + this.grassC + this.fireC + this.waterC + this.lavaC + this.iceC;

	static generateBoard()
	{
		for (let y = 0; y < this.heightCells; y++) 
		{
			for (let x = 0; x < this.widthCells; x++) 
			{
				let randomElement = randomNumber(0, this.fullC)
				if (randomElement >= 0 && randomElement < this.voidC)
				{
					this.matrix[y][x] = new Void(x, y);
				}
				else if (randomElement >= this.voidC && randomElement < this.voidC + this.grassC) 
				{
					this.matrix[y][x] = new Grass(x, y);
				}
				else if (randomElement >= this.voidC + this.grassC && randomElement < this.voidC + this.grassC+ this.fireC) 
				{
					this.matrix[y][x] = new Fire(x, y);
				}
				else if (randomElement >= this.voidC + this.grassC+ this.fireC && randomElement < this.voidC + this.grassC+ this.fireC + this.waterC) 
				{
					this.matrix[y][x] = new Water(x, y);
				}
				else if (randomElement >= this.voidC + this.grassC+ this.fireC + this.waterC && randomElement < this.voidC + this.grassC+ this.fireC + this.waterC + this.lavaC) 
				{
					this.matrix[y][x] = new Lava(x, y, 3);
				}
				else if (randomElement >= this.voidC + this.grassC+ this.fireC + this.waterC + this.lavaC && randomElement < this.fullC) 
				{
					this.matrix[y][x] = new Ice(x, y, 3);
				}
			}
		}
	}

	static drawElements()
	{
		let cellWidth = Board.widthPixels / Board.widthCells;
		let cellHeight = Board.heightPixels / Board.heightCells;

		for (let y = 0; y < Board.heightCells; y++) 
		{
			for (let x = 0; x < Board.widthCells; x++) 
			{
				let element = Board.matrix[y][x];
				if (element instanceof Void)
				{
					fill(225, 225, 225);
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
				}
				else if (element instanceof Grass)
				{
					fill(0, 128, 0);
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					element.grow();
				}
				else if (element instanceof Fire)
				{
					fill(255, 150, 0);
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					element.burn();
					element.fade();
				}
				else if (element instanceof Water)
				{
					fill(0, 50, 255);
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					element.flow();
					element.evaporate();
				}
				else if (element instanceof Lava)
				{
					if(element.density == 3)
					{
						fill(255, 0, 0);
					}
					else if(element.density == 2)
					{
						fill(255, 50, 0);
					}
					else if(element.density == 1)
					{
						fill(255, 100, 0);
					}
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					element.flow();
					element.burn();
					element.fade();
				}
				else if (element instanceof Ice)
				{
					if(element.density == 3)
					{
						fill(0, 200, 255);
					}
					else if(element.density == 2)
					{
						fill(0, 150, 255);
					}
					else if(element.density == 1)
					{
						fill(0, 100, 255);
					}
					rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					element.flow();
					element.melt();
					element.evaporate();
				}
			}
		}
	}

	static updateResults()
	{
		let voidCount = 0;
		let grassCount = 0;
		let fireCount = 0;
		let waterCount = 0;
		let lavaCount = 0;
		let iceCount = 0;

		for (let y = 0; y < this.heightCells; y++)
		{
			for (let x = 0; x < this.widthCells; x++)
			{
				let element = this.matrix[y][x];
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

		document.getElementById("voidCount").textContent = voidCount;
		document.getElementById("grassCount").textContent = grassCount;
		document.getElementById("fireCount").textContent = fireCount;
		document.getElementById("waterCount").textContent = waterCount;
		document.getElementById("lavaCount").textContent = lavaCount;
		document.getElementById("iceCount").textContent = iceCount;
	}
	//#endregion
}
//#endregion