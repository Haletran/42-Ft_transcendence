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

document.addEventListener('DOMContentLoaded', async function () {
    let actual_pp = document.getElementById('actual_pp'); // Current active profile picture
    const other_pp = document.querySelectorAll('.pp'); // All profile pictures

    if (actual_pp && other_pp.length > 0) {
        other_pp.forEach((pp) => {
            pp.addEventListener('click', () => {
                // Remove the 'actual' ID from the current picture
                actual_pp.removeAttribute('id');
                actual_pp.classList.remove('animate__animated', 'animate__bounce');

                // Assign the 'actual' ID to the newly clicked picture
                pp.id = 'actual_pp';
                actual_pp = pp;

                // Add bounce animation
                actual_pp.classList.add('animate__animated', 'animate__bounce');
                actual_pp.addEventListener('animationend', () => {
                    actual_pp.classList.remove('animate__animated', 'animate__bounce');
                });
            });
        });
    }
});
