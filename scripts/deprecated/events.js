//#region Navigation
document.getElementById("ButtonHome").addEventListener
	("click",
		function (Event) {
			Navigate.Id = 0;
		}
	);
document.getElementById("ButtonSettings").addEventListener
	("click",
		function (Event) {
			Navigate.Id = 1;
		}
	);
document.getElementById("ButtonInformation").addEventListener
	("click",
		function (Event) {
			Navigate.Id = 2;
		}
	);
//#endregion

//#region Interface
document.getElementById("ButtonTheme").addEventListener
	("click",
		function (Event) {
			Interface.DarkTheme = !Interface.DarkTheme;
		}
	);
document.getElementById("ButtonStats").addEventListener
	("click",
		function (Event) {
			Program.Stats = !Program.Stats;
		}
	);
//#endregion

//#region Program
document.getElementById("ButtonExecute").addEventListener
	("click",
		function (Event) {
			Program.Execute = !Program.Execute;
		}
	);
document.getElementById("ButtonReset").addEventListener
	("click",
		function (Event) {
			Program.GenerateBoard();
			Program.DrawElements();
		}
	);
document.getElementById("InputSize").addEventListener
	("input",
		function (Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Program.WidthCells = Value;
				Program.HeightCells = Value;

				Program.Execute = false;
				Program.GenerateBoard();
				Program.DrawElements();

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputFramesCount").addEventListener
	("input",
		function (Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Program.FramesCount = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
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

for (let Index = 0; Index < InputCoefficentsList.length; Index++) {
	let InputCoefficent: any = InputCoefficentsList[Index];
	InputCoefficent.addEventListener
		("input",
			function (Event: Event) {
				let InputField: any = Event.target;
				InputField.value = InputField.value.replace(/[^0-9]/g, "");
				let Value: Number = Number(InputField.value);

				try {
					if (Index === 0) {
						Program.Coefficents(Value, Program.FireC, Program.WaterC, Program.LavaC, Program.IceC);
					}
					else if (Index === 1) {
						Program.Coefficents(Program.GrassC, Value, Program.WaterC, Program.LavaC, Program.IceC);
					}
					else if (Index === 2) {
						Program.Coefficents(Program.GrassC, Program.FireC, Value, Program.LavaC, Program.IceC);
					}
					else if (Index === 3) {
						Program.Coefficents(Program.GrassC, Program.FireC, Program.WaterC, Value, Program.IceC);
					}
					else if (Index === 4) {
						Program.Coefficents(Program.GrassC, Program.FireC, Program.WaterC, Program.LavaC, Value);
					}
					document.getElementById("InputVoidC").value = Program.VoidC;

					for (let Index2 = 0; Index2 < InputCoefficentsList.length; Index2++) {
						let InputField2: any = InputCoefficentsList[Index2];
						if (InputField2.classList.contains("Denied")) {
							InputField2.classList.replace("Denied", "Background");
						}
					}
				}
				catch
				{
					if (InputField.classList.contains("Background")) {
						InputField.classList.replace("Background", "Denied");
					}
				}
			}
		);
}
//#endregion

//#region ElementsCountdown
document.getElementById("InputGrassGrow").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Grass.GrowCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputFireLifespan").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Fire.LifespanMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputFireBurn").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Fire.BurnCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputWaterFlow").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Water.FlowCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputWaterEvaporate").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Water.EvaporateCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputLavaFlow").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Lava.FlowCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputLavaBurn").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Lava.BurnCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputLavaFade").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Lava.FadeCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputIceFlow").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Ice.FlowCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputIceMelt").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Ice.MeltCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
document.getElementById("InputIceEvaporate").addEventListener
	("input",
		function (Event: Event) {
			let InputField: any = Event.target;
			InputField.value = InputField.value.replace(/[^0-9]/g, "");
			let Value: Number = Number(InputField.value);

			try {
				Ice.EvaporateCountdownMax = Value;

				if (InputField.classList.contains("Denied")) {
					InputField.classList.replace("Denied", "Background");
				}
			}
			catch
			{
				if (InputField.classList.contains("Background")) {
					InputField.classList.replace("Background", "Denied");
				}
			}
		}
	);
//#endregion

//#region Reset
document.getElementById("ButtonResetSettings").addEventListener
	("click",
		function (Event) {
			Interface.DarkTheme = Default.DarkTheme;
			Program.Stats = Default.Stats;
			Program.WidthCells = Default.WidthCells;
			Program.HeightCells = Default.HeightCells;
			Program.FramesCount = Default.FramesCount;
			Program.Coefficents(Default.GrassC, Default.FireC, Default.WaterC, Default.LavaC, Default.IceC);
			Grass.GrowCountdownMax = Default.GrassGrowCountdownMax;
			Fire.LifespanMax = Default.FireLifespanMax;
			Fire.BurnCountdownMax = Default.FireBurnCountdownMax;
			Water.FlowCountdownMax = Default.WaterFlowCountdownMax;
			Water.EvaporateCountdownMax = Default.WaterEvaporateCountdownMax;
			Lava.FlowCountdownMax = Default.LavaFlowCountdownMax;
			Lava.BurnCountdownMax = Default.LavaBurnCountdownMax;
			Lava.FadeCountdownMax = Default.LavaFadeCountdownMax;
			Ice.FlowCountdownMax = Default.IceFlowCountdownMax;
			Ice.MeltCountdownMax = Default.IceMeltCountdownMax;
			Ice.EvaporateCountdownMax = Default.IceEvaporateCountdownMax;

			document.getElementById("InputSize").value = Program.WidthCells;
			document.getElementById("InputFramesCount").value = Program.FramesCount;
			document.getElementById("InputVoidC").value = Program.VoidC;
			document.getElementById("InputGrassC").value = Program.GrassC;
			document.getElementById("InputFireC").value = Program.FireC;
			document.getElementById("InputWaterC").value = Program.WaterC;
			document.getElementById("InputLavaC").value = Program.LavaC;
			document.getElementById("InputIceC").value = Program.IceC;
			document.getElementById("InputGrassGrow").value = Grass.GrowCountdownMax;
			document.getElementById("InputFireLifespan").value = Fire.LifespanMax;
			document.getElementById("InputFireBurn").value = Fire.BurnCountdownMax;
			document.getElementById("InputWaterFlow").value = Water.FlowCountdownMax;
			document.getElementById("InputWaterEvaporate").value = Water.EvaporateCountdownMax;
			document.getElementById("InputLavaFlow").value = Lava.FlowCountdownMax;
			document.getElementById("InputLavaBurn").value = Lava.BurnCountdownMax;
			document.getElementById("InputLavaFade").value = Lava.FadeCountdownMax;
			document.getElementById("InputIceFlow").value = Ice.FlowCountdownMax;
			document.getElementById("InputIceMelt").value = Ice.MeltCountdownMax;
			document.getElementById("InputIceEvaporate").value = Ice.EvaporateCountdownMax;

			Console.Write("Настройки восстановлены по умолчанию.");
		}
	);
//#endregion