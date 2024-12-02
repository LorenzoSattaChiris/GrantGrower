const express = require("express");
const axios = require('axios'); // For making HTTP requests
const xml2js = require('xml2js'); // For parsing XML to JSON
const fs = require('fs');
const path = require('path');
const router = express.Router();

const { fetchAndProcessGrants } = require('../../utils/grant_fetch');
const { categorizeGrants } = require('../../utils/grant_categories');
const { getRecommendedGrants } = require('../../utils/grant_recommendation');
const { getGrantByTitle, fetchGrantDetails } = require('../../utils/grant_utilities');
const parseCookie = require('../../utils/parse_cookie');

router
  .get('/', function (req, res) {
    console.log(`[INFO] Accessed Home Page - Timestamp: ${new Date().toISOString()}`);
    res.render("home");
  })
  .get('/questions', function (req, res) {
    console.log(`[INFO] Accessed Questions Page - Timestamp: ${new Date().toISOString()}`);

    // Check for existing farm data in cookies
    const cookieData = req.cookies;
    const existingFarmData = {
      farmSize: cookieData.farmSize || "",
      location: cookieData.location || "",
      cropType: cookieData.cropType || "",
      yearsFarming: cookieData.yearsFarming || "",
      waterAccess: cookieData.waterAccess || "",
      grantInterest: cookieData.grantInterest || ""
    };

    // Check if any farm data exists
    const hasExistingData = Object.values(existingFarmData).some(val => val !== undefined);

    res.render("questions", {
      existingData: hasExistingData ? existingFarmData : null
    });
  })
  .get('/grants', function (req, res) {
    // Simply renders the grants page
    console.log(`[INFO] Accessed Grants Page - Timestamp: ${new Date().toISOString()}`);

    // Check for existing farm data in cookies
    const cookieData = req.cookies;
    const existingFarmData = {
      farmSize: cookieData.farmSize || "",
      location: cookieData.location || "",
      cropType: cookieData.cropType || "",
      yearsFarming: cookieData.yearsFarming || "",
      waterAccess: cookieData.waterAccess || "",
      grantInterest: cookieData.grantInterest || ""
    };

    // Check if any farm data exists
    const hasExistingData = Object.values(existingFarmData).some(val => val !== undefined);

    res.render("grants", {
      existingData: hasExistingData ? existingFarmData : null
    });
  })
  .get('/api/grants', async (req, res) => {
    try {
      console.log(`[INFO] Fetching grants - Timestamp: ${new Date().toISOString()}`);

      const grants = await fetchAndProcessGrants();

      let categorizedGrants;
      try {
        // Categorize grants
        categorizedGrants = categorizeGrants(grants);
      } catch (categorizationError) {
        console.error(`[ERROR] Categorizing grants failed - ${categorizationError.message}`);
        categorizedGrants = { Uncategorized: grants };
      }

      console.log(`[INFO] Categorized Grants Sent via API - Timestamp: ${new Date().toISOString()}`);
      res.json(categorizedGrants);

    } catch (error) {
      console.error(`[ERROR] Fetching grants failed - ${error.message}`);
      res.status(500).send({ error: 'Failed to fetch grants' });
    }
  })
  .get('/api/my-grants', async (req, res) => {
    try {
      const cookieData = req.headers.cookie || '';
      const parsedData = parseCookie(cookieData);

      // Await the getRecommendedGrants function
      const recommendedGrants = await getRecommendedGrants(parsedData);

      console.log(`[INFO] Sending Recommended Grants via API - Timestamp: ${new Date().toISOString()}`);

      res.json(recommendedGrants);
    } catch (error) {
      console.error(`[ERROR] Failed to fetch recommendations - ${error.message}`);
      res.status(500).send({ error: 'Failed to fetch recommendations' });
    }
  })
  .get('/apply/:grantTitle', async (req, res) => {
    try {
      const grantTitleSlug = req.params.grantTitle;
      const grant = await getGrantByTitle(grantTitleSlug); // Fetch grant by title slug

      if (!grant) {
        return res.status(404).render('404', { message: 'Grant not found' });
      }

      const grantDetails = await fetchGrantDetails(grant.link); // Fetch and parse grant details from the link

      if (!grantDetails) {
        return res.status(500).render('500', { message: 'Unable to fetch grant details' });
      }

      res.render('apply', {
        title: `Apply for ${grant.title}`,
        grant: { ...grant, ...grantDetails }, // Merge grant data with fetched details
      });
    } catch (error) {
      console.error(`[ERROR] Failed to render grant page for ${req.params.grantTitle} - ${error.message}`);
      res.status(500).render('500', { message: 'Internal Server Error' });
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