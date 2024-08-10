const { isInCooldown, setCooldown } = require('../utils/cooldown.js');

module.exports = {
    name: 'نهب',
    description: 'Steal a random amount of money from another user',
    async execute(message, db, config, args) {
        const thiefId = message.author.id;

        if (isInCooldown('نهب', thiefId, config)) {
            const timeLeft = isInCooldown('نهب', thiefId, config);
            return message.reply(`يرجى الانتظار ${timeLeft} قبل استخدام الأمر مرة أخرى.`);
        }

        if (args.length < 1) {
            return message.reply('يرجى الإشارة إلى المستخدم الذي تريد نهبه.');
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply('يرجى الإشارة إلى مستخدم صالح.');
        }

        const targetId = targetUser.id;

        if (thiefId === targetId) {
            return message.reply('لا يمكنك نهب نفسك!');
        }

        const shieldExpiry = await db.get(`shield_${targetId}`);
        if (shieldExpiry && shieldExpiry > Date.now()) {
            return message.reply('لا يمكنك نهب هذا المستخدم، لديهم حماية نشطة.');
        }

        let thiefBalance = await db.get(`balance_${thiefId}`) || 0;
        let targetBalance = await db.get(`balance_${targetId}`) || 0;

        if (targetBalance <= 0) {
            return message.reply('لا يمتلك هذا المستخدم رصيداً كافياً للنهب.');
        }

        const stealPercentage = Math.random() * (0.5 - 0.1) + 0.1;
        const stealAmount = Math.round(targetBalance * stealPercentage);

        thiefBalance += stealAmount;
        targetBalance -= stealAmount;

        await db.set(`balance_${thiefId}`, thiefBalance);
        await db.set(`balance_${targetId}`, targetBalance);

        setCooldown('نهب', thiefId, config.cooldowns['نهب']);

        message.reply(`لقد نهبت ${targetUser.tag} وسرقت $${stealAmount.toLocaleString()}! رصيدك الحالي هو $${thiefBalance.toLocaleString()}.`);

        try {
            await targetUser.send(`تم نهبك من قبل ${message.author.tag} وسرقت $${stealAmount.toLocaleString()}. رصيدك الحالي هو $${targetBalance.toLocaleString()}.`);
        } catch (error) {
            console.error(`Could not send DM to ${targetUser.tag}.`);
        }
    }
};
