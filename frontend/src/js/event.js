import { hideElementsByClass } from './utils.js';
import { showElementsByClass } from './utils.js';
import { addClassToElementsByClass } from './utils.js';

['start_button', 'start_button2'].forEach(buttonId => {
    document.getElementById(buttonId).addEventListener('click', function () {
        hideElementsByClass('menu');
        showElementsByClass('game', 'flex');
        addClassToElementsByClass('game', 'center');
        document.getElementById('pong_canvas').style.display = 'block';
        game(this.value);
    });
});