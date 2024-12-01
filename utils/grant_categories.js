// grant_categories.js

function categorizeGrants(grants) {
    // Define the categories and associated keywords
    const categories = [
        {
            name: 'Soil Management',
            keywords: ['soil', 'till', 'no-till']
        },
        {
            name: 'Organic Farming',
            keywords: ['organic']
        },
        {
            name: 'Horticulture and Crops',
            keywords: ['horticulture', 'horticultural', 'crop', 'cereal', 'arable', 'maize']
        },
        {
            name: 'Forestry and Woodland',
            keywords: ['forest', 'forestry', 'woodland']
        },
        {
            name: 'Wildlife and Biodiversity',
            keywords: ['bird', 'wildlife', 'habitat', 'scrub', 'mosaic', 'skylark', 'lapwing', 'species-rich']
        },
        {
            name: 'Water Management',
            keywords: ['water', 'pond', 'watercourse']
        },
        {
            name: 'Grassland and Grazing',
            keywords: ['grassland', 'grass', 'grazing', 'pasture', 'leys']
        },
        {
            name: 'Historic and Archaeological Features',
            keywords: ['historic', 'archaeological']
        },
        {
            name: 'Pest Management',
            keywords: ['pest', 'insecticide', 'integrated pest management', 'CIPM']
        },
        {
            name: 'Nutrient Management',
            keywords: ['nutrient', 'legume']
        }
    ];

    const categorizedGrants = {};

    // Initialize the categories in the result object
    categories.forEach(category => {
        categorizedGrants[category.name] = [];
    });

    // Add an 'Uncategorized' category
    categorizedGrants['Uncategorized'] = [];

    // For each grant, check which category it belongs to
    grants.forEach(grant => {
        const title = grant.title.toLowerCase();
        let matched = false;

        for (let category of categories) {
            for (let keyword of category.keywords) {
                if (title.includes(keyword.toLowerCase())) {
                    categorizedGrants[category.name].push(grant);
                    matched = true;
                    break; // Stop checking keywords for this category
                }
            }
            if (matched) {
                break; // Stop checking categories once a match is found
            }
        }

        if (!matched) {
            categorizedGrants['Uncategorized'].push(grant);
        }
    });

    return categorizedGrants;
}

module.exports = {
    categorizeGrants
};
