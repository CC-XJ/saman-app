/**
 * Application State Management
 */
window.Store = {
    state: {
        history: ['auth-view'], // Keeping track, but Router now handles DOM
        tickets: [], // Will be populated from DB
        currentTicket: null,
        user: {
            name: 'Pemandu Cekap', 
            ic: '900101-14-1234'
        }
    },

    get: function(key) {
        return this.state[key];
    },

    set: function(key, value) {
        this.state[key] = value;
    }
};
