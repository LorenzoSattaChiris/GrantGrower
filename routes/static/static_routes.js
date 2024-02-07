const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.render("index"); // Homepage
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;