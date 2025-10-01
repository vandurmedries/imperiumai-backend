const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware voor MetaMask
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      connectSrc: ["'self'", "https://*.infura.io", "https://*.alchemy.com", "wss://*.infura.io"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS voor MetaMask frontend
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Address']
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (voor MetaMask frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Web3 Provider Setup
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

// Routes voor MetaMask functionaliteit
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/trading', require('./routes/trading'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/transactions', require('./routes/transactions'));

// MetaMask connection endpoint
app.get('/api/connect', (req, res) => {
  res.json({ 
    message: 'MetaMask backend ready',
    chainId: '0x1', // Ethereum Mainnet
    rpcUrl: process.env.ETHEREUM_RPC_URL 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    metamask: 'Ready',
    provider: provider.connection.url 
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('MetaMask Backend Error:', err.stack);
  res.status(500).json({ 
    error: 'MetaMask backend error',
    message: err.message 
  });
});

module.exports = app;
