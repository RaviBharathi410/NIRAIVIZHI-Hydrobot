require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// In-memory history storage (Last 100 points per robot)
const history = {
    '1': [],
    '2': []
};

app.get('/api/robot/:id/history', (req, res) => {
    const { id } = req.params;
    res.json(history[id] || []);
});

app.get('/api/water-quality', (req, res) => {
    const robotsList = Object.values(robots);
    if (robotsList.length === 0) return res.json({ tds: 0, ph: 7.0, turbidity: 0 });

    const avgTds = Math.round(robotsList.reduce((acc, r) => acc + parseFloat(r.telemetry.tds), 0) / robotsList.length);
    const avgPh = (robotsList.reduce((acc, r) => acc + parseFloat(r.telemetry.ph), 0) / robotsList.length).toFixed(1);
    const avgTurbidity = Math.round(robotsList.reduce((acc, r) => acc + parseFloat(r.telemetry.turbidity), 0) / robotsList.length);

    res.json({ tds: avgTds, ph: parseFloat(avgPh), turbidity: avgTurbidity, unit: 'PPM' });
});

app.get('/api/alerts', (req, res) => {
    res.json([
        { id: '1', type: 'warning', message: 'High Turbidity detected in Sector A', time: '2m ago' },
        { id: '2', type: 'danger', message: 'Critical Battery Level: HY-BOT-02', time: '5m ago' }
    ]);
});

app.get('/api/robots', (req, res) => {
    res.json(Object.values(robots).map(r => ({
        ...r,
        status: r.isOnline ? 'active' : 'offline',
        load: Math.floor(Math.random() * 40) + 20
    })));
});

const { login, verifyToken } = require('./auth');

// Internal Robot State
let robots = {
    '1': {
        id: '1',
        name: 'HY-BOT-01 (Mani)',
        isOnline: true,
        battery: 84,
        missionStatus: 'Navigating to Sector A',
        location: { latitude: 12.9716, longitude: 77.5946 },
        telemetry: { speed: 1.2, heading: 45, voltage: 12.4, temp: 28.5, ph: 7.2, turbidity: 45, tds: 250 }
    },
    '2': {
        id: '2',
        name: 'HY-BOT-02 (Ravi)',
        isOnline: true,
        battery: 12,
        missionStatus: 'Sampling Sector C',
        location: { latitude: 12.9816, longitude: 77.6046 },
        telemetry: { speed: 0.8, heading: 180, voltage: 11.2, temp: 29.1, ph: 7.1, turbidity: 12, tds: 210 }
    }
};

// Auth Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await login(email, password);
    if (result) res.json(result);
    else res.status(401).json({ error: 'Invalid credentials' });
});

// Broadcast Loop (1Hz for general status)
setInterval(() => {
    Object.keys(robots).forEach(id => {
        const robot = robots[id];

        // Simulate minor sensor noise
        robot.telemetry.ph = (parseFloat(robot.telemetry.ph) + (Math.random() - 0.5) * 0.05).toFixed(2);
        robot.telemetry.temp = (parseFloat(robot.telemetry.temp) + (Math.random() - 0.5) * 0.1).toFixed(1);

        // Simulation: GPS Drift / Movement
        if (robot.telemetry.speed > 0) {
            const rad = (robot.telemetry.heading * Math.PI) / 180;
            robot.location.latitude += (Math.cos(rad) * robot.telemetry.speed) * 0.00001;
            robot.location.longitude += (Math.sin(rad) * robot.telemetry.speed) * 0.00001;
        }

        // Composite Pollution Index (CPI) Calculation
        // Formula: CPI = (w1 * |pH - 7|) + (w2 * Turbidity) + (w3 * TDS / 100)
        // Simplified for demo: Lower is better.
        const phDev = Math.abs(parseFloat(robot.telemetry.ph) - 7.0);
        const turbidity = parseFloat(robot.telemetry.turbidity);
        const tds = parseFloat(robot.telemetry.tds);

        const cpi = (phDev * 10) + (turbidity * 0.2) + (tds * 0.05);
        robot.telemetry.pollutionIndex = Math.round(cpi);

        // Update History
        if (!history[id]) history[id] = [];
        history[id].push({
            timestamp: Date.now(),
            ph: parseFloat(robot.telemetry.ph),
            turbidity: parseFloat(robot.telemetry.turbidity),
            tds: parseFloat(robot.telemetry.tds),
            temp: parseFloat(robot.telemetry.temp),
            pollutionIndex: robot.telemetry.pollutionIndex
        });

        // Limit history to last 100 points
        if (history[id].length > 100) history[id].shift();

        io.emit('telemetry', { robotId: id, ...robot });

        // Simulate AI detection (10% chance per second)
        if (Math.random() > 0.9) {
            const types = ['PLASTIC', 'ORGANIC', 'METAL', 'CHEMICAL'];
            const type = types[Math.floor(Math.random() * types.length)];
            const confidence = 0.85 + Math.random() * 0.14;

            io.emit('detection', {
                robotId: id,
                type,
                confidence: parseFloat(confidence.toFixed(2)),
                location: { ...robot.location },
                timestamp: new Date().toISOString()
            });
        }
    });
}, 1000);

io.on('connection', (socket) => {
    console.log('Operational Link Established:', socket.id);

    socket.on('robot_command', (data) => {
        const { robotId, heading, speed, emergency_stop } = data;
        if (robots[robotId]) {
            if (emergency_stop) {
                robots[robotId].telemetry.speed = 0;
                robots[robotId].missionStatus = 'EMERGENCY HALT';
            } else {
                if (heading !== undefined) robots[robotId].telemetry.heading = heading;
                if (speed !== undefined) robots[robotId].telemetry.speed = speed;
            }
        }
    });

    socket.on('disconnect', () => console.log('Operational Link Closed'));
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Aquaguard Mission Control Gateway running on port ${PORT}`);
});
