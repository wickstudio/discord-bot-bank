const userIncomeProcesses = {};

module.exports = {
    name: 'شراء',
    description: 'Buy a house',
    async execute(message, db, config, args) {
        try {
            const houseNumber = parseInt(args[0]);

            if (!houseNumber || isNaN(houseNumber) || houseNumber < 1 || houseNumber > 5) {
                return message.reply('يرجى اختيار رقم منزل صحيح بين 1 و 5.');
            }

            const userId = message.author.id;

            for (let i = 1; i <= 5; i++) {
                const houseKey = `house_${i}`;
                let houseData = await db.get(houseKey);
                if (houseData && houseData.owner === userId) {
                    return message.reply('لا يمكنك شراء أكثر من منزل واحد.');
                }
            }

            const houseKey = `house_${houseNumber}`;
            let houseData = await db.get(houseKey);

            if (!houseData) {
                houseData = {
                    price: config.houses[houseNumber - 1].price,
                    income: config.houses[houseNumber - 1].income,
                    owner: null
                };
                await db.set(houseKey, houseData);
            }

            const userBalance = await db.get(`balance_${userId}`) || 0;

            if (userBalance < houseData.price) {
                return message.reply('ليس لديك رصيد كافي لشراء هذا المنزل.');
            }

            await db.set(`balance_${userId}`, userBalance - houseData.price);

            if (houseData.owner && userIncomeProcesses[houseData.owner]) {
                clearInterval(userIncomeProcesses[houseData.owner]);
                delete userIncomeProcesses[houseData.owner];
            }

            houseData.owner = userId;
            houseData.price *= 2;
            houseData.income *= 2;
            await db.set(houseKey, houseData);

            startIncomeProcess(userId, houseData.income, db, config);

            return message.reply(`تم شراء المنزل #${houseNumber} بنجاح! الآن ستحصل على دخل قدره $${houseData.income.toLocaleString()} كل 10 ساعات.`);
        } catch (error) {
            console.error('Error executing شراء command:', error);
            message.reply('حدث خطأ أثناء محاولة شراء المنزل. يرجى المحاولة مرة أخرى.');
        }
    }
};

function startIncomeProcess(userId, income, db, config) {
    if (userIncomeProcesses[userId]) {
        clearInterval(userIncomeProcesses[userId]);
    }

    userIncomeProcesses[userId] = setInterval(async () => {
        try {
            let userBalance = await db.get(`balance_${userId}`) || 0;
            userBalance += income;
            await db.set(`balance_${userId}`, userBalance);
        } catch (error) {
            console.error(`Error adding income for user ${userId}:`, error);
        }
    }, config.houseIncomeInterval || 10 * 60 * 60 * 1000);
}
