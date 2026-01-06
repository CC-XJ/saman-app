/**
 * Navigation Router
 * Handles SPA navigation logic
 */
const Router = {
    navigate: (viewId) => {
        // Push to history
        const history = Store.get('history');
        const currentView = history[history.length - 1];
        
        if (currentView === viewId) return;

        history.push(viewId);
        
        // UI Transition
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        const nextView = document.getElementById(viewId + '-view');
        if (nextView) {
            nextView.classList.add('active');
        } else {
            console.error('View not found:', viewId);
        }

        // Trigger view specific logic via a simplified event system or direct check
        if (viewId === 'tickets') TicketController.renderList();
    },

    back: () => {
        const history = Store.get('history');
        if (history.length <= 1) return; // Can't go back from root

        history.pop();
        const prevView = history[history.length - 1];

        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.getElementById(prevView + '-view').classList.add('active');
    }
};
