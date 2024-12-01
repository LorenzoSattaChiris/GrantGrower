const express = require("express");
const axios = require('axios'); // For making HTTP requests
const xml2js = require('xml2js'); // For parsing XML to JSON
const router = express.Router();

const { categorizeGrants } = require('../../utils/grant_categories');

router
  .get('/', function (req, res) {
    console.log(`[INFO] Accessed Home Page - Timestamp: ${new Date().toISOString()}`);
    res.render("home");
  })
  .get('/questions', function (req, res) {
    console.log(`[INFO] Accessed Questions Page - Timestamp: ${new Date().toISOString()}`);
    res.render("questions");
  })
  .get('/grants', function (req, res) {
    // Simply renders the grants page
    console.log(`[INFO] Accessed Grants Page - Timestamp: ${new Date().toISOString()}`);
    res.render("grants");
  })
  .get('/api/grants', async (req, res) => {
    try {
      console.log(`[INFO] Fetching grants - Timestamp: ${new Date().toISOString()}`);
      
      const feedUrl = 'https://www.gov.uk/find-funding-for-land-or-farms.atom';
      const response = await axios.get(feedUrl);

      // Parse XML to JSON
      xml2js.parseString(response.data, { trim: true, explicitArray: false }, (err, result) => {
        if (err) {
          console.error(`[ERROR] Parsing XML failed - ${err.message}`);
          return res.status(500).send({ error: 'Failed to parse XML' });
        }

        // Extract relevant data
        const entries = result.feed.entry || [];
        const grants = entries.map(entry => ({
          title: entry.title,
          summary: entry.summary._,
          link: entry.link.$.href,
          updated: entry.updated
        }));

        console.log(`[INFO] Fetched Grants - Timestamp: ${new Date().toISOString()}`);
        // console.log(grants)

        let categorizedGrants;
        try {
          // Categorize grants
          categorizedGrants = categorizeGrants(grants);
        } catch (categorizationError) {
          console.error(`[ERROR] Categorizing grants failed - ${categorizationError.message}`);
          categorizedGrants = { Uncategorized: grants };
        }

        console.log(categorizedGrants)

        console.log(`[INFO] Categorized Grants Sent via API - Timestamp: ${new Date().toISOString()}`);
        res.json(categorizedGrants);
      });
    } catch (error) {
      console.error(`[ERROR] Fetching grants failed - ${error.message}`);
      res.status(500).send({ error: 'Failed to fetch grants' });
    }
  });

module.exports = router;

// .get('/api/grants', async (req, res) => {
//   try {
//     const feedUrl = 'https://www.gov.uk/find-funding-for-land-or-farms.atom';
//     const response = await axios.get(feedUrl);

//     // Parse XML to JSON
//     xml2js.parseString(response.data, { trim: true, explicitArray: false }, (err, result) => {
//       if (err) {
//         console.error(`[ERROR] Parsing XML failed - ${err.message}`);
//         return res.status(500).send({ error: 'Failed to parse XML' });
//       }

//       // Extract relevant data
//       const entries = result.feed.entry || [];
//       const grants = entries.map(entry => ({
//         title: entry.title,
//         summary: entry.summary._,
//         link: entry.link.$.href,
//         updated: entry.updated
//       }));

//       // Categorize grants
//       const categorizedGrants = categorizeGrants(grants);

//       console.log(`[INFO] Sending Categorized Grants via API - Timestamp: ${new Date().toISOString()}`);
//       res.json(categorizedGrants);
//     });
//   } catch (error) {
//     console.error(`[ERROR] Fetching grants failed - ${error.message}`);
//     res.status(500).send({ error: 'Failed to fetch grants' });
//   }
// });