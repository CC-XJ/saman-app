/**
 * Navigation Router
 * Handles SPA navigation logic and Dynamic View Loading
 */
window.Router = {
    navigate: async function(viewId) {
        // Push to history
        const history = window.Store.get('history');
        const currentView = history[history.length - 1];
        
        if (currentView === viewId) return;

        // Load View Content if not already present
        let viewEl = document.getElementById(viewId + '-view');
        if (!viewEl) {
            // Create container
            viewEl = document.createElement('section');
            viewEl.id = viewId + '-view';
            viewEl.className = 'view';
            document.getElementById('app').appendChild(viewEl);
            
            // Fetch content
            const html = await window.ViewLoader.load(viewId);
            viewEl.innerHTML = html;
        }

        history.push(viewId);
        
        // UI Transition
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        viewEl.classList.add('active');

        // Trigger view specific logic
        if (viewId === 'tickets') window.TicketController.renderList();
        if (viewId === 'auth' || viewId === 'signup') window.AuthController.init(); 
        if (viewId === 'dashboard') window.DashboardController.init();
        if (viewId === 'profile') window.ProfileController.init();
        if (viewId === 'officer_dashboard') window.OfficerController.init();
        if (viewId === 'ticket_detail') {
            // Detail controller is called directly, no init needed
        }

        // Toggle Navbar & Update Active State
        const navbar = document.getElementById('navbar');
        if (navbar) {
            // Navbar is visible for public user views (excluding payment flow)
            if (['dashboard', 'tickets', 'profile', 'ticket_detail'].includes(viewId)) {
                navbar.style.display = 'flex';
                
                // Remove active from all
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                
                // Add active to current (only for main nav items)
                if (['dashboard', 'tickets', 'profile'].includes(viewId)) {
                    const activeNav = document.getElementById('nav-' + viewId);
                    if (activeNav) activeNav.classList.add('active');
                }

            } else {
                navbar.style.display = 'none';
            }
        }
    },

    back: function() {
        const history = window.Store.get('history');
        if (history.length <= 1) return; // Can't go back from root

        history.pop();
        const prevView = history[history.length - 1];

        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.getElementById(prevView + '-view').classList.add('active');
    },

    // Initial load
    init: async function() {
        // Check for session first
        if (window.AuthController.checkSession()) {
            // checkSession handles navigation if logged in
            return; 
        }

        // Load initial view (auth)
        const initialView = 'auth';
        const viewEl = document.createElement('section');
        viewEl.id = initialView + '-view';
        viewEl.className = 'view active'; // Start active
        document.getElementById('app').appendChild(viewEl);
        
        const html = await window.ViewLoader.load(initialView);
        viewEl.innerHTML = html;
        
        // Init controller
        window.AuthController.init();
    }
};
