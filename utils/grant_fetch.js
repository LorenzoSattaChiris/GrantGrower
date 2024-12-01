const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

async function fetchAndProcessGrants() {
  try {
    const feedUrl = 'https://www.gov.uk/find-funding-for-land-or-farms.atom';
    const response = await axios.get(feedUrl);

    return new Promise((resolve, reject) => {
      xml2js.parseString(response.data, { trim: true, explicitArray: false }, (err, result) => {
        if (err) {
          console.error(`[ERROR] Parsing XML failed - ${err.message}`);
          reject(err);
          return;
        }

        // Extract relevant data
        const entries = result.feed.entry || [];
        const grants = entries.map(entry => ({
          title: entry.title,
          summary: entry.summary._,
          link: entry.link.$.href,
          updated: entry.updated
        }));

        // Save grants to file
        try {
          const filePath = path.join(__dirname, '..', 'routes', 'static', 'grant_list.json');
          fs.writeFileSync(filePath, JSON.stringify(grants, null, 2));
          console.log(`[INFO] grant_list.json successfully updated at ${new Date().toISOString()}`);
        } catch (error) {
          console.error(`[ERROR] Failed to write file - ${error.message}`);
        }

        resolve(grants);
      });
    });
  } catch (error) {
    console.error(`[ERROR] Fetching grants failed - ${error.message}`);
    throw error;
  }
}

module.exports = { fetchAndProcessGrants };
