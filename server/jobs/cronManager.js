const dailyCleaningJob = require('./dailyCleaningJob');
const bookingCleanupJob = require('./bookingCleanupJob');

const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Start the jobs
    dailyCleaningJob.start();
    bookingCleanupJob.start();

    console.log('✅ Cron Jobs are scheduled and running.');
};

module.exports = initCronJobs;