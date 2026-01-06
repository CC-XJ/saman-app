/**
 * Ticket Controller
 * Handles fetching and rendering of summons
 */
window.TicketController = {
    renderList: async function() {
        const pendingContainer = document.getElementById('pending-ticket-list');
        const paidContainer = document.getElementById('paid-ticket-list');
        
        if (!pendingContainer || !paidContainer) return;
        
        pendingContainer.innerHTML = '<div style="text-align:center; padding: 20px;">Loading...</div>';
        paidContainer.innerHTML = '<div style="text-align:center; padding: 20px;">Loading...</div>';

        // Fetch from DB
        const user = window.Store.get('user');
        const tickets = await window.Database.getTickets(user ? user.ic : null);
        
        // Update Store
        window.Store.set('tickets', tickets);

        // Separate into pending and paid
        const pendingTickets = tickets.filter(t => t.status === 'unpaid');
        const paidTickets = tickets.filter(t => t.status === 'paid');

        // Render Pending
        if (pendingTickets.length === 0) {
            pendingContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted);">No pending summons</div>';
        } else {
            pendingContainer.innerHTML = '';
            pendingTickets.forEach(ticket => {
                const item = this.createTicketItem(ticket, false);
                pendingContainer.appendChild(item);
            });
        }

        // Render Paid
        if (paidTickets.length === 0) {
            paidContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted);">No paid summons</div>';
        } else {
            paidContainer.innerHTML = '';
            paidTickets.forEach(ticket => {
                const item = this.createTicketItem(ticket, true);
                paidContainer.appendChild(item);
            });
        }
    },

    createTicketItem: function(ticket, isPaid) {
        const item = document.createElement('div');
        item.className = 'ticket-item';
        
        // Click behavior
        item.onclick = () => {
            if (isPaid) {
                // Show detail view for paid tickets
                window.TicketDetailController.showDetail(ticket.id);
            } else {
                // Go to payment for unpaid tickets
                window.PaymentController.preparePayment(ticket.id);
            }
        };

        const statusClass = isPaid ? 'status-paid' : 'status-unpaid';
        const statusText = isPaid ? 'PAID' : 'UNPAID';

        item.innerHTML = `
            <div class="ticket-info" style="flex: 1; padding-right: 10px;">
                <h4>${ticket.type}</h4>
                <div class="ticket-meta">${ticket.location}</div>
                <div class="ticket-meta">${ticket.date}</div>
                <div style="margin-top: 4px; font-weight: 600; color: var(--primary);">RM ${ticket.amount.toFixed(2)}</div>
            </div>
            <div class="ticket-status ${statusClass}">${statusText}</div>
        `;
        
        if (isPaid) {
            item.style.opacity = '0.9';
        }

        return item;
    },

    refresh: function() {
        this.renderList();
    }
};
