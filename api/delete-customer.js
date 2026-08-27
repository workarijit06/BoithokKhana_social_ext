const { getCustomers, saveCustomers } = require('./customers');
const { checkAuth } = require('./auth');

function handleDeleteCustomer(req, res, pathname) {
    if (!checkAuth(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized access. Please login.' }));
        return;
    }

    if (req.method !== 'DELETE') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        return;
    }

    const currentPath = pathname || req.url;
    const id = currentPath.replace('/api/delete-customer/', '').replace('/api/customers/', '').split('?')[0];
    let customers = getCustomers();
    const initialLength = customers.length;
    customers = customers.filter(c => c.id !== id);

    if (customers.length === initialLength) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Customer not found' }));
        return;
    }

    saveCustomers(customers);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Customer deleted successfully' }));
}

module.exports = (req, res) => handleDeleteCustomer(req, res, req.url);
module.exports.handleDeleteCustomer = handleDeleteCustomer;
