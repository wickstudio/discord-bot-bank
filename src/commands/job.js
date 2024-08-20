module.exports = {
    name: 'وظيفة',
    description: 'اختيار وظيفة جديدة',

    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;
            const jobName = args[0];

            if (!jobName) {
                return message.reply('يرجى تحديد الوظيفة التي ترغب في الانضمام إليها.');
            }

            const selectedJob = config.jobTitles.find(job => job.name === jobName);

            if (!selectedJob) {
                return message.reply('الوظيفة التي حددتها غير متاحة. يرجى اختيار وظيفة من القائمة.');
            }

            const currentMoney = await db.get(`money_${userId}`) || 0;
            const jobCost = selectedJob.cost;

            if (currentMoney < jobCost) {
                return message.reply(`ليس لديك مال كافٍ للحصول على وظيفة ${jobName}. تحتاج إلى ${jobCost} دولار.`);
            }

            await db.set(`job_${userId}`, selectedJob.name);
            await db.set(`salary_${userId}`, selectedJob.salary);
            await db.sub(`money_${userId}`, jobCost);

            message.reply(`تم تعيينك كـ${selectedJob.name} بنجاح! لقد تم خصم ${jobCost} دولار من حسابك وسيكون راتبك ${selectedJob.salary} دولار.`);
        } catch (error) {
            console.error('Error executing job command:', error);
            message.reply('حدث خطأ أثناء محاولة الانضمام للوظيفة.');
        }
    }
};
