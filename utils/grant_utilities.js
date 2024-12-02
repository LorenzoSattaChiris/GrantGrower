const axios = require('axios'); // For HTTP requests
const cheerio = require('cheerio'); // For HTML parsing

let grants = []; // In-memory cache for grants

// Function to load grants dynamically
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

// Function to find grant by title slug
async function getGrantByTitle(slug) {
    const grants = await loadGrants(); // Ensure grants are loaded
    const formattedSlug = slug.replace(/-/g, ' ').toLowerCase(); // Convert slug back to title format
    return grants.find(grant => grant.title.toLowerCase() === formattedSlug);
}

// Function to extract information from the grant's page
async function fetchGrantDetails(link) {
    try {
        const response = await axios.get(link); // Fetch the HTML content
        const $ = cheerio.load(response.data); // Load HTML into Cheerio

        // Extract information based on selectors
        const pageTitle = $('h1').text().trim(); // Example: Extract main title
        const summary = $('meta[name="description"]').attr('content'); // Extract meta description
        const content = $('article').text().trim(); // Example: Extract main content

        // Return extracted details as a dictionary
        return {
            pageTitle,
            summary,
            content,
        };
    } catch (error) {
        console.error(`[ERROR] Failed to fetch grant details from ${link} - ${error.message}`);
        return null; // Return null if fetching fails
    }
}

module.exports = { getGrantByTitle, fetchGrantDetails };
