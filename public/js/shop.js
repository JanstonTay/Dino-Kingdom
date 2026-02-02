      // =========================
      // 1) CHANGE ONLY THESE URLs
      // =========================
      const BASE_URL = "http://localhost:3000"; // change if your backend differs

      // GET lists:
      const EGGS_URL = `${BASE_URL}/shop/eggs`;   // e.g. /shop/eggs
      const FOOD_URL = `${BASE_URL}/shop/food`;   // e.g. /shop/food

      // POST buy:
      const BUY_EGG_URL = `${BASE_URL}/shop/buy/egg`;   // e.g. /shop/buy/egg
      const BUY_FOOD_URL = `${BASE_URL}/shop/buy/food`; // e.g. /shop/buy/food

      // Where token is stored (common pattern)
      const token = localStorage.getItem("token");

      // =========================
      // Helpers
      // =========================
      const eggsGrid = document.getElementById("eggsGrid");
      const foodGrid = document.getElementById("foodGrid");
      const eggsStatus = document.getElementById("eggsStatus");
      const foodStatus = document.getElementById("foodStatus");
      const eggsCount = document.getElementById("eggsCount");
      const foodCount = document.getElementById("foodCount");
      const globalAlert = document.getElementById("globalAlert");

      function showGlobalAlert(type, message) {
        globalAlert.className = `alert alert-${type}`;
        globalAlert.textContent = message;
        globalAlert.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function clearGlobalAlert() {
        globalAlert.classList.add("d-none");
      }

      function safeText(v) {
        return (v === null || v === undefined) ? "" : String(v);
      }

      function formatPrice(v) {
        if (v === null || v === undefined) return "-";
        const num = Number(v);
        return Number.isFinite(num) ? `$${num.toFixed(2)}` : safeText(v);
      }

      // =========================
      // Rendering
      // Expecting each item object to have (any of these):
      // - name/title
      // - description
      // - price
      // - image (optional)
      // - id (optional)
      // =========================
      function renderItemCard(item, type) {
        const name = item.name || item.title || `${type} Item`;
        const desc = item.description || item.desc || "";
        const price = item.price ?? item.cost ?? item.amount;

        // If your backend returns image paths, use it.
        // If not, it will just show "No image".
        const img = item.image || item.img || "";

        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        col.innerHTML = `
          <div class="soft-card p-3 d-flex flex-column">
            ${
              img
                ? `<img src="${img}" alt="${safeText(name)}" class="item-img" />`
                : `<div class="item-img d-flex align-items-center justify-content-center text-muted border rounded">
                     No image
                   </div>`
            }

            <div class="mt-2">
              <div class="fw-semibold">${safeText(name)}</div>
              ${desc ? `<div class="text-muted small mt-1">${safeText(desc)}</div>` : ""}
              <div class="mt-2"><span class="text-muted small">Price:</span> <span class="fw-semibold">${formatPrice(price)}</span></div>
            </div>

            <div class="mt-auto pt-3">
              <button class="btn btn-green text-white w-100 btn-buy">Buy</button>
            </div>
          </div>
        `;

        // buy handler
        col.querySelector(".btn-buy").addEventListener("click", () => {
          if (type === "Egg") buyEgg(item);
          else buyFood(item);
        });

        return col;
      }

      // =========================
      // Fetch lists
      // =========================
      function loadEggs() {
        eggsStatus.textContent = "Loading eggs...";
        eggsGrid.innerHTML = "";
        clearGlobalAlert();

        fetchMethod(EGGS_URL, (status, data) => {
          if (status >= 200 && status < 300) {
            // Accept either array OR { items: [...] }
            const items = Array.isArray(data) ? data : (data.items || data.eggs || []);
            eggsCount.textContent = items.length;

            if (!items.length) {
              eggsStatus.textContent = "No eggs found.";
              return;
            }

            eggsStatus.textContent = "";
            items.forEach((item) => eggsGrid.appendChild(renderItemCard(item, "Egg")));
          } else {
            eggsStatus.textContent = "";
            showGlobalAlert("danger", `Failed to load eggs (HTTP ${status}). Check EGGS_URL endpoint.`);
          }
        });
      }

      function loadFood() {
        foodStatus.textContent = "Loading food...";
        foodGrid.innerHTML = "";
        clearGlobalAlert();

        fetchMethod(FOOD_URL, (status, data) => {
          if (status >= 200 && status < 300) {
            const items = Array.isArray(data) ? data : (data.items || data.food || []);
            foodCount.textContent = items.length;

            if (!items.length) {
              foodStatus.textContent = "No food found.";
              return;
            }

            foodStatus.textContent = "";
            items.forEach((item) => foodGrid.appendChild(renderItemCard(item, "Food")));
          } else {
            foodStatus.textContent = "";
            showGlobalAlert("danger", `Failed to load food (HTTP ${status}). Check FOOD_URL endpoint.`);
          }
        });
      }

      // =========================
      // Buy actions (POST)
      // You may need to adjust request body keys based on backend
      // =========================
      function buyEgg(item) {
        clearGlobalAlert();

        // Common body patterns: { id }, { eggId }, or { itemId }
        const body = { id: item.id ?? item.eggId ?? item.itemId ?? null };

        fetchMethod(BUY_EGG_URL, (status, data) => {
          if (status >= 200 && status < 300) {
            showGlobalAlert("success", data.message || "Egg purchased!");
            // Optionally refresh inventory counts later
          } else if (status === 401 || status === 403) {
            showGlobalAlert("warning", "You must be logged in to buy items.");
          } else {
            showGlobalAlert("danger", data.message || `Failed to buy egg (HTTP ${status}).`);
          }
        }, "POST", body, token);
      }

      function buyFood(item) {
        clearGlobalAlert();

        const body = { id: item.id ?? item.foodId ?? item.itemId ?? null };

        fetchMethod(BUY_FOOD_URL, (status, data) => {
          if (status >= 200 && status < 300) {
            showGlobalAlert("success", data.message || "Food purchased!");
          } else if (status === 401 || status === 403) {
            showGlobalAlert("warning", "You must be logged in to buy items.");
          } else {
            showGlobalAlert("danger", data.message || `Failed to buy food (HTTP ${status}).`);
          }
        }, "POST", body, token);
      }

      // =========================
      // Buttons
      // =========================
      document.getElementById("refreshEggsBtn").addEventListener("click", loadEggs);
      document.getElementById("refreshFoodBtn").addEventListener("click", loadFood);

      // =========================
      // Init
      // =========================
      loadEggs();
      loadFood();