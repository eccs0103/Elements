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
