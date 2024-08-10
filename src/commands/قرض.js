module.exports = {
    name: 'قرض',
    description: 'Take a loan',
    async execute(message, db, config) {
        const userId = message.author.id;
        let currentBalance = await db.get(`balance_${userId}`) || 0;

        const loanAmount = 100000;
        currentBalance += loanAmount;
        await db.set(`balance_${userId}`, currentBalance);

        message.reply(`تم اصدار طلب قرض بقيمة $${loanAmount.toLocaleString()} سيتم خصمه خلال ساعة`);
    }
};
