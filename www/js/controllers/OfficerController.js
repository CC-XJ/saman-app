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

        // Setup autocomplete for IC input
        const icInput = document.getElementById('offender-ic');
        const autocompleteDiv = document.getElementById('ic-autocomplete');
        
        if (icInput && autocompleteDiv) {
            let searchTimeout;
            
            icInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                
                // Clear previous timeout
                clearTimeout(searchTimeout);
                
                if (searchTerm.length < 2) {
                    autocompleteDiv.style.display = 'none';
                    return;
                }
                
                // Debounce search
                searchTimeout = setTimeout(async () => {
                    const results = await window.Database.searchUsers(searchTerm);
                    this.showAutocomplete(results, autocompleteDiv, icInput);
                }, 300);
            });
            
            // Hide autocomplete when clicking outside
            document.addEventListener('click', (e) => {
                if (!icInput.contains(e.target) && !autocompleteDiv.contains(e.target)) {
                    autocompleteDiv.style.display = 'none';
                }
            });
        }
    },

    showAutocomplete: function(results, container, input) {
        if (results.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = '';
        
        results.forEach(user => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 12px; cursor: pointer; border-bottom: 1px solid var(--border);';
            item.innerHTML = `
                <div style="font-weight: 600;">${user.ic}</div>
                <div style="font-size: 13px; color: var(--text-muted);">${user.name}</div>
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'var(--background)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
            
            item.addEventListener('click', () => {
                input.value = user.ic;
                container.style.display = 'none';
            });
            
            container.appendChild(item);
        });
        
        container.style.display = 'block';
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
