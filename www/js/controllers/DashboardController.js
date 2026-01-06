/**
 * Dashboard Controller
 * Populates dynamic user data
 */
window.DashboardController = {
    init: async function() {
        const user = window.Store.get('user');
        
        if (user) {
            document.getElementById('dashboard-user-name').innerText = user.name || 'User';
            document.getElementById('dashboard-user-ic').innerText = user.ic || '';
        }

        // Fetch tickets to count outstanding
        try {
            const tickets = await window.Database.getTickets(user.ic);
            const unpaidCount = tickets.filter(t => t.status === 'unpaid').length;
            document.getElementById('dashboard-outstanding-count').innerText = unpaidCount;
            
            // Should probably cache tickets in store if not present
            window.Store.set('tickets', tickets);
        } catch (e) {
            console.error('Failed to load dashboard data', e);
        }
    }
};
