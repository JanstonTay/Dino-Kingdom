document.addEventListener('DOMContentLoaded', () => {
    const dinoGrid = document.getElementById('dinoGrid');
    const searchInput = document.getElementById('searchInput');
    // New dropdown elements
    const dietDropdown = document.getElementById('dietDropdown');
    const dietSelected = document.getElementById('dietSelected');
    const rarityDropdown = document.getElementById('rarityDropdown');
    const raritySelected = document.getElementById('raritySelected');

    let allDinos = [];
    let currentFilters = {
        diet: '',
        rarity: ''
    };

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
                <div style="height: 240px; width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; overflow: hidden; border-radius: 8px; background: rgba(0,0,0,0.2);">
                    <img src="${imgPath}" alt="${dino.name}" style="width: 200px; height: 200px; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:4rem;\\'>🦕</span>';">
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
        const diet = currentFilters.diet.toLowerCase();
        const rarity = currentFilters.rarity;

        const filtered = allDinos.filter(dino => {
            const matchesSearch = dino.name.toLowerCase().includes(searchTerm);
            const matchesDiet = diet === '' || dino.diet.toLowerCase() === diet;
            const matchesRarity = rarity === '' || dino.rarity === rarity;
            return matchesSearch && matchesDiet && matchesRarity;
        });

        renderDinos(filtered);
    }

    // Custom Dropdown Logic
    function setupDropdown(dropdown, selectedElem, filterKey) {
        selectedElem.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.custom-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });

        const options = dropdown.querySelectorAll('.dropdown-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Update UI
                selectedElem.textContent = text;
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Update State & Filter
                currentFilters[filterKey] = value;
                dropdown.classList.remove('active');
                filterDinos();
            });
        });
    }

    setupDropdown(dietDropdown, dietSelected, 'diet');
    setupDropdown(rarityDropdown, raritySelected, 'rarity');

    // Close dropdowns on outside click
    window.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            d.classList.remove('active');
        });
    });

    searchInput.addEventListener('input', filterDinos);
});
