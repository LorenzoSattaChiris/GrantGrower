// parseCookie.js

function parseCookie(cookieString) {
    const cookies = {};
    cookieString.split(';').forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split('=');
        cookies[name] = decodeURIComponent(rest.join('='));
    });
    // Assuming your cookie values are JSON strings
    const farmerData = JSON.parse(cookies.farmerData || '{}');
    return farmerData;
}

module.exports = parseCookie;
