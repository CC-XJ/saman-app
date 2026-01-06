/**
 * Application State Management
 */
const Store = {
    state: {
        history: ['auth-view'],
        tickets: [
            { id: 1, type: 'Speeding Offense (110km/h in 90km/h Zone)', location: 'NKVE Highway KM 14.5', date: '2025-10-12 14:30', amount: 300.00, status: 'unpaid' },
            { id: 2, type: 'Illegal Parking', location: 'Jalan Telawi, Bangsar', date: '2025-09-28 09:15', amount: 150.00, status: 'unpaid' },
            { id: 3, type: 'Expired Road Tax', location: 'Roadblock Sprint Highway', date: '2025-08-15 22:00', amount: 100.00, status: 'paid' },
            { id: 4, type: 'Running Red Light', location: 'Jalan Bukit Bintang', date: '2025-11-01 18:45', amount: 300.00, status: 'unpaid' }
        ],
        currentTicket: null,
        user: {
            name: 'Pemandu Cekap', // Example placeholder
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
