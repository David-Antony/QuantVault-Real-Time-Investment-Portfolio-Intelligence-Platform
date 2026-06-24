require('dotenv').config();

const app = require('./server/app');
const { connectDB } = require('./server/config/db');

const PORT = process.env.PORT || 3002;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

start();
