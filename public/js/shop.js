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

      // XP info for food
      let xpInfo = '';
      if (type === 'food' && item.xp_gain) {
        xpInfo = `<div style="font-size: 0.85rem; color: var(--primary-color); margin-bottom: 0.5rem;">+${item.xp_gain} XP</div>`;
      }

      // Diet info for food
      let dietInfo = '';
      if (type === 'food' && item.diet) {
        dietInfo = `<div style="font-size: 0.8rem; color: var(--text-muted);">Diet: ${item.diet}</div>`;
      }

      // Rarity info for eggs
      let rarityInfo = '';
      if (type === 'eggs' && item.rarity) {
        let rarityColor = '#a0aec0';
        if (item.rarity === 'Rare') rarityColor = '#4299e1';
        if (item.rarity === 'Epic') rarityColor = '#9f7aea';
        if (item.rarity === 'Legendary') rarityColor = '#ed8936';
        rarityInfo = `<span style="font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid ${rarityColor}; color: ${rarityColor};">${item.rarity}</span>`;
      }

      card.innerHTML = `
                <div style="height: 150px; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem;">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${item.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '<span style="font-size:3rem;">🥚</span>'}
                </div>
                <h3>${item.name}</h3>
                ${rarityInfo}
                ${xpInfo}
                ${dietInfo}
                <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--primary-color);">${price} pts</span>
                    <button class="btn btn-outline purchase-btn" 
                        data-type="${type === 'eggs' ? 'egg' : 'food'}" 
                        data-id="${itemId}" 
                        data-price="${price}"
                        data-name="${item.name}">
                        Buy
                    </button>
                </div>
            `;

      shopGrid.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.purchase-btn').forEach(btn => {
      btn.addEventListener('click', handlePurchase);
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

    // Optimistic check
    const currentPoints = parseInt(pointsDisplay.textContent);
    if (currentPoints < itemPrice) {
      alert('Not enough points!');
      return;
    }

    if (!confirm(`Buy ${itemName} for ${itemPrice} points?`)) return;

    btn.disabled = true;
    btn.textContent = 'Buying...';

    const data = {
      user_id: parseInt(userId),
      item_type: itemType,
      item_id: parseInt(itemId),
      quantity: 1
    };

    fetchMethod('/api/userPurchases', (status, response) => {
      if (status === 201) {
        alert('Purchase successful!');
        fetchUserPoints(); // Refresh points
        btn.textContent = 'Buy';
        btn.disabled = false;
      } else {
        alert(`Purchase failed: ${getErrorMessage(response)}`);
        btn.textContent = 'Buy';
        btn.disabled = false;
      }
    }, 'POST', data);
  }
});