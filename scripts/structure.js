//#region Vector
class Vector {
	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x, y) {
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
//#region Matrix
/** 
 * @template Type
 */
class Matrix {
	/**
	 * 
	 * @param {Vector} size 
	 * @param {Type} initial
	 */
	constructor(size, initial) {
		this.#size = size;
		console.log(`The matrix is generated as ${this.#size.x} × ${this.#size.x}.`);
		this.#data = [];
		for (let y = 0; y < size.y; y++) {
			this.#data[y] = [];
			for (let x = 0; x < size.x; x++) {
				this.#data[y][x] = initial;
			}
		}
	}
	/** @type {Vector} */ #size;
	/** @readonly */ get size() {
		return this.#size;
	}
	/** @type {Array<Array<Type>>} */ #data;
	/** @readonly */ get data() {
		return this.#data;
	}
	/**
	 * 
	 * @param {Vector} position 
	 * @param {Type} value 
	 */
	set(position, value) {
		if (this.has(position)) {
			this.#data[position.y][position.x] = value;
		} else {
			throw new RangeError(`Position ${position.toString()} is out of layer edges.`);
		}
	}
	/**
	 * 
	 * @param {Vector} position 
	 * @returns 
	 */
	get(position) {
		if (this.has(position)) {
			return this.#data[position.y][position.x];
		} else {
			throw new RangeError(`Position ${position.toString()} is out of layer edges.`);
		}
	}
	/**
	 * 
	 * @param {Vector} position 
	 * @returns 
	 */
	has(position) {
		return (0 <= position.x && position.x < this.#size.x && 0 <= position.y && position.y < this.#size.y);
	}
}
//#endregion
//#region Color
class Color {
	/**
	 * 
	 * @param {Number} hue 
	 * @param {Number} saturation 
	 * @param {Number} value 
	 * @returns 
	 */
	static viaHSV(hue, saturation, value) {
		/**
		 * 
		 * @param {Number} n 
		 * @param {Number} k 
		 * @returns 
		 */
		function f(n, k = (n + hue / 60) % 6) {
			return (value / 100) - (value / 100) * (saturation / 100) * Math.max(Math.min(k, 4 - k, 1), 0);
		};
		return new Color(f(5) * 255, f(3) * 255, f(1) * 255);
	}
	/** @readonly */ static get white() {
		return new Color(255, 255, 255);
	}
	/** @readonly */ static get black() {
		return new Color(0, 0, 0);
	}
	/**
	 * 
	 * @param {Number} red 
	 * @param {Number} green 
	 * @param {Number} blue 
	 * @param {Number} transparence 
	 */
	constructor(red, green, blue, transparence = 1) {
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
	/**
	 * 
	 * @param {String} title 
	 * @param {() => Boolean} action 
	 * @param {Number} countdown 
	 * @param {Number} progress 
	 */
	constructor(title, action, countdown, progress = 0) {
		this.#title = title;
		this.#action = action;
		this.#countdown = countdown;
		this.progress = progress;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
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
//#region Elemental
class Elemental {
	static color = new Color(0, 0, 0);
	static title = `Element`;
	constructor() {
		this._title = Elemental.title;
		this._color = Elemental.color;
		this.#abilities = [];
	}
	/** @protected @type {String} */ _title;
	/** @readonly */ get title() {
		return this._title;
	}
	/** @type {Vector} */ position;
	/** @protected @type {Color} */ _color;
	/** @readonly */ get color() {
		return this._color;
	}
	/** @type {Array<Ability>} */ #abilities;
	/** @readonly */ get abilities() {
		return this.#abilities;
	}
	execute() {
		let moves = false;
		for (const ability of this.abilities) {
			if (ability.progress > ability.countdown) {
				throw new RangeError(`Invalid progress value - ${ability.progress}, at ability - ${ability.title}, at element ${Object.getPrototypeOf(this)}, in position - ${this.position.toString()}`);
			} else if (ability.progress == ability.countdown) {
				const reset = ability.action();
				if (reset) {
					ability.progress = 0;
					moves = true;
				}
			} else {
				ability.progress++;
				moves = true;
			}
		}
		return moves;
	}
}
//#endregion
//#region Factory
/** 
 * @extends {Matrix<Elemental>}
 */
class Factory extends Matrix {
	/**
	 * 
	 * @param {Vector} size 
	 * @param {typeof Elemental} initial
	 */
	constructor(size, initial) {
		super(size, new initial());
	}
	/** @typedef {{ value: typeof Elemental, coefficient: Number }} Case */
	/** @type {Array<Case>} */ #cases = [];
	/** @readonly */ get cases() {
		return Object.freeze(this.#cases);
	}
	/**
	 * 
	 * @param {typeof Elemental} value 
	 * @returns 
	 */
	getCase(value) {
		const result = this.#cases.find((_case) => _case.value == value);
		return result ? result.coefficient : undefined;
	}
	/**
	 * 
	 * @param {typeof Elemental} value 
	 * @param {Number | undefined} coefficient 
	 * @returns 
	 */
	setCase(value, coefficient = undefined) {
		const index = this.#cases.findIndex((_case) => _case.value == value);
		if (index != -1) {
			const result = this.#cases[index];
			if (coefficient) {
				result.coefficient = coefficient;
			} else {
				this.#cases.splice(index, 1);
			}
		} else {
			if (coefficient) {
				this.#cases.push({ value: value, coefficient: coefficient });
			}
		}
	}
	generate() {
		const summary = this.#cases.reduce((previous, current) => previous + current.coefficient, 0);
		const random = Random.number(0, summary);
		let selection = null;
		for (let index = 0, start = 0; index < this.#cases.length; index++) {
			const _case = this.#cases[index];
			const end = start + _case.coefficient;
			if (start <= random && random < end) {
				selection = _case.value;
				break;
			}
			start = end;
		}
		if (selection) {
			return selection;
		} else {
			throw new ReferenceError(`Can't generate value. Maybe stack is empty.`);
		}
	}
}
//#endregion
//#region Engine
class Engine extends Factory {
	/**
	 * 
	 * @param {Vector} size 
	 */
	constructor(size) {
		super(size, Elemental);
		console.log(`Standart FPS rate setted to: ${this.#MFC}.`);
		let previousFrame = Date.now();
		setInterval(() => {
			let currentFrame = Date.now();
			this.#FPS = (() => {
				return 1000 / (currentFrame - previousFrame);
			})();
			previousFrame = currentFrame;
			///
			if (this.#execute) {
				this._update();
			}
		}, 1000 / this.#MFC);
	}
	/** @type {Number} */ #MFC = 60;
	/** @readonly */ get MFC() {
		return this.#MFC;
	}
	/** @type {Boolean} */ #execute = false;
	get execute() {
		return this.#execute;
	}
	set execute(value) {
		this.#execute = value;
	}
	/** 
	 * @protected
	 * @type {() => void}
	 */
	_update;
	/** @type {Number} */ #FPS;
	/** @readonly */ get FPS() {
		return this.#FPS;
	}
}
//#endregion
//#region Board
class Board extends Engine {
	/**
	 * 
	 * @param {Vector} size 
	 * @param {CanvasRenderingContext2D} context 
	 */
	constructor(size, context) {
		super(size);
		this.#context = context;
		this.#context.canvas.width = this.#context.canvas.getBoundingClientRect().width - (this.#context.canvas.getBoundingClientRect().width % this.size.x);
		this.#context.canvas.height = this.#context.canvas.getBoundingClientRect().height - (this.#context.canvas.getBoundingClientRect().height % this.size.y);
		this.#drawFrame();
		this._update = () => {
			this.#executeFrame();
			this.#drawFrame();
		};
	}
	/** @type {CanvasRenderingContext2D} */ #context;
	/**
	 * 
	 * @param {Vector} position 
	 * @param {Elemental} value 
	 */
	set(position, value) {
		value.position = position;
		super.set(position, value);
	}
	/** 
	 * @template {typeof Elemental} Type 
	 * @param {Array<Vector>} positions 
	 * @param {Type} type 
	 */
	getElementalsOfType(positions, type) {
		const result = [];
		for (const position of positions) {
			if (this.has(position)) {
				const datul = this.get(position);
				if (datul instanceof type) {
					result.push((/** @type {InstanceType<Type>} */ (datul)));
				}
			}
		}
		return result;
	}
	/** @type {Map<typeof Elemental, Number>} */ #information;
	/** @readonly */ get information() {
		return this.#information;
	}
	#drawFrame() {
		this.#information = new Map();
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Vector(x, y);
				const element = this.get(position);
				const key = element.constructor;
				// @ts-ignore
				this.#information.set(key, (this.#information.get(key) ?? 0) + 1);
				this.#context.fillStyle = element.color.toString();
				const cellSize = new Vector(this.#context.canvas.width / this.size.x, this.#context.canvas.height / this.size.y);
				this.#context.fillRect(position.x * cellSize.x, position.y * cellSize.y, cellSize.x, cellSize.y);
			}
		}
		const tableElementsCounter = /** @type {HTMLTableElement} */ (document.querySelector(`table#elements-counter`));
		const tbodyInformation = tableElementsCounter.tBodies[0];
		tbodyInformation.innerHTML = ``;
		// for (const row of tbodyInformation.rows) {
		// 	tbodyInformation.removeChild(row);
		// }
		for (const data of this.#information) {
			const element = data[0];
			const count = data[1];
			const row = tbodyInformation.insertRow();
			// row.insertCell().innerText = `${this.getCase(element)}%`;
			row.insertCell().appendChild(document.createElement(`div`)).setAttribute(`style`, `
				aspect-ratio: 1 / 1;
				width: calc(var(--size-standart-2) / 2);
				background-color: ${element.color.toString()};
			`);
			row.insertCell().innerText = element.title;
			row.insertCell().innerText = `${count}`;
		}
	}
	#executeFrame() {
		let moves = false;
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Vector(x, y);
				const element = this.get(position);
				if (element.execute()) {
					moves = true;
				}
			}
		}
		if (!moves) {
			this.execute = false;
			const inputTogglePlay = /** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`));
			if (window.confirm(`Elementals have no more moves. Do you want to reload the board?`)) {
				this.fill();
				this.execute = true;
			}
			inputTogglePlay.checked = this.execute;
		}
	}
	/**
	 * 
	 * @param {Vector} from 
	 * @param {Vector} to 
	 */
	fill(from = new Vector(0, 0), to = new Vector(this.size.x, this.size.y)) {
		const start = new Vector(Math.min(from.x, to.x), Math.min(from.y, to.y));
		const end = new Vector(Math.max(from.x, to.x), Math.max(from.y, to.y));
		for (let y = start.y; y < end.y; y++) {
			for (let x = start.x; x < end.x; x++) {
				const position = new Vector(x, y);
				this.set(position, new (this.generate())());
			}
		}
		this.#drawFrame();
	}
}
//#endregion
//#region Initialize
const canvasView = /** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`));
const contextView = (() => {
	const context = canvasView.getContext(`2d`);
	if (context) {
		return context;
	} else {
		throw new ReferenceError(`Can't reach the texture.`);
	}
})();
///
// const input = window.prompt(`Input board size`, `100`);
const size = 50; /* (() => {
	if (input == null) {
		throw new TypeError(`Input mustn't be empty.`);
	}
	const result = Number.parseInt(input);
	if (Number.isNaN(result)) {
		throw new TypeError(`Input must be converted to a number.`);
	} else {
		return result;
	}
})(); */
const board = new Board(new Vector(size, size), contextView);
///
const bCounterFPS = /** @type {HTMLElement} */ (document.querySelector(`b#counter-fps`));
setInterval(() => {
	bCounterFPS.innerText = board.FPS.toFixed(0);
	bCounterFPS.style.backgroundColor = Color.viaHSV(120 * (Math.min(Math.max(0, board.FPS / board.MFC), 1)), 100, 100).toString();
}, 1000 / 4);
//#endregion
