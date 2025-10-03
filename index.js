const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: '🎉 ImperiumAI Backend ONLINE with CORS fixed!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
