/* ----- Loading Packages  ----- */
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const subdomain = require("express-subdomain");
const helmet = require("helmet");

/* ----- Initial Configuration  ----- */
const app = express();

/* ----- Packages  ----- */
app.use(logger("dev"));
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet())
app.disable('x-powered-by')

/* ----- Loading Routes  ----- */
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
app.set("views", [__dirname + "/pages", __dirname + "/app"]);
app.use(express.static(__dirname + "/public"));

/* ----- SubDomain (Dashboard)  ----- */
const router = express.Router();
app.use(subdomain("app", router));

/* ----- Loading Files  ----- */
const static = require('./routes/static/static_routes.js');
const dynamic = require('./routes/dynamic/dynamic_routes.js');

/* ----- Static Website - Not Logged ----- */
app.use("/", static);

/* ----- Dynamy Website - Logged In ----- */
router.use("/", dynamic);

/* ----- Server ----- */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};

    if (req.app.get("env") === "development") {
        // Show detailed error information for developers
        res.status(err.status || 500);
        res.json({
            error: {
                code: err.status || 500,
                name: err.name,
                message: err.message,
                stack: err.stack,
            }
        });
    } else {
        res.status(err.status || 500);
        res.render("error");
    }
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