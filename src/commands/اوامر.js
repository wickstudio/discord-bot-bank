const { EmbedBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
    name: 'اوامر',
    description: 'Show all available commands',
    async execute(message) {
        try {
            const embed = new EmbedBuilder()
                .setTitle(config.commandsListTitle || '📜 قائمة الأوامر الخاصة بالبوت 📜')
                .setDescription(config.commandsListDescription || 'هذه هي جميع الأوامر المتاحة في البوت:')
                .setColor(config.embedColor || '#00AAFF')
                .addFields(
                    { name: 'راتب', value: 'للحصول على الراتب اليومي الخاص بك.', inline: true },
                    { name: 'حظ', value: 'محاولة حظك وربما تكسب بعض المال.', inline: true },
                    { name: 'استثمار [كل | نص | ربع]', value: 'استثمر جزء من مالك مع فرصة للربح أو الخسارة.', inline: true },
                    { name: 'تداول [كل | نص | ربع]', value: 'تداول بأموالك مع فرصة للربح أو الخسارة.', inline: true },
                    { name: 'نرد [كل | نص | ربع]', value: 'لعب لعبة نرد مع فرصة للربح أو الخسارة.', inline: true },
                    { name: 'قمار [كل | نص | ربع | مبلغ]', value: 'قم بمقامرة أموالك مع فرصة للربح أو الخسارة.', inline: true },
                    { name: 'قرض', value: 'احصل على قرض لزيادة رصيدك.', inline: true },
                    { name: 'توب', value: 'عرض قائمة أغنى الأشخاص بالسرفر.', inline: true },
                    { name: 'فلوسي', value: 'عرض رصيدك الحالي.', inline: true },
                    { name: 'تحويل @المستخدم [المبلغ]', value: 'تحويل مبلغ معين إلى مستخدم آخر.', inline: true },
                    { name: 'نهب @المستخدم', value: 'محاولة سرقة مبلغ من مستخدم آخر.', inline: true },
                    { name: 'حماية [المدة بالساعات]', value: 'شراء حماية لمنع السرقة لفترة محددة.', inline: true },
                    { name: 'وقت', value: 'عرض أوقات التبريد المتبقية لجميع الأوامر.', inline: true }
                )
                .setFooter({ text: `طلبت بواسطة: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in اوامر command:', error);
            message.reply('حدث خطأ أثناء محاولة عرض قائمة الأوامر.');
        }
    }
};
