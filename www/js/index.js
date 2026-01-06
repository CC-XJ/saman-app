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

        // Initialize Database
        window.Database.initialize().then(() => {
            // Initialize Router (which loads the Auth View)
            window.Router.init();
        });

        // Global Access for HTML event handlers
        window.app = {
            router: window.Router,
            handlers: {
                processPayment: window.PaymentController.processPayment
            }
        };

        console.log('App Initialized');
    }
};

app.initialize();
