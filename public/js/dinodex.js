document.addEventListener('DOMContentLoaded', () => {
    const dinoGrid = document.getElementById('dinoGrid');
    const searchInput = document.getElementById('searchInput');
    const dietFilter = document.getElementById('dietFilter');
    const rarityFilter = document.getElementById('rarityFilter');

    let allDinos = [];

    // Show loading state
    dinoGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Loading dinosaurs...</p>';

    // Fetch all dinosaurs from the API
    fetchMethod('/api/dinosaurDex', (status, data) => {
        console.log('DinoDex API response:', status, data);

        if (status === 200 && Array.isArray(data)) {
            allDinos = data;
            renderDinos(allDinos);
        } else if (status === 200 && data.length === 0) {
            dinoGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">No dinosaurs in the registry yet.</p>';
        } else {
            dinoGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Failed to load dinosaurs. Please try again.</p>';
        }
    });

    function renderDinos(dinos) {
        dinoGrid.innerHTML = '';

        if (!dinos || dinos.length === 0) {
            dinoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;"><p class="text-muted">No dinosaurs found.</p></div>';
            return;
        }

        dinos.forEach(dino => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.style.textAlign = 'center';

            // Image path based on dex number
            const imgPath = `images/dinosaurs/dinosaur${dino.number}.png`;

            // Rarity color mapping
            let rarityColor = '#a0aec0';
            if (dino.rarity === 'Common') rarityColor = '#a0aec0';
            if (dino.rarity === 'Rare') rarityColor = '#4299e1';
            if (dino.rarity === 'Epic') rarityColor = '#9f7aea';
            if (dino.rarity === 'Legendary') rarityColor = '#ed8936';

            card.innerHTML = `
                <div style="height: 200px; width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; overflow: hidden; border-radius: 8px; background: rgba(0,0,0,0.2);">
                    <img src="${imgPath}" alt="${dino.name}" style="width: 160px; height: 160px; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:4rem;\\'>🦕</span>';">
                </div>
                <h3 style="margin-bottom: 0.25rem;">${dino.name}</h3>
                <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <span style="font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid ${rarityColor}; color: ${rarityColor};">
                        ${dino.rarity}
                    </span>
                    <span style="font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(255,255,255,0.1);">
                        ${dino.diet}
                    </span>
                </div>
            `;

            dinoGrid.appendChild(card);
        });
    }

    function filterDinos() {
        const searchTerm = searchInput.value.toLowerCase();
        const diet = dietFilter.value.toLowerCase();
        const rarity = rarityFilter.value;

        const filtered = allDinos.filter(dino => {
            const matchesSearch = dino.name.toLowerCase().includes(searchTerm);
            const matchesDiet = diet === '' || dino.diet.toLowerCase() === diet;
            const matchesRarity = rarity === '' || dino.rarity === rarity;
            return matchesSearch && matchesDiet && matchesRarity;
        });

        renderDinos(filtered);
    }

    searchInput.addEventListener('input', filterDinos);
    dietFilter.addEventListener('change', filterDinos);
    rarityFilter.addEventListener('change', filterDinos);
});
