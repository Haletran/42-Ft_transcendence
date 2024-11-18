// document.getElementById('add_player').onclick = function () {
//     var list = document.querySelector('.list-group');
//     if (list.children.length < 4) {
//         var item = document.createElement('li');
//         item.classList.add('list-group-item');
//         item.innerHTML = '<i class="bi bi-robot"></i> Player ' + (list.children.length + 1);
//         list.appendChild(item);
//     } else {
//         alert('Maximum 4 players allowed');
//     }
// }
document.getElementById('add_player').onclick = function () {
    var list = document.querySelector('.list-group');
    var errorMsg = document.getElementById('error_msg');
    if (list.children.length < 4) {
        var item = document.createElement('li');
        item.classList.add('list-group-item');
        var playerName = prompt('Enter player name:');
        if (playerName) {
            item.innerHTML = '<i class="bi bi-robot"></i> ' + playerName;
            list.appendChild(item);
            errorMsg.textContent = '';
            errorMsg.classList.remove('animate__animated', 'animate__headShake');
        }
        else {
            errorMsg.classList.remove('animate__animated', 'animate__headShake');
            errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Player name cannot be empty';
            errorMsg.classList.add('animate__animated', 'animate__headShake');
        }
    } else {
        errorMsg.classList.remove('animate__animated', 'animate__headShake');
        errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Maximum 4 players allowed';
        errorMsg.classList.add('animate__animated', 'animate__headShake');

    }
}
document.getElementById('rm_player').onclick = function () {
    var list = document.querySelector('.list-group');
    var items = document.querySelectorAll('.list-group-item');
    var errorMsg = document.getElementById('error_msg');

    if (items.length > 2) {
        list.removeChild(items[items.length - 1]);
        errorMsg.textContent = '';
        errorMsg.classList.remove('animate__animated', 'animate__headShake');
    }
    else {
        errorMsg.classList.remove('animate__animated', 'animate__headShake');
        errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>  Minimum 2 player required';
        errorMsg.classList.add('animate__animated', 'animate__headShake');
    }
}
