const cooldowns = new Map();

function isInCooldown(commandName, userId, config) {
    try {
        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Map());
        }

        const userCooldowns = cooldowns.get(commandName);
        const expirationTime = userCooldowns.get(userId);

        if (!expirationTime) return false;

        if (Date.now() < expirationTime) {
            return true;
        } else {
            userCooldowns.delete(userId);
            return false;
        }
    } catch (error) {
        console.error(`Error checking cooldown for command ${commandName} and user ${userId}:`, error);
        return false;
    }
}

function setCooldown(commandName, userId, cooldownTime) {
    try {
        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Map());
        }

        const userCooldowns = cooldowns.get(commandName);
        const expirationTime = Date.now() + cooldownTime;
        userCooldowns.set(userId, expirationTime);
    } catch (error) {
        console.error(`Error setting cooldown for command ${commandName} and user ${userId}:`, error);
    }
}

function getRemainingCooldown(commandName, userId, config) {
    try {
        if (!cooldowns.has(commandName)) {
            return 0;
        }

        const userCooldowns = cooldowns.get(commandName);
        const expirationTime = userCooldowns.get(userId);
        
        if (!expirationTime) return 0;

        const remainingTime = expirationTime - Date.now();
        return remainingTime > 0 ? remainingTime : 0;
    } catch (error) {
        console.error(`Error getting remaining cooldown for command ${commandName} and user ${userId}:`, error);
        return 0;
    }
}

module.exports = { isInCooldown, setCooldown, getRemainingCooldown };
