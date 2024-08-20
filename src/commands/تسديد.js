module.exports = {
    name: 'تسديد',
    description: 'لتسديد قرضك',
    async execute(message, db, config) {
        const userId = message.author.id;
        let currentBalance = await db.get(`balance_${userId}`) || 0;

        const outstandingLoan = await db.get(`loan_${userId}`);
        if (!outstandingLoan || outstandingLoan <= 0) {
            return message.reply('ليس لديك أي قرض مستحق للسداد.');
        }

        if (currentBalance < outstandingLoan) {
            return message.reply('ليس لديك رصيد كافي لسداد القرض.');
        }

        currentBalance -= outstandingLoan;
        await db.set(`balance_${userId}`, currentBalance);
        await db.delete(`loan_${userId}`);

        message.reply(`تم سداد قرضك بقيمة $${outstandingLoan.toLocaleString()}. رصيدك الحالي هو $${currentBalance.toLocaleString()}.`);
    }
};
