const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

// Create Redis connection options with error handling to prevent console spam
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('[JobQueue] Redis connection failed. Background queue is disabled. Please ensure Redis is running via Docker.');
      return null; // Stop retrying
    }
    return Math.min(times * 500, 2000);
  }
});

redisConnection.on('error', (err) => {
  // Suppress ECONNREFUSED spam
  if (err.code !== 'ECONNREFUSED') {
    console.error('[JobQueue] Redis Error:', err.message);
  }
});

// Create a queue for heavy reporting tasks
const reportingQueue = new Queue('reportingQueue', { connection: redisConnection });

/**
 * Worker to process CSV generation in the background.
 * In a fully distributed system, this could run on a separate container.
 */
const reportingWorker = new Worker('reportingQueue', async (job) => {
  console.log(`[JobQueue] Processing job ${job.id} of type ${job.name}...`);
  
  if (job.name === 'generateCSV') {
    const { userId, portfolio } = job.data;
    
    // Simulate a heavy operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real scenario, this would upload to S3 and email a link.
    // For now, we just log it.
    console.log(`[JobQueue] Completed async data processing for User ${userId}`);
    return { success: true };
  }
}, { connection: redisConnection });

reportingWorker.on('completed', (job, returnvalue) => {
  console.log(`[JobQueue] Job ${job.id} completed! Result:`, returnvalue);
});

reportingWorker.on('failed', (job, err) => {
  console.error(`[JobQueue] Job ${job.id} failed with error:`, err.message);
});

/**
 * Add a CSV export job to the queue
 */
const enqueueCSVExport = async (userId, portfolio) => {
  const job = await reportingQueue.add('generateCSV', { userId, portfolio }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
  console.log(`[JobQueue] Enqueued CSV export job ${job.id} for User ${userId}`);
  return job.id;
};

module.exports = {
  reportingQueue,
  enqueueCSVExport
};
