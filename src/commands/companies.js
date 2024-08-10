const { EmbedBuilder } = require('discord.js');
const companies = require('./companiesData');

module.exports = {
    name: 'شركات',
    description: 'List available companies for sale',
    async execute(message, db, config) {
        const embed = new EmbedBuilder()
            .setTitle('🏢 قائمة الشركات المتاحة للبيع 🏢')
            .setDescription('اختر شركتك الآن واستثمر للحصول على دخل ثابت!')
            .setColor('#00FF00')
            .setTimestamp();

        for (const company of companies) {
            const ownerInfo = company.owner ? `<@${company.owner}> 🔒` : 'متاح للبيع 🟢';
            embed.addFields({ name: `${company.name}`, value: `السعر: $${company.price.toLocaleString()}\nالدخل: $${company.rent.toLocaleString()} كل 10 ثواني\nالحالة: ${ownerInfo}`, inline: false });
        }

        message.reply({ embeds: [embed] });
    }
};
