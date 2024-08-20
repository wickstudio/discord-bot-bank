const companies = require('./companiesData');

module.exports = {
    name: 'شراء_شركة',
    description: 'Buy a company',
    async execute(message, db, config, args) {
        try {
            const userId = message.author.id;
            let userBalance = await db.get(`balance_${userId}`) || 0;

            const companyId = parseInt(args[0]);
            if (isNaN(companyId)) {
                return message.reply('يرجى تحديد رقم صحيح للشركة.');
            }

            const company = companies.find(c => c.id === companyId);
            if (!company) {
                return message.reply('هذه الشركة غير موجودة.');
            }

            const companyOwner = await db.get(`company_${companyId}_owner`);
            if (companyOwner) {
                return message.reply('هذه الشركة مملوكة بالفعل.');
            }

            const userCompanies = await db.get(`user_${userId}_companies`) || [];
            if (userCompanies.length > 0) {
                return message.reply('لا يمكنك شراء أكثر من شركة واحدة.');
            }

            if (userBalance < company.price) {
                return message.reply('ليس لديك رصيد كافٍ لشراء هذه الشركة.');
            }

            userBalance -= company.price;
            await db.set(`balance_${userId}`, userBalance);
            await db.set(`company_${companyId}_owner`, userId);
            await db.set(`company_${companyId}_price`, company.price * config.companyPriceMultiplier || 2);
            userCompanies.push(companyId);
            await db.set(`user_${userId}_companies`, userCompanies);

            message.reply(`لقد قمت بشراء ${company.name} مقابل $${company.price.toLocaleString()}! رصيدك الحالي هو $${userBalance.toLocaleString()}.`);

            setInterval(async () => {
                try {
                    let currentBalance = await db.get(`balance_${userId}`) || 0;
                    currentBalance += company.rent;
                    await db.set(`balance_${userId}`, currentBalance);
                } catch (error) {
                    console.error('Error updating rent:', error);
                }
            }, config.rentInterval || 10 * 60 * 60 * 1000);
        } catch (error) {
            console.error('Error in شراء_شركة command:', error);
            message.reply('حدث خطأ أثناء تنفيذ الأمر.');
        }
    }
};
