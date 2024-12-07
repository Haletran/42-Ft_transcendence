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