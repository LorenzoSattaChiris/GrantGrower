const express = require("express");
const router = express.Router();

router
  .get('/', function(req, res){
    res.render("home");
  })
  .get('/signup', function(req,res){
    res.render("signup"); // Homepage
  })

module.exports = router;