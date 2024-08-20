const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'منازل',
    description: 'List available houses for sale',
    async execute(message, db, config) {
        const embed = new EmbedBuilder()
            .setTitle('🏡 قائمة المنازل المتاحة للبيع 🏡')
            .setDescription('اختر منزلك الآن واستمر في الحصول على دخل ثابت كل 10 ثواني!')
            .setColor('#FFD700')
            .setTimestamp()
            .setFooter({ text: 'طلبت بواسطة: ' + message.author.tag, iconURL: message.author.displayAvatarURL() });

        for (let i = 1; i <= 5; i++) {
            const houseData = await db.get(`house_${i}`);
            const owner = houseData?.owner ? `<@${houseData.owner}>` : 'متاح للبيع';
            const status = houseData?.owner ? '🔒 تم البيع إلى ' + `<@${houseData.owner}>` : '🟢 متاح للبيع';

            embed.addFields(
                { name: `منزل #${i}`, value: `السعر: $${(houseData?.price || 500000).toLocaleString()}\nالدخل: $${(houseData?.income || 500000).toLocaleString()} كل 10 ثواني\nالحالة: ${status}`, inline: false }
            );
        }

        message.reply({ embeds: [embed] });
    }
};
