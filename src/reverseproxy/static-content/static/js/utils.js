export function hideElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}
export function showElementsByClass(className, display) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = display;
    }
}
export function addClassToElementsByClass(targetClassName, classNameToAdd) {
    const elements = document.getElementsByClassName(targetClassName);
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add(classNameToAdd);
    }
}

export function getNumberofUser() {
    var items = document.querySelectorAll('.list-group-item');
    var count = 0;
    for (var i = 0; i < items.length; i++) {
        count++;
    }
    return count;
}

export function setACookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}


export function deleteACookie(name) {
    console.log('deleting cookie');
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax';
}

export function getACookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function redirectTo(url) {
    window.location.href = url;
}

export function unload() {
    setACookie('game_running', 'false', 1);
    setACookie('credits', 'false', 1);
}

export const showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toast-container');
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="10000">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
};