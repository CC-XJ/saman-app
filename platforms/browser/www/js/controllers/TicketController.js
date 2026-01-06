/**
 * Ticket Controller
 * Handles fetching and rendering of summons
 */
const TicketController = {
    renderList: function() {
        const container = document.getElementById('ticket-list-container');
        if (!container) return;
        
        container.innerHTML = ''; // Clear

        const tickets = Store.get('tickets');

        tickets.forEach(ticket => {
            const item = document.createElement('div');
            item.className = 'ticket-item';
            
            // Interaction logic
            item.onclick = () => {
                if (ticket.status === 'unpaid') {
                    PaymentController.preparePayment(ticket.id);
                }
            };

            const statusClass = ticket.status === 'paid' ? 'status-paid' : 'status-unpaid';
            const statusText = ticket.status.toUpperCase();

            item.innerHTML = `
                <div class="ticket-info" style="flex: 1; padding-right: 10px;">
                    <h4>${ticket.type}</h4>
                    <div class="ticket-meta">${ticket.location}</div>
                    <div class="ticket-meta">${ticket.date}</div>
                    <div style="margin-top: 4px; font-weight: 600; color: var(--primary);">RM ${ticket.amount.toFixed(2)}</div>
                </div>
                <div class="ticket-status ${statusClass}">${statusText}</div>
            `;
            
            if (ticket.status === 'paid') {
                item.style.opacity = '0.7';
            }

            container.appendChild(item);
        });
    },

    refresh: function() {
        // Logic to fetch from API would go here
        this.renderList();
    }
};
