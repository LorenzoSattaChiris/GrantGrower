document.addEventListener('DOMContentLoaded', async () => {
    const grantCards = document.getElementById('grantCards');
    try {
        const response = await fetch('/api/grants');
        if (!response.ok) throw new Error('Failed to fetch grants.');
        const grants = await response.json();

        // Populate grant cards
        grants.forEach(grant => {
            const card = document.createElement('div');
            card.classList.add('grant-card');
            card.innerHTML = `
                <h3 class="grant-title">${grant.title}</h3>
                <p class="grant-summary">${grant.summary}</p>
                <p class="grant-info"><strong>Updated:</strong> ${new Date(grant.updated).toLocaleDateString()}</p>
                <div class="button-row">
                    <button class="btn primary-btn" onclick="location.href='/application-template'">Apply Now</button>
                    <button class="btn secondary-btn" onclick="window.open('https://example.com', '_blank')">Official Grant Page</button>
                </div>
            `;
            grantCards.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading grants:', error);
        grantCards.innerHTML = '<p class="error">Failed to load grants. Please try again later.</p>';
    }
});
