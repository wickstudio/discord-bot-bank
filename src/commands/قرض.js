const ms = require('ms'); // تأكد من استيراد مكتبة ms إذا لم تكن مستوردة بالفعل

module.exports = {
    name: 'قرض',
    description: 'Take a loan',
    async execute(message, db, config) {
        const userId = message.author.id;
        let currentBalance = await db.get(`balance_${userId}`) || 0;
        const existingLoan = await db.get(`loan_${userId}`);

        if (existingLoan && existingLoan > 0) {
            return message.reply('لديك قرض قائم بالفعل. لا يمكنك أخذ قرض جديد حتى تسدد القرض الحالي.');
        }

        const loanAmount = 100000;
        currentBalance += loanAmount;
        await db.set(`balance_${userId}`, currentBalance);
        await db.set(`loan_${userId}`, loanAmount);

        message.reply(`تم اصدار طلب قرض بقيمة $${loanAmount.toLocaleString()} سيتم خصمه خلال ساعة`);

        setTimeout(async () => {
            let updatedBalance = await db.get(`balance_${userId}`) || 0;
            const outstandingLoan = await db.get(`loan_${userId}`); 

            if (outstandingLoan && updatedBalance >= outstandingLoan) {
                updatedBalance -= outstandingLoan;
                await db.set(`balance_${userId}`, updatedBalance);
                await db.delete(`loan_${userId}`);
                message.reply(`تم سحب مبلغ القرض بقيمة $${loanAmount.toLocaleString()} من حسابك.`);
            } else {
                message.reply(`رصيدك غير كافي لسحب القرض. يرجى زيادة رصيدك لتجنب المشاكل.`);
            }
        }, ms('1h'));
    }
};

