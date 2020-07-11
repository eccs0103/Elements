//#region Canvas
function setup() 
{
	frameRate(60);
	let canvas = createCanvas(widthPx, heightPx);
	canvas.parent("game");
	background(255, 255, 255);
	stroke(150, 150, 150);

	generateBoard();
	drawElements();
}

function draw() 
{
	if(gameStatus)
	{
		drawElements();
	}

	if (resultsStatus)
	{
		updateResults();
	}
}
//#endregion

//#region Navigation
pages = 
[
	[document.getElementById("home"), document.getElementById("homeIcon")],
	[document.getElementById("settings"), document.getElementById("settingsIcon")],
	[document.getElementById("information"), document.getElementById("informationIcon")],
];

function openPage(id)
{
	if(id != pageId)
	{
		for (let index = 0; index < pages.length; index++) 
		{
			pages[index][0].style.display = "none";
			pages[index][1].style.backgroundColor = "rgb(255, 255, 255)";
		}
		pages[id][0].style.display = "flex";
		pages[id][1].style.backgroundColor = "rgb(225, 225, 225)";
		pageId = id;
	}
}

openPage(0);

document.getElementById("homeIcon").addEventListener
("click", 
	function(event)
	{
		openPage(0);
	}
);

document.getElementById("settingsIcon").addEventListener
("click", 
	function(event)
	{
		openPage(1);
	}
);

document.getElementById("informationIcon").addEventListener
("click", 
	function(event)
	{
		openPage(2);
	}
);
//#endregion

//#region Game
function generateBoard()
{
	for (let y = 0; y < height; y++) 
	{
		for (let x = 0; x < width; x++) 
		{
			let randomElement = randomNumber(0, fullC)
			if (randomElement >= 0 && randomElement < voidC)
			{
				board[y][x] = new Void(x, y);
			}
			else if (randomElement >= voidC && randomElement < voidC + grassC) 
			{
				board[y][x] = new Grass(x, y);
			}
			else if (randomElement >= voidC + grassC && randomElement < voidC + grassC+ fireC) 
			{
				board[y][x] = new Fire(x, y);
			}
			else if (randomElement >= voidC + grassC+ fireC && randomElement < voidC + grassC+ fireC + waterC) 
			{
				board[y][x] = new Water(x, y);
			}
			else if (randomElement >= voidC + grassC+ fireC + waterC && randomElement < voidC + grassC+ fireC + waterC + lavaC) 
			{
				board[y][x] = new Lava(x, y, 3);
			}
			else if (randomElement >= voidC + grassC+ fireC + waterC + lavaC && randomElement < fullC) 
			{
				board[y][x] = new Ice(x, y, 3);
			}
		}
	}
}

function drawElements()
{
	let cellWidth = widthPx / width;
	let cellHeight = heightPx / height;

	for (let y = 0; y < height; y++) 
	{
		for (let x = 0; x < width; x++) 
		{
			let element = board[y][x];
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

function resumeGame(execute)
{
	if(execute)
	{
		document.getElementById("statusIconImage").src = "../Resources/2x/baseline_pause_black_48dp.png";
		document.getElementById("statusIconImage").alt = "Пауза";
		gameStatus = true;
	}
	else if(!execute)
	{
		document.getElementById("statusIconImage").src = "../Resources/2x/baseline_play_arrow_black_48dp.png";
		document.getElementById("statusIconImage").alt = "Старт";
		gameStatus = false;
	}
}

function showResults(execute)
{
	if(execute)
	{
		resultsStatus = true;
		document.getElementById("results").style.display = "block";
	}
	else if(!execute)
	{
		resultsStatus = false;
		document.getElementById("results").style.display = "none";
	}
}

function updateResults()
{
	let voidCount = 0;
	let grassCount = 0;
	let fireCount = 0;
	let waterCount = 0;
	let lavaCount = 0;
	let iceCount = 0;

	for (let y = 0; y < height; y++)
	{
		for (let x = 0; x < width; x++)
		{
			let element = board[y][x];
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

document.getElementById("statusIcon").addEventListener
("click", 
	function()
	{
		resumeGame(!gameStatus);
	}
);

document.getElementById("refreshIcon").addEventListener
("click", 
	function(event)
	{
		generateBoard();
		drawElements();
	}
);

document.getElementById("resultsIcon").addEventListener
("click", 
	function(event)
	{
		showResults(!resultsStatus);
	}
);
//#endregion

//#region Settings
// document.getElementById("boardWidthInput").addEventListener
// ("input", 
// 	function(event)
// 	{
// 		let widthValue = document.getElementById("boardWidthInput").value;
// 		if(5 <= widthValue && widthValue <= 50)
// 		{
// 			width = widthValue;
// 			resumeGame(false);
// 			generateBoard();
// 		}
// 	}
// );

// document.getElementById("boardHeightInput").addEventListener
// ("input", 
// 	function(event)
// 	{
// 		let heightValue = document.getElementById("boardHeightInput").value;
// 		if(5 <= heightValue && heightValue <= 50)
// 		{
// 			height = heightValue;
// 			resumeGame(false);
// 			generateBoard();
// 		}
// 	}
// );
//#endregion