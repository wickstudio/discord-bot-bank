module.exports = {
    name: 'نرد',
    description: 'Play a risky dice game',
    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            if (currentBalance <= 0) {
                return message.reply('ليس لديك رصيد كافي للعب نرد.');
            }

            let diceType = args[0];
            let betAmount;

            switch (diceType) {
                case 'نص':
                    betAmount = Math.round(currentBalance / 2);
                    break;
                case 'ربع':
                    betAmount = Math.round(currentBalance / 4);
                    break;
                case 'كل':
                default:
                    betAmount = currentBalance;
                    break;
            }

            const userChoice = Math.floor(Math.random() * 100) + 1;
            const botChoice = Math.floor(Math.random() * 100) + 1;

            let resultMessage;
            if (userChoice > botChoice) {
                const winnings = betAmount * 2;
                currentBalance += winnings;
                resultMessage = `🎉 فزت بالنرد!\nاخترت: ${userChoice}\nاخترت انا: ${botChoice}\nمبلغ الربح: $${winnings.toLocaleString()}\nرصيدك الحالي: $${currentBalance.toLocaleString()}`;
            } else {
                const lossAmount = betAmount;
                currentBalance -= lossAmount;
                resultMessage = `😢 خسرت بالنرد...\nاخترت: ${userChoice}\nاخترت انا: ${botChoice}\nمبلغ الخسارة: $${lossAmount.toLocaleString()}\nرصيدك الحالي: $${currentBalance.toLocaleString()}`;
            }

            await db.set(`balance_${userId}`, currentBalance);

            message.reply({
                content: resultMessage,
                allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            console.error('Error executing نرد command:', error);
            message.reply('حدث خطأ أثناء محاولة لعب نرد. يرجى المحاولة مرة أخرى.');
        }
    }
};
