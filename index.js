const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS FIX - Voeg dit toe VOOR je routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Of gebruik de cors package (beide werken)
app.use(cors({
    origin: '*',
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
        cors_enabled: true,
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
        memory: process.memoryUsage(),
        cors_working: true
    });
});

// API Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'ImperiumAI API v1.0',
        available_endpoints: [
            'GET /api/tasks - Get available tasks',
            'POST /api/tasks - Create new task',
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
            error: 'Title, description and reward are required'
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
        message: 'Task created successfully',
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
            error: 'Amount and address are required'
        });
    }

    res.json({
        success: true,
        message: `Withdrawal of ${amount} ETH to ${address} initiated`,
        transaction_id: 'tx_' + Date.now(),
        estimated_completion: '5-10 minutes'
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
        message: `AI started in ${mode} mode`,
        target_eth: target_eth || '0.1',
        estimated_daily_earnings: '0.05-0.15 ETH'
    });
});

app.post('/api/ai/stop', (req, res) => {
    res.json({
        success: true,
        message: 'AI stopped successfully',
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
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} does not exist`,
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
});

// Export for Vercel
module.exports = app;
