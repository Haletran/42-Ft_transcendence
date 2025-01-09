// UserStore.js
class UserStore {
    constructor() {
        this._userData = null;
        this._profilePictureSubscribers = [];
    }

    async fetchMinInfo() {
        try {
            const response = await fetch('/api/credentials/user-info/', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();

                if (this._hasProfilePictureChanged(userData.profile_picture)) {
                    this._userData = userData;
                    this._notifyProfilePictureSubscribers(userData.profile_picture);
                }

                return userData;
            } else {
                console.log(response.status);
                console.log('User not logged in');
                router.goTo('/');
                return null;
            }
        } catch (error) {
            console.error("User not logged in:", error);
            router.goTo('/');
            return null;
        }
    }

    _hasProfilePictureChanged(newProfilePicture) {
        return !this._userData ||
            this._userData.profile_picture !== newProfilePicture;
    }

    subscribeToProfilePicture(callback) {
        this._profilePictureSubscribers.push(callback);

        // Si une photo de profil existe déjà, appeler immédiatement le callback
        if (this._userData && this._userData.profile_picture) {
            callback(this._userData.profile_picture);
        }

        // Retourne une fonction de désinscription
        return () => {
            this._profilePictureSubscribers = this._profilePictureSubscribers.filter(
                sub => sub !== callback
            );
        };
    }

    _notifyProfilePictureSubscribers(profilePictureUrl) {
        this._profilePictureSubscribers.forEach(callback => {
            callback(profilePictureUrl);
        });
    }

    // Fonction utilitaire pour mettre à jour les images de profil
    updateProfilePicture(profilePictureUrl) {
        const profilePics = [
            document.querySelector('img[alt="logo_profile_picture"]'),
            document.querySelector('img[alt="profile_picture_main"]')
        ];

        profilePics.forEach(pic => {
            if (pic) pic.src = profilePictureUrl;
        });
    }
}

const userStore = new UserStore();
export function fetchMinInfo() {
    return userStore.fetchMinInfo();
}

export function subscribeToProfilePicture(callback) {
    return userStore.subscribeToProfilePicture(callback);
}