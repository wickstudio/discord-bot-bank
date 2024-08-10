module.exports = {
    name: 'قمار',
    description: 'Gamble with your balance with options for full, half, quarter, or set amount',
    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            if (currentBalance <= 0) {
                return message.reply('ليس لديك رصيد كافي للقمار.');
            }

            let betAmount;
            let gambleType = args[0];

            if (!isNaN(gambleType)) {
                betAmount = parseInt(gambleType, 10);
                if (betAmount > currentBalance) {
                    return message.reply('ليس لديك رصيد كافي للمبلغ الذي اخترته.');
                }
            } else {
                switch (gambleType) {
                    case 'نص':
                        betAmount = Math.round(currentBalance / 2);
                        break;
                    case 'ربع':
                        betAmount = Math.round(currentBalance / 4);
                        break;
                    case 'كل':
                        betAmount = currentBalance;
                        break;
                    default:
                        return message.reply('يرجى تحديد مبلغ صحيح (كل، نص، ربع، أو تحديد مبلغ معين).');
                }
            }

            const isWin = Math.random() < 0.5;
            const multiplier = isWin ? config.gambleMultiplier : 1 - Math.random() * 0.3;
            const resultAmount = Math.round(betAmount * multiplier);
            const newBalance = isWin ? currentBalance + (resultAmount - betAmount) : currentBalance - (betAmount - resultAmount);

            await db.set(`balance_${userId}`, newBalance);

            let messageContent;
            if (isWin) {
                messageContent = `🎉 القمار نجح بنسبة ${Math.round((multiplier - 1) * 100)}%\nمبلغ الربح: $${resultAmount.toLocaleString()}\nرصيدك السابق: $${currentBalance.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`;
            } else {
                messageContent = `😢 القمار خاسر بنسبة ${Math.round((1 - multiplier) * 100)}%\nمبلغ الخسارة: $${Math.abs(betAmount - resultAmount).toLocaleString()}\nرصيدك السابق: $${currentBalance.toLocaleString()}\nرصيدك الحالي: $${newBalance.toLocaleString()}`;
            }

            message.reply({
                content: messageContent,
                allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            console.error('Error executing gamble command:', error);
            message.reply('حدث خطأ أثناء محاولة تنفيذ القمار. يرجى المحاولة مرة أخرى.');
        }
    }
};
