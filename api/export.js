const { getCustomers } = require('./customers');
const { checkAuth } = require('./auth');

function handleExport(req, res) {
    if (!checkAuth(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized access. Please login.' }));
        return;
    }

    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        return;
    }

    const customers = getCustomers();
    // UTF-8 BOM (\uFEFF) ensures Excel correctly displays UTF-8 Bengali characters & columns
    let csv = '\uFEFFID,Name,Birth Date,Phone Number,Registration Date\n';
    customers.forEach(c => {
        const cleanName = `"${(c.name || '').replace(/"/g, '""')}"`;
        const cleanDob = `"${(c.dob || '').replace(/"/g, '""')}"`;
        // Excel phone string format to preserve formatting & leading zeros
        const cleanPhone = `="${(c.phone || '').replace(/"/g, '""')}"`;
        const regDate = c.registeredAt ? `"${new Date(c.registeredAt).toLocaleString('en-IN')}"` : '""';
        csv += `"${c.id}",${cleanName},${cleanDob},${cleanPhone},${regDate}\n`;
    });

    res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="boithok_khana_customers.csv"'
    });
    res.end(csv);
}

module.exports = handleExport;
module.exports.handleExport = handleExport;
