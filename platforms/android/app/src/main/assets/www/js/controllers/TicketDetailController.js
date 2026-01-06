/**
 * Ticket Detail Controller
 * Shows full details of a summon including receipt if paid
 */
window.TicketDetailController = {
    showDetail: async function(ticketId) {
        const tickets = window.Store.get('tickets');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;

        window.Store.set('currentTicket', ticket);
        
        // Navigate to detail view
        await window.Router.navigate('ticket_detail');
        
        // Populate ticket details
        setTimeout(() => {
            document.getElementById('detail-summon-type').innerText = ticket.type;
            document.getElementById('detail-summon-location').innerText = ticket.location;
            document.getElementById('detail-summon-date').innerText = ticket.date;
            document.getElementById('detail-summon-amount').innerText = 'RM ' + ticket.amount.toFixed(2);
            
            const statusEl = document.getElementById('detail-summon-status');
            if (ticket.status === 'paid') {
                statusEl.innerText = 'PAID';
                statusEl.style.color = 'var(--success)';
                
                // Fetch and show receipt
                this.loadReceipt(ticketId);
            } else {
                statusEl.innerText = 'UNPAID';
                statusEl.style.color = 'var(--error)';
                document.getElementById('receipt-card').style.display = 'none';
            }
        }, 50);
    },

    loadReceipt: async function(ticketId) {
        try {
            const receipt = await window.Database.getReceipt(ticketId);
            
            if (receipt) {
                document.getElementById('receipt-method').innerText = receipt.payment_method;
                document.getElementById('receipt-date').innerText = receipt.payment_date;
                document.getElementById('receipt-amount').innerText = 'RM ' + receipt.amount.toFixed(2);
                document.getElementById('receipt-card').style.display = 'block';
            }
        } catch (e) {
            console.error('Failed to load receipt:', e);
        }
    }
};
