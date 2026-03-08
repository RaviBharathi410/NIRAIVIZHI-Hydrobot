const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'aquaguard_super_secret';

// Mock DB
const users = [
    { id: 1, email: 'admin@aquaguard.com', password: '$2b$10$TbR.tj4J4gNkIkffczDhO.LEfpnL8A5XTIx0S2JupCrG7OIbdwksG', role: 'admin' }
];

const login = async (email, password) => {
    const user = users.find(u => u.email === email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '24h' });
    return { user: { id: user.id, email: user.email, role: user.role }, token };
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { login, verifyToken };
