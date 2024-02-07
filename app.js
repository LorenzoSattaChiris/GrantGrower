/* ----- Loading Packages  ----- */
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const subdomain = require("express-subdomain");
const helmet = require("helmet");
const fs = require('fs');


/* ----- Loading Routes  ----- */
let app = express();
let router = express.Router();

app.use(subdomain("app", router));
app.set("view engine", "ejs");
app.set("views", [__dirname + "/pages", __dirname + "/app"]);
app.use(express.static(__dirname + "/public"));

app.use(logger("dev"));
app.disable('x-powered-by')
app.use((req, res, next) => {
    if (req.originalUrl.includes("/webhook") || req.headers['stripe-signature'] != null) {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(
    helmet.frameguard({
        action: "sameorigin",
    })
);
app.use(helmet.dnsPrefetchControl());
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());

require('dotenv').config({ path: 'comment.env' })

/* ----- Loading Files  ----- */
const static = require('./routes/static/static_routes.js'); 
const dynamic = require('./routes/dynamic/dynamic_routes.js'); 


/* ----- Static Website - Marketing - Not Logged ----- */
app.use("/", static);

/* ----- Dynamy Website - Dashboard - Logged In ----- */
router.use("/", dynamic);

/* ----- Server ----- */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.get("*", function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

app.use(function (req, res, next) {
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
})

app.use(function (err, req, res, next) {
    if (err.status === 404) {
        res.status(404).render("error");
    } else {
        return next();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening on: ", port);
});