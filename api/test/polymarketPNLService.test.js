const PolymarketPNLService = require('../src/polymarketPNLService');

describe('PolymarketPNLService Tests', () => {
  let pnlService;
  const testAccount = '0x1F18593aD76aEC4FDf5a7C94dec60d25BB0a5388';

  beforeAll(() => {
    pnlService = new PolymarketPNLService();
  });

  describe('Service initialization', () => {
    test('should initialize service successfully', () => {
      expect(pnlService).toBeInstanceOf(PolymarketPNLService);
    });
  });

  describe('PNL calculations', () => {
    test('should get PNL data without initial balance', async () => {
      const pnlData = await pnlService.getTotalPNL(testAccount);
      
      expect(pnlData).toHaveProperty('address');
      expect(pnlData).toHaveProperty('totalPNL');
      expect(pnlData).toHaveProperty('totalPNLPercentage');
      expect(pnlData).toHaveProperty('firstPNLDate');
      expect(pnlData).toHaveProperty('latestPNLDate');
      expect(pnlData).toHaveProperty('dataPoints');
      
      expect(pnlData.address).toBe(testAccount);
      expect(typeof pnlData.totalPNL).toBe('number');
      expect(typeof pnlData.dataPoints).toBe('number');
      
      console.log('PNL Results:');
      console.log(`Address: ${pnlData.address}`);
      console.log(`Total Lifetime PNL: ${pnlData.totalPNL} USDC`);
      
      if (pnlData.totalPNLPercentage !== null) {
        console.log(`Total Lifetime PNL: ${pnlData.totalPNLPercentage}%`);
      }
      
      if (pnlData.estimatedInitialBalance) {
        console.log(`Estimated Initial Balance: ${pnlData.estimatedInitialBalance} USDC`);
      }
      
      console.log(`Trading Period: ${pnlData.firstPNLDate} to ${pnlData.latestPNLDate}`);
      console.log(`Data Points: ${pnlData.dataPoints}`);
      
      if (pnlData.message) {
        console.log(`Message: ${pnlData.message}`);
      }
    }, 30000);

    test('should get PNL data with initial balance', async () => {
      const initialBalance = 100;
      const pnlDataWithBalance = await pnlService.getTotalPNL(testAccount, initialBalance);
      
      expect(pnlDataWithBalance).toHaveProperty('address');
      expect(pnlDataWithBalance).toHaveProperty('totalPNL');
      expect(pnlDataWithBalance).toHaveProperty('totalPNLPercentage');
      expect(pnlDataWithBalance).toHaveProperty('initialBalance');
      expect(pnlDataWithBalance).toHaveProperty('estimatedCurrentBalance');
      
      expect(pnlDataWithBalance.address).toBe(testAccount);
      expect(pnlDataWithBalance.initialBalance).toBe(initialBalance);
      expect(typeof pnlDataWithBalance.totalPNL).toBe('number');
      expect(typeof pnlDataWithBalance.totalPNLPercentage).toBe('number');
      expect(typeof pnlDataWithBalance.estimatedCurrentBalance).toBe('number');
      
      console.log('PNL Results with Initial Balance:');
      console.log(`Address: ${pnlDataWithBalance.address}`);
      console.log(`Initial Balance: $${pnlDataWithBalance.initialBalance} USDC`);
      console.log(`Total Lifetime PNL: ${pnlDataWithBalance.totalPNL} USDC`);
      console.log(`Total Lifetime PNL: ${pnlDataWithBalance.totalPNLPercentage}%`);
      console.log(`Estimated Current Balance: ${pnlDataWithBalance.estimatedCurrentBalance} USDC`);
    }, 30000);
  });
});