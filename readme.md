# Discord Bot Bank

## 📜 Introduction

**Discord Bot Bank** is an engaging and interactive banking simulation bot for Discord servers, developed by **Wick® Studio**. The bot allows users to perform various financial operations such as investing, trading, gambling, buying houses and companies, and much more—all within the safety of your Discord server.

## 🚀 Features

- **Daily Salary:** Earn a daily salary based on random job titles.
- **Investment Opportunities:** Invest your money with calculated risks for potential rewards.
- **Gambling & Games:** Play games like dice and gambling with chances to win or lose big.
- **House & Company Management:** Buy, sell, and manage houses and companies to generate income.
- **Security Features:** Buy shields to protect yourself from being robbed by other users.
- **Leaderboards:** See who the richest users in the server are with the top players feature.
- **Random Luck:** Try your luck and see if you can win a random amount of money.
- **Cooldown System:** All commands have cooldowns to prevent spam and encourage strategic gameplay.

## 🛠️ Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Discord.js](https://discord.js.org/) (v14.0.0 or higher)
- [Quick.db](https://www.npmjs.com/package/quick.db)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wickstudio/discord-bot-bank.git
   cd discord-bot-bank
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   - Rename `config.example.js` to `config.js`.
   - Open `config.js` and fill in your bot token, allowed channel ID, and other settings.

4. **Run the bot:**
   ```bash
   node index.js
   ```

## 📝 Commands

| Command        | Description                                                           | Example Usage                          |
|----------------|-----------------------------------------------------------------------|----------------------------------------|
| `راتب`         | Get your daily salary.                                                | `راتب`                                 |
| `حظ`           | Try your luck to win a random amount of money.                        | `حظ`                                   |
| `استثمار`      | Invest your money with a chance to win or lose.                       | `استثمار كل`                           |
| `تداول`        | Trade money with high risks and rewards.                              | `تداول نص`                             |
| `قرض`          | Take a loan and repay it later.                                       | `قرض`                                  |
| `توب`          | Display the top players by balance.                                   | `توب`                                  |
| `نرد`          | Play a risky dice game with other users.                              | `نرد ربع`                              |
| `قمار`         | Gamble your money with various betting options.                       | `قمار كل`                              |
| `نهب`          | Attempt to rob another user.                                          | `نهب @username`                        |
| `حماية`        | Buy a shield to protect yourself from being robbed.                   | `حماية 3`                              |
| `شراء`         | Buy a house and start earning a steady income.                        | `شراء 1`                               |
| `منازل`        | List available houses for sale.                                       | `منازل`                                |
| `شركات`        | List available companies for sale.                                    | `شركات`                                |
| `شراء_شركة`    | Buy a company to generate higher income.                              | `شراء_شركة 2`                          |
| `بيع_شركة`     | Sell your company to another user.                                    | `بيع_شركة @username`                   |
| `فلوسي`        | Check your current balance.                                           | `فلوسي`                                |
| `تحويل`        | Transfer money to another user.                                       | `تحويل @username 1000`                 |
| `وقت`          | Check remaining cooldown times for your commands.                     | `وقت`                                  |
| `يومي`         | Get a daily random gift of money.                                     | `يومي`                                 |

## ⚙️ Configuration

The bot's settings are managed through the `config.js` file. Here's an overview of some key configuration options:

```javascript
module.exports = {
    token: '', // Your Discord bot token
    allowedChannelId: '', // Channel ID where the bot can be used
    cooldowns: {
        راتب: ms('1d'),
        حظ: ms('1h'),
        استثمار: ms('2h'),
        تداول: ms('2h'),
        قرض: ms('1d'),
        توب: ms('10s'),
        نرد: ms('3h'),
        قمار: ms('2h'),
        نهب: ms('2h'),
        حماية: ms('2h'),
        يومي: ms('1d'),
        شراء: ms('10s'),
        منازل: ms('10s'),
        شركات: ms('10s'),
        شراء_شركة: ms('10s'),
        بيع_شركة: ms('10s')
    },
    startingSalary: 1000, // Starting salary for new users
    investmentMultiplier: 1.2, // Multiplier for investment returns
    transferTaxRate: 0.15, // Tax rate for money transfers
    gambleMultiplier: 2.0, // Multiplier for gambling rewards
    commandsListTitle: '📜 قائمة الأوامر الخاصة بالبوت 📜', // Command list title
    commandsListDescription: 'هذه هي جميع الأوامر المتاحة في البوت:', // Command list description
    embedColor: '#00AAFF', // Embed color for bot messages
    topPlayersLimit: 6, // Number of top players to display
    topPlayersTitle: '🏆 قائمة أغنى الأشخاص بالسرفر 🏆', // Title for top players list
    topPlayersDescription: 'هؤلاء هم أغنى الأشخاص بالسرفر حسب رصيدهم الحالي:', // Description for top players list
    topPlayersEmbedColor: '#FFD700', // Embed color for top players list
    luckMinAmount: 1000, // Minimum amount for luck command
    luckMaxAmount: 5000, // Maximum amount for luck command
    shieldMaxHours: 5, // Maximum hours for shield protection
    shieldCostPerHour: 200000, // Cost per hour for shield protection
    salaryMax: 5000, // Maximum random salary
    salaryMin: 1000, // Minimum random salary
    jobTitles: ['طبيب', 'مهندس', 'معلم', 'مبرمج', 'محامي'], // Job titles for daily salary
    houses: [
        { price: 500000, income: 500000, ownerId: null },
        { price: 500000, income: 500000, ownerId: null },
        { price: 500000, income: 500000, ownerId: null },
        { price: 500000, income: 500000, ownerId: null },
        { price: 500000, income: 500000, ownerId: null }
    ]
};
```

## 🤝 Contribution

Feel free to contribute by opening issues, creating pull requests, or suggesting new features! Contributions are highly appreciated.

## 📞 Support

For support, you can join our [Discord Server](https://discord.gg/wicks) or contact us through [Wick® Studio](https://wick.studio/).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Enjoy banking and managing your finances in the virtual world! 🎉
