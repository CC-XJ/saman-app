/*
 * Main App Entry Point
 * Orchestrates the initialization of modules
 */

const app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
        
        // Initialize Status Bar
        if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString('#f8fafc');
            StatusBar.overlaysWebView(false);
        }

        // Initialize Controllers
        AuthController.init();

        // Global Access for HTML event handlers (e.g., onclick="app.router...")
        // We remap the old inline calls to our new modules for compatibility with existing HTML
        window.app = {
            router: Router,
            handlers: {
                processPayment: PaymentController.processPayment
            }
        };

        console.log('App Initialized');
    }
};

app.initialize();
