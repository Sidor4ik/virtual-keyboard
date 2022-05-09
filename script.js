import KeysContainer from './keyboard.js';

const wrapper = document.createElement('div');
const title = document.createElement('h1');
const textarea = document.createElement('textarea');
const keyboardElem = document.createElement('div');
const text = document.createElement('p');

wrapper.classList.add('wrapper');
title.textContent = 'Виртуальная клавиатура';
text.innerText = 'Клавиатура создана под операционной системой Windows\nДля переключения языка комбинация: Shift + Alt';

const keyboard = new KeysContainer(keyboardElem, textarea);
keyboard.keyboardInit();
keyboard.logicAdd();

wrapper.appendChild(title);
wrapper.appendChild(textarea);
wrapper.appendChild(keyboardElem);
wrapper.appendChild(text);
document.body.appendChild(wrapper);



