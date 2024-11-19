import { hideElementsByClass } from './utils.js';
import { showElementsByClass } from './utils.js';
import { addClassToElementsByClass } from './utils.js';
import { getNumberofUser } from './utils.js';

['start_button', 'start_button2'].forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', function () {
            hideElementsByClass('menu');
            showElementsByClass('game', 'flex');
            addClassToElementsByClass('game', 'center');
            document.getElementById('pong_canvas').style.display = 'block';
            game(this.value);
        });
    }
});

const startButtonM = document.getElementById('start_button_m');
if (startButtonM) {
    startButtonM.addEventListener('click', function () {
        hideElementsByClass('menu');
        showElementsByClass('game', 'flex');
        addClassToElementsByClass('game', 'center');
        document.getElementById('monopoly_canvas').style.display = 'block';
        init_monopoly_game(getNumberofUser());
    });
}

