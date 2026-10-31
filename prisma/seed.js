const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding QuantVault database...');

  const demoEmail = 'demo@quantvault.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail }
  });

  if (existingUser) {
    console.log(`Demo user already exists (${demoEmail}). Skipping seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const demoUser = await prisma.user.create({
    data: {
      username: 'DemoTrader',
      email: demoEmail,
      passwordHash,
      role: 'USER',
      portfolio: {
        create: {
          name: 'Growth & Tech Portfolio',
          cashBalance: 34066.00,
          assets: {
            create: [
              {
                name: 'AAPL',
                type: 'Stock',
                currentPrice: 195.50,
                quantity: 45,
                averageCost: 178.20,
                totalInvested: 8019.00
              },
              {
                name: 'NVDA',
                type: 'Stock',
                currentPrice: 132.80,
                quantity: 80,
                averageCost: 105.50,
                totalInvested: 8440.00
              },
              {
                name: 'MSFT',
                type: 'Stock',
                currentPrice: 442.10,
                quantity: 25,
                averageCost: 412.00,
                totalInvested: 10300.00
              },
              {
                name: 'BTC',
                type: 'Crypto',
                currentPrice: 66800.00,
                quantity: 0.45,
                averageCost: 59500.00,
                totalInvested: 26775.00
              },
              {
                name: 'ETH',
                type: 'Crypto',
                currentPrice: 3450.00,
                quantity: 4.0,
                averageCost: 3100.00,
                totalInvested: 12400.00
              }
            ]
          },
          transactions: {
            create: [
              {
                assetName: 'AAPL',
                type: 'BUY',
                amount: 8019.00,
                price: 178.20,
                quantity: 45,
                status: 'completed',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
              },
              {
                assetName: 'NVDA',
                type: 'BUY',
                amount: 8440.00,
                price: 105.50,
                quantity: 80,
                status: 'completed',
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
              },
              {
                assetName: 'BTC',
                type: 'BUY',
                amount: 26775.00,
                price: 59500.00,
                quantity: 0.45,
                status: 'completed',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              },
              {
                assetName: 'MSFT',
                type: 'BUY',
                amount: 10300.00,
                price: 412.00,
                quantity: 25,
                status: 'completed',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
              },
              {
                assetName: 'ETH',
                type: 'BUY',
                amount: 12400.00,
                price: 3100.00,
                quantity: 4.0,
                status: 'completed',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        }
      },
      watchlistItems: {
        create: [
          { symbol: 'TSLA', name: 'Tesla Inc', targetPrice: 250.00, notes: 'Watch for breakout above $250' },
          { symbol: 'AMZN', name: 'Amazon.com Inc', targetPrice: 190.00, notes: 'Q3 earnings watch' },
          { symbol: 'SOL', name: 'Solana', targetPrice: 180.00, notes: 'DeFi volume surge' }
        ]
      },
      priceAlerts: {
        create: [
          { assetName: 'NVDA', condition: 'ABOVE', targetPrice: 140.00, isActive: true },
          { assetName: 'BTC', condition: 'BELOW', targetPrice: 65000.00, isActive: true }
        ]
      }
    }
  });

  console.log(`Demo user created successfully:`);
  console.log(`Email:    ${demoUser.email}`);
  console.log(`Password: Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
