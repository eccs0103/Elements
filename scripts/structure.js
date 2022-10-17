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
//#region Matrix
/** @template Type */ class Matrix {
	constructor(/** @type {Coordinate} */ size, /** @type {(position: Coordinate) => Type} */ initial) {
		this.#size = size;
		console.log(`The matrix is generated as ${this.#size.x} × ${this.#size.x}.`);
		this.#data = [];
		for (let y = 0; y < size.y; y++) {
			this.#data[y] = [];
			for (let x = 0; x < size.x; x++) {
				this.#data[y][x] = initial(new Coordinate(x, y));
			}
		}
	}
	/** @type {Coordinate} */ #size;
	/** @readonly */ get size() {
		return this.#size;
	}
	/** @type {Array<Array<Type>>} */ #data;
	/** @readonly */ get data() {
		return this.#data;
	}
	set(/** @type {Coordinate} */ position, /** @type {Type} */ value) {
		if (this.has(position)) {
			this.#data[position.y][position.x] = value;
		} else {
			throw new RangeError(`Position ${position.toString()} is out of layer edges.`);
		}
	}
	get(/** @type {Coordinate} */ position) {
		if (this.has(position)) {
			return this.#data[position.y][position.x];
		} else {
			throw new RangeError(`Position ${position.toString()} is out of layer edges.`);
		}
	}
	has(/** @type {Coordinate} */ position) {
		return (0 <= position.x && position.x < this.#size.x && 0 <= position.y && position.y < this.#size.y);
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
//#region Elemental
class Elemental {
	static color = new Color(0, 0, 0);
	constructor(/** @type {Coordinate} */ position) {
		this.#position = position;
		this._color = Elemental.color;
		this.#abilities = [];
	}
	/** @type {Coordinate} */ #position;
	/** @readonly */ get position() {
		return this.#position;
	}
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
				throw new RangeError(`Invalid progress value - ${ability.progress}, at ability - ${ability.name}, at element ${Object.getPrototypeOf(this)}, in position - ${this.#position.toString()}`);
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
//#region _Generator
/** @extends {Matrix<Elemental>} */ class _Generator extends Matrix {
	constructor(/** @type {Coordinate} */ size) {
		super(size, (position) => new Elemental(position));
	}
	/** @type {Array<{ value: typeof Elemental, coefficient: Number }>} */ #cases = [];
	setCase(/** @type {typeof Elemental} */ value, /** @type {Number} */ coefficient) {
		const result = this.#cases.find((_case) => _case.value == value);
		if (result) {
			result.coefficient = coefficient;
		} else {
			this.#cases.push({ value: value, coefficient: coefficient });
		}
		return (result != undefined);
	}
	removeCase(/** @type {typeof Elemental} */ value) {
		const index = this.#cases.findIndex((_case) => _case.value == value);
		const result = (index == -1);
		if (result) {
			this.#cases.splice(index, 1);
		}
		return result;
	}
	/** @protected */ _generateValue(/** @type {Coordinate} */ position) {
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
			throw new ReferenceError(`Can't select random element. Maybe stack is empty.`);
		}
	}
	// /** @protected */ _generateValueCollection(/** @type {Array<Coordinate>} */ list) {
	// 	const array = [];
	// 	for (let index = 0; index < list.length; index++) {
	// 		const position = list[index];
	// 		array[index] = this._generateValue(position);
	// 	}
	// 	return array;
	// }
}
//#endregion
//#region Engine
class Engine extends _Generator {
	constructor(/** @type {Coordinate} */ size) {
		super(size);
		console.log(`Standart FPS rate setted to: ${this.#framesCount}.`);
		let previousFrame = Date.now();
		setInterval(() => {
			let currentFrame = Date.now();
			this.FPS = (() => {
				return 1000 / (currentFrame - previousFrame);
			})();
			previousFrame = currentFrame;
			///
			if (this.#execute) {
				this._updateFrame();
			}
		}, 1000 / this.#framesCount);
	}
	/** @type {Number} */ #framesCount = 60;
	/** @type {Boolean} */ #execute = false;
	get execute() {
		return this.#execute;
	}
	set execute(value) {
		this.#execute = value;
	}
	/** @protected @type {() => void} */ _updateFrame;
	/** @type {Number} */ FPS;
}
//#endregion
//#region Board
class Board extends Engine {
	constructor(/** @type {Coordinate} */ size, /** @type {CanvasRenderingContext2D | null} */ context) {
		super(size);
		if (context) {
			this.#context = context;
			// this.#drawFrame();
		} else {
			throw new ReferenceError(`Can't reach the texture.`);
		}
		this._updateFrame = () => {
			this.#executeFrame();
			this.#drawFrame();
		};
	}
	/** @type {CanvasRenderingContext2D} */ #context;
	/** @template {typeof Elemental} Type */ getElementalsOfType(/** @type {Array<Coordinate>} */ positions, /** @type {Type} */ type) {
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
	#drawFrame() {
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Coordinate(x, y);
				const element = this.get(position);
				this.#context.fillStyle = element.color.toString();
				const cellSize = new Coordinate(this.#context.canvas.width / this.size.x, this.#context.canvas.height / this.size.y);
				this.#context.fillRect(position.x * cellSize.x, position.y * cellSize.y, cellSize.x, cellSize.y);
			}
		}
	}
	#executeFrame() {
		let moves = false;
		for (let y = 0; y < this.size.y; y++) {
			for (let x = 0; x < this.size.x; x++) {
				const position = new Coordinate(x, y);
				const element = this.get(position);
				if (element.execute()) {
					moves = true;
				}
			}
		}
		if (!moves) {
			this.execute = false;
			if (window.confirm(`Elementals have no more moves. Do you want to reload the board?`)) {
				this.fill();
				this.execute = true;
			}
		}
	}
	fill(from = new Coordinate(0, 0), to = new Coordinate(this.size.x, this.size.y)) {
		const start = new Coordinate(Math.min(from.x, to.x), Math.min(from.y, to.y));
		const end = new Coordinate(Math.max(from.x, to.x), Math.max(from.y, to.y));
		for (let y = start.y; y < end.y; y++) {
			for (let x = start.x; x < end.x; x++) {
				const position = new Coordinate(x, y);
				this.set(position, this._generateValue(position));
			}
		}
		this.#drawFrame();
	}
}
//#endregion
//#region Initialize
const canvasView = /** @type {HTMLCanvasElement} */ (document.querySelector(`canvas#view`));
canvasView.width = canvasView.getBoundingClientRect().width;
canvasView.height = canvasView.getBoundingClientRect().height;
const contextView = canvasView.getContext(`2d`);
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
const board = new Board(new Coordinate(size, size), contextView);
///
const bCounterFPS = /** @type {HTMLElement} */ (document.querySelector(`b#counter-fps`));
setInterval(() => {
	bCounterFPS.innerText = board.FPS.toFixed(0);
}, 1000 / 4);
//#endregion