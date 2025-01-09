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