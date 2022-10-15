//#region Random
class Random {
	static number(/** @type {Number} */ min, /** @type {Number} */ max) {
		return Math.random() * (max - min) + min;
	}
	/** @template Type */ static element(/** @type {Array<Type>} */ array) {
		return array[Math.floor(Random.number(0, array.length))];
	}
}
//#endregion
//#region Archive
/** @template Notation */ class Archive {
	constructor(/** @type {String} */ path, /** @type {Notation | undefined} */ initial = undefined) {
		this.#path = path;
		if (!localStorage.getItem(path) && initial) {
			localStorage.setItem(path, JSON.stringify(initial));
		}
	}
	/** @type {String} */ #path;
	read() {
		const item = localStorage.getItem(this.#path);
		return item ? /** @type {Notation} */ (JSON.parse(item)) : null;
	}
	write(/** @type {Notation} */ value) {
		localStorage.setItem(this.#path, JSON.stringify(value));
	}
}
//#endregion