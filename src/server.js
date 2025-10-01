const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 ImperiumAI MetaMask Backend gestart!');
  console.log(`📡 Server draait op: http://localhost:${PORT}`);
  console.log('🦊 MetaMask endpoints beschikbaar:');
  console.log(`   • Test: http://localhost:${PORT}/api/wallet/test`);
  console.log(`   • Balance: http://localhost:${PORT}/api/wallet/balance`);
  console.log(`   • Tokens: http://localhost:${PORT}/api/wallet/tokens`);
  console.log(`   • Gas: http://localhost:${PORT}/api/wallet/gas`);
  console.log('✅ Backend klaar voor MetaMask verbinding!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM ontvangen, server wordt afgesloten...');
  server.close(() => {
    console.log('✅ Server succesvol afgesloten');
    process.exit(0);
  });
});

module.exports = server;