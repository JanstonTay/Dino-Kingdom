document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const pointsDisplay = document.getElementById('pointsDisplay');
  const userBalanceDiv = document.getElementById('userBalance');
  const shopGrid = document.getElementById('shopGrid');

  let currentTab = 'eggs';

  // Image mappings based on food names
  const foodImages = {
    'Raw Meat': 'images/food/rawMeat.png',
    'Fresh Fish': 'images/food/freshFish.png',
    'Prime Steak': 'images/food/primeSteak.png',
    'Leafy Green': 'images/food/leafyGreen.png',
    'Ancient Fern': 'images/food/ancientFern.png',
    'Fruit Mix': 'images/food/fruitMix.png'
  };

  // Egg image mappings based on rarity
  const eggImages = {
    'Common': 'images/eggs/commonEgg1.png',
    'Rare': 'images/eggs/rareEgg1.png',
    'Epic': 'images/eggs/epicEgg1.png',
    'Legendary': 'images/eggs/legendaryEgg1.png'
  };

  // Initial Load
  if (userId && token) {
    userBalanceDiv.style.display = 'block';
    fetchUserPoints();
  }

  loadShopItems('eggs');

  window.switchTab = (tab) => {
    currentTab = tab;

    // Update UI
    document.getElementById('eggTab').classList.toggle('btn-primary', tab === 'eggs');
    document.getElementById('eggTab').classList.toggle('btn-outline', tab !== 'eggs');
    document.getElementById('foodTab').classList.toggle('btn-primary', tab === 'food');
    document.getElementById('foodTab').classList.toggle('btn-outline', tab !== 'food');

    loadShopItems(tab);
  }

  // Set initial active state
  window.switchTab('eggs');

  function fetchUserPoints() {
    if (!userId) return;
    fetchMethod(`/api/users/${userId}`, (status, data) => {
      if (status === 200) {
        pointsDisplay.textContent = data.points;
      }
    });
  }

  function loadShopItems(type) {
    shopGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Loading...</p>';

    const endpoint = type === 'eggs' ? '/api/eggTypes' : '/api/foodTypes';

    fetchMethod(endpoint, (status, items) => {
      console.log('Shop items response:', status, items);

      if (status === 200 && Array.isArray(items)) {
        renderItems(items, type);
      } else {
        shopGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Failed to load items. Please try again.</p>';
      }
    });
  }

  function renderItems(items, type) {
    shopGrid.innerHTML = '';

    if (!items || items.length === 0) {
      shopGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">No items available.</p>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card fade-in';
      card.style.textAlign = 'center';

      const itemId = type === 'eggs' ? item.egg_type_id : item.food_type_id;
      const price = item.price_points || 0;

      // Get appropriate image
      let imgSrc = '';
      if (type === 'eggs') {
        imgSrc = eggImages[item.rarity] || 'images/eggs/commonEgg1.png';
      } else {
        imgSrc = foodImages[item.name] || '';
      }

      // XP and Badges section
      let badges = '';
      // Rarity for eggs
      if (type === 'eggs' && item.rarity) {
        let rarityColor = '#a0aec0';
        if (item.rarity === 'Rare') rarityColor = '#4299e1';
        if (item.rarity === 'Epic') rarityColor = '#9f7aea';
        if (item.rarity === 'Legendary') rarityColor = '#ed8936';
        badges += `<span style="font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid ${rarityColor}; color: ${rarityColor}; white-space: nowrap;">${item.rarity}</span>`;
      }

      // Diet info for food
      if (type === 'food' && item.diet) {
        badges += `<span style="font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: var(--text-muted); white-space: nowrap;">${item.diet}</span>`;
      }

      // XP info for food - now as a badge
      if (type === 'food' && item.xp_gain) {
        badges += `<span style="font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid var(--primary-color); color: var(--primary-color); white-space: nowrap;">+${item.xp_gain} XP</span>`;
      }

      const badgesSection = badges ? `<div style="display: flex; justify-content: center; gap: 0.4rem; margin-top: 0.5rem; flex-wrap: wrap;">${badges}</div>` : '';

      card.innerHTML = `
                <div style="height: 160px; width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; border-radius: 8px; background: rgba(0,0,0,0.1);">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: contain;">` : '<span style="font-size:3rem;">🥚</span>'}
                </div>
                <h3>${item.name}</h3>
                ${badgesSection}
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.8rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.2rem 0.5rem;">
                        <span style="font-weight: 800; color: var(--primary-color); font-size: 1.2rem; letter-spacing: -0.5px;">${price}&nbsp;<span style="font-size: 0.8rem; font-weight: 400; opacity: 0.8;">PTS</span></span>
                        <div class="quantity-selector" style="background: rgba(84, 250, 203, 0.05); border: 1px solid rgba(84, 250, 203, 0.2); border-radius: 8px; display: flex; align-items: center; padding: 2px;">
                            <button class="qty-btn minus" data-id="${itemId}" style="width: 28px; height: 28px; background: transparent; border: none; color: var(--primary-color); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold;">−</button>
                            <span class="qty-display" data-id="${itemId}" style="width: 30px; text-align: center; color: var(--white); font-weight: 800; font-size: 1.1rem; user-select: none;">1</span>
                            <button class="qty-btn plus" data-id="${itemId}" style="width: 28px; height: 28px; background: transparent; border: none; color: var(--primary-color); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold;">+</button>
                        </div>
                    </div>
                    <button class="btn btn-primary purchase-btn" 
                        data-type="${type === 'eggs' ? 'egg' : 'food'}" 
                        data-id="${itemId}" 
                        data-price="${price}"
                        data-name="${item.name}"
                        style="width: 100%; height: 46px; font-weight: 700; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; border-radius: 12px; box-shadow: 0 4px 15px rgba(84, 250, 203, 0.3);">
                        Buy Now
                    </button>
                </div>
            `;

      shopGrid.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.purchase-btn').forEach(btn => {
      btn.addEventListener('click', handlePurchase);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const display = document.querySelector(`.qty-display[data-id="${id}"]`);
        let val = parseInt(display.textContent);
        if (e.target.classList.contains('plus')) {
          val++;
        } else {
          val = Math.max(1, val - 1);
        }
        display.textContent = val;
      });
    });
  }

  function handlePurchase(e) {
    if (!userId || !token) {
      alert('Please login to purchase items.');
      window.location.href = 'login.html';
      return;
    }

    const btn = e.target;
    const itemType = btn.dataset.type;
    const itemId = btn.dataset.id;
    const itemName = btn.dataset.name;
    const itemPrice = parseInt(btn.dataset.price);

    const qtyDisplay = document.querySelector(`.qty-display[data-id="${itemId}"]`);
    const quantity = parseInt(qtyDisplay.textContent) || 1;
    const totalCost = itemPrice * quantity;

    // Optimistic check
    const currentPoints = parseInt(pointsDisplay.textContent);
    if (currentPoints < totalCost) {
      alert(`Not enough points! Total cost for ${quantity} items is ${totalCost} pts.`);
      return;
    }

    if (!confirm(`Buy ${quantity}x ${itemName} for a total of ${totalCost} points?`)) return;

    btn.disabled = true;
    btn.textContent = 'Buying...';

    const data = {
      user_id: parseInt(userId),
      item_type: itemType,
      item_id: parseInt(itemId),
      quantity: quantity
    };

    fetchMethod('/api/userPurchases', (status, response) => {
      if (status === 201) {
        alert('Purchase successful!');
        fetchUserPoints(); // Refresh points
        btn.textContent = 'Buy Now';
        btn.disabled = false;
        qtyDisplay.textContent = '1'; // Reset quantity
      } else {
        alert(`Purchase failed: ${getErrorMessage(response)}`);
        btn.textContent = 'Buy Now';
        btn.disabled = false;
      }
    }, 'POST', data);
  }
});