//#region NewElement
class NewElement extends _Element {
	static color = new Color(0, 0, 0); // Цвет элемента
	static durationAbilityName = 1; // Длительность перезарядки способности
	constructor(/** @type {Coordinate} */ position) {
		super(position);
		this._color = NewElement.color; // Присваивание цвета элемента
		this.abilities.push(this.#abilityName); // Подключение способностей
	}
	#abilityName = new Ability(`Ability Name`, () => {
		// Действия при активации
		return true; // Сбросить прогресс при активации?
	}, NewElement.durationAbilityName); // Способность
}
//#endregion