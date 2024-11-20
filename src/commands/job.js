// Update By Ghlais

module.exports = {
    name: 'وظيفة',
    description: 'اختيار وظيفة جديدة',

    async execute(message, db, config, args) {
        const userId = message.author.id;

        let currentBalance = await db.get(`balance_${userId}`) || 0;

        if (currentBalance <= 0) {
            return message.reply('ليس لديك رصيد كافٍ للقيام بأي عملية.');
        }

        if (!args[0]) {
            const jobList = config.jobTitles.map(job => `- ${job.name}: ${job.cost} دولار`).join('\n');
            return message.reply(`يرجى اختيار وظيفة من القائمة التالية:\n${jobList}`);
        }

        const jobName = args[0];
        const selectedJob = config.jobTitles.find(job => job.name === jobName);

        if (!selectedJob) {
            return message.reply('الوظيفة التي حددتها غير متاحة. يرجى اختيار وظيفة من القائمة.');
        }

        const jobCost = selectedJob.cost;

        if (currentBalance < jobCost) {
            return message.reply(`ليس لديك مال كافٍ للحصول على وظيفة ${jobName}. تحتاج إلى ${jobCost} دولار.`);
        }

        const newBalance = currentBalance - jobCost;
        await db.set(`balance_${userId}`, newBalance);
        await db.set(`job_${userId}`, selectedJob.name);
        await db.set(`salary_${userId}`, selectedJob.salary);

        return message.reply(`تهانينا! لقد حصلت على وظيفة ${jobName}. راتبك الجديد هو ${selectedJob.salary} دولار.`);
    }
};
