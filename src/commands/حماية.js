module.exports = {
    name: 'حماية',
    description: 'Buy a shield to protect yourself from being stolen',
    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;

            if (args.length < 1 || isNaN(args[0])) {
                return message.reply(`يرجى تحديد عدد الساعات التي ترغب في شراء الحماية لها (بحد أقصى ${config.shieldMaxHours} ساعات).`);
            }

            const shieldHours = parseInt(args[0]);

            if (shieldHours < 1 || shieldHours > config.shieldMaxHours) {
                return message.reply(`يمكنك شراء الحماية لمدة تتراوح بين 1 إلى ${config.shieldMaxHours} ساعات فقط.`);
            }

            const shieldCost = shieldHours * config.shieldCostPerHour;
            let userBalance = await db.get(`balance_${userId}`) || 0;

            if (userBalance < shieldCost) {
                return message.reply(`ليس لديك رصيد كافٍ لشراء الحماية لمدة ${shieldHours} ساعات. التكلفة الإجمالية هي $${shieldCost.toLocaleString()}.`);
            }

            userBalance -= shieldCost;
            await db.set(`balance_${userId}`, userBalance);

            const shieldExpiry = Date.now() + shieldHours * 60 * 60 * 1000;
            await db.set(`shield_${userId}`, shieldExpiry);

            message.reply(`لقد اشتريت حماية لمدة ${shieldHours} ساعات! لا يمكن لأي شخص نهبك حتى انتهاء مدة الحماية. رصيدك الحالي هو $${userBalance.toLocaleString()}.`);
        } catch (error) {
            console.error('Error executing حماية command:', error);
            message.reply('حدث خطأ أثناء محاولة شراء الحماية.');
        }
    }
};
