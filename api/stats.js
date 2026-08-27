const { getCustomers } = require('./customers');
const { checkAuth } = require('./auth');

function handleStats(req, res) {
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
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;

    const registeredToday = customers.filter(c => c.registeredAt && c.registeredAt.startsWith(today)).length;
    const birthdaysThisMonth = customers.filter(c => {
        if (!c.dob) return false;
        const month = parseInt(c.dob.split('-')[1], 10);
        return month === currentMonth;
    }).length;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: true,
        stats: {
            totalCustomers: customers.length,
            todayRegistrations: registeredToday,
            birthdaysThisMonth: birthdaysThisMonth
        }
    }));
}

module.exports = handleStats;
module.exports.handleStats = handleStats;
