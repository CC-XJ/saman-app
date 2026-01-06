window.AuthController = {
    init: function() {
        // We need to wait for the DOM to be present since it's lazy loaded
        setTimeout(() => {
            // Login Form binding
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                // Remove old listeners to prevent duplicates if re-init
                const newForm = loginForm.cloneNode(true);
                loginForm.parentNode.replaceChild(newForm, loginForm);
                
                newForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.login();
                });
            }

            // Signup Form binding
            const signupForm = document.getElementById('signup-form');
            if (signupForm) {
                const newSignForm = signupForm.cloneNode(true);
                signupForm.parentNode.replaceChild(newSignForm, signupForm);
                
                newSignForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.register();
                });
            }
        }, 100);
    },

    checkSession: function() {
        const storedUser = localStorage.getItem('session_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            window.Store.set('user', user);
            
            if (user.role === 'officer') {
                window.Router.navigate('officer_dashboard');
            } else {
                window.Router.navigate('dashboard');
            }
            return true;
        }
        return false;
    },

    login: async function() {
        const ic = document.getElementById('ic-number').value;
        const pass = document.getElementById('password').value;

        if (!ic || !pass) {
            alert('Please enter both IC Number and Password');
            return;
        }

        const btn = document.getElementById('login-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Verifying...';
        btn.disabled = true;

        try {
            const user = await window.Database.loginUser(ic, pass);
            
            // Store user session
            window.Store.set('user', user);
            localStorage.setItem('session_user', JSON.stringify(user));
            
            // Navigate based on Role
            if (user.role === 'officer') {
                window.Router.navigate('officer_dashboard');
            } else {
                window.Router.navigate('dashboard');
            }
        
        } catch (error) {
            alert('Login Failed: ' + error);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },

    logout: function() {
        localStorage.removeItem('session_user');
        window.Store.set('user', null);
        
        // Clear Form
        const icInput = document.getElementById('ic-number');
        const passInput = document.getElementById('password');
        if (icInput) icInput.value = '';
        if (passInput) passInput.value = '';

        window.Router.navigate('auth');
    },

    register: async function() {
        const name = document.getElementById('reg-name').value;
        const ic = document.getElementById('reg-ic').value;
        const pass = document.getElementById('reg-password').value;

        if (!name || !ic || !pass) {
            alert('Please fill in all fields');
            return;
        }

        const btn = document.getElementById('reg-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Creating Account...';
        btn.disabled = true;

        try {
            await window.Database.registerUser(ic, pass, name);
            alert('Account created! Please login.');
            window.Router.navigate('auth');
        } catch (error) {
            alert('Registration Failed: ' + error);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
};
