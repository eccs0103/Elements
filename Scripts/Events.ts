//#region Navigation
document.getElementById("ButtonHome").addEventListener
("click", 
	function(Event)
	{
		Navigate.Id = 0;
	}
);
document.getElementById("ButtonSettings").addEventListener
("click", 
	function(Event)
	{
		Navigate.Id = 1;
	}
);
document.getElementById("ButtonInformation").addEventListener
("click", 
	function(Event)
	{
		Navigate.Id = 2;
	}
);
//#endregion

//#region Interface
document.getElementById("ButtonTheme").addEventListener
("click",
	function(Event)
	{
		Interface.DarkTheme = !Interface.DarkTheme;
	}
);
document.getElementById("ButtonStats").addEventListener
("click", 
	function(Event)
	{
		Program.Stats = !Program.Stats;
	}
);
//#endregion

//#region Program
document.getElementById("ButtonExecute").addEventListener
("click", 
	function(Event)
	{
		Program.Execute = !Program.Execute;
	}
);
document.getElementById("ButtonReset").addEventListener
("click", 
	function(Event)
	{
		Program.GenerateBoard();
		Program.DrawElements();
	}
);
document.getElementById("InputSize").addEventListener
("input",
	function(Event)
	{
		let InputField: any = Event.target;
		InputField.value = InputField.value.replace(/[^0-9]/g, "");
		let Value: number = Number(InputField.value);

		try
		{
			Program.WidthCells = Value;
			Program.HeightCells = Value;

			Program.Execute = false;
			Program.GenerateBoard();
			Program.DrawElements();

			if(InputField.classList.contains("Denied"))
			{
				InputField.classList.replace("Denied", "Background");
			}
		}
		catch
		{
			if(InputField.classList.contains("Background"))
			{
				InputField.classList.replace("Background", "Denied");
			}
		}
	}
);
document.getElementById("InputFramesCount").addEventListener
("input",
	function(Event)
	{
		let InputField: any = Event.target;
		InputField.value = InputField.value.replace(/[^0-9]/g, "");
		let Value: number = Number(InputField.value);

		try
		{
			Program.FramesCount = Value;

			// Program.Execute = false;
			// Program.GenerateBoard();
			// Program.DrawElements();

			if(InputField.classList.contains("Denied"))
			{
				InputField.classList.replace("Denied", "Background");
			}
		}
		catch
		{
			if(InputField.classList.contains("Background"))
			{
				InputField.classList.replace("Background", "Denied");
			}
		}
	}
);
//#endregion

//#region Coefficents
let InputCoefficentsList: any[] = 
[
	document.getElementById("InputGrassC"),
	document.getElementById("InputFireC"),
	document.getElementById("InputWaterC"),
	document.getElementById("InputLavaC"),
	document.getElementById("InputIceC"),
];

for (let Index = 0; Index < InputCoefficentsList.length; Index++)
{
	let InputCoefficent: any = InputCoefficentsList[Index];
	InputCoefficent.addEventListener
	("input",
		function(Event: Event)
		{
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: number = Number(InputField.value);

			try
			{
				if(Index === 0)
				{
					Program.Coefficents(Value, Program.FireC, Program.WaterC, Program.LavaC, Program.IceC);
				}
				else if(Index === 1)
				{
					Program.Coefficents(Program.GrassC, Value, Program.WaterC, Program.LavaC, Program.IceC);
				}
				else if(Index === 2)
				{
					Program.Coefficents(Program.GrassC, Program.FireC, Value, Program.LavaC, Program.IceC);
				}
				else if(Index === 3)
				{
					Program.Coefficents(Program.GrassC, Program.FireC, Program.WaterC, Value, Program.IceC);
				}
				else if(Index === 4)
				{
					Program.Coefficents(Program.GrassC, Program.FireC, Program.WaterC, Program.LavaC, Value);
				}
				document.getElementById("InputVoidC").value = Program.VoidC;

				for (let Index2 = 0; Index2 < InputCoefficentsList.length; Index2++)
				{
					let InputField2: any = InputCoefficentsList[Index2];
					if(InputField2.classList.contains("Denied"))
					{
						InputField2.classList.replace("Denied", "Background");
					}
				}
			}
			catch
			{
				if(InputField.classList.contains("Background"))
				{
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
}
//#endregion