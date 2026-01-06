/*
 * Database Service
 * Handles SQLite interactions or falls back to simulation
 */
window.Database = {
    db: null,

    initialize: function() {
        return new Promise((resolve, reject) => {
            document.addEventListener('deviceready', () => {
                if (window.sqlitePlugin) {
                    this.db = window.sqlitePlugin.openDatabase({
                        name: 'saman.db',
                        location: 'default',
                        androidDatabaseProvider: 'system'
                    });
                    
                    this.setupTables().then(() => {
                        console.log('Database Initialized (SQLite)');
                        resolve();
                    });
                } else {
                    console.warn('SQLite not found, falling back to Mock Data');
                    resolve(); // Just resolve to simple mock mode
                }
            });
        });
    },

    setupTables: function() {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                // Tickets Table - Added user_ic
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS tickets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_ic TEXT,
                        type TEXT,
                        location TEXT,
                        date TEXT,
                        amount REAL,
                        status TEXT
                    )
                `);

                // Users Table - Added role and username support (ic column stores username for officers)
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        ic TEXT UNIQUE,
                        password TEXT,
                        name TEXT,
                        role TEXT DEFAULT 'public'
                    )
                `);

                // Receipts Table
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS receipts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        ticket_id INTEGER,
                        user_ic TEXT,
                        amount REAL,
                        payment_method TEXT,
                        payment_date TEXT
                    )
                `);

                // Check if empty and seed
                tx.executeSql('SELECT count(*) AS mycount FROM users', [], (tx, rs) => {
                    if (rs.rows.item(0).mycount == 0) {
                        this.seedData(tx);
                    }
                    resolve();
                });
            }, (error) => {
                console.error('DB Setup Error: ' + error.message);
                reject(error);
            });
        });
    },

    seedData: function(tx) {
        // Seed Public User
        tx.executeSql('INSERT INTO users (ic, password, name, role) VALUES (?,?,?,?)', 
            ['900101-14-1234', 'password123', 'Ali Bin Abu', 'public']);

        // Seed Officers
        tx.executeSql('INSERT INTO users (ic, password, name, role) VALUES (?,?,?,?)', 
            ['jpj01', 'password', 'Officer 1', 'officer']);
        tx.executeSql('INSERT INTO users (ic, password, name, role) VALUES (?,?,?,?)', 
            ['jpj02', 'password', 'Officer 2', 'officer']);

        // Seed Tickets for the Public User
        const dummyTickets = [
            ['900101-14-1234', 'Speeding Offense', 'NKVE Highway KM 14.5', '2025-10-12 14:30', 300.00, 'unpaid'],
            ['900101-14-1234', 'Illegal Parking', 'Jalan Telawi, Bangsar', '2025-09-28 09:15', 150.00, 'unpaid']
        ];

        dummyTickets.forEach(row => {
            tx.executeSql('INSERT INTO tickets (user_ic, type, location, date, amount, status) VALUES (?,?,?,?,?,?)', row);
        });
    },

    // --- User Methods ---

    loginUser: function(ic, password) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB not ready');

            this.db.executeSql('SELECT * FROM users WHERE ic = ? AND password = ?', [ic, password], (rs) => {
                if (rs.rows.length > 0) {
                    resolve(rs.rows.item(0));
                } else {
                    reject('Invalid credentials');
                }
            }, (err) => reject(err));
        });
    },

    registerUser: function(ic, password, name) {
        return new Promise((resolve, reject) => {
            if (!this.db) return resolve(); // Mock

            this.db.executeSql('INSERT INTO users (ic, password, name, role) VALUES (?,?,?,?)', [ic, password, name, 'public'], () => {
                resolve();
            }, (err) => {
                if (err.message && err.message.includes('UNIQUE')) {
                    reject('User already exists');
                } else {
                    reject(err);
                }
            });
        });
    },

    // --- Ticket & Payment Methods ---

    addTicket: function(ticket) {
        return new Promise((resolve, reject) => {
            if (!this.db) return resolve();

            this.db.executeSql(
                'INSERT INTO tickets (user_ic, type, location, date, amount, status) VALUES (?,?,?,?,?,?)',
                [ticket.user_ic, ticket.type, ticket.location, ticket.date, ticket.amount, 'unpaid'],
                () => resolve(),
                (err) => reject(err)
            );
        });
    },

    getTickets: function(user_ic) {
        return new Promise((resolve) => {
            if (!this.db) {
                resolve(window.Store.state.tickets); 
                return;
            }

            // If user_ic is provided, filter. Else return all (maybe for admin usage, though not requested yet)
            const query = user_ic ? 'SELECT * FROM tickets WHERE user_ic = ?' : 'SELECT * FROM tickets';
            const params = user_ic ? [user_ic] : [];

            this.db.executeSql(query, params, (rs) => {
                let items = [];
                for (let i = 0; i < rs.rows.length; i++) {
                    items.push(rs.rows.item(i));
                }
                resolve(items);
            }, (err) => {
                console.error(err);
                resolve([]);
            });
        });
    },

    payTicket: function(ticketId, paymentMethod, amount, userIc) {
        return new Promise((resolve, reject) => {
            if (!this.db) return resolve();

            const date = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

            this.db.transaction((tx) => {
                // 1. Update Ticket
                tx.executeSql('UPDATE tickets SET status = ? WHERE id = ?', ['paid', ticketId]);

                // 2. Add Receipt
                tx.executeSql(
                    'INSERT INTO receipts (ticket_id, user_ic, amount, payment_method, payment_date) VALUES (?,?,?,?,?)',
                    [ticketId, userIc, amount, paymentMethod, date]
                );
            }, (error) => {
                console.error('Payment Error: ' + error.message);
                reject(error);
            }, () => {
                resolve();
            });
        });
    },

    getReceipt: function(ticketId) {
        return new Promise((resolve, reject) => {
            if (!this.db) return resolve(null);

            this.db.executeSql('SELECT * FROM receipts WHERE ticket_id = ?', [ticketId], (rs) => {
                if (rs.rows.length > 0) {
                    resolve(rs.rows.item(0));
                } else {
                    resolve(null);
                }
            }, (err) => {
                console.error(err);
                reject(err);
            });
        });
    },

    updateTicketStatus: function(id, status) {
        return new Promise((resolve) => {
            if (!this.db) {
                // Mock update
                const t = window.Store.state.tickets.find(x => x.id === id);
                if (t) t.status = status;
                resolve();
                return;
            }

            this.db.executeSql('UPDATE tickets SET status = ? WHERE id = ?', [status, id], () => {
                resolve();
            });
        });
    }
};
