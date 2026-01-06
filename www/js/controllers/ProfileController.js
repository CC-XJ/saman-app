/**
 * Profile Controller
 * Handles user profile display
 */
window.ProfileController = {
    init: function() {
        const user = window.Store.get('user');
        if (user) {
            document.getElementById('profile-name').innerText = user.name || 'User';
            document.getElementById('profile-ic').innerText = user.ic || '';
            document.getElementById('profile-initial').innerText = (user.name ? user.name.charAt(0).toUpperCase() : 'U');
        }
    }
};
