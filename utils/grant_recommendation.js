let grants = [];

async function loadGrants() {
    if (grants.length > 0) {
        return grants;
    }
    try {
        // Directly require the JSON array
        grants = require('./grant_list.json'); // Make sure the path is correct
    } catch (error) {
        console.error(`[ERROR] Failed to load grant_list - ${error.message}`);
        const { fetchAndProcessGrants } = require('./grant_fetch');
        try {
            grants = await fetchAndProcessGrants();
        } catch (fetchError) {
            console.error(`[ERROR] Failed to fetch grants - ${fetchError.message}`);
        }
    }
    return grants;
}

async function getRecommendedGrants(farmerData) {
    await loadGrants();
    if (!grants || grants.length === 0) {
        throw new Error('Grants data is not available.');
    }

    const {
        location = '',
        cropType = '',
        waterAccess = '',
        grantInterest = '',
        farmSize = '',
        yearsFarming = '',
    } = farmerData;

    // Define scoring logic based on farmer data
    const recommendations = grants.map((grant) => {
        let score = 0;

        // Match location keywords (e.g., Exeter, South West)
        if (location && grant.title.toLowerCase().includes(location.toLowerCase())) score += 10;

        // Match crop type or farming type
        if (cropType && grant.title.toLowerCase().includes(cropType.toLowerCase())) score += 15;

        // Match water access-related grants
        if (waterAccess === 'yes' && grant.title.toLowerCase().includes('water')) score += 10;

        // Match farmer's specific interest
        if (grantInterest && grant.title.toLowerCase().includes(grantInterest.toLowerCase())) score += 20;

        // Adjust score based on farm size
        const size = parseInt(farmSize, 10);
        if (!isNaN(size)) {
            if (size <= 100 && grant.title.toLowerCase().includes('small')) score += 5;
            if (size > 100 && grant.title.toLowerCase().includes('large')) score += 5;
        }

        // Adjust score based on years of farming
        const years = parseInt(yearsFarming, 10);
        if (!isNaN(years)) {
            if (years < 5 && grant.title.toLowerCase().includes('new')) score += 10;
            if (years >= 5 && grant.title.toLowerCase().includes('experienced')) score += 10;
        }

        return { ...grant, score };
    });

    // Sort grants by score and return top 3
    return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

module.exports = { getRecommendedGrants };
