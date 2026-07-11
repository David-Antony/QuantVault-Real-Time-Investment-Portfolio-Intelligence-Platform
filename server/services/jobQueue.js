const { Queue, Worker } = require('bullmq');

// Create Redis connection options
const redisOptions = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  maxRetriesPerRequest: null,
};

// Create a queue for heavy reporting tasks
const reportingQueue = new Queue('reportingQueue', { connection: redisOptions });

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
}, { connection: redisOptions });

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
