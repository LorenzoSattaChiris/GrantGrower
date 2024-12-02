document.addEventListener('DOMContentLoaded', async () => {
    // Fetch all grants
    let categorizedGrants = {};
    try {
        const response = await fetch('/api/grants');
        if (!response.ok) throw new Error('Failed to fetch grants.');
        categorizedGrants = await response.json();
    } catch (error) {
        console.error('Error loading grants:', error);
        const grantCategoriesDiv = document.getElementById('grantCategories');
        grantCategoriesDiv.innerHTML = '<p class="error">Failed to load grants. Please try again later.</p>';
        return;
    }

    // Fetch recommended grants
    let recommendedGrants = [];
    try {
        const response = await fetch('/api/my-grants');
        if (!response.ok) throw new Error('Failed to fetch recommended grants.');
        recommendedGrants = await response.json();
    } catch (error) {
        console.error('Error loading recommended grants:', error);
        // Proceed without recommended grants if there's an error
    }

    // Insert recommended grants as the first category
    if (recommendedGrants.length > 0) {
        categorizedGrants = {
            'Recommended for You': recommendedGrants,
            ...categorizedGrants
        };
    }

    const grantCategoriesDiv = document.getElementById('grantCategories');

    // Get all categories and populate the category filter dropdown
    const categories = Object.keys(categorizedGrants);
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Function to render grants
    function renderGrants(filteredGrants) {
        grantCategoriesDiv.innerHTML = ''; // Clear existing grants

        Object.keys(filteredGrants).forEach(category => {
            const grants = filteredGrants[category];
            if (grants.length === 0) return;

            // Create category heading
            const categoryHeading = document.createElement('h3');
            categoryHeading.classList.add('category-heading');
            categoryHeading.textContent = category;
            grantCategoriesDiv.appendChild(categoryHeading);

            // Create grants container
            const grantsContainer = document.createElement('div');
            grantsContainer.classList.add('grant-cards');

            grants.forEach((grant, index) => {
                const card = document.createElement('div');
                card.classList.add('grant-card');

                // If the category is 'Recommended for You', add a special class
                if (category === 'Recommended for You') {
                    card.classList.add('recommended-grant-card');
                }

                card.innerHTML = `
                    <h4 class="grant-title">${grant.title}</h4>
                    <p class="grant-info"><strong>Updated:</strong> ${new Date(grant.updated).toLocaleDateString()}</p>
                    <div class="button-row">
                    <button class="btn primary-btn" onclick="location.href='/apply/${encodeURIComponent(grant.title.replace(/\s+/g, '-').toLowerCase())}'">Apply Now</button>
                        <button class="btn secondary-btn" onclick="window.open('${grant.link}', '_blank')">Official Page</button>
                    </div>
                `;
                grantsContainer.appendChild(card);

                // Add animation delay
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100); // Stagger animations by 100ms
            });

            grantCategoriesDiv.appendChild(grantsContainer);
        });
    }

    // Initial render
    renderGrants(categorizedGrants);

    // Live Search and Filtering
    const searchBar = document.getElementById('searchBar');

    function filterGrants() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filteredGrants = {};

        Object.keys(categorizedGrants).forEach(category => {
            if (selectedCategory !== 'All' && category !== selectedCategory) {
                return;
            }
            const grants = categorizedGrants[category].filter(grant => {
                return grant.title.toLowerCase().includes(searchTerm);
            });
            if (grants.length > 0) {
                filteredGrants[category] = grants;
            }
        });

        renderGrants(filteredGrants);
    }

    searchBar.addEventListener('input', () => {
        filterGrants();
    });

    categoryFilter.addEventListener('change', () => {
        filterGrants();
    });

    // Handle email subscription
    const notificationForm = document.getElementById('notification-form');
    notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        // Save email for notifications
        alert('Coming Soon...');
        // fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // }).then(res => {
        //     if (res.ok) alert('Subscribed successfully!');
        //     else alert('Subscription failed. Try again.');
        // });
    });
});

// Support functions
function openChat() {
    alert('Coming Soon...');
    // window.open('https://chat.example.com');
}

function callSupport() {
    alert('Coming Soon...');
    // window.location.href = 'tel:+18001234567';
}
