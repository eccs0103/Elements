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
}
//#endregion

//#region Navigate
class Navigate
{
	//#region List
	static #list = 
	[
		[document.getElementById("page_home"), document.getElementById("div_home")],
		[document.getElementById("page_settings"), document.getElementById("div_settings")],
		[document.getElementById("page_information"), document.getElementById("div_information")],
	];
	//#endregion

	//#region Id
	static #activePageId = 0;
	static get id()
	{
		return this.#activePageId;
	}
	static set id (value)
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

//#region Program
class Program
{
	//#region Canvas
	static canvas = document.getElementById("canvas_program");
	static desk = this.canvas.getContext("2d");

	static matrix = [];

	static framesCount = 60;

	static fullC = 100;
	static grassC = 4;
	static fireC = 2;
	static waterC = 2;
	static lavaC = 1;
	static iceC = 1;
	static voidC = this.fullC - this.grassC - this.fireC - this.waterC - this.lavaC - this.iceC;
	//#endregion

	//#region Size
	static #widthCells;
	static get widthCells()
	{
		return this.#widthCells;
	}

	static #heightCells;
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

				this.matrix = [];
				for (let y = 0; y < this.#heightCells; y++)
				{
					this.matrix[y] = [];
				}
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
		document.documentElement.clientHeight - 160
	);
	//#endregion

	//#region Functions
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
		let cellWidth = Program.sizePixels / Program.widthCells;
		let cellHeight = Program.sizePixels / Program.heightCells;

		for (let y = 0; y < Program.heightCells; y++) 
		{
			for (let x = 0; x < Program.widthCells; x++) 
			{
				let element = Program.matrix[y][x];
				if (element instanceof Void)
				{
					this.desk.fillStyle = "rgb(225, 225, 225)";
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
				else if (element instanceof Grass)
				{
					this.desk.fillStyle = "rgb(0, 128, 0)";
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
				else if (element instanceof Fire)
				{
					this.desk.fillStyle = "rgb(255, 150, 0)";
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
				else if (element instanceof Water)
				{
					this.desk.fillStyle = "rgb(0, 50, 255)";
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
				else if (element instanceof Lava)
				{
					if(element.density == 3)
					{
						this.desk.fillStyle = "rgb(255, 0, 0)";
					}
					else if(element.density == 2)
					{
						this.desk.fillStyle = "rgb(255, 50, 0)";
					}
					else if(element.density == 1)
					{
						this.desk.fillStyle = "rgb(255, 100, 0)";
					}
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
				else if (element instanceof Ice)
				{
					if(element.density == 3)
					{
						this.desk.fillStyle = "rgb(0, 200, 255)";
					}
					else if(element.density == 2)
					{
						this.desk.fillStyle = "rgb(0, 150, 255)";
					}
					else if(element.density == 1)
					{
						this.desk.fillStyle = "rgb(0, 100, 255)";
					}
					this.desk.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
				}
			}
		}
	}

	static executeFrame()
	{
		for (let y = 0; y < Program.heightCells; y++) 
		{
			for (let x = 0; x < Program.widthCells; x++) 
			{
				let element = Program.matrix[y][x];
				if (element instanceof Void)
				{

				}
				else if (element instanceof Grass)
				{
					element.grow();
				}
				else if (element instanceof Fire)
				{
					element.burn();
					element.fade();
				}
				else if (element instanceof Water)
				{
					element.flow();
					element.evaporate();
				}
				else if (element instanceof Lava)
				{
					element.flow();
					element.burn();
					element.fade();
				}
				else if (element instanceof Ice)
				{
					element.flow();
					element.melt();
					element.evaporate();
				}
			}
		}
	}
	//#endregion

	//#region Execute
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
}
//#endregion