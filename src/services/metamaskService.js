const { ethers } = require('ethers');
require('dotenv').config();

class MetaMaskService {
  constructor() {
    // 🦊 Eenvoudige setup met jouw wallet gegevens
    this.provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.walletAddress = process.env.WALLET_ADDRESS;
    
    console.log('🦊 MetaMask Service gestart voor wallet:', this.walletAddress);
  }

  // ✅ Haal je eigen wallet balance op
  async getMyBalance() {
    try {
      const balance = await this.provider.getBalance(this.walletAddress);
      const balanceInEth = ethers.utils.formatEther(balance);
      
      console.log(`💰 Wallet balance: ${balanceInEth} ETH`);
      
      return {
        address: this.walletAddress,
        balance: balanceInEth,
        balanceWei: balance.toString(),
        network: 'ethereum'
      };
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      throw error;
    }
  }

  // 💸 Verstuur ETH naar een ander adres
  async sendETH(toAddress, amountInEth) {
    try {
      console.log(`🚀 Versturen ${amountInEth} ETH naar ${toAddress}`);
      
      const transaction = {
        to: toAddress,
        value: ethers.utils.parseEther(amountInEth.toString()),
        gasLimit: 21000
      };

      const txResponse = await this.wallet.sendTransaction(transaction);
      console.log('📝 Transactie verstuurd:', txResponse.hash);
      
      // Wacht op bevestiging
      const receipt = await txResponse.wait();
      console.log('✅ Transactie bevestigd!');
      
      return {
        hash: txResponse.hash,
        from: this.walletAddress,
        to: toAddress,
        amount: amountInEth,
        status: 'success',
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Error sending ETH:', error);
      throw error;
    }
  }

  // 🪙 Haal token balance op (USDT, USDC, etc.)
  async getTokenBalance(tokenAddress) {
    try {
      const tokenABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await tokenContract.balanceOf(this.walletAddress);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();

      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      
      console.log(`🪙 ${symbol} balance: ${formattedBalance}`);

      return {
        symbol,
        balance: formattedBalance,
        balanceRaw: balance.toString(),
        decimals,
        contractAddress: tokenAddress
      };
    } catch (error) {
      console.error('❌ Error getting token balance:', error);
      throw error;
    }
  }

  // 🔄 Verstuur tokens (USDT, USDC, etc.)
  async sendToken(tokenAddress, toAddress, amount) {
    try {
      const tokenABI = [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, this.wallet);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      
      const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);
      
      console.log(`🔄 Versturen ${amount} ${symbol} naar ${toAddress}`);
      
      const txResponse = await tokenContract.transfer(toAddress, amountInWei);
      const receipt = await txResponse.wait();
      
      console.log('✅ Token transfer succesvol!');
      
      return {
        hash: txResponse.hash,
        from: this.walletAddress,
        to: toAddress,
        amount: amount,
        token: symbol,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error sending tokens:', error);
      throw error;
    }
  }

  // ⛽ Haal huidige gas prijzen op
  async getGasPrices() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
      
      return {
        standard: gasPriceGwei,
        fast: (parseFloat(gasPriceGwei) * 1.2).toFixed(2),
        instant: (parseFloat(gasPriceGwei) * 1.5).toFixed(2)
      };
    } catch (error) {
      console.error('❌ Error getting gas prices:', error);
      throw error;
    }
  }

  // 📊 Krijg alle wallet info in één keer
  async getWalletInfo() {
    try {
      const ethBalance = await this.getMyBalance();
      const usdtBalance = await this.getTokenBalance(process.env.USDT_CONTRACT);
      const usdcBalance = await this.getTokenBalance(process.env.USDC_CONTRACT);
      const gasPrices = await this.getGasPrices();
      
      return {
        address: this.walletAddress,
        balances: {
          ETH: ethBalance.balance,
          USDT: usdtBalance.balance,
          USDC: usdcBalance.balance
        },
        gasPrices,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting wallet info:', error);
      throw error;
    }
  }
}

module.exports = MetaMaskService;