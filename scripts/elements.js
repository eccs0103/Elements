//#region Initial Elementals
//#region Void
class Void extends Elemental {
	static title = `Void`;
	static color = new Color(225, 225, 225);
	constructor() {
		super();
		this._title = Void.title;
		this._color = Void.color;
	}
}
board.setCase(Void, 90);
//#endregion
//#region Grass
class Grass extends Elemental {
	static title = `Grass`;
	static color = new Color(0, 128, 0);
	static durationGrow = 10;
	constructor() {
		super();
		this._title = Grass.title;
		this._color = Grass.color;
		this.abilities.push(this.#grow);
	}
	#grow = new Ability(`Grow`, () => {
		const positions = [
			new Vector(this.position.x - 1, this.position.y - 1),
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x + 1, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x - 1, this.position.y + 1),
			new Vector(this.position.x, this.position.y + 1),
			new Vector(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementalsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Grass());
			return true;
		} else {
			return false;
		}
	}, Grass.durationGrow);
}
board.setCase(Grass, 4);
//#endregion
//#region Fire
class Fire extends Elemental {
	static title = `Fire`;
	static color = new Color(255, 150, 0);
	static durationBurn = 4;
	static durationFade = 16;
	constructor() {
		super();
		this._title = Fire.title;
		this._color = Fire.color;
		this.abilities.push(this.#burn, this.#fade);
	}
	#burn = new Ability(`Burn`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Fire());
			this.#fade.progress = 0;
			return true;
		} else {
			return false;
		}
	}, Fire.durationBurn);
	#fade = new Ability(`Fade`, () => {
		board.set(this.position, new Void());
		return false;
	}, Fire.durationFade);
}
board.setCase(Fire, 2);
//#endregion
//#region Water
class Water extends Elemental {
	static title = `Water`;
	static color = new Color(0, 50, 255);
	static durationFlow = 8;
	static durationEvaporate = 8;
	constructor() {
		super();
		this._title = Water.title;
		this._color = Water.color;
		this.abilities.push(this.#flow, this.#evaporate);
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Vector(this.position.x - 1, this.position.y - 1),
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x + 1, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x - 1, this.position.y + 1),
			new Vector(this.position.x, this.position.y + 1),
			new Vector(this.position.x + 1, this.position.y + 1)
		];
		const targets = board.getElementalsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Water());
			return true;
		} else {
			return false;
		}

	}, Water.durationFlow);
	#evaporate = new Ability(`Evaporate`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Void());
			board.set(this.position, new Void());
			return true;
		} else {
			return false;
		}
	}, Water.durationEvaporate);
}
board.setCase(Water, 2);
//#endregion
//#region Lava
class Lava extends Elemental {
	static title = `Lava`;
	static color = new Color(255, 0, 0);
	static maxDensity = 3;
	static durationFlow = 15;
	static durationBurn = 8;
	static durationFade = 4;
	/**
	 * 
	 * @param {Number} density 
	 */
	constructor(density = Lava.maxDensity) {
		super();
		this._title = Lava.title;
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
			board.set(this.position, new Void());
		}
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			const lifespan = this.#density - 1;
			if (lifespan > 0) {
				board.set(target.position, new Lava(lifespan));
			}
			return true;
		} else {
			return false;
		}
	}, Lava.durationFlow);
	#burn = new Ability(`Burn`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Grass);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Fire());
			return true;
		} else {
			return false;
		}
	}, Lava.durationBurn);
	#fade = new Ability(`Fade`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Water);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Void());
			this.density--;
			return true;
		} else {
			return false;
		}
	}, Lava.durationFade);
}
board.setCase(Lava, 1);
//#endregion
//#region Ice
class Ice extends Elemental {
	static title = `Ice`;
	static color = new Color(0, 200, 255);
	static maxDensity = 3;
	static durationFlow = 12;
	static durationMelt = 4;
	static durationEvaporate = 4;
	/**
	 * 
	 * @param {Number} density 
	 */
	constructor(density = Ice.maxDensity) {
		super();
		this._title = Ice.title;
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
			board.set(this.position, new Water());
		}
	}
	#flow = new Ability(`Flow`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Void);
		if (targets.length > 0) {
			const target = Random.element(targets);
			const lifespan = this.#density - 1;
			if (lifespan > 0) {
				board.set(target.position, new Ice(lifespan));
			}
			return true;
		} else {
			return false;
		}
	}, Ice.durationFlow);
	#melt = new Ability(`Melt`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Fire);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Lava());
			this.density--;
			return true;
		} else {
			return false;
		}
	}, Ice.durationMelt);
	#evaporate = new Ability(`Evaporate`, () => {
		const positions = [
			new Vector(this.position.x, this.position.y - 1),
			new Vector(this.position.x - 1, this.position.y),
			new Vector(this.position.x + 1, this.position.y),
			new Vector(this.position.x, this.position.y + 1),
		];
		const targets = board.getElementalsOfType(positions, Lava);
		if (targets.length > 0) {
			const target = Random.element(targets);
			board.set(target.position, new Void());
			board.set(this.position, new Void());
			return true;
		} else {
			return false;
		}
	}, Ice.durationEvaporate);
}
board.setCase(Ice, 1);
//#endregion
//#endregion
//#region Custom Elementals
//#region NewElemental
class NewElemental extends Elemental {
	static title = `New Elemental`; // Название элемента
	static color = new Color(0, 0, 0); // Цвет элемента
	static durationAbilityName = 1; // Длительность перезарядки способности
	constructor() {
		super();
		this._title = NewElemental.title;
		this._color = NewElemental.color; // Присваивание цвета элемента
		this.abilities.push(this.#abilityName); // Подключение способностей
	}
	#abilityName = new Ability(`Ability Name`, () => {
		// Действия при активации
		return true; // Сбросить прогресс при активации?
	}, NewElemental.durationAbilityName); // Способность
}
//#endregion
//#endregion
