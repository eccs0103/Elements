//#region Primary
//#region Coordinate
class Coordinate {
	constructor(/** @type {Number} */ x, /** @type {Number} */ y) {
		this.#x = x;
		this.#y = y;
	}
	/** @type {Number} */ #x;
	/** @readonly */ get x() {
		return this.#x;
	}
	/** @type {Number} */ #y;
	/** @readonly */ get y() {
		return this.#y;
	}
	toString() {
		return `(${this.#x}, ${this.#y})`;
	}
}
//#endregion
//#region Color
class Color {
	/** @readonly */ static get white() {
		return new Color(255, 255, 255);
	}
	/** @readonly */ static get black() {
		return new Color(0, 0, 0);
	}
	constructor(/** @type {Number} */ red, /** @type {Number} */ green, /** @type {Number} */ blue, /** @type {Number} */ transparence = 1) {
		this.#red = red;
		this.#green = green;
		this.#blue = blue;
		this.#transparence = transparence;
	}
	/** @type {Number} */ #red;
	/** @readonly */ get red() {
		return this.#red;
	}
	/** @type {Number} */ #green;
	/** @readonly */ get green() {
		return this.#green;
	}
	/** @type {Number} */ #blue;
	/** @readonly */ get blue() {
		return this.#blue;
	}
	/** @type {Number} */ #transparence;
	/** @readonly */ get transparence() {
		return this.#transparence;
	}
	toString() {
		return `rgba(${this.#red}, ${this.#green}, ${this.#blue}, ${this.#transparence})`;
	}
}
//#endregion
//#region Ability
class Ability {
	constructor(/** @type {String} */ name, /** @type {() => Boolean} */ action, /** @type {Number} */ countdown, /** @type {Number} */ progress = 0) {
		this.#name = name;
		this.#action = action;
		this.#countdown = countdown;
		this.progress = progress;
	}
	/** @type {String} */ #name;
	/** @readonly */ get name() {
		return this.#name;
	}
	/** @type {() => Boolean} */ #action;
	/** @readonly */ get action() {
		return this.#action;
	}
	/** @type {Number} */ #countdown;
	/** @readonly */ get countdown() {
		return this.#countdown;
	}
	/** @type {Number} */ progress;
}
//#endregion
//#region _Element
class _Element {
	static color = new Color(0, 0, 0);
	constructor(/** @type {Coordinate} */ position) {
		this.#position = position;
		this._color = _Element.color;
		this.#abilities = [];
	}
	/** @type {Coordinate} */ #position;
	/** @readonly */ get position() {
		return this.#position;
	}
	/** @protected */ _color;
	/** @readonly */ get color() {
		return this._color;
	}
	/** @type {Array<Ability>} */ #abilities;
	/** @readonly */ get abilities() {
		return this.#abilities;
	}
}
//#endregion
//#region Generator
class _Generator {
	/** @type {Array<{ value: typeof _Element, coefficient: Number }>} */ #cases = [];
	setCase(/** @type {typeof _Element} */ value, /** @type {Number} */ coefficient) {
		const result = this.#cases.find((_case) => _case.value == value);
		if (result) {
			result.coefficient = coefficient;
		} else {
			this.#cases.push({ value: value, coefficient: coefficient });
		}
		return (result != undefined);
	}
	removeCase(/** @type {typeof _Element} */ value) {
		const index = this.#cases.findIndex((_case) => _case.value == value);
		const result = (index == -1);
		if (result) {
			this.#cases.splice(index, 1);
		}
		return result;
	}
	/** @protected */ _getElement(/** @type {Coordinate} */ position) {
		const summary = this.#cases.reduce((previous, current) => previous + current.coefficient, 0);
		const random = Random.number(0, summary);
		let selection = null;
		for (let index = 0, start = 0; index < this.#cases.length; index++) {
			const _case = this.#cases[index];
			const end = start + _case.coefficient;
			if (start <= random && random < end) {
				selection = new _case.value(position);
				break;
			}
			start = end;
		}
		if (selection) {
			return selection;
		} else {
			throw new ReferenceError(`список вариантов пуста: ${summary}, ${random}`);
		}
	}
	// /** @protected */ _getELementCollection(/** @type {Array<Coordinate>} */ list) {
	// 	const array = [];
	// 	for (let index = 0; index < list.length; index++) {
	// 		const position = list[index];
	// 		array[index] = this._getElement(position);
	// 	}
	// 	return array;
	// }
}
//#endregion
//#region Board
class Board extends _Generator {
	constructor(/** @type {Coordinate} */ size, /** @type {CanvasRenderingContext2D | null} */ context) {
		super();
		this.#size = size;
		this.#data = [];
		for (let y = 0; y < size.y; y++) {
			this.#data[y] = [];
			for (let x = 0; x < size.x; x++) {
				this.#data[y][x] = new _Element(new Coordinate(x, y));
			}
		}
		///
		if (context) {
			console.log(`Standart FPS rate setted to: ${this.#framesCount}`);
			this.#drawFrame(context);
			let previousFrame = Date.now();
			setInterval(() => {
				let currentFrame = Date.now();
				this.FPS = (() => {
					return 1000 / (currentFrame - previousFrame);
				})();
				previousFrame = currentFrame;
				///
				this.#executeFrame();
				this.#drawFrame(context);
			}, 1000 / this.#framesCount);
		} else {
			throw new ReferenceError(`не удалось найти текстуру`);
		}
	}
	/** @type {Coordinate} */ #size;
	/** @readonly */ get size() {
		return this.#size;
	}
	/** @type {Array<Array<_Element>>} */ #data;
	/** @readonly */ get data() {
		return this.#data;
	}
	/** @type {Number} */ #framesCount = 60;
	/** @template {_Element} Type */ setCell(/** @type {Coordinate} */ position, /** @type {Type} */ value) {
		if (this.hasCell(position)) {
			this.#data[position.y][position.x] = value;
		} else {
			throw new RangeError(`позиция ${position.toString()} выходит за границы слоя`);
		}
	}
	getCell(/** @type {Coordinate} */ position) {
		if (this.hasCell(position)) {
			return this.#data[position.y][position.x];
		} else {
			throw new RangeError(`позиция ${position.toString()} выходит за границы слоя`);
		}
	}
	hasCell(/** @type {Coordinate} */ position) {
		return (0 <= position.x && position.x < this.#size.x && 0 <= position.y && position.y < this.#size.y);
	}
	/** @template {typeof _Element} Type */ getElementsOfType(/** @type {Array<Coordinate>} */ positions, /** @type {Type} */ type) {
		const result = [];
		for (const position of positions) {
			if (this.hasCell(position)) {
				const datul = this.#data[position.y][position.x];
				if (datul instanceof type) {
					result.push((/** @type {InstanceType<Type>} */ (datul)));
				}
			}
		}
		return result;
	}
	#drawFrame(/** @type {CanvasRenderingContext2D} */ context) {
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Coordinate(x, y);
				const element = this.getCell(position);
				context.fillStyle = element.color.toString();
				const cellSize = new Coordinate(context.canvas.width / this.size.x, context.canvas.height / this.size.y);
				context.fillRect(position.x * cellSize.x, position.y * cellSize.y, cellSize.x, cellSize.y);
			}
		}
	}
	#executeFrame() {
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Coordinate(x, y);
				const element = this.getCell(position);
				if (element) {

				}
				for (const ability of element.abilities) {
					if (ability.progress > ability.countdown) {
						throw new RangeError(`недопустимое значаение прогресса - ${ability.progress}, способности - ${ability.name}, у элемента ${Object.getPrototypeOf(element)}, в позиции - ${element.position.toString()}`);
					} else if (ability.progress == ability.countdown) {
						const reset = ability.action();
						if (reset) {
							ability.progress = 0;
						}
					} else {
						ability.progress++;
					}
				}
			}
		}
	}
	/** @type {Number} */ FPS;
	generateArea(/** @type {Coordinate} */ from, /** @type {Coordinate} */ to) {
		const start = new Coordinate(Math.min(from.x, to.x), Math.min(from.y, to.y));
		const end = new Coordinate(Math.max(from.x, to.x), Math.max(from.y, to.y));
		for (let y = start.y; y < end.y; y++) {
			for (let x = start.x; x < end.x; x++) {
				const position = new Coordinate(x, y);
				this.setCell(position, this._getElement(position));
			}
		}
	}
}
//#endregion
//#endregion
const canvasView = /** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`));
canvasView.width = canvasView.getBoundingClientRect().width;
canvasView.height = canvasView.getBoundingClientRect().height;
const contextView = canvasView.getContext(`2d`);
const input = window.prompt(`Input board size`, `100`);
const size = (() => {
	if (input == null) {
		throw new TypeError(`invalid input`);
	}
	const result = Number.parseInt(input);
	if (Number.isNaN(result)) {
		throw new TypeError(`invalid input`);
	} else {
		return result;
	}
})();
const board = new Board(new Coordinate(size, size), contextView);
//
const bCounterFPS = /** @type {HTMLElement} */ (document.querySelector(`b#counter-fps`));
setInterval(() => {
	bCounterFPS.innerText = board.FPS.toFixed(0);
}, 1000 / 4);
