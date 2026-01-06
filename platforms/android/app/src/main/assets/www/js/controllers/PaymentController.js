/**
 * Payment Controller
 * Handles payment details and processing
 */
window.PaymentController = {
    preparePayment: function(ticketId) {
        const tickets = window.Store.get('tickets');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;

        window.Store.set('currentTicket', ticket);
        
        // Populate Payment View
        // Note: The payment view might need to be loaded first if we were deep linking, 
        // but typically we navigate TO it, so Router loads it. 
        // We need to ensure navigation happens, then populate.
        
        window.Router.navigate('payment').then(() => {
            // Small delay to ensure DOM is ready if async
            setTimeout(() => {
                document.getElementById('pay-summon-type').innerText = ticket.type;
                document.getElementById('pay-summon-location').innerText = ticket.location;
                document.getElementById('pay-summon-date').innerText = ticket.date;
                document.getElementById('pay-summon-amount').innerText = 'RM ' + ticket.amount.toFixed(2);
            }, 50);
        });
    },

    processPayment: function() {
        const currentTicket = window.Store.get('currentTicket');
        if (!currentTicket) return;

        // Get selected payment method
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        const paymentMethod = selectedMethod.value;
        const confirmPayment = confirm(`Proceed with payment of RM ${currentTicket.amount.toFixed(2)} via ${paymentMethod}?`);
        
        if (confirmPayment) {
            const user = window.Store.get('user');
            
            // Use new payTicket method that creates receipt
            window.Database.payTicket(
                currentTicket.id, 
                paymentMethod, 
                currentTicket.amount, 
                user.ic
            ).then(() => {
                alert('Payment Successful! Receipt has been saved.');
                
                // Update Local Store as well for UI consistency
                currentTicket.status = 'paid';
                
                // Navigate back and refresh
                window.Router.back();
                window.TicketController.refresh();
            }).catch((err) => {
                alert('Payment failed: ' + err);
            });
        }
    }
};
