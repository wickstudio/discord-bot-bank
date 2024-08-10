module.exports = {
    name: 'تحويل',
    description: 'Transfer money to another user',
    async execute(message, db, config, args) {
        if (args.length < 2) {
            return message.reply('يرجى تحديد المستخدم والمبلغ المراد تحويله.');
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply('يرجى الإشارة إلى المستخدم الذي تريد تحويل المال إليه.');
        }

        const amount = parseFloat(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('يرجى إدخال مبلغ صالح.');
        }

        const senderId = message.author.id;
        const receiverId = targetUser.id;

        try {
            let senderBalance = await db.get(`balance_${senderId}`) || 0;
            let receiverBalance = await db.get(`balance_${receiverId}`) || 0;

            if (senderBalance < amount) {
                return message.reply('ليس لديك رصيد كافي لإتمام هذه العملية.');
            }

            const taxRate = config.transferTaxRate || 0.15;
            const taxAmount = amount * taxRate;
            const finalAmount = amount - taxAmount;

            senderBalance -= amount;
            receiverBalance += finalAmount;

            await db.set(`balance_${senderId}`, senderBalance);
            await db.set(`balance_${receiverId}`, receiverBalance);

            message.reply(`تم تحويل $${amount.toLocaleString()} بنجاح إلى ${targetUser.tag}. تم خصم ضريبة بقيمة $${taxAmount.toLocaleString()}. رصيدك الحالي هو $${senderBalance.toLocaleString()}.`);

            try {
                await targetUser.send(`لقد استلمت $${finalAmount.toLocaleString()} من ${message.author.tag}. رصيدك الحالي هو $${receiverBalance.toLocaleString()}.`);
            } catch (error) {
                if (error.code === 50007) {
                    message.reply(`لا يمكن إرسال رسالة إلى ${targetUser.tag} لأن الرسائل الخاصة معطلة.`);
                } else {
                    console.error('Failed to send DM:', error);
                    message.reply('حدث خطأ أثناء محاولة إرسال رسالة خاصة إلى المستخدم.');
                }
            }

        } catch (error) {
            console.error('Error during money transfer:', error);
            return message.reply('حدث خطأ أثناء محاولة تنفيذ عملية التحويل.');
        }
    }
};
