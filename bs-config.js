module.exports = {
    proxy: "http://localhost:3000", // Your local server
    files: [
        "css/**/*.css",              // All CSS files in the 'css' folder
        "db/**/*",                   // All files in the 'db' folder
        "Fonts/**/*",                // All files in the 'Fonts' folder
        "pages/**/*.ejs",            // All EJS files in 'pages' and subfolders
        "pages/partials/**/*.ejs",   // All EJS files in 'pages/partials'
        "javascript/**/*.js",        // All JS files in 'javascript' folder
        "app/**/*.ejs",              // All EJS files in 'app' and subfolders
        "app/partials/**/*.ejs",     // All EJS files in 'app/partials'
    ],
    port: 3001,
    notify: false,
    reloadDebounce: 300,
    watchOptions: {
        usePolling: true, // Enable polling
        interval: 100,    // Set polling interval (in ms)
    },
};
