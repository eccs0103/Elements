//#region Interface
class Interface
{
	//#region Loading
	static #loadingTime = 0.5;
	static get loadingTime()
	{
		return this.#loadingTime;
	} 
	//#endregion

	//#region Theme
	static #darkTheme = false;
	static get darkTheme()
	{
		return this.#darkTheme;
	}
	static set darkTheme(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				document.documentElement.classList.replace("light", "dark");
				document.getElementById("div_theme").classList.replace("block", "selected");
				document.getElementById("div_theme").classList.replace("unbordered", "bordered");
				document.getElementById("p_theme").textContent = "Выключить";
			}
			else if(!value)
			{
				document.documentElement.classList.replace("dark", "light");
				document.getElementById("div_theme").classList.replace("selected", "block");
				document.getElementById("div_theme").classList.replace("bordered", "unbordered");
				document.getElementById("p_theme").textContent = "Включить";
			}
			this.#darkTheme = value;
		}
		else
		{
			throw new TypeError(typeof(value));
		}
	}
	//#endregion

	//#region Borders
	static #borders = true;
	static get borders()
	{
		return this.#borders;
	}
	static set borders(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				stroke(150, 150, 150);
				document.getElementById("div_borders").classList.replace("block", "selected");
				document.getElementById("div_borders").classList.replace("unbordered", "bordered");
				document.getElementById("p_borders").textContent = "Выключить";
			}
			else if(!value)
			{
				noStroke();
				document.getElementById("div_borders").classList.replace("selected", "block");
				document.getElementById("div_borders").classList.replace("bordered", "unbordered");
				document.getElementById("p_borders").textContent = "Включить";
			}
			Board.drawElements();
			this.#borders = value;
		}
		else
		{
			throw new TypeError(typeof(value));
		}
	}
	//#endregion
}
//#endregion

//#region Pages
class Pages
{
	//#region List
	static #list = 
	[
		[document.getElementById("page_home"), document.getElementById("div_home")],
		[document.getElementById("page_settings"), document.getElementById("div_settings")],
		[document.getElementById("page_information"), document.getElementById("div_information")],
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
				if(this.#list[index][1].classList.contains("selected"))
				{
					this.#list[index][1].classList.replace("selected", "block");
				}
				if(this.#list[index][1].classList.contains("bordered"))
				{
					this.#list[index][1].classList.replace("bordered", "unbordered");
				}
			}
			this.#list[value][0].style.display = "flex";
			this.#list[value][1].classList.replace("block", "selected");
			this.#list[value][1].classList.replace("unbordered", "bordered");
			this.#activePageId = value;
		}
		else
		{
			throw new RangeError(value);
		}
	}
	//#endregion
};
//#endregion

//#region Game
class Game
{
	//#region  Play
	static #execute = false;
	static get execute()
	{
		return this.#execute;
	}
	static set execute(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				document.getElementById("img_play").src = "../resources/pause.png";
				document.getElementById("img_play").alt = "Пауза";
			}
			else if(!value)
			{
				document.getElementById("img_play").src = "../resources/play.png";
				document.getElementById("img_play").alt = "Старт";
			}
			this.#execute = value;
		}
		else
		{
			throw new TypeError(typeof(value));
		}
	}
	//#endregion

	//#region Stats
	static #stats = true;
	static get stats()
	{
		return this.#stats;
	}	
	static set stats(value)
	{
		if(typeof(value) == "boolean")
		{
			if(value)
			{
				document.getElementById("div_stats_table").style.display = "block";
				document.getElementById("div_stats").classList.replace("block", "selected");
				document.getElementById("div_stats").classList.replace("unbordered", "bordered");
			}
			else if(!value)
			{
				document.getElementById("div_stats_table").style.display = "none";
				document.getElementById("div_stats").classList.replace("selected", "block");
				document.getElementById("div_stats").classList.replace("bordered", "unbordered");
			}
			this.#stats = value;
		}
		else
		{
			throw new TypeError(typeof(value));
		}
	}
	//#endregion
};
//#endregion

//#region Board
class Board
{
	//#region Size
	static #widthCells = 25;
	static get widthCells()
	{
		return this.#widthCells;
	}

	static #heightCells = 25;
	static get heightCells()
	{
		return this.#heightCells;
	}

	static minSizeCells = 10;
	static maxSizeCells = 50;
	static set sizeCells(value)
	{
		let number = parseInt(value);
		if(typeof(number) == "number")
		{
			if(this.minSizeCells <= number && number <= this.maxSizeCells)
			{
				this.#widthCells = number;
				this.#heightCells = number;
			}
			else
			{
				throw new RangeError(number);
			}
		}
		else
		{
			throw new TypeError(number);
		}
	}

	static sizePixels = Math.min
	(
		document.documentElement.clientWidth - 70,
		document.documentElement.clientHeight - 150
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
				let randomElement = Random.number(0, this.fullC)
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
		let cellWidth = Board.sizePixels / Board.widthCells;
		let cellHeight = Board.sizePixels / Board.heightCells;

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

	static updateStatistics()
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

		document.getElementById("div_void_count").textContent = voidCount;
		document.getElementById("div_grass_count").textContent = grassCount;
		document.getElementById("div_fire_count").textContent = fireCount;
		document.getElementById("div_water_count").textContent = waterCount;
		document.getElementById("div_lava_count").textContent = lavaCount;
		document.getElementById("div_ice_count").textContent = iceCount;
	}
	//#endregion
}
//#endregion