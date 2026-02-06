document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const habitatGrid = document.getElementById('habitatGrid');
    const feedModal = document.getElementById('feedModal');
    const closeModal = document.getElementById('closeModal');
    const foodSelectContainer = document.getElementById('foodSelectContainer');
    const confirmFeedBtn = document.getElementById('confirmFeedBtn');

    // Auth Check
    if (!userId || !token) {
        window.location.href = 'login.html';
        return;
    }

    let allDex = {}; // Map dex_num -> { name, diet, rarity }
    let selectedDinoId = null;
    let selectedFoodId = null;

    // Load Data
    fetchAllDex()
        .then(() => fetchMyDinos())
        .catch(err => console.error(err));

    function fetchAllDex() {
        return new Promise((resolve, reject) => {
            fetchMethod('/api/dinosaurDex', (status, data) => {
                if (status === 200) {
                    data.forEach(d => {
                        allDex[d.number] = d;
                    });
                    resolve();
                } else {
                    reject('Failed to load dex');
                }
            });
        });
    }

    function fetchMyDinos() {
        habitatGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Loading your dinosaurs...</p>';

        fetchMethod('/api/dinosaurs', (status, dinos) => {
            if (status === 200) {
                // Filter client side
                // Filter client side
                const myDinos = dinos.filter(d => d.owner_id == userId);

                const totalCount = myDinos.length;
                const uniqueCount = new Set(myDinos.map(d => d.dex_num)).size;

                renderStats(totalCount, uniqueCount);
                renderDinos(myDinos);
            } else {
                habitatGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Failed to load dinosaurs.</p>';
            }
        });
    }

    function renderDinos(dinos) {
        habitatGrid.innerHTML = '';

        if (dinos.length === 0) {
            habitatGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">You have no dinosaurs yet. Visit the Shop or hatch some eggs!</p>';
            return;
        }

        dinos.forEach(dino => {
            const dexInfo = allDex[dino.dex_num] || { name: 'Unknown', diet: 'Unknown', rarity: 'Unknown' };
            const imgPath = `images/dinosaurs/dinosaur${dino.dex_num}.png`;

            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.innerHTML = `
                <div style="height: 240px; width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; overflow: hidden; border-radius: 8px; background: rgba(0,0,0,0.2);">
                    <img src="${imgPath}" alt="${dexInfo.name}" style="width: 200px; height: 200px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
                </div>
                <h3>${dexInfo.name} <span style="font-size: 0.8rem; color: var(--text-muted);">Lvl ${dino.level}</span></h3>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
                    <div>Diet: <span style="color: var(--primary-color);">${dexInfo.diet}</span></div>
                    <div>XP: ${dino.xp}</div>
                    <div>Size: ${dino.height}m / ${dino.weight}kg</div>
                </div>
                <button class="btn btn-outline feed-btn" style="width: 100%;" data-id="${dino.id}" data-diet="${dexInfo.diet}">Feed</button>
            `;

            habitatGrid.appendChild(card);
        });

        document.querySelectorAll('.feed-btn').forEach(btn => {
            btn.addEventListener('click', openFeedModal);
        });
    }

    function openFeedModal(e) {
        selectedDinoId = e.target.dataset.id;
        const diet = e.target.dataset.diet.toLowerCase();

        feedModal.style.display = 'flex';
        confirmFeedBtn.disabled = true;
        foodSelectContainer.innerHTML = 'Loading food...';

        // Fetch User Food Inventory
        fetchMethod(`/api/userFoodInventory/user/${userId}`, (status, inventory) => {
            if (status === 200) {
                renderFoodOptions(inventory, diet);
            } else {
                foodSelectContainer.textContent = 'Failed to load food.';
            }
        });
    }

    function renderFoodOptions(inventory, diet) {
        // Filter out empty
        const availableFood = inventory.filter(item => item.quantity > 0);

        if (availableFood.length === 0) {
            foodSelectContainer.innerHTML = '<p class="text-muted">You have no food.</p>';
            return;
        }

        foodSelectContainer.innerHTML = '<div style="display: grid; gap: 0.5rem;"></div>';
        const container = foodSelectContainer.firstElementChild;

        availableFood.forEach(item => {
            let isCompatible = true;
            if (item.diet) {
                const foodDiet = item.diet.toLowerCase();
                if (diet === 'herbivore' && foodDiet !== 'herbivore') isCompatible = false;
                if (diet === 'carnivore' && foodDiet !== 'carnivore') isCompatible = false;
            }

            if (!isCompatible) return;

            const div = document.createElement('div');
            div.className = 'card';
            div.style.padding = '0.5rem';
            div.style.cursor = 'pointer';
            div.style.border = '1px solid transparent';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';

            div.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span class="text-muted small">${item.diet || ''}</span>
            `;

            div.addEventListener('click', () => {
                Array.from(container.children).forEach(c => c.style.borderColor = 'transparent');
                div.style.borderColor = 'var(--primary-color)';
                selectedFoodId = item.food_type_id;
                confirmFeedBtn.disabled = false;
            });

            container.appendChild(div);
        });

        if (container.children.length === 0) {
            foodSelectContainer.innerHTML = '<p class="text-muted">No compatible food available for this dinosaur.</p>';
        }
    }

    closeModal.addEventListener('click', () => {
        feedModal.style.display = 'none';
        selectedDinoId = null;
        selectedFoodId = null;
    });

    confirmFeedBtn.addEventListener('click', () => {
        if (!selectedDinoId || (!selectedFoodId && selectedFoodId !== 0)) return;

        const quantityInput = document.getElementById("feedQuantity");
        const quantity = parseInt(quantityInput ? quantityInput.value : 1, 10);

        const data = {
            user_id: userId,
            dinosaur_id: selectedDinoId,
            food_type_id: selectedFoodId,
            quantity: quantity
        };

        confirmFeedBtn.textContent = 'Feeding...';

        fetchMethod('/api/dinosaurFeed', (status, result) => {
            if (status === 201 || status === 200) {
                alert(`Yum! Dino ate ${quantity} item(s) and gained ${result.xp_gained || 0} XP.`);
                feedModal.style.display = 'none';
                selectedDinoId = null;
                selectedFoodId = null;
                fetchMyDinos();
            } else {
                alert(`Feeding failed: ${getErrorMessage(result)}`);
            }
            confirmFeedBtn.textContent = 'Feed Dino';
            confirmFeedBtn.disabled = false;
        }, 'POST', data);
    });

    // Slider listener
    const qtyInput = document.getElementById("feedQuantity");
    const qtyDisplay = document.getElementById("feedQtyDisplay");
    if (qtyInput && qtyDisplay) {
        qtyInput.addEventListener("input", (e) => {
            qtyDisplay.textContent = e.target.value;
        });
    }

    function renderStats(total, unique) {
        const banner = document.getElementById('statsBanner');
        if (!banner) return;

        const progressPercent = Math.min((unique / 12) * 100, 100);

        banner.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total Dinos</div>
            </div>
            <div style="width: 1px; height: 50px; background: rgba(255,255,255,0.1);"></div>
            <div class="stat-item" style="flex: 1.5;">
                <div class="stat-value">${unique} / 12</div>
                <div class="stat-label">Species Collected</div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
        `;
    }
});
