const { QuickDB } = require('quick.db');
const db = new QuickDB();

async function getHouseData() {
    let houses = await db.get('houses');
    if (!houses) {
        houses = [
            { price: 1000000, income: 200000, ownerId: null },
            { price: 1000000, income: 200000, ownerId: null },
            { price: 1000000, income: 200000, ownerId: null },
            { price: 1000000, income: 200000, ownerId: null },
            { price: 1000000, income: 200000, ownerId: null }
        ];
        await db.set('houses', houses);
    }
    return houses;
}

async function setHouseData(houses) {
    await db.set('houses', houses);
}

function startHouseIncome(userId, incomeAmount, db) {
    setInterval(async () => {
        let userBalance = await db.get(`balance_${userId}`) || 0;
        userBalance += incomeAmount;
        await db.set(`balance_${userId}`, userBalance);
    }, 10000);
}

module.exports = { getHouseData, setHouseData, startHouseIncome };
