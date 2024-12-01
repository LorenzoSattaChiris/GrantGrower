// grant_recommendation.js

const { grants } = require('./grant_list'); 

function getRecommendedGrants(farmerData) {
    const { location, cropType, waterAccess, grantInterest, farmSize, yearsFarming } = farmerData;

    // Define scoring logic based on farmer data
    const recommendations = grants.map(grant => {
        let score = 0;

        // Match location keywords (e.g., Exeter, South West)
        if (grant.title.toLowerCase().includes(location.toLowerCase())) score += 10;

        // Match crop type or farming type
        if (grant.title.toLowerCase().includes(cropType.toLowerCase())) score += 15;

        // Match water access-related grants
        if (waterAccess === 'yes' && grant.title.toLowerCase().includes('water')) score += 10;

        // Match farmer's specific interest
        if (grant.title.toLowerCase().includes(grantInterest.toLowerCase())) score += 20;

        // Adjust score based on farm size
        const size = parseInt(farmSize, 10);
        if (size <= 100 && grant.title.toLowerCase().includes('small')) score += 5;
        if (size > 100 && grant.title.toLowerCase().includes('large')) score += 5;

        // Adjust score based on years of farming
        const years = parseInt(yearsFarming, 10);
        if (years < 5 && grant.title.toLowerCase().includes('new')) score += 10;
        if (years >= 5 && grant.title.toLowerCase().includes('experienced')) score += 10;

        return { ...grant, score };
    });

    // Sort grants by score and return top 3
    return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

module.exports = { getRecommendedGrants };
