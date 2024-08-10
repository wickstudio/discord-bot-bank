const { EmbedBuilder } = require('discord.js');
const cooldownUtil = require('../utils/cooldown.js');

module.exports = {
    name: 'وقت',
    description: 'Check remaining cooldown times for your commands',
    async execute(message, db, config) {
        try {
            const userId = message.author.id;
            const commandCooldowns = Object.keys(config.cooldowns).map(command => {
                const remainingTime = cooldownUtil.getRemainingCooldown(command, userId, config);
                if (remainingTime > 0) {
                    const cooldownEndTime = new Date(Date.now() + remainingTime);
                    const formattedTime = `<t:${Math.floor(cooldownEndTime.getTime() / 1000)}:R>`;
                    return { command, timeLeft: formattedTime };
                } else {
                    return { command, timeLeft: 'متاح للاستخدام' };
                }
            });

            const embed = new EmbedBuilder()
                .setTitle('⏰ أوقات الاستخدام الخاصة بك')
                .setColor(config.embedColor || '#00aaff')
                .setDescription('هذه هي أوقات الاستخدام المتبقية لجميع الأوامر الخاصة بك:')
                .setFooter({
                    text: `طلبت بواسطة: ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

            commandCooldowns.forEach(cooldown => {
                embed.addFields({ name: cooldown.command, value: cooldown.timeLeft, inline: true });
            });

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error('Error executing وقت command:', error);
            message.reply('حدث خطأ أثناء محاولة جلب أوقات الاستخدام. يرجى المحاولة مرة أخرى.');
        }
    }
};
