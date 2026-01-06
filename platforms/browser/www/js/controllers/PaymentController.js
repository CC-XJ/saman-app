/**
 * Payment Controller
 * Handles payment details and processing
 */
const PaymentController = {
    preparePayment: function(ticketId) {
        const tickets = Store.get('tickets');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;

        Store.set('currentTicket', ticket);
        
        // Populate Payment View
        document.getElementById('pay-summon-type').innerText = ticket.type;
        document.getElementById('pay-summon-location').innerText = ticket.location;
        document.getElementById('pay-summon-date').innerText = ticket.date;
        document.getElementById('pay-summon-amount').innerText = 'RM ' + ticket.amount.toFixed(2);

        Router.navigate('payment');
    },

    processPayment: function() {
        const currentTicket = Store.get('currentTicket');
        if (!currentTicket) return;

        const confirmPayment = confirm(`Proceed with payment of RM ${currentTicket.amount.toFixed(2)}?`);
        
        if (confirmPayment) {
             alert('Payment Successful! Receipt has been emailed.');
             
             // Update logic in Store
             currentTicket.status = 'paid';
             
             // Navigate back and refresh
             Router.back();
             TicketController.refresh();
        }
    }
};
