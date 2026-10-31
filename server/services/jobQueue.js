const IORedis = require('ioredis');

let reportingQueue = null;
let isRedisAvailable = false;

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 1) {
      return null;
    }
    return 1000;
  }
});

redisConnection.connect().then(() => {
  const { Queue, Worker } = require('bullmq');
  isRedisAvailable = true;
  reportingQueue = new Queue('reportingQueue', { connection: redisConnection });
  new Worker('reportingQueue', async (job) => {
    console.log(`[JobQueue] Processing job ${job.id}...`);
    return { success: true };
  }, { connection: redisConnection });
  console.log('[JobQueue] Redis connected successfully.');
}).catch(() => {
  console.log('[JobQueue] Redis not detected. Background queue disabled (running in local mode).');
});

redisConnection.on('error', () => {
  // Silent suppress ECONNREFUSED
});

const enqueueCSVExport = async (userId, portfolio) => {
  if (isRedisAvailable && reportingQueue) {
    try {
      const job = await reportingQueue.add('generateCSV', { userId, portfolio });
      return job.id;
    } catch (e) {
      // fallback
    }
  }
  return 'local-export-' + Date.now();
};

module.exports = {
  reportingQueue,
  enqueueCSVExport
};
