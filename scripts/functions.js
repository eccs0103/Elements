//#region Random
class Random
{
	static number(min, max)
	{
		return parseInt((Math.random() * (max - min) + min));
	}

	static arrayElement(array)
	{
		return array[Random.number(0, array.length)];
	}
}
//#endregion

//#region Data
class Files
{
	static #path = "FiveElements.LocalKey.";
	static save(key, value)
	{
		localStorage.setItem(this.#path + key, value);
	}
	static load(key, value)
	{
		if(localStorage.getItem(this.#path + key) === null)
		{
			return value;
		}
		else
		{
			let value = localStorage.getItem(this.#path + key);
			//Number Check
			if(!isNaN(parseInt(value)))
			{
				return parseInt(value);
			}
			//Boolean Check
			else if(value === "true" || value === "false")
			{
				return (value === "true");
			}
			//String Check
			else
			{
				return value;
			}
		}
	}
}
//#endregion