module.exports = {
    name: 'تداول',
    description: 'Trade money with high risk and reward',
    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            if (currentBalance <= 0) {
                return message.reply('ليس لديك رصيد كافي للتداول.');
            }

            let tradingType = args[0];
            let tradingAmount;

            switch (tradingType) {
                case 'نص':
                    tradingAmount = Math.round(currentBalance / 2);
                    break;
                case 'ربع':
                    tradingAmount = Math.round(currentBalance / 4);
                    break;
                case 'كل':
                default:
                    tradingAmount = currentBalance;
                    break;
            }

            const isWin = Math.random() < 0.4;
            let multiplier = isWin ? (1 + Math.random() * 0.3) : 1 - Math.random() * 0.5;

            if (isNaN(multiplier)) {
                multiplier = 1;
            }

            const resultAmount = Math.round(tradingAmount * multiplier);
            const newBalance = currentBalance - tradingAmount + resultAmount;

            await db.set(`balance_${userId}`, newBalance);

            let messageContent;
            if (isWin) {
                messageContent = `🚀 صفقة تداول رابحة بنسبة ${Math.round((multiplier - 1) * 100)}%\nمبلغ الربح: $${resultAmount.toLocaleString()}\nرصيدك السابق: $${currentBalance.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`;
            } else {
                messageContent = `😢 القسمة تداول خاسر بنسبة ${Math.round((1 - multiplier) * 100)}%\nمبلغ الخسارة: $${Math.abs(resultAmount).toLocaleString()}\nرصيدك السابق: $${currentBalance.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`;
            }

            message.reply({
                content: messageContent,
                allowedMentions: { repliedUser: false }
            });

            console.log('Trading Amount:', tradingAmount);
            console.log('Multiplier:', multiplier);
            console.log('Result Amount:', resultAmount);
            console.log('New Balance:', newBalance);
        } catch (error) {
            console.error('Error executing trade command:', error);
            message.reply('حدث خطأ أثناء محاولة التداول. يرجى المحاولة مرة أخرى.');
        }
    }
};
