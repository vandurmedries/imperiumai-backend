const express = require('express');
const router = express.Router();
const MetaMaskService = require('../services/metamaskService');

// Maak MetaMask service instance
const metamaskService = new MetaMaskService();

// 🦊 Test je wallet verbinding
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing wallet connection...');
    const walletInfo = await metamaskService.getWalletInfo();
    
    res.json({
      success: true,
      message: '🦊 MetaMask wallet succesvol verbonden!',
      data: walletInfo
    });
  } catch (error) {
    console.error('❌ Wallet test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Wallet test mislukt',
      error: error.message
    });
  }
});

// 💰 Haal wallet balance op
router.get('/balance', async (req, res) => {
  try {
    const balance = await metamaskService.getMyBalance();
    res.json({ success: true, data: balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🪙 Haal token balances op
router.get('/tokens', async (req, res) => {
  try {
    const usdt = await metamaskService.getTokenBalance(process.env.USDT_CONTRACT);
    const usdc = await metamaskService.getTokenBalance(process.env.USDC_CONTRACT);
    
    res.json({
      success: true,
      data: { usdt, usdc }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 💸 Verstuur ETH (POST request)
router.post('/send-eth', async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    
    if (!toAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: 'toAddress en amount zijn verplicht'
      });
    }
    
    const result = await metamaskService.sendETH(toAddress, amount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ⛽ Gas prijzen
router.get('/gas', async (req, res) => {
  try {
    const gasPrices = await metamaskService.getGasPrices();
    res.json({ success: true, data: gasPrices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
