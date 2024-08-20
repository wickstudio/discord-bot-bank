module.exports = {
    name: 'حساب',
    description: 'عرض معلومات الحساب الشخصي',
    async execute(message, db) {
        const userId = message.author.id;
        const balance = await db.get(`balance_${userId}`) || 0;
        const loanAmount = await db.get(`loan_${userId}`) || 0;
        const userCompanies = await db.get(`user_${userId}_companies`) || [];

        const companyNames = userCompanies.map(companyId => {
            const company = companies.find(c => c.id === companyId);
            return company ? company.name : 'شركة غير معروفة';
        }).join(', ');

        message.reply(`رصيدك الحالي: $${balance.toLocaleString()}\n` +
                      `مبلغ القرض: $${loanAmount.toLocaleString()}\n` +
                      `الشركات المملوكة: ${companyNames.length > 0 ? companyNames : 'لا توجد شركات'}`);
    }
};
