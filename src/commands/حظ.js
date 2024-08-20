module.exports = {
    name: 'حظ',
    description: 'Give a random luck amount',
    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            const luckAmount = Math.floor(Math.random() * config.luckMaxAmount) + config.luckMinAmount;
            const newBalance = currentBalance + luckAmount;
            await db.set(`balance_${userId}`, newBalance);

            message.reply(`حظك هالوقت\nالمبلغ: $${luckAmount.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`);
        } catch (error) {
            console.error('Error executing حظ command:', error);
            message.reply('حدث خطأ أثناء محاولة حساب حظك.');
        }
    }
};
