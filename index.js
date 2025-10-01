const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuratie - BELANGRIJK voor frontend verbinding
app.use(cors({
    origin: '*', // Staat alle origins toe
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🎉 ImperiumAI Backend is ONLINE!',
        status: 'success',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api',
            tasks: '/api/tasks',
            wallet: '/api/wallet'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
    });
});

// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'ImperiumAI API v1.0',
        available_endpoints: [
            'GET /api/tasks - Haal beschikbare taken op',
            'POST /api/tasks - Maak nieuwe taak',
            'GET /api/wallet - Wallet status',
            'POST /api/wallet/withdraw - Withdraw ETH'
        ]
    });
});

// Tasks endpoints
app.get('/api/tasks', (req, res) => {
    const sampleTasks = [
        {
            id: 1,
            title: 'Data Entry Project',
            description: 'Enter customer data into spreadsheet',
            reward: '0.05 ETH',
            difficulty: 'Easy',
            estimated_time: '2 hours',
            status: 'available'
        },
        {
            id: 2,
            title: 'Website Testing',
            description: 'Test website functionality and report bugs',
            reward: '0.08 ETH',
            difficulty: 'Medium',
            estimated_time: '3 hours',
            status: 'available'
        },
        {
            id: 3,
            title: 'AI Model Training',
            description: 'Help train AI model with data labeling',
            reward: '0.12 ETH',
            difficulty: 'Hard',
            estimated_time: '5 hours',
            status: 'available'
        }
    ];

    res.json({
        success: true,
        tasks: sampleTasks,
        total: sampleTasks.length
    });
});

app.post('/api/tasks', (req, res) => {
    const { title, description, reward } = req.body;
    
    if (!title || !description || !reward) {
        return res.status(400).json({
            success: false,
            error: 'Title, description en reward zijn verplicht'
        });
    }

    const newTask = {
        id: Date.now(),
        title,
        description,
        reward,
        status: 'created',
        created_at: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Taak succesvol aangemaakt',
        task: newTask
    });
});

// Wallet endpoints
app.get('/api/wallet', (req, res) => {
    res.json({
        success: true,
        wallet: {
            address: '0x742d35Cc6634C0532925a3b8D4C9db4C4C4b4C4C',
            balance: '2.456 ETH',
            balance_usd: '$4,123.45',
            transactions: [
                {
                    id: 'tx1',
                    type: 'received',
                    amount: '0.05 ETH',
                    from: 'Task Completion',
                    timestamp: new Date().toISOString()
                },
                {
                    id: 'tx2',
                    type: 'received',
                    amount: '0.08 ETH',
                    from: 'Task Completion',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                }
            ]
        }
    });
});

app.post('/api/wallet/withdraw', (req, res) => {
    const { amount, address } = req.body;
    
    if (!amount || !address) {
        return res.status(400).json({
            success: false,
            error: 'Amount en address zijn verplicht'
        });
    }

    // Simuleer withdrawal
    res.json({
        success: true,
        message: `Withdrawal van ${amount} ETH naar ${address} is gestart`,
        transaction_id: 'tx_' + Date.now(),
        estimated_completion: '5-10 minuten'
    });
});

// AI Control endpoints
app.get('/api/ai/status', (req, res) => {
    res.json({
        success: true,
        ai_status: {
            running: true,
            mode: 'search',
            uptime: '2h 34m',
            tasks_completed: 15,
            eth_earned: '0.234 ETH',
            success_rate: '94%'
        }
    });
});

app.post('/api/ai/start', (req, res) => {
    const { mode, target_eth } = req.body;
    
    res.json({
        success: true,
        message: `AI gestart in ${mode} modus`,
        target_eth: target_eth || '0.1',
        estimated_daily_earnings: '0.05-0.15 ETH'
    });
});

app.post('/api/ai/stop', (req, res) => {
    res.json({
        success: true,
        message: 'AI succesvol gestopt',
        final_stats: {
            runtime: '3h 45m',
            tasks_completed: 8,
            eth_earned: '0.156 ETH'
        }
    });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            total_tasks_completed: 127,
            total_eth_earned: '5.678 ETH',
            success_rate: '96%',
            uptime: '99.8%',
            active_users: 1,
            last_updated: new Date().toISOString()
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint niet gevonden',
        message: `${req.method} ${req.originalUrl} bestaat niet`,
        available_endpoints: [
            'GET /',
            'GET /health',
            'GET /api',
            'GET /api/tasks',
            'POST /api/tasks',
            'GET /api/wallet',
            'POST /api/wallet/withdraw',
            'GET /api/ai/status',
            'POST /api/ai/start',
            'POST /api/ai/stop',
            'GET /api/stats'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ImperiumAI Backend running on port ${PORT}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`✅ CORS enabled for all origins`);
    console.log(`📊 Available endpoints:`);
    console.log(`   GET  / - Main endpoint`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  /api - API info`);
    console.log(`   GET  /api/tasks - Get tasks`);
    console.log(`   POST /api/tasks - Create task`);
    console.log(`   GET  /api/wallet - Wallet status`);
    console.log(`   POST /api/wallet/withdraw - Withdraw ETH`);
    console.log(`   GET  /api/ai/status - AI status`);
    console.log(`   POST /api/ai/start - Start AI`);
    console.log(`   POST /api/ai/stop - Stop AI`);
    console.log(`   GET  /api/stats - Statistics`);
});

// Export for Vercel
module.exports = app;
