/**
 * Auth Controller
 * Handles Login logic
 */
const AuthController = {
    init: function() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    },

    login: function() {
        const ic = document.getElementById('ic-number').value;
        const pass = document.getElementById('password').value;

        if (!ic || !pass) {
            alert('Please enter both IC Number and Password');
            return;
        }

        // Mock Login Delay
        const btn = document.getElementById('login-btn');
        const originalText = btn.innerText;
        
        btn.innerText = 'Verifying...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            
            // Navigate to dashboard on success
            Router.navigate('dashboard');
        }, 800);
    }
};
