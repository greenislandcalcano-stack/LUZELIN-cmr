const appContent = document.getElementById("app-content");
const pageTitle = document.getElementById("page-title");
const navLinks = document.querySelectorAll(".crm-nav a");

const TOTAL_TABLES = 12;
const ITBIS_RATE = 0.18;
const SERVICE_RATE = 0.10;

let tableOrders = JSON.parse(localStorage.getItem("tableOrders")) || {};
let posCart = [];
let activeMenuCategory = "Todos";
let selectedMenuItem = null;
let productOptionsModal = null;

const cheeseCrustPrices = {
  '4"': 75,
  '6"': 100,
  '8"': 150,
  '12"': 200
};

const menuData = [
  {
    category: "Pizzas en Carnes",
    icon: "🍕",
    items: [
      { id: "pizza-rincon-tropical", name: "Rincón Tropical", type: "pizza", sizes: { '4"': 300, '6"': 450, '8"': 650, '12"': 900 } },
      { id: "pizza-jamon", name: "Jamón", type: "pizza", sizes: { '4"': 225, '6"': 325, '8"': 500, '12"': 750 } },
      { id: "pizza-pepperoni", name: "Pepperoni", type: "pizza", sizes: { '4"': 250, '6"': 400, '8"': 575, '12"': 825 } },
      { id: "pizza-tocineta", name: "Tocineta", type: "pizza", sizes: { '4"': 275, '6"': 425, '8"': 600, '12"': 850 } },
      { id: "pizza-pollo", name: "Pollo", type: "pizza", sizes: { '4"': 250, '6"': 350, '8"': 500, '12"': 775 } }
    ]
  },
  {
    category: "Pizzas Vegetarianas",
    icon: "🌿",
    items: [
      { id: "pizza-rincon-vegetal", name: "Rincón Vegetal", type: "pizza", sizes: { '4"': 300, '6"': 450, '8"': 600, '12"': 850 } },
      { id: "pizza-margarita", name: "Margarita", type: "pizza", sizes: { '4"': 250, '6"': 350, '8"': 550, '12"': 800 } },
      { id: "pizza-veggie-lovers", name: "Veggie Lovers", type: "pizza", sizes: { '4"': 250, '6"': 375, '8"': 575, '12"': 800 } },
      { id: "pizza-champinones", name: "Champiñones", type: "pizza", sizes: { '4"': 250, '6"': 350, '8"': 550, '12"': 775 } }
    ]
  },
  {
    category: "Pizzas Marineras",
    icon: "🦐",
    items: [
      { id: "pizza-rincon-marino", name: "Rincón Marino", type: "pizza", sizes: { '4"': 425, '6"': 600, '8"': 850, '12"': 1100 } },
      { id: "pizza-camaron", name: "Camarón", type: "pizza", sizes: { '4"': 400, '6"': 575, '8"': 850, '12"': 1100 } },
      { id: "pizza-cangrejo", name: "Cangrejo", type: "pizza", sizes: { '4"': 450, '6"': 675, '8"': 925, '12"': 1200 } },
      { id: "pizza-pulpo", name: "Pulpo", type: "pizza", sizes: { '4"': 350, '6"': 525, '8"': 800, '12"': 1050 } },
      { id: "pizza-lambi", name: "Lambí", type: "pizza", sizes: { '4"': 350, '6"': 550, '8"': 825, '12"': 1075 } },
      { id: "pizza-calamar", name: "Calamar", type: "pizza", sizes: { '4"': 350, '6"': 500, '8"': 750, '12"': 1000 } }
    ]
  },
  {
    category: "Mariscos",
    icon: "🦞",
    items: [
      { id: "camaron-coco", name: "Camarones en Salsa de Coco", type: "simple", price: 695 },
      { id: "camaron-frito", name: "Camarones Fritos", type: "simple", price: 695 },
      { id: "camaron-salteado", name: "Camarones Salteados", type: "simple", price: 695 },
      { id: "camaron-criollo", name: "Camarones al Criollo", type: "simple", price: 725 },
      { id: "lambi-ajillo", name: "Lambí al Ajillo", type: "simple", price: 895 },
      { id: "lambi-coco", name: "Lambí en Salsa de Coco", type: "simple", price: 925 },
      { id: "lambi-criollo", name: "Lambí al Criollo", type: "simple", price: 895 },
      { id: "calamar-frito", name: "Calamar Frito", type: "simple", price: 695 },
      { id: "calamar-ajillo", name: "Calamar al Ajillo", type: "simple", price: 725 },
      { id: "calamar-criollo", name: "Calamar Criollo", type: "simple", price: 725 }
    ]
  },
  {
    category: "Pescados",
    icon: "🐟",
    items: [
      {
        id: "chillo",
        name: "Chillo",
        type: "preparation",
        options: [
          { label: "Al Ajillo", price: 975 },
          { label: "Salsa de Coco", price: 995 },
          { label: "Criollo", price: 975 }
        ]
      },
      {
        id: "mero",
        name: "Mero",
        type: "preparation",
        options: [
          { label: "Al Ajillo", price: 995 },
          { label: "Salsa de Coco", price: 1025 },
          { label: "Criollo", price: 995 }
        ]
      },
      {
        id: "pargo",
        name: "Pargo",
        subtitle: "Según disponibilidad",
        type: "preparation",
        options: [
          { label: "Al Ajillo", price: 975 },
          { label: "Salsa de Coco", price: 975 },
          { label: "Criollo", price: 975 }
        ]
      }
    ]
  },
  {
    category: "Parrilla",
    icon: "🔥",
    items: [
      {
        id: "pollo-parrilla",
        name: "Pollo a la Parrilla",
        type: "side",
        price: 495,
        subtitle: "Incluye una guarnición",
        sides: ["Papas Fritas", "Tostones", "Arroz Blanco", "Moro", "Vegetales"]
      }
    ]
  },
  {
    category: "Extras",
    icon: "➕",
    items: [
      { id: "extra-papas", name: "Papas Extra", type: "simple", price: 120 },
      { id: "extra-tostones", name: "Tostones Extra", type: "simple", price: 120 },
      { id: "extra-arroz", name: "Arroz Extra", type: "simple", price: 90 }
    ]
  },
  {
    category: "Bebidas Naturales",
    icon: "🥤",
    items: [
      { id: "jugo-chinola", name: "Chinola", type: "simple", price: 160 },
      { id: "jugo-limon", name: "Limón", type: "simple", price: 150 },
      { id: "jugo-naranja", name: "Naranja", type: "simple", price: 160 },
      { id: "jugo-sandia", name: "Sandía", type: "simple", price: 160 },
      { id: "jugo-tamarindo", name: "Tamarindo", type: "simple", price: 160 },
      { id: "jugo-avena", name: "Avena", type: "simple", price: 170 }
    ]
  },
  {
    category: "Tragos de la Casa",
    icon: "🍹",
    items: [
      { id: "trago-bahia", name: "Bahía de Samaná", type: "simple", price: 295, subtitle: "Ron, chinola, limón" },
      { id: "trago-haitises", name: "Los Haitises", type: "simple", price: 325, subtitle: "Ron, coco, piña" },
      { id: "trago-muelle", name: "Muelle Viejo (Mamajuana)", type: "simple", price: 250, subtitle: "El auténtico sabor dominicano" },
      { id: "trago-coquito", name: "Coquito Tropical", type: "simple", price: 320, subtitle: "Ron, crema de coco, canela y nuez moscada" },
      { id: "trago-atardecer", name: "Atardecer en Sánchez", type: "simple", price: 295, subtitle: "Ron, tamarindo, naranja" },
      { id: "trago-cayo", name: "El Cayo", type: "simple", price: 320, subtitle: "Vodka, chinola, hierbabuena" }
    ]
  },
  {
    category: "Cervezas",
    icon: "🍺",
    items: [
      { id: "cerveza-presidente", name: "Presidente", type: "simple", price: 200 },
      { id: "cerveza-corona", name: "Corona", type: "simple", price: 175 }
    ]
  },
  {
    category: "Postres",
    icon: "🍮",
    items: [
      { id: "postre-flan", name: "Flan Casero", type: "simple", price: 220 },
      { id: "postre-dulce-coco", name: "Dulce de Coco", type: "simple", price: 220 },
      { id: "postre-tres-leches", name: "Tres Leches", type: "simple", price: 240 },
      { id: "postre-arroz-leche", name: "Arroz con Leche", type: "simple", price: 180 },
      { id: "postre-majarete", name: "Majarete", type: "simple", price: 180 }
    ]
  }
];

function money(value) {
  return `RD$${Number(value || 0).toLocaleString("es-DO", {
    maximumFractionDigits: 2
  })}`;
}

function getAllMenuItems() {
  return menuData.flatMap(section =>
    section.items.map(item => ({
      ...item,
      category: section.category,
      icon: section.icon
    }))
  );
}

async function loadPage(page) {
  try {
    if (page === "dashboard") {
      pageTitle.textContent = "Dashboard";
      renderDashboardPage();
      return;
    }

    if (page === "tables") {
      pageTitle.textContent = "Tables";
      renderTablesPage();
      return;
    }

    if (page === "orders") {
      pageTitle.textContent = "Orders";
      renderOrdersPage();
      return;
    }

    const response = await fetch(`assets/pages/${page}.html`);

    if (!response.ok) throw new Error("Page not found");

    appContent.innerHTML = await response.text();
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);

    bindPageButtons();

    if (page === "menu") initPOSMenu();
    if (page === "sales") initSales();
  } catch (error) {
    appContent.innerHTML = `
      <div class="crm-card">
        <h3>Page not found</h3>
        <p>Please make sure <strong>assets/pages/${page}.html</strong> exists.</p>
      </div>
    `;
    console.error(error);
  }
}

function bindPageButtons() {
  document.querySelectorAll(".page-btn").forEach(button => {
    button.addEventListener("click", function () {
      const targetPage = this.getAttribute("data-page");
      targetPage === "menu" ? startTakeoutOrder() : loadPage(targetPage);
    });
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    navLinks.forEach(item => item.classList.remove("active"));
    this.classList.add("active");

    const page = this.getAttribute("data-page");
    page === "menu" ? startTakeoutOrder() : loadPage(page);
  });
});

function saveTableOrders() {
  localStorage.setItem("tableOrders", JSON.stringify(tableOrders));
}

function getTables() {
  return Array.from({ length: TOTAL_TABLES }, (_, index) => {
    const number = index + 1;
    const id = `table-${number}`;
    const order = tableOrders[id];

    return {
      id,
      number,
      occupied: Boolean(order?.items?.length)
    };
  });
}

function renderTablesPage() {
  tableOrders = JSON.parse(localStorage.getItem("tableOrders")) || {};
  const tables = getTables();
  const openTables = tables.filter(table => !table.occupied).length;
  const occupiedTables = tables.filter(table => table.occupied).length;

  appContent.innerHTML = `
    <div class="crm-card">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1">🪑 Mesas</h2>
          <p class="text-muted mb-0">Selecciona una mesa para abrir o continuar su orden.</p>
        </div>
        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> Nueva orden para llevar
        </button>
      </div>

      <div class="row g-3 mb-4">
        ${renderStatCard("Mesas disponibles", openTables)}
        ${renderStatCard("Mesas ocupadas", occupiedTables)}
        ${renderStatCard("Total de mesas", TOTAL_TABLES)}
      </div>

      <div class="row g-3">
        ${tables.map(table => `
          <div class="col-6 col-md-4 col-xl-3">
            <button class="table-card ${table.occupied ? "occupied" : "available"}"
              onclick="openTableOrder('${table.id}')">
              <div class="table-number">Mesa ${table.number}</div>
              <div class="table-status">${table.occupied ? "Ocupada" : "Disponible"}</div>
            </button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderStatCard(label, value) {
  return `
    <div class="col-md-4">
      <div class="crm-stat-card">
        <h6>${label}</h6>
        <h3>${value}</h3>
      </div>
    </div>
  `;
}

function openTableOrder(tableId) {
  if (!tableOrders[tableId]) {
    tableOrders[tableId] = { type: "table", tableId, items: [], note: "" };
    saveTableOrders();
  }

  localStorage.setItem("activeOrderType", "table");
  localStorage.setItem("activeTableId", tableId);
  loadPage("menu");
}

function startTakeoutOrder() {
  localStorage.setItem("activeOrderType", "takeout");
  localStorage.removeItem("activeTableId");
  loadPage("menu");
}

function getActiveOrderType() {
  return localStorage.getItem("activeOrderType") || "takeout";
}

function getActiveTableId() {
  return localStorage.getItem("activeTableId");
}

function loadPOSCart() {
  tableOrders = JSON.parse(localStorage.getItem("tableOrders")) || {};
  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();

  if (orderType === "table" && tableId) {
    tableOrders[tableId] ||= { type: "table", tableId, items: [], note: "" };
    posCart = tableOrders[tableId].items || [];
  } else {
    posCart = JSON.parse(localStorage.getItem("takeoutOrder")) || [];
  }
}

function savePOSCart() {
  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();
  const note = document.getElementById("orderNote")?.value || "";

  if (orderType === "table" && tableId) {
    tableOrders[tableId] ||= { type: "table", tableId, items: [], note: "" };
    tableOrders[tableId].items = posCart;
    tableOrders[tableId].note = note;
    saveTableOrders();
  } else {
    localStorage.setItem("takeoutOrder", JSON.stringify(posCart));
    localStorage.setItem("takeoutOrderNote", note);
  }
}

function initPOSMenu() {
  loadPOSCart();
  renderCategoryTabs();
  renderMenuItems();
  renderPOSCart();
  updateActiveOrderLabel();

  document.getElementById("posSearch")?.addEventListener("input", renderMenuItems);
  document.getElementById("orderNote")?.addEventListener("input", savePOSCart);

  const orderNote = document.getElementById("orderNote");
  if (orderNote) {
    const type = getActiveOrderType();
    const tableId = getActiveTableId();
    orderNote.value =
      type === "table" && tableId
        ? tableOrders[tableId]?.note || ""
        : localStorage.getItem("takeoutOrderNote") || "";
  }

  const modalElement = document.getElementById("productOptionsModal");
  if (modalElement && window.bootstrap) {
    productOptionsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  }
}

function updateActiveOrderLabel() {
  const label = document.getElementById("activeOrderLabel");
  if (!label) return;

  const tableId = getActiveTableId();
  label.textContent =
    getActiveOrderType() === "table" && tableId
      ? tableId.replace("table-", "Mesa ")
      : "Para llevar";
}

function renderCategoryTabs() {
  const container = document.getElementById("posCategoryTabs");
  if (!container) return;

  const categories = ["Todos", ...menuData.map(section => section.category)];

  container.innerHTML = categories.map(category => `
    <button
      class="pos-category-btn ${category === activeMenuCategory ? "active" : ""}"
      onclick="setMenuCategory('${category.replace(/'/g, "\\'")}')"
    >
      ${category}
    </button>
  `).join("");
}

function setMenuCategory(category) {
  activeMenuCategory = category;
  renderCategoryTabs();
  renderMenuItems();
}

function getStartingPrice(item) {
  if (item.type === "pizza") return Math.min(...Object.values(item.sizes));
  if (item.type === "preparation") return Math.min(...item.options.map(option => option.price));
  return item.price;
}

function renderMenuItems() {
  const container = document.getElementById("posMenuGrid");
  if (!container) return;

  const query = (document.getElementById("posSearch")?.value || "").trim().toLowerCase();

  const items = getAllMenuItems().filter(item => {
    const matchesCategory =
      activeMenuCategory === "Todos" || item.category === activeMenuCategory;

    const searchable = `${item.name} ${item.category} ${item.subtitle || ""}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  if (!items.length) {
    container.innerHTML = `
      <div class="pos-no-results">
        <i class="bi bi-search"></i>
        <h5>No encontramos productos</h5>
        <p>Prueba con otra palabra o selecciona otra categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const pricePrefix = ["pizza", "preparation"].includes(item.type) ? "Desde " : "";
    const actionText = item.type === "simple" ? "Agregar" : "Personalizar";

    return `
      <article class="pos-product-card">
        <div class="pos-product-icon">${item.icon}</div>
        <div class="pos-product-content">
          <span class="pos-product-category">${item.category}</span>
          <h5>${item.name}</h5>
          ${item.subtitle ? `<p>${item.subtitle}</p>` : ""}
          <div class="pos-product-footer">
            <strong>${pricePrefix}${money(getStartingPrice(item))}</strong>
            <button class="btn btn-sm btn-success"
              onclick="selectMenuItem('${item.id}')">
              ${actionText}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function findMenuItem(itemId) {
  return getAllMenuItems().find(item => item.id === itemId);
}

function selectMenuItem(itemId) {
  const item = findMenuItem(itemId);
  if (!item) return;

  if (item.type === "simple") {
    addConfiguredItem({
      menuId: item.id,
      name: item.name,
      price: item.price,
      details: item.subtitle || "",
      note: ""
    });
    return;
  }

  selectedMenuItem = item;
  renderProductOptions(item);
  productOptionsModal?.show();
}

function renderProductOptions(item) {
  const title = document.getElementById("productOptionsTitle");
  const body = document.getElementById("productOptionsBody");
  const confirmButton = document.getElementById("confirmProductOptions");

  if (!title || !body || !confirmButton) return;

  title.textContent = item.name;

  if (item.type === "pizza") {
    const pizzaSizes = Object.keys(item.sizes);
    const firstSize = pizzaSizes[0];

    body.innerHTML = `
      <div class="pos-option-group">
        <label class="pos-option-label">1. Selecciona el tamaño</label>

        <div class="pos-option-grid">
          ${pizzaSizes.map((size, index) => `
            <label class="pos-option-card">
              <input
                type="radio"
                name="pizzaSize"
                value="${index}"
                ${index === 0 ? "checked" : ""}
              >

              <span>
                <strong>${size}</strong>
                <small>${money(item.sizes[size])}</small>
              </span>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="pos-option-group">
        <label class="pos-option-label">2. Borde de queso</label>

        <label class="pos-check-row">
          <input id="pizzaCheeseCrust" type="checkbox">

          <span>
            <strong>Agregar borde de queso</strong>
            <small id="cheeseCrustPriceLabel">
              +${money(cheeseCrustPrices[firstSize])}
            </small>
          </span>
        </label>
      </div>

      ${renderItemNoteField()}
    `;

    document
      .querySelectorAll('input[name="pizzaSize"]')
      .forEach(input => {
        input.addEventListener("change", function () {
          const selectedSize = pizzaSizes[Number(this.value)];
          const crustPrice = cheeseCrustPrices[selectedSize] || 0;
          const label = document.getElementById("cheeseCrustPriceLabel");

          if (label) {
            label.textContent = `+${money(crustPrice)}`;
          }
        });
      });
  }

  if (item.type === "preparation") {
    body.innerHTML = `
      <div class="pos-option-group">
        <label class="pos-option-label">
          Selecciona la preparación
        </label>

        <div class="pos-option-list">
          ${item.options.map((option, index) => `
            <label class="pos-option-line">
              <input
                type="radio"
                name="preparationOption"
                value="${index}"
                ${index === 0 ? "checked" : ""}
              >

              <span>${option.label}</span>
              <strong>${money(option.price)}</strong>
            </label>
          `).join("")}
        </div>
      </div>

      ${renderItemNoteField()}
    `;
  }

  if (item.type === "side") {
    body.innerHTML = `
      <div class="pos-option-group">
        <label class="pos-option-label">
          Selecciona una guarnición
        </label>

        <div class="pos-option-list">
          ${item.sides.map((side, index) => `
            <label class="pos-option-line">
              <input
                type="radio"
                name="sideOption"
                value="${side}"
                ${index === 0 ? "checked" : ""}
              >

              <span>${side}</span>
              <strong>Incluida</strong>
            </label>
          `).join("")}
        </div>
      </div>


      ${renderItemNoteField()}
    `;

    document.querySelectorAll('input[name="pizzaSize"]').forEach(input => {
      input.addEventListener("change", event => {
        const label = document.getElementById("cheeseCrustPriceLabel");
        if (label) label.textContent = `+${money(cheeseCrustPrices[event.target.value])}`;
      });
    });
  }

  if (item.type === "preparation") {
    body.innerHTML = `
      <div class="pos-option-group">
        <label class="pos-option-label">Selecciona la preparación</label>
        <div class="pos-option-list">
          ${item.options.map((option, index) => `
            <label class="pos-option-line">
              <input type="radio" name="preparationOption" value="${index}" ${index === 0 ? "checked" : ""}>
              <span>${option.label}</span>
              <strong>${money(option.price)}</strong>
            </label>
          `).join("")}
        </div>
      </div>

      ${renderItemNoteField()}
    `;
  }

  if (item.type === "side") {
    body.innerHTML = `
      <div class="pos-option-group">
        <label class="pos-option-label">Selecciona una guarnición</label>
        <div class="pos-option-list">
          ${item.sides.map((side, index) => `
            <label class="pos-option-line">
              <input type="radio" name="sideOption" value="${side}" ${index === 0 ? "checked" : ""}>
              <span>${side}</span>
              <strong>Incluida</strong>
            </label>
          `).join("")}
        </div>
      </div>

      ${renderItemNoteField()}
    `;
  }

  confirmButton.onclick = confirmSelectedMenuItem;
}

function renderItemNoteField() {
  return `
    <div class="pos-option-group mb-0">
      <label for="productItemNote" class="pos-option-label">Nota para este producto</label>
      <textarea
        id="productItemNote"
        class="form-control"
        rows="2"
        placeholder="Ej.: sin cebolla, bien cocido, poca salsa..."
      ></textarea>
    </div>
  `;
}

function confirmSelectedMenuItem() {
  if (!selectedMenuItem) return;

  const note =
    document.getElementById("productItemNote")?.value.trim() || "";

  if (selectedMenuItem.type === "pizza") {
    const selectedIndex = Number(
      document.querySelector(
        'input[name="pizzaSize"]:checked'
      )?.value
    );

    const pizzaSizes = Object.keys(selectedMenuItem.sizes);
    const size = pizzaSizes[selectedIndex];

    if (!size) return;

    const withCheeseCrust = Boolean(
      document.getElementById("pizzaCheeseCrust")?.checked
    );

    const basePrice = selectedMenuItem.sizes[size];
    const crustPrice = withCheeseCrust
      ? cheeseCrustPrices[size] || 0
      : 0;

    addConfiguredItem({
      menuId: selectedMenuItem.id,
      name: `Pizza ${selectedMenuItem.name} ${size}`,
      price: basePrice + crustPrice,
      details: withCheeseCrust
        ? `Borde de queso +${money(crustPrice)}`
        : "Sin borde de queso",
      note
    });
  }

  if (selectedMenuItem.type === "preparation") {
    const optionIndex = Number(
      document.querySelector(
        'input[name="preparationOption"]:checked'
      )?.value
    );

    const option = selectedMenuItem.options[optionIndex];

    if (!option) return;

    addConfiguredItem({
      menuId: selectedMenuItem.id,
      name: `${selectedMenuItem.name} ${option.label}`,
      price: option.price,
      details: option.label,
      note
    });
  }

  if (selectedMenuItem.type === "side") {
    const side = document.querySelector(
      'input[name="sideOption"]:checked'
    )?.value;

    if (!side) return;

    addConfiguredItem({
      menuId: selectedMenuItem.id,
      name: selectedMenuItem.name,
      price: selectedMenuItem.price,
      details: `Guarnición: ${side}`,
      note
    });
  }

  selectedMenuItem = null;
  productOptionsModal?.hide();
}

function addConfiguredItem(item) {
  const key = `${item.menuId}|${item.name}|${item.details}|${item.note}`;
  const existing = posCart.find(cartItem => cartItem.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    posCart.push({
      ...item,
      key,
      qty: 1
    });
  }

  savePOSCart();
  renderPOSCart();
}

function renderPOSCart() {
  const container = document.getElementById("posCartItems");
  const totalLabel = document.getElementById("posCartTotal");
  const countLabel = document.getElementById("posCartCount");

  if (!container || !totalLabel) return;

  const itemCount = posCart.reduce((sum, item) => sum + item.qty, 0);
  if (countLabel) countLabel.textContent = itemCount;

  if (!posCart.length) {
    container.innerHTML = `
      <div class="pos-empty-state">
        <i class="bi bi-basket"></i>
        <p>No hay productos seleccionados.</p>
      </div>
    `;

    totalLabel.innerHTML = `
      <div class="d-flex justify-content-between">
        <span>Total</span>
        <strong>RD$0</strong>
      </div>
    `;
    return;
  }

  let subtotal = 0;

  container.innerHTML = posCart.map((item, index) => {
    const itemSubtotal = item.qty * item.price;
    subtotal += itemSubtotal;

    return `
      <div class="pos-cart-item">
        <div class="pos-cart-item-main">
          <div>
            <strong>${item.name}</strong>
            ${item.details ? `<small>${item.details}</small>` : ""}
            ${item.note ? `<small class="pos-item-note">Nota: ${item.note}</small>` : ""}
          </div>
          <strong>${money(itemSubtotal)}</strong>
        </div>

        <div class="pos-cart-item-actions">
          <div class="pos-qty-control">
            <button onclick="decreasePOSItem(${index})">−</button>
            <span>${item.qty}</span>
            <button onclick="increasePOSItem(${index})">+</button>
          </div>

          <button class="pos-remove-btn" onclick="removePOSItem(${index})" aria-label="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");

  const itbis = subtotal * ITBIS_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + itbis + service;

  totalLabel.innerHTML = `
    <div class="d-flex justify-content-between">
      <span>Subtotal</span>
      <strong>${money(subtotal)}</strong>
    </div>
    <div class="d-flex justify-content-between">
      <span>ITBIS 18%</span>
      <strong>${money(itbis)}</strong>
    </div>
    <div class="d-flex justify-content-between">
      <span>Propina legal 10%</span>
      <strong>${money(service)}</strong>
    </div>
    <hr>
    <div class="d-flex justify-content-between pos-grand-total">
      <span>Total</span>
      <strong>${money(total)}</strong>
    </div>
  `;
}

function increasePOSItem(index) {
  if (!posCart[index]) return;
  posCart[index].qty += 1;
  savePOSCart();
  renderPOSCart();
}

function decreasePOSItem(index) {
  if (!posCart[index]) return;
  posCart[index].qty -= 1;

  if (posCart[index].qty <= 0) posCart.splice(index, 1);

  savePOSCart();
  renderPOSCart();
}

function removePOSItem(index) {
  posCart.splice(index, 1);
  savePOSCart();
  renderPOSCart();
}

function clearPOSCart() {
  if (!posCart.length) return;
  if (!confirm("¿Limpiar la orden actual?")) return;

  posCart = [];
  const note = document.getElementById("orderNote");
  if (note) note.value = "";

  savePOSCart();
  renderPOSCart();
}

function completePOSOrder() {
  if (!posCart.length) {
    alert("No hay productos en la orden.");
    return;
  }

  const sales = JSON.parse(localStorage.getItem("sales")) || [];
  const subtotal = posCart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const itbis = subtotal * ITBIS_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + itbis + service;
  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();
  const orderNote = document.getElementById("orderNote")?.value.trim() || "";

  const sale = {
    ticket: `LC-${String(sales.length + 1).padStart(5, "0")}`,
    date: new Date().toLocaleString("es-DO"),
    createdAt: new Date().toISOString(),
    type: orderType,
    table: tableId ? tableId.replace("table-", "Mesa ") : "Para llevar",
    items: structuredClone(posCart),
    note: orderNote,
    subtotal,
    itbis,
    service,
    total,
    status: "Completed"
  };

  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  posCart = [];

  if (orderType === "table" && tableId) {
    tableOrders[tableId] = { type: "table", tableId, items: [], note: "" };
    saveTableOrders();
  } else {
    localStorage.setItem("takeoutOrder", "[]");
    localStorage.removeItem("takeoutOrderNote");
  }

  alert(`Venta guardada correctamente\n\nTicket: ${sale.ticket}\nTotal: ${money(total)}`);
  loadPage("dashboard");
}

function getOpenOrders() {
  const tableOrdersData = JSON.parse(localStorage.getItem("tableOrders")) || {};
  const takeoutOrder = JSON.parse(localStorage.getItem("takeoutOrder")) || [];
  const openOrders = [];

  Object.entries(tableOrdersData).forEach(([tableId, order]) => {
    if (!order?.items?.length) return;

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    openOrders.push({
      order: `OPEN-${tableId.replace("table-", "").padStart(3, "0")}`,
      type: "Dine-In",
      table: tableId.replace("table-", "Mesa "),
      customer: "Walk In",
      total: subtotal * (1 + ITBIS_RATE + SERVICE_RATE),
      status: "Preparing"
    });
  });

  if (takeoutOrder.length) {
    const subtotal = takeoutOrder.reduce((sum, item) => sum + item.price * item.qty, 0);
    openOrders.push({
      order: "OPEN-TK",
      type: "Takeout",
      table: "-",
      customer: "Walk In",
      total: subtotal * (1 + ITBIS_RATE + SERVICE_RATE),
      status: "Preparing"
    });
  }

  return openOrders;
}

function renderOrdersPage() {
  const openOrders = getOpenOrders();

  appContent.innerHTML = `
    <div class="crm-card">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1">🧾 Órdenes</h2>
          <p class="text-muted mb-0">Órdenes abiertas del restaurante.</p>
        </div>
        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> Nueva orden
        </button>
      </div>

      ${openOrders.length === 0 ? `
        <div class="alert alert-info mb-0">No hay órdenes abiertas ahora mismo.</div>
      ` : `
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Tipo</th>
                <th>Mesa</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${openOrders.map(order => `
                <tr>
                  <td><strong>${order.order}</strong></td>
                  <td>${order.type}</td>
                  <td>${order.table}</td>
                  <td>${order.customer}</td>
                  <td><strong>${money(order.total)}</strong></td>
                  <td><span class="badge bg-warning text-dark">${order.status}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary"
                      onclick="openOrderFromList('${order.table}')">Ver</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function openOrderFromList(tableName) {
  if (tableName === "-") {
    startTakeoutOrder();
    return;
  }

  openTableOrder(tableName.toLowerCase().replace("mesa ", "table-"));
}

function initSales() {
  renderSales();
}

function renderSales() {
  const container = document.getElementById("salesList");
  if (!container) return;

  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  if (!sales.length) {
    container.innerHTML = `<div class="alert alert-info mb-0">No hay ventas registradas todavía.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${sales.slice().reverse().map(sale => `
            <tr>
              <td><strong>${sale.ticket}</strong></td>
              <td>${sale.date}</td>
              <td>${sale.table || "Para llevar"}</td>
              <td>${sale.items.reduce((sum, item) => sum + item.qty, 0)}</td>
              <td><strong>${money(sale.total)}</strong></td>
              <td><span class="badge bg-success">${sale.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function clearSalesHistory() {
  if (!confirm("¿Seguro que deseas borrar todo el historial de ventas?")) return;
  localStorage.removeItem("sales");
  renderSales();
}

function renderDashboardPage() {
  tableOrders = JSON.parse(localStorage.getItem("tableOrders")) || {};
  const sales = JSON.parse(localStorage.getItem("sales")) || [];
  const tables = getTables();
  const openOrders = getOpenOrders();

  const openTables = tables.filter(table => !table.occupied).length;
  const occupiedTables = tables.filter(table => table.occupied).length;

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysSales = sales.filter(sale =>
    sale.createdAt
      ? sale.createdAt.slice(0, 10) === todayKey
      : new Date(sale.date).toDateString() === new Date().toDateString()
  );

  const todaySalesTotal = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  appContent.innerHTML = `
    <div class="crm-card mb-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1">🍕 Restaurant Dashboard</h2>
          <p class="text-muted mb-0">Actividad actual del restaurante.</p>
        </div>
        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> Nueva orden
        </button>
      </div>

      <div class="row g-3">
        ${renderDashboardStat("Mesas disponibles", openTables)}
        ${renderDashboardStat("Mesas ocupadas", occupiedTables)}
        ${renderDashboardStat("Órdenes abiertas", openOrders.length)}
        ${renderDashboardStat("Ventas de hoy", money(todaySalesTotal))}
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="crm-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="fw-bold mb-0">Órdenes recientes</h3>
            <button class="btn btn-outline-success btn-sm" onclick="loadPage('orders')">Ver todas</button>
          </div>

          ${openOrders.length === 0 ? `
            <div class="alert alert-info mb-0">No hay órdenes abiertas ahora mismo.</div>
          ` : `
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Mesa</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${openOrders.map(order => `
                    <tr>
                      <td><strong>${order.order}</strong></td>
                      <td>${order.table}</td>
                      <td>${order.customer}</td>
                      <td><strong>${money(order.total)}</strong></td>
                      <td><span class="badge bg-warning text-dark">${order.status}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>

      <div class="col-lg-4">
        <div class="crm-card">
          <h3 class="fw-bold mb-3">Acciones rápidas</h3>
          <button class="quick-action-btn btn-new-order mb-3" onclick="startTakeoutOrder()">
            <i class="bi bi-plus-circle"></i> Nueva orden
          </button>
          <button class="quick-action-btn btn-tables mb-3" onclick="loadPage('tables')">
            <i class="bi bi-grid-3x3-gap"></i> Administrar mesas
          </button>
          <button class="quick-action-btn btn-pos mb-3" onclick="startTakeoutOrder()">
            <i class="bi bi-receipt"></i> POS / Menú
          </button>
          <button class="quick-action-btn btn-sales" onclick="loadPage('sales')">
            <i class="bi bi-graph-up"></i> Historial de ventas
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardStat(label, value) {
  return `
    <div class="col-sm-6 col-xl-3">
      <div class="crm-stat-card">
        <h6>${label}</h6>
        <h3>${value}</h3>
      </div>
    </div>
  `;
}

loadPage("dashboard");
