const appContent = document.getElementById("app-content");
const pageTitle = document.getElementById("page-title");
const navLinks = document.querySelectorAll(".crm-nav a");

/* =====================================================
   GLOBAL SETTINGS
===================================================== */

const TOTAL_TABLES = 12;
let tableOrders = JSON.parse(localStorage.getItem("tableOrders")) || {};
let posCart = [];

/* =====================================================
   PAGE LOADER
===================================================== */

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

    if (!response.ok) {
      throw new Error("Page not found");
    }

    const html = await response.text();
    appContent.innerHTML = html;
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);

    document.querySelectorAll(".page-btn").forEach(button => {
      button.addEventListener("click", function () {
        const targetPage = this.getAttribute("data-page");

        if (targetPage === "menu") {
          startTakeoutOrder();
        } else {
          loadPage(targetPage);
        }
      });
    });

    if (page === "menu") {
      loadPOSCart();
      renderPOSCart();
    }

    if (page === "sales") {
      initSales();
    }

  } catch (error) {
    appContent.innerHTML = `
      <div class="crm-card">
        <h3>Page not found</h3>
        <p>Please make sure <strong>assets/pages/${page}.html</strong> exists.</p>
      </div>
    `;
  }
}

/* =====================================================
   NAVIGATION
===================================================== */

navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    navLinks.forEach(item => item.classList.remove("active"));
    this.classList.add("active");

    const page = this.getAttribute("data-page");

    if (page === "menu") {
      startTakeoutOrder();
    } else {
      loadPage(page);
    }
  });
});

/* =====================================================
   TABLES
===================================================== */

function saveTableOrders() {
  localStorage.setItem("tableOrders", JSON.stringify(tableOrders));
}

function getTables() {
  const tables = [];

  for (let i = 1; i <= TOTAL_TABLES; i++) {
    const tableId = `table-${i}`;
    const order = tableOrders[tableId];

    tables.push({
      id: tableId,
      number: i,
      occupied: order && order.items && order.items.length > 0
    });
  }

  return tables;
}

function renderTablesPage() {
  const tables = getTables();
  const openTables = tables.filter(table => !table.occupied).length;
  const occupiedTables = tables.filter(table => table.occupied).length;

  appContent.innerHTML = `
    <div class="crm-card">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">🪑 Tables</h2>
          <p class="text-muted mb-0">Select a table, takeout, or delivery to start an order.</p>
        </div>

        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> New Takeout Order
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="crm-stat-card">
            <h6>Open Tables</h6>
            <h3>${openTables}</h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="crm-stat-card">
            <h6>Occupied Tables</h6>
            <h3>${occupiedTables}</h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="crm-stat-card">
            <h6>Total Tables</h6>
            <h3>${TOTAL_TABLES}</h3>
          </div>
        </div>
      </div>

      <div class="row g-3">
        ${tables.map(table => `
          <div class="col-6 col-md-4 col-lg-3">
            <button 
              class="table-card ${table.occupied ? "occupied" : "available"}"
              onclick="openTableOrder('${table.id}')"
            >
              <div class="table-number">Table ${table.number}</div>
              <div class="table-status">
                ${table.occupied ? "Occupied" : "Available"}
              </div>
            </button>
          </div>
        `).join("")}
      </div>

    </div>
  `;
}

function openTableOrder(tableId) {
  if (!tableOrders[tableId]) {
    tableOrders[tableId] = {
      type: "table",
      tableId,
      items: []
    };
    saveTableOrders();
  }

  localStorage.setItem("activeOrderType", "table");
  localStorage.setItem("activeTableId", tableId);

  loadPage("menu");
}

function startTakeoutOrder() {
  localStorage.setItem("activeOrderType", "takeout");
  localStorage.removeItem("activeTableId");

  posCart = JSON.parse(localStorage.getItem("takeoutOrder")) || [];

  loadPage("menu");
}

/* =====================================================
   POS
===================================================== */

function getActiveOrderType() {
  return localStorage.getItem("activeOrderType") || "takeout";
}

function getActiveTableId() {
  return localStorage.getItem("activeTableId");
}

function loadPOSCart() {
  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();

  if (orderType === "table" && tableId) {
    if (!tableOrders[tableId]) {
      tableOrders[tableId] = {
        type: "table",
        tableId,
        items: []
      };
      saveTableOrders();
    }

    posCart = tableOrders[tableId].items || [];
  } else {
    posCart = JSON.parse(localStorage.getItem("takeoutOrder")) || [];
  }
}

function savePOSCart() {
  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();

  if (orderType === "table" && tableId) {
    if (!tableOrders[tableId]) {
      tableOrders[tableId] = {
        type: "table",
        tableId,
        items: []
      };
    }

    tableOrders[tableId].items = posCart;
    saveTableOrders();
  } else {
    localStorage.setItem("takeoutOrder", JSON.stringify(posCart));
  }
}

function addToPOS(name, price) {
  const existing = posCart.find(item => item.name === name);

  if (existing) {
    existing.qty++;
  } else {
    posCart.push({
      name,
      price,
      qty: 1
    });
  }

  savePOSCart();
  renderPOSCart();
}

function renderPOSCart() {
  const container = document.getElementById("posCartItems");
  const totalLabel = document.getElementById("posCartTotal");

  if (!container || !totalLabel) return;

  if (posCart.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay productos seleccionados.</p>`;
    totalLabel.textContent = "RD$0";
    return;
  }

  let html = "";
  let subtotal = 0;

  posCart.forEach((item, index) => {
    const itemSubtotal = item.qty * item.price;
    subtotal += itemSubtotal;

    html += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.qty} x RD$${item.price}</small>
        </div>

        <div class="text-end">
          <strong>RD$${itemSubtotal.toLocaleString()}</strong>

          <div class="mt-1">
            <button class="btn btn-sm btn-outline-secondary" onclick="decreasePOSItem(${index})">-</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="increasePOSItem(${index})">+</button>
            <button class="btn btn-sm btn-outline-danger" onclick="removePOSItem(${index})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  const itbis = subtotal * 0.18;
  const service = subtotal * 0.10;
  const total = subtotal + itbis + service;

  container.innerHTML = html;

  totalLabel.innerHTML = `
    <div class="text-start">
      <div class="d-flex justify-content-between">
        <span>Subtotal</span>
        <strong>RD$${subtotal.toLocaleString()}</strong>
      </div>

      <div class="d-flex justify-content-between">
        <span>ITBIS 18%</span>
        <strong>RD$${itbis.toLocaleString()}</strong>
      </div>

      <div class="d-flex justify-content-between">
        <span>Propina legal 10%</span>
        <strong>RD$${service.toLocaleString()}</strong>
      </div>

      <hr>

      <div class="d-flex justify-content-between fs-5">
        <span>Total</span>
        <strong>RD$${total.toLocaleString()}</strong>
      </div>
    </div>
  `;
}

function increasePOSItem(index) {
  posCart[index].qty++;
  savePOSCart();
  renderPOSCart();
}

function decreasePOSItem(index) {
  posCart[index].qty--;

  if (posCart[index].qty <= 0) {
    posCart.splice(index, 1);
  }

  savePOSCart();
  renderPOSCart();
}

function removePOSItem(index) {
  posCart.splice(index, 1);
  savePOSCart();
  renderPOSCart();
}

function clearPOSCart() {
  if (!confirm("¿Limpiar la orden actual?")) return;

  posCart = [];
  savePOSCart();
  renderPOSCart();
}

function completePOSOrder() {
  if (posCart.length === 0) {
    alert("No hay productos en la orden.");
    return;
  }

  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  const subtotal = posCart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const itbis = subtotal * 0.18;
  const service = subtotal * 0.10;
  const total = subtotal + itbis + service;

  const orderType = getActiveOrderType();
  const tableId = getActiveTableId();

  const sale = {
    ticket: "LC-" + String(sales.length + 1).padStart(5, "0"),
    date: new Date().toLocaleString(),
    type: orderType,
    table: tableId ? tableId.replace("table-", "Table ") : "Takeout",
    items: [...posCart],
    subtotal,
    itbis,
    service,
    total,
    status: "Completed"
  };

  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  alert(`
Venta guardada correctamente

Ticket: ${sale.ticket}
Total: RD$${total.toLocaleString()}
  `);

  posCart = [];

  if (orderType === "table" && tableId) {
    tableOrders[tableId].items = [];
    saveTableOrders();
  } else {
    localStorage.setItem("takeoutOrder", JSON.stringify([]));
  }

  renderPOSCart();
}

/* =====================================================
   ORDERS
===================================================== */

function getOpenOrders() {
  const tableOrdersData = JSON.parse(localStorage.getItem("tableOrders")) || {};
  const takeoutOrder = JSON.parse(localStorage.getItem("takeoutOrder")) || [];

  const openOrders = [];

  Object.keys(tableOrdersData).forEach(tableId => {
    const order = tableOrdersData[tableId];

    if (order.items && order.items.length > 0) {
      const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const total = subtotal + subtotal * 0.18 + subtotal * 0.10;

      openOrders.push({
        order: "OPEN-" + tableId.replace("table-", "").padStart(3, "0"),
        type: "Dine-In",
        table: tableId.replace("table-", "Table "),
        customer: "Walk In",
        total,
        status: "Preparing"
      });
    }
  });

  if (takeoutOrder.length > 0) {
    const subtotal = takeoutOrder.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + subtotal * 0.18 + subtotal * 0.10;

    openOrders.push({
      order: "OPEN-TK",
      type: "Takeout",
      table: "-",
      customer: "Walk In",
      total,
      status: "Preparing"
    });
  }

  return openOrders;
}

function renderOrdersPage() {
  const openOrders = getOpenOrders();

  appContent.innerHTML = `
    <div class="crm-card">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">🧾 Orders</h2>
          <p class="text-muted mb-0">Órdenes abiertas del restaurante.</p>
        </div>

        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> New Order
        </button>
      </div>

      ${
        openOrders.length === 0
          ? `
            <div class="alert alert-info mb-0">
              No hay órdenes abiertas ahora mismo.
            </div>
          `
          : `
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Type</th>
                    <th>Table</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  ${openOrders.map(order => `
                    <tr>
                      <td><strong>${order.order}</strong></td>
                      <td>${order.type}</td>
                      <td>${order.table}</td>
                      <td>${order.customer}</td>
                      <td><strong>RD$${order.total.toLocaleString()}</strong></td>
                      <td>
                        <span class="badge bg-warning text-dark">${order.status}</span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="openOrderFromList('${order.table}')">
                          View
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `
      }

    </div>
  `;
}

function openOrderFromList(tableName) {
  if (tableName === "-") {
    startTakeoutOrder();
    return;
  }

  const tableId = tableName.toLowerCase().replace(" ", "-");
  openTableOrder(tableId);
}

/* =====================================================
   SALES
===================================================== */

function initSales() {
  renderSales();
}

function renderSales() {
  const container = document.getElementById("salesList");
  if (!container) return;

  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  if (sales.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info mb-0">
        No hay ventas registradas todavía.
      </div>
    `;
    return;
  }

  let html = `
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
  `;

  sales.slice().reverse().forEach(sale => {
    const itemsCount = sale.items.reduce((sum, item) => sum + item.qty, 0);

    html += `
      <tr>
        <td><strong>${sale.ticket}</strong></td>
        <td>${sale.date}</td>
        <td>${sale.table || "Takeout"}</td>
        <td>${itemsCount}</td>
        <td><strong>RD$${Number(sale.total || 0).toLocaleString()}</strong></td>
        <td>
          <span class="badge bg-success">${sale.status}</span>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

function clearSalesHistory() {
  if (!confirm("¿Seguro que deseas borrar todo el historial de ventas?")) return;

  localStorage.removeItem("sales");
  renderSales();
}

/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboardPage() {
  const sales = JSON.parse(localStorage.getItem("sales")) || [];
  const tables = getTables();
  const openOrders = getOpenOrders();

  const openTables = tables.filter(table => !table.occupied).length;
  const occupiedTables = tables.filter(table => table.occupied).length;

  const today = new Date().toLocaleDateString();

  const todaysSales = sales.filter(sale => {
    return sale.date && sale.date.includes(today);
  });

  const todaySalesTotal = todaysSales.reduce((sum, sale) => {
    return sum + Number(sale.total || 0);
  }, 0);

  appContent.innerHTML = `
    <div class="crm-card mb-4">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">🍕 Restaurant Dashboard</h2>
          <p class="text-muted mb-0">Actividad actual del restaurante.</p>
        </div>

        <button class="btn btn-success" onclick="startTakeoutOrder()">
          <i class="bi bi-plus-circle"></i> New Order
        </button>
      </div>

      <div class="row g-3">
        <div class="col-md-3">
          <div class="crm-stat-card">
            <h6>Open Tables</h6>
            <h3>${openTables}</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="crm-stat-card">
            <h6>Occupied Tables</h6>
            <h3>${occupiedTables}</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="crm-stat-card">
            <h6>Open Orders</h6>
            <h3>${openOrders.length}</h3>
          </div>
        </div>

        <div class="col-md-3">
          <div class="crm-stat-card">
            <h6>Today's Sales</h6>
            <h3>RD$${todaySalesTotal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

    </div>

    <div class="row g-4">

      <div class="col-lg-8">
        <div class="crm-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="fw-bold mb-0">Recent Orders</h3>
            <button class="btn btn-outline-success btn-sm" onclick="loadPage('orders')">
              View All
            </button>
          </div>

          ${
            openOrders.length === 0
              ? `
                <div class="alert alert-info mb-0">
                  No hay órdenes abiertas ahora mismo.
                </div>
              `
              : `
                <div class="table-responsive">
                  <table class="table align-middle">
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Table</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      ${openOrders.map(order => `
                        <tr>
                          <td><strong>${order.order}</strong></td>
                          <td>${order.table}</td>
                          <td>${order.customer}</td>
                          <td><strong>RD$${order.total.toLocaleString()}</strong></td>
                          <td>
                            <span class="badge bg-warning text-dark">${order.status}</span>
                          </td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              `
          }
        </div>
      </div>

      <div class="col-lg-4">
        <div class="crm-card">
          <h3 class="fw-bold mb-3">Quick Actions</h3>

          <button class="btn btn-success w-100 mb-3" onclick="startTakeoutOrder()">
            <i class="bi bi-plus-circle"></i> New Order
          </button>

          <button class="btn btn-warning w-100 mb-3" onclick="loadPage('tables')">
            <i class="bi bi-grid-3x3-gap"></i> Manage Tables
          </button>

          <button class="btn btn-primary w-100 mb-3" onclick="startTakeoutOrder()">
            <i class="bi bi-receipt"></i> POS / Menu
          </button>

          <button class="btn btn-danger w-100" onclick="loadPage('sales')">
            <i class="bi bi-graph-up"></i> Sales History
          </button>
        </div>
      </div>

    </div>
  `;
}

/* =====================================================
   START APP
===================================================== */

loadPage("dashboard");
