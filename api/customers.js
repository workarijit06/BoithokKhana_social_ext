const fs = require('fs');
const path = require('path');
const { checkAuth } = require('./auth');

const DATA_DIR = path.join('/tmp', 'data'); // Uses /tmp for Vercel write permission if needed
const DATA_FILE = path.join(DATA_DIR, 'customers.json');

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
    }
    if (!fs.existsSync(DATA_FILE)) {
        try { fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8'); } catch (e) {}
    }
}

function getCustomers() {
    ensureDataFile();
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        return [];
    }
}

function saveCustomers(customers) {
    ensureDataFile();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(customers, null, 2), 'utf8');
        return true;
    } catch (err) {
        return false;
    }
}

async function parseBody(req) {
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch (err) {
                resolve({});
            }
        });
    });
}

async function handleCustomers(req, res) {
    if (req.method === 'GET') {
        if (!checkAuth(req)) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Unauthorized access. Please login.' }));
            return;
        }
        const customers = getCustomers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: customers.length, data: customers }));
        return;
    }

    if (req.method === 'POST') {
        const { name, dob, phone } = await parseBody(req);

        if (!name || !dob || !phone) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Name, birth date, and phone number are required.' }));
            return;
        }

        const customers = getCustomers();
        const newCustomer = {
            id: 'CUST-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
            name: String(name).trim(),
            dob: String(dob).trim(),
            phone: String(phone).trim(),
            registeredAt: new Date().toISOString()
        };

        customers.unshift(newCustomer);
        saveCustomers(customers);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Customer registered successfully', customer: newCustomer }));
        return;
    }
}

module.exports = handleCustomers;
module.exports.getCustomers = getCustomers;
module.exports.saveCustomers = saveCustomers;
module.exports.handleCustomers = handleCustomers;
