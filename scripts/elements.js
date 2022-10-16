//#region Void
class Void extends _Element {
	static color = new Color(225, 225, 225);
	constructor(/** @type {Coordinate} */ position) {
		super(position);
		this._color = Void.color;
	}
}
//#endregion
//#region Grass
class Grass extends _Element {
	static color = new Color(0, 128, 0);
	static durationGrow = 10;
	constructor(/** @type {Coordinate} */ position) {
		super(position);
		this._color = Grass.color;
		this.abilities.push(this.#grow);
	}
	#grow = new Ability(`Grow`, () => {
		const positions = [
			new Coordinate(this.position.x - 1, this.position.y - 1),
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x + 1, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x - 1, this.position.y + 1),
			new Coordinate(this.position.x, this.position.y + 1),
			new Coordinate(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Grass(target.position));
			return true;
		} else {
			return false;
		}
	}, Grass.durationGrow);
}
//#endregion
//#region Fire
class Fire extends _Element {
	static color = new Color(255, 150, 0);
	static durationBurn = 4;
	static durationFade = 16;
	constructor(/** @type {Coordinate} */ position) {
		super(position);
		this._color = Fire.color;
		this.abilities.push(this.#burn, this.#fade);
	}
	#burn = new Ability(`Burn`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Fire(target.position));
			this.#fade.progress = 0;
			return true;
		} else {
			return false;
		}
	}, Fire.durationBurn);
	#fade = new Ability(`Fade`, () => {
		board.setCell(this.position, new Void(this.position));
		return false;
	}, Fire.durationFade);
}
//#endregion
//#region Water
class Water extends _Element {
	static color = new Color(0, 50, 255);
	static durationFlow = 8;
	static durationEvaporate = 8;
	constructor(/** @type {Coordinate} */ position) {
		super(position);
		this._color = Water.color;
		this.abilities.push(this.#flow, this.#evaporate);
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Coordinate(this.position.x - 1, this.position.y - 1),
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x + 1, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x - 1, this.position.y + 1),
			new Coordinate(this.position.x, this.position.y + 1),
			new Coordinate(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Water(target.position));
			return true;
		} else {
			return false;
		}

	}, Water.durationFlow);
	#evaporate = new Ability(`Evaporate`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Void(target.position));
			board.setCell(this.position, new Void(this.position));
			return true;
		} else {
			return false;
		}
	}, Water.durationEvaporate);
}
//#endregion
//#region Lava
class Lava extends _Element {
	static color = new Color(255, 0, 0);
	static maxDensity = 3;
	static durationFlow = 15;
	static durationBurn = 8;
	static durationFade = 4;
	constructor(/** @type {Coordinate} */ position, /** @type {Number} */ density = Lava.maxDensity) {
		super(position);
		this.#density = density;
		this._color = new Color(
			((Lava.color.red - Fire.color.red) * this.#density / Lava.maxDensity) + Fire.color.red,
			((Lava.color.green - Fire.color.green) * this.#density / Lava.maxDensity) + Fire.color.green,
			((Lava.color.blue - Fire.color.blue) * this.#density / Lava.maxDensity) + Fire.color.blue,
		);
		this.abilities.push(this.#flow, this.#burn, this.#fade);
	}
	/** @type {Number} */ #density;
	get density() {
		return this.#density;
	}
	set density(value) {
		this.#density = value;
		if (this.#density <= 0) {
			board.setCell(this.position, new Void(this.position));
		}
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			const lifespan = this.#density - 1;
			if (lifespan > 0) {
				board.setCell(target.position, new Lava(target.position, lifespan));
			}
			return true;
		} else {
			return false;
		}
	}, Lava.durationFlow);
	#burn = new Ability(`Burn`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Fire(target.position));
			return true;
		} else {
			return false;
		}
	}, Lava.durationBurn);
	#fade = new Ability(`Fade`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Water);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Void(target.position));
			this.density--;
			return true;
		} else {
			return false;
		}
	}, Lava.durationFade);
}
//#endregion
//#region Ice
class Ice extends _Element {
	static color = new Color(0, 200, 255);
	static maxDensity = 3;
	static durationFlow = 12;
	static durationMelt = 4;
	static durationEvaporate = 4;
	constructor(/** @type {Coordinate} */ position, /** @type {Number} */ density = Ice.maxDensity) {
		super(position);
		this.#density = density;
		this._color = new Color(
			((Ice.color.red - Water.color.red) * this.#density / Ice.maxDensity) + Water.color.red,
			((Ice.color.green - Water.color.green) * this.#density / Ice.maxDensity) + Water.color.green,
			((Ice.color.blue - Water.color.blue) * this.#density / Ice.maxDensity) + Water.color.blue,
		);
		this.abilities.push(this.#flow, this.#melt, this.#evaporate);
	}
	/** @type {Number} */ #density;
	get density() {
		return this.#density;
	}
	set density(value) {
		this.#density = value;
		if (this.#density <= 0) {
			board.setCell(this.position, new Water(this.position));
		}
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			const lifespan = this.#density - 1;
			if (lifespan > 0) {
				board.setCell(target.position, new Ice(target.position, lifespan));
			}
			return true;
		} else {
			return false;
		}
	}, Ice.durationFlow);
	#melt = new Ability(`Melt`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Lava(target.position));
			this.density--;
			return true;
		} else {
			return false;
		}
	}, Ice.durationMelt);
	#evaporate = new Ability(`Evaporate`, () => {
		const positions = [
			new Coordinate(this.position.x, this.position.y - 1),
			new Coordinate(this.position.x - 1, this.position.y),
			new Coordinate(this.position.x + 1, this.position.y),
			new Coordinate(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementsOfType(positions, Lava);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.setCell(target.position, new Void(target.position));
			board.setCell(this.position, new Void(this.position));
			return true;
		} else {
			return false;
		}
	}, Ice.durationEvaporate);
}
//#endregion
