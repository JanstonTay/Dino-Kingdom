document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const inventoryGrid = document.getElementById('inventoryGrid');

    // Hatching modal elements
    const hatchModal = document.getElementById('hatchModal');
    const hatchEggImg = document.getElementById('hatchEggImg');
    const hatchInstruction = document.getElementById('hatchInstruction');
    const clickCounter = document.getElementById('clickCounter');
    const hatchContent = document.getElementById('hatchContent');
    const hatchResult = document.getElementById('hatchResult');
    const dinosaurResultImg = document.getElementById('dinosaurResultImg');
    const dinosaurName = document.getElementById('dinosaurName');
    const dinosaurInfo = document.getElementById('dinosaurInfo');
    const closeHatchBtn = document.getElementById('closeHatchBtn');

    // Image mappings
    const foodImages = {
        'Raw Meat': 'images/food/rawMeat.png',
        'Fresh Fish': 'images/food/freshFish.png',
        'Prime Steak': 'images/food/primeSteak.png',
        'Leafy Green': 'images/food/leafyGreen.png',
        'Ancient Fern': 'images/food/ancientFern.png',
        'Fruit Mix': 'images/food/fruitMix.png'
    };

    let currentTab = 'eggs';
    let hatchClickCount = 0;
    let currentHatchEgg = null;

    // Auth check
    if (!userId || !token) {
        inventoryGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Please <a href="login.html" style="color: var(--primary-color);">login</a> to view your inventory.</p>';
        return;
    }

    // Initial load
    loadInventory('eggs');

    window.switchTab = (tab) => {
        currentTab = tab;

        document.getElementById('eggTab').classList.toggle('btn-primary', tab === 'eggs');
        document.getElementById('eggTab').classList.toggle('btn-outline', tab !== 'eggs');
        document.getElementById('foodTab').classList.toggle('btn-primary', tab === 'food');
        document.getElementById('foodTab').classList.toggle('btn-outline', tab !== 'food');

        loadInventory(tab);
    };

    window.switchTab('eggs');

    function loadInventory(type) {
        inventoryGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Loading...</p>';

        const endpoint = type === 'eggs'
            ? `/api/userEggInventory/user/${userId}`
            : `/api/userFoodInventory/user/${userId}`;

        fetchMethod(endpoint, (status, items) => {
            console.log('Inventory response:', status, items);

            if (status === 200) {
                renderInventory(items, type);
            } else {
                inventoryGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">Failed to load inventory.</p>';
            }
        });
    }

    function renderInventory(items, type) {
        inventoryGrid.innerHTML = '';

        // Filter items with quantity > 0
        const availableItems = items.filter(item => item.quantity > 0);

        if (!availableItems || availableItems.length === 0) {
            inventoryGrid.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1;">Your ${type} inventory is empty. Visit the <a href="shop.html" style="color: var(--primary-color);">Shop</a> to buy some!</p>`;
            return;
        }

        availableItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.style.textAlign = 'center';

            let imgSrc = '';
            let actionBtn = '';

            if (type === 'eggs') {
                const rarityLower = (item.rarity || 'common').toLowerCase();
                imgSrc = `images/eggs/${rarityLower}Egg1.png`;
                actionBtn = `<button class="btn btn-primary hatch-btn" data-egg-type-id="${item.egg_type_id}" data-rarity="${item.rarity}" data-name="${item.name}">Hatch</button>`;
            } else {
                imgSrc = foodImages[item.name] || '';
            }

            // Rarity color
            let rarityColor = '#a0aec0';
            if (item.rarity === 'Rare') rarityColor = '#4299e1';
            if (item.rarity === 'Epic') rarityColor = '#9f7aea';
            if (item.rarity === 'Legendary') rarityColor = '#ed8936';

            card.innerHTML = `
                <div style="height: 150px; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem;">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${item.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '<span style="font-size:3rem;">🍖</span>'}
                </div>
                <h3>${item.name || 'Unknown'}</h3>
                ${item.rarity ? `<span style="font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid ${rarityColor}; color: ${rarityColor};">${item.rarity}</span>` : ''}
                ${item.diet ? `<p class="text-muted" style="font-size: 0.85rem; margin-top: 0.5rem;">Diet: ${item.diet}</p>` : ''}
                <p style="margin-top: 0.5rem; font-size: 1.1rem;">Quantity: <strong>${item.quantity}</strong></p>
                <div style="margin-top: 1rem;">
                    ${actionBtn}
                </div>
            `;

            inventoryGrid.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('.hatch-btn').forEach(btn => {
            btn.addEventListener('click', startHatching);
        });
    }

    function startHatching(e) {
        const btn = e.target;
        const eggTypeId = btn.dataset.eggTypeId;
        const rarity = btn.dataset.rarity || 'Common';
        const eggName = btn.dataset.name;

        currentHatchEgg = {
            egg_type_id: parseInt(eggTypeId),
            rarity: rarity,
            name: eggName
        };

        hatchClickCount = 0;

        // Show modal
        hatchModal.style.display = 'flex';
        hatchContent.style.display = 'block';
        hatchResult.style.display = 'none';

        // Set initial egg image
        const rarityLower = rarity.toLowerCase();
        hatchEggImg.src = `images/eggs/${rarityLower}Egg1.png`;
        updateClickCounter();

        // Add shake effect on hover
        hatchEggImg.style.cursor = 'pointer';
    }

    // Egg click handler for hatching animation
    hatchEggImg.addEventListener('click', () => {
        if (!currentHatchEgg) return;

        hatchClickCount++;
        const rarityLower = currentHatchEgg.rarity.toLowerCase();

        // Shake animation
        hatchEggImg.style.transform = 'rotate(10deg)';
        setTimeout(() => {
            hatchEggImg.style.transform = 'rotate(-10deg)';
        }, 100);
        setTimeout(() => {
            hatchEggImg.style.transform = 'rotate(0deg)';
        }, 200);

        // Update egg image based on clicks
        if (hatchClickCount === 1) {
            hatchEggImg.src = `images/eggs/${rarityLower}Egg1.png`;
        } else if (hatchClickCount === 2) {
            hatchEggImg.src = `images/eggs/${rarityLower}Egg2.png`;
        } else if (hatchClickCount >= 3) {
            hatchEggImg.src = `images/eggs/${rarityLower}Egg3.png`;

            // Call API to hatch
            setTimeout(() => {
                performHatch();
            }, 500);
        }

        updateClickCounter();
    });

    function updateClickCounter() {
        clickCounter.textContent = `Clicks: ${Math.min(hatchClickCount, 3)}/3`;

        if (hatchClickCount < 3) {
            hatchInstruction.textContent = `Click the egg to hatch! (${3 - hatchClickCount} more)`;
        } else {
            hatchInstruction.textContent = 'Hatching...';
        }
    }

    function performHatch() {
        if (!currentHatchEgg) return;

        const data = {
            user_id: parseInt(userId),
            egg_type_id: currentHatchEgg.egg_type_id
        };

        fetchMethod('/api/hatchEvents', (status, result) => {
            console.log('Hatch result:', status, result);

            if (status === 201) {
                // Show the hatched dinosaur
                showHatchResult(result);
            } else {
                alert(`Hatching failed: ${result.message || 'Unknown error'}`);
                hatchModal.style.display = 'none';
                currentHatchEgg = null;
            }
        }, 'POST', data, token);
    }

    function showHatchResult(result) {
        hatchContent.style.display = 'none';
        hatchResult.style.display = 'block';

        // Get dinosaur info
        const dexNum = result.dex_num || result.dinosaur?.dex_num || 1;
        dinosaurResultImg.src = `images/dinosaurs/dinosaur${dexNum}.png`;
        dinosaurName.textContent = result.name || result.dinosaur?.name || 'New Dinosaur!';
        dinosaurInfo.textContent = `A ${currentHatchEgg.rarity} dinosaur has hatched!`;
    }

    closeHatchBtn.addEventListener('click', () => {
        hatchModal.style.display = 'none';
        currentHatchEgg = null;
        // Refresh inventory
        loadInventory('eggs');
    });
});
