const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Arijitboithok26';

const activeTokens = new Set();

function generateToken() {
    const token = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeTokens.add(token);
    return token;
}

function verifyToken(token) {
    if (!token) return false;
    const cleanToken = token.replace('Bearer ', '').trim();
    return activeTokens.has(cleanToken);
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

async function handleLogin(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        return;
    }

    const { username, password } = await parseBody(req);

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = generateToken();
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax`
        });
        res.end(JSON.stringify({ success: true, message: 'Login successful', token }));
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
    }
}

function checkAuth(req) {
    const authHeader = req.headers['authorization'];
    if (authHeader && verifyToken(authHeader)) {
        return true;
    }

    const cookies = req.headers['cookie'];
    if (cookies) {
        const match = cookies.match(/admin_token=([^;]+)/);
        if (match && verifyToken(match[1])) {
            return true;
        }
    }

    return false;
}

module.exports = { handleLogin, checkAuth, verifyToken };
