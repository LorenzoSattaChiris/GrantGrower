// utils/safeGet.js
function safeGet(value, defaultValue = "Missing") {
    if (typeof value === 'undefined' || value === null) {
        return defaultValue;
    }
    return value;
}

module.exports = safeGet;