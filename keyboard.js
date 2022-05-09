import KEYS from './key.js';

export default class KeysContainer {
	constructor(keyboardElem, textareaElem) {
		this.keyboardElem = keyboardElem;
		this.textareaElem = textareaElem;
		this.keys = [];
		this.storage = localStorage.getItem('language') === 'ru' ? 'ru' : 'en';
		this.isCapslock = false;
		this.isDown = false;
	}

	keyboardInit() {
		this.keyboardElem.classList.add('keyboard');
		KEYS.forEach((key) => {
			const keyButton = document.createElement('button');
			keyButton.setAttribute('id', key.code);
			keyButton.setAttribute('type', 'button');
			keyButton.setAttribute('language-en', key.language.en);
			keyButton.setAttribute('language-ru', key.language.ru);
			keyButton.setAttribute('contents-en', key.contents.en);
			keyButton.setAttribute('contents-ru', key.contents.ru);
			keyButton.setAttribute('shift-en', key.shift.en);
			keyButton.setAttribute('shift-ru', key.shift.ru);
			keyButton.classList.add('key', key.code);
			keyButton.textContent = this.storage === 'en' ? key.contents.en : key.contents.ru;
			this.keyboardElem.appendChild(keyButton);
			this.keys.push(keyButton);
		});
	}

	insertText(text, options) {
		let cursorStart = this.textareaElem.selectionStart;
		let cursorEnd = this.textareaElem.selectionEnd;
		if (this.textareaElem.selectionStart === this.textareaElem.selectionEnd) {
			if (options === 'Delete') cursorEnd += 1;
			else if (options === 'Backspace') cursorStart = Math.max(0, cursorStart - 1);
		}

		if (options === 'Backspace' || options === 'Delete') {
			this.textareaElem.setRangeText('', cursorStart, cursorEnd);
		} else this.textareaElem.setRangeText(text);
		this.textareaElem.selectionStart = cursorStart + text.length;
		this.textareaElem.selectionEnd = this.textareaElem.selectionStart;
	}

	shiftText(noCapsKey) {
		this.keys.forEach((forKey) => {
			const key = forKey;
			if (noCapsKey || key.getAttribute('language-en') === 'letter') {
				const el = key.getAttribute('contents-en');
				key.setAttribute('contents-en', key.getAttribute('shift-en'));
				key.setAttribute('shift-en', el);
			}
			if (noCapsKey || key.getAttribute('language-ru') === 'letter') {
				const el = key.getAttribute('contents-ru');
				key.setAttribute('contents-ru', key.getAttribute('shift-ru'));
				key.setAttribute('shift-ru', el);
			}
			key.innerText = this.storage === 'en'
				? key.getAttribute('contents-en')
				: key.getAttribute('contents-ru');
		});
	}

	logicAdd() {
		document.addEventListener('keydown', (keyEvent) => {
			const key = document.getElementById(keyEvent.code);
			if (key) {
				key.classList.add('pressed');
				keyEvent.preventDefault();
				const languageEn = key.getAttribute('language-en');
				if (
					(keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight')
					&& !keyEvent.repeat
				) this.shiftText(true);
				else if (keyEvent.code === 'CapsLock') {
					this.shiftText(false);
					if (this.isCapslock) key.classList.remove('pressed');
					this.isCapslock = !this.isCapslock;
				} else if (keyEvent.shiftKey && keyEvent.altKey) {
					this.storage = this.storage === 'ru' ? 'en' : 'ru';
					localStorage.setItem('language', this.storage);
					this.keys.forEach((forKey) => {
						if (this.storage === 'en') {
							const keyFromKeys = forKey;
							keyFromKeys.innerText = forKey.getAttribute('contents-en');
						} else if (this.storage === 'ru') {
							const keyFromKeys = forKey;
							keyFromKeys.innerText = forKey.getAttribute('contents-ru');
						}
					});
				} else if (keyEvent.code === 'Backspace') this.insertText('', 'Backspace');
				else if (keyEvent.code === 'Tab') this.insertText('    ');
				else if (languageEn !== 'func') this.insertText(key.textContent);
				else if (keyEvent.code === 'Delete') this.insertText('', 'Delete');
				else if (keyEvent.code === 'Enter') this.insertText('\n');
			}
		});

		document.addEventListener('keyup', (keyEvent) => {
			const key = document.getElementById(keyEvent.code);
			if (key) {
				if (keyEvent.code !== 'CapsLock') key.classList.remove('pressed');
				if (keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight') this.shiftText(true);
			}
		});

		this.keyboardElem.addEventListener('mousedown', (event) => {
			const eventKeyDown = new KeyboardEvent('keydown', {
				code: event.target.id,
			});
			document.dispatchEvent(eventKeyDown);
			this.isDown = true;
		});

		this.keyboardElem.addEventListener('mouseup', (event) => {
			const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
			document.dispatchEvent(eventKeyUp);
			this.isDown = false;
		});

		this.keyboardElem.addEventListener('mouseout', (event) => {
			if (this.isDown) {
				const eventKeyUp = new KeyboardEvent('keyup', {
					code: event.target.id,
				});
				document.dispatchEvent(eventKeyUp);
			}
		});
	}
}
