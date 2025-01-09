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

export function setupProfilePictureSelection() {
    let actual_pp = document.getElementById('actual_pp');
    const other_pp = document.querySelectorAll('.pp');
    if (actual_pp && other_pp.length > 0) {
        other_pp.forEach((pp) => {
            pp.addEventListener('click', () => {
                actual_pp.removeAttribute('id');
                actual_pp.classList.remove('animate__animated', 'animate__bounce');
                pp.id = 'actual_pp';
                actual_pp = pp;
                actual_pp.addEventListener('animationend', () => {
                    actual_pp.classList.remove('animate__animated', 'animate__bounce');
                });
            });
        });
    }
}
