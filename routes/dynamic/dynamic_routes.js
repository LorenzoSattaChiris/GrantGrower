const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Hey");
    try {
        const userId = 'fe973867-3173-4064-bbfd-79282c53c072';
        const notes = await getNotesByUserId(userId);
        res.render('dashboard', { notes: notes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve notes' });
    }
});

router.get("/signup", function (req, res) {
    res.redirect("signup");
});

router.get("/settings", function (req, res) {
    res.render("settings");
});


module.exports = router;