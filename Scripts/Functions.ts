//#region Random
class Random
{
	public static Integer(Min: number, Max: number): number
	{
		return parseInt(String(Math.random() * (Max - Min) + Min));
	}
	public static Element(array: any[]):any
	{
		return array[Random.Integer(0, array.length)];
	}
}
//#endregion

//#region Files
class Files
{
	private static _Path = "FiveEelements.LocalKey.";
	public static Save(Key: string, Value: any)
	{
		window.localStorage.setItem(this._Path + Key, Value);
	}
	public static Load(Key: string, Value: any)
	{
		if(window.localStorage.getItem(this._Path + Key) === null)
		{
			return Value;
		}
		else
		{
			let Value = localStorage.getItem(this._Path + Key);
			//Number Check
			if(!isNaN(Number(Value)))
			{
				return Number(Value);
			}
			//Boolean Check
			else if(Value === "true" || Value === "false")
			{
				return (Value === "true");
			}
			//String Check
			else
			{
				return Value;
			}
		}
	}
}
//#endregion

//#region Console
class Console
{
	public static Write(Message: string)
	{
		document.getElementById("TextConsole").textContent = Message;
		document.getElementById("DivConsole").style.visibility = "visible";
		document.getElementById("DivConsole").style.transform = "translateY(0%)";
		document.getElementById("DivConsole").style.transition = Interface.SlideTime + "s";
		setTimeout
		(
			function()
			{
				document.getElementById("DivConsole").style.transform = "translateY(-100%)";
				document.getElementById("DivConsole").style.transition = Interface.SlideTime + "s";
				document.getElementById("DivConsole").style.visibility = "hidden";
				
			}, 
			Interface.ConsoleTime * 1000
		);
	}
}
//#endregion