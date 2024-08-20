module.exports = {
    name: 'راتب',
    description: 'استلام الراتب اليومي',

    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            const currentJob = await db.get(`job_${userId}`);
            const currentSalary = await db.get(`salary_${userId}`) || config.startingSalary;
            const currentBalance = await db.get(`balance_${userId}`) || 0;

            if (!currentJob) {
                return message.reply('أنت لا تملك وظيفة حالياً. استخدم الأمر "وظيفة" لاختيار وظيفة جديدة.');
            }

            const newBalance = currentBalance + currentSalary;
            await db.set(`balance_${userId}`, newBalance);

            message.reply(`تم استلام راتبك كـ${currentJob}. تم إضافة $${currentSalary.toLocaleString()} إلى رصيدك. رصيدك الحالي: $${newBalance.toLocaleString()}.`);
        } catch (error) {
            console.error('Error executing راتب command:', error);
            message.reply('حدث خطأ أثناء محاولة استلام الراتب.');
        }
    }
};
