const companies = require('./companiesData');

module.exports = {
    name: 'بيع_شركة',
    description: 'Sell your company to another user',
    async execute(message, db, config, args) {
        try {
            const sellerId = message.author.id;
            const buyer = message.mentions.users.first();
            const sellAmount = parseInt(args[1]);

            if (!buyer) {
                return message.reply('يرجى تحديد المستخدم الذي تريد بيع الشركة له.');
            }

            const userCompanies = await db.get(`user_${sellerId}_companies`) || [];
            if (userCompanies.length === 0) {
                return message.reply('ليس لديك أي شركة لبيعها.');
            }

            const companyId = userCompanies[0];
            const company = companies.find(c => c.id === companyId);

            const sellPrice = sellAmount || company.price * config.companyPriceMultiplier;

            const promptMessage = await message.channel.send(
                `${buyer}, لقد عرض عليك ${message.author} شراء ${company.name} مقابل $${sellPrice.toLocaleString()}. هل تقبل؟ اكتب "نعم" للقبول أو "لا" للرفض.`
            );

            const filter = response => {
                return response.author.id === buyer.id && ['نعم', 'لا'].includes(response.content.toLowerCase());
            };

            const collector = message.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async response => {
                if (response.content.toLowerCase() === 'نعم') {
                    let buyerBalance = await db.get(`balance_${buyer.id}`) || 0;

                    if (buyerBalance < sellPrice) {
                        return message.reply('ليس لديك رصيد كافٍ لشراء هذه الشركة.');
                    }

                    buyerBalance -= sellPrice;
                    await db.set(`balance_${buyer.id}`, buyerBalance);

                    let sellerBalance = await db.get(`balance_${sellerId}`) || 0;
                    sellerBalance += sellPrice;
                    await db.set(`balance_${sellerId}`, sellerBalance);

                    await db.set(`company_${companyId}_owner`, buyer.id);
                    await db.set(`company_${companyId}_price`, sellPrice * config.companyPriceMultiplier);

                    await db.set(`user_${buyer.id}_companies`, [companyId]);
                    await db.set(`user_${sellerId}_companies`, []);

                    await message.channel.send(
                        `${buyer} قبل شراء الشركة! ${message.author} قد استلم $${sellPrice.toLocaleString()}!`
                    );
                } else if (response.content.toLowerCase() === 'لا') {
                    await message.channel.send(`${buyer} رفض شراء الشركة.`);
                }

                collector.stop();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    message.channel.send('انتهى الوقت ولم يتم الرد على العرض.');
                }
            });
        } catch (error) {
            console.error('Error in بيع_شركة command:', error);
            message.reply('حدث خطأ أثناء محاولة بيع الشركة. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    }
};
