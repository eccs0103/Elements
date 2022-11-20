//#region Random
class Random {
	/**
	 * 
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns 
	 */
	static number(min, max) {
		return Math.random() * (max - min) + min;
	}
	/**
	 * 
	 * @template Type
	 * @param {Array<Type>} array 
	 * @returns 
	 */
	static element(array) {
		return array[Math.floor(Random.number(0, array.length))];
	}
}
//#endregion
//#region Archive
/** 
 * @template Notation
 */
class Archive {
	/**
	 * 
	 * @param {String} path 
	 * @param {Notation | undefined} initial 
	 */
	constructor(path, initial = undefined) {
		this.#path = path;
		if (!localStorage.getItem(path) && initial) {
			localStorage.setItem(path, JSON.stringify(initial, undefined, " "));
		}
	}
	/** @type {String} */ #path;
	get data() {
		const item = localStorage.getItem(this.#path);
		if (item) {
			return (/** @type {Notation} */ (JSON.parse(item)));
		} else {
			throw new ReferenceError(`Key '${this.#path}' is undefined.`);
		}
	}
	/**
	 * 
	 * @param {Notation} value 
	 */
	set data(value) {
		localStorage.setItem(this.#path, JSON.stringify(value, undefined, " "));
	}
}
//#endregion
//#region Manager
class Manager {
	static async queryText(/** @type {String} */ url) {
		return fetch(url).then(response => response.text());
	}
}
//#endregion