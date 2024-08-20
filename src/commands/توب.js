const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'توب',
    description: 'List top players by balance',
    async execute(message, db, config) {
        try {
            const balances = await db.all();

            if (!balances || balances.length === 0) {
                return message.reply('لا توجد بيانات لعرضها.');
            }

            const sortedBalances = balances
                .filter(entry => entry && entry.id && entry.id.startsWith('balance_'))
                .map(entry => ({
                    userId: entry.id.split('_')[1],
                    balance: entry.value
                }))
                .sort((a, b) => b.balance - a.balance)
                .slice(0, config.topPlayersLimit);

            if (sortedBalances.length === 0) {
                return message.reply('لا توجد بيانات لعرضها.');
            }

            const embed = new EmbedBuilder()
                .setTitle(config.topPlayersTitle)
                .setDescription(config.topPlayersDescription)
                .setColor(config.topPlayersEmbedColor)
                .setTimestamp()
                .setFooter({ text: 'طلبت بواسطة: ' + message.author.tag, iconURL: message.author.displayAvatarURL() });

            sortedBalances.forEach((entry, index) => {
                let balanceDisplay = formatBalance(entry.balance);
                embed.addFields(
                    { name: `#${index + 1}`, value: `<@${entry.userId}>`, inline: true },
                    { name: '💰 الرصيد:', value: balanceDisplay, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true }
                );
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing توب command:', error);
            message.reply('حدث خطأ أثناء محاولة عرض قائمة الأغنى.');
        }
    }
};

function formatBalance(balance) {
    if (balance >= 1e9) {
        return `${(balance / 1e9).toFixed(1)}B`; // Billions
    } else if (balance >= 1e6) {
        return `${(balance / 1e6).toFixed(1)}M`; // Millions
    } else if (balance >= 1e3) {
        return `${(balance / 1e3).toFixed(1)}K`; // Thousands
    } else {
        return `$${balance.toLocaleString()}`; // Less than thousands
    }
}
