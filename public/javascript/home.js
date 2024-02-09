setInterval(function () {
    if (!document.hidden) {
        location.reload();
    }
}, 100000); // <-- time in milliseconds