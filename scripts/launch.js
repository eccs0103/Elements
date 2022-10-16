board.setCase(Void, 90);
board.setCase(Grass, 4);
board.setCase(Fire, 2);
board.setCase(Water, 2);
board.setCase(Lava, 1);
board.setCase(Ice, 1);
board.fill();

const inputTogglePlay = /** @type {HTMLInputElement} */ (document.querySelector(`input#toggle-play`));
board.execute = inputTogglePlay.checked;
inputTogglePlay.addEventListener(`change`, (event) => {
	board.execute = inputTogglePlay.checked;
});

const buttonReloadBoard = /** @type {HTMLButtonElement} */ (document.querySelector(`button#reload-board`));
buttonReloadBoard.addEventListener(`click`, (event) => {
	board.fill();
});
