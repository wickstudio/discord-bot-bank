module.exports = {
    name: 'راتب',
    description: 'Give a daily salary',
    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            const salary = Math.floor(Math.random() * config.salaryMax) + config.salaryMin;
            const newBalance = currentBalance + salary;
            await db.set(`balance_${userId}`, newBalance);
            
            const job = config.jobTitles[Math.floor(Math.random() * config.jobTitles.length)];
            message.reply(`اشعار ايداع راتب\nالوظيفه: ${job}\nالراتب: $${salary.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`);
        } catch (error) {
            console.error('Error executing راتب command:', error);
            message.reply('حدث خطأ أثناء محاولة استلام الراتب.');
        }
    }
};
