/**
 * Officer Controller
 * Handles issuing summons
 */
window.OfficerController = {
    init: function() {
        const user = window.Store.get('user');
        if (user) {
            document.getElementById('officer-name').innerText = user.name;
        }

        const form = document.getElementById('issue-ticket-form');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTicket();
            });
        }
    },

    submitTicket: async function() {
        const offenderIc = document.getElementById('offender-ic').value;
        const type = document.getElementById('offense-type').value;
        const location = document.getElementById('offense-location').value;
        const amount = document.getElementById('offense-amount').value;

        if (!offenderIc || !type || !location || !amount) {
            alert('Please fill in all fields');
            return;
        }

        const btn = document.getElementById('issue-btn');
        btn.disabled = true;
        btn.innerText = 'Issuing...';

        try {
            const ticket = {
                user_ic: offenderIc,
                type: type,
                location: location,
                date: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
                amount: parseFloat(amount)
            };

            await window.Database.addTicket(ticket);
            
            alert('Summons Issued Successfully');
            document.getElementById('issue-ticket-form').reset(); // Clear form

        } catch (e) {
            alert('Failed to issue summons: ' + e);
        } finally {
            btn.disabled = false;
            btn.innerText = 'Issue Summons';
        }
    },

    logout: function() {
        window.AuthController.logout();
    }
};
