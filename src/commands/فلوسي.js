module.exports = {
    name: 'فلوسي',
    description: 'Check your current balance',
    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            let currentBalance = await db.get(`balance_${userId}`) || 0;

            const responseMessage = `رصيدك الحالي هو: $${currentBalance.toLocaleString()}`;

            message.reply({
                content: responseMessage,
                allowedMentions: { repliedUser: false }
            });
        } catch (error) {
            console.error('Error fetching balance:', error);
            message.reply('حدث خطأ أثناء محاولة عرض الرصيد. يرجى المحاولة مرة أخرى.');
        }
    }
};
