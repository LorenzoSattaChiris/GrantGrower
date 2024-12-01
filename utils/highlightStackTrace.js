/**
 * Highlights the file path and line number in the stack trace.
 * Specifically, it wraps the "filename:line:column" part in a span with the class "error-line".
 *
 * @param {string} stack - The raw stack trace string from the error.
 * @returns {string} - The formatted stack trace with highlighted error locations.
 */
function highlightStackTrace(stack) {
    if (!stack) return "No stack trace available";

    // Escape HTML entities to prevent XSS attacks
    stack = stack
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Split the stack trace into individual lines
    const stackLines = stack.split('\n');

    // Process each line to highlight the "filename:line:column" part
    const highlightedStack = stackLines.map(line => {
        // Regular expression to capture the path and line number
        // It matches the last occurrence of '/' or '\\' to ensure cross-platform compatibility
        const regex = /(.*[\\/])([^\\/]+:\d+:\d+)/;
        const match = line.match(regex);

        if (match) {
            const beforePath = match[1]; // Part before the filename
            const fileLineCol = match[2]; // "filename:line:column"

            // Wrap the "filename:line:column" with a span for styling
            return `${beforePath}<span class="error-line">${fileLineCol}</span>`;
        }

        // If the line doesn't match the expected format, return it unmodified
        return line;
    }).join('\n');

    return highlightedStack;
}

module.exports = highlightStackTrace;
