export function initializeCSRFToken() {
    fetch('/api/credentials/set-csrf-token/')
      .then(response => response.json())
      .then(data => {
    console.log('CSRF token set:', data);
    })
      .catch(error => {
        console.error('Error setting CSRF token:', error);
    });
}

export function getCSRFToken(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}