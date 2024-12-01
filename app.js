/* ----- Loading Packages  ----- */
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const subdomain = require("express-subdomain");
const helmet = require("helmet");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const os = require("os"); 
const safeGet = require('./utils/safeGet'); 

/* ----- Initial Configuration  ----- */
const app = express();

/* ----- Packages  ----- */
app.use(logger("dev"));
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
dotenv.config();

/* ----- Loading Routes  ----- */
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
app.set("views", [__dirname + "/pages", __dirname + "/app"]);
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(path.join(__dirname, 'Fonts')));
app.use(express.static(__dirname + "/logos"));
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/public"));

/* ----- SubDomain (Dashboard)  ----- */
const router = express.Router();
app.use(subdomain("app", router));

/* ----- Loading Files  ----- */
const staticRoutes = require('./routes/static/static_routes.js');
const dynamicRoutes = require('./routes/dynamic/dynamic_routes.js');

/* ----- Static Website ----- */
app.use("/", staticRoutes);

/* ----- Dynamic Website ----- */
router.use("/", dynamicRoutes);

/* ----- Other Routes  ----- */
const chatgptRouter = require('./routes/utils/chatgpt.js');
app.use('/api', chatgptRouter);

/* ----- Server ----- */
// Catch-all route for 404 errors
app.use(function (req, res, next) {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

const highlightStackTrace = require('./utils/highlightStackTrace');

// ----- Updated Error-Handling Middleware -----
app.use((err, req, res, next) => {
    const env = app.get("env") || "production"; // Default to production
    const status = safeGet(err.status, 500);
    const errorMessage = safeGet(err.message, "An unexpected error occurred");
    const errorName = safeGet(err.name, "Unknown Error");
    const errorCode = safeGet(err.code, "N/A");
    const errorStack = safeGet(err.stack, "No stack trace available");

    // Prepare variables for error-dev.ejs
    const networkInfo = {
        protocol: safeGet(req.protocol, "N/A"),
        method: safeGet(req.method, "N/A"),
        url: safeGet(req.originalUrl, "N/A"),
        clientIP: safeGet(req.ip, "N/A"),
        userAgent: safeGet(req.headers["user-agent"], "N/A"),
        host: safeGet(req.headers.host, "N/A"),
        queryParams: safeGet(req.query, {}),
        body: safeGet(req.body, {}),
        headers: safeGet(req.headers, {}),
        session: safeGet(req.session, {}),
        params: safeGet(req.params, {}),
    };

    const serverInfo = {
        nodeVersion: safeGet(process.version, "N/A"),
        os: safeGet(`${os.type()} ${os.release()}`, "N/A"),
        processUptime: safeGet(`${process.uptime().toFixed(2)} seconds`, "N/A"),
        workingDirectory: safeGet(process.cwd(), "N/A"),
        memoryUsage: process.memoryUsage(),
    };

    const routeInfo = {
        path: safeGet(req.route ? req.route.path : null, "Unknown"),
        methods: safeGet(req.route ? req.route.methods : null, {}),
    };    

    const errorTimestamp = new Date().toISOString();

    // Inside the error handler:
    const formattedStack = highlightStackTrace(err.stack || "No stack trace available");
    
    const sanitizedReq = {
        protocol: req.protocol,
        method: req.method,
        originalUrl: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body,
        cookies: req.cookies,
        route: req.route ? { path: req.route.path, methods: req.route.methods } : null,
    };

    if (env === "development") {
        res.status(status).render("errors/error-dev", {
            status,
            name: errorName,
            code: errorCode,
            message: errorMessage,
            stack: errorStack,
            networkInfo,
            serverInfo, 
            formattedStack: formattedStack,
            errorTimestamp: errorTimestamp,
            routeInfo: routeInfo,
            req: sanitizedReq,
        });
    } else {
        res.status(status).render("errors/error-prod", {
            status,
            message: errorMessage, 
        });
    }
});
// ----- End of Updated Error-Handling Middleware -----

// Redirect to HTTPS
app.use(function (req, res, next) {
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
});

const port = safeGet(process.env.PORT, 3000);
app.listen(port, () => {
    console.log("Server is listening on:", port);
});
