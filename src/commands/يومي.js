module.exports = {
    name: 'يومي',
    description: 'Get a daily random gift of money',
    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            const cooldownKey = `cooldown_daily_${userId}`;
            const lastUsed = await db.get(cooldownKey);
            const now = Date.now();

            if (lastUsed && (now - lastUsed) < config.cooldowns['يومي']) {
                const remainingTime = config.cooldowns['يومي'] - (now - lastUsed);
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                return message.reply(`يرجى الانتظار قبل الحصول على الهدية اليومية مرة أخرى. الوقت المتبقي: ${hours} ساعات و ${minutes} دقائق.`);
            }

            const giftAmount = Math.floor(Math.random() * 5000) + 1000;
            let userBalance = await db.get(`balance_${userId}`) || 0;
            userBalance += giftAmount;

            await db.set(`balance_${userId}`, userBalance);
            await db.set(cooldownKey, now);

            message.reply(`🎁 لقد حصلت على هدية يومية بقيمة $${giftAmount.toLocaleString()}! رصيدك الحالي هو $${userBalance.toLocaleString()}.`);
        } catch (error) {
            console.error('Error executing يومي command:', error);
            message.reply('حدث خطأ أثناء محاولة الحصول على الهدية اليومية. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    }
};
