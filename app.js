const appContent = document.getElementById("app-content");
const pageTitle = document.getElementById("page-title");
const navLinks = document.querySelectorAll(".crm-nav a");

async function loadPage(page) {
  try {
    const response = await fetch(`assets/pages/${page}.html`);

    if (!response.ok) {
      throw new Error("Page not found");
    }

    const html = await response.text();
    appContent.innerHTML = html;
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);

  } catch (error) {
    appContent.innerHTML = `
      <div class="crm-card">
        <h3>Page not found</h3>
        <p>Please make sure <strong>pages/${page}.html</strong> exists.</p>
      </div>
    `;
    if (page === "sales") initSales();
  }
}

navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    navLinks.forEach(item => item.classList.remove("active"));
    this.classList.add("active");

    const page = this.getAttribute("data-page");
    loadPage(page);
  });
});

loadPage("dashboard");
/* =====================================================
   LOS COQUITOS POS
===================================================== */

let posCart = [];

function addToPOS(name, price) {

    const existing = posCart.find(i => i.name === name);

    if (existing) {
        existing.qty++;
    } else {
        posCart.push({
            name,
            price,
            qty: 1
        });
    }

    renderPOSCart();
}

function renderPOSCart() {

    const container = document.getElementById("posCartItems");
    const totalLabel = document.getElementById("posCartTotal");

    if (!container || !totalLabel) return;

    if (posCart.length === 0) {

        container.innerHTML =
            `<p class="text-muted">No hay productos seleccionados.</p>`;

        totalLabel.textContent = "RD$0";

        return;
    }

    let html = "";
    let total = 0;

    posCart.forEach((item, index) => {

        const subtotal = item.qty * item.price;
        total += subtotal;

        html += `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">

            <div>
                <strong>${item.name}</strong><br>
                <small>${item.qty} x RD$${item.price}</small>
            </div>

            <div class="text-end">

                <strong>RD$${subtotal}</strong>

                <div class="mt-1">

                    <button class="btn btn-sm btn-outline-secondary"
                        onclick="decreasePOSItem(${index})">
                        -
                    </button>

                    <button class="btn btn-sm btn-outline-secondary"
                        onclick="increasePOSItem(${index})">
                        +
                    </button>

                    <button class="btn btn-sm btn-outline-danger"
                        onclick="removePOSItem(${index})">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>

            </div>

        </div>
        `;
    });

    container.innerHTML = html;
    totalLabel.textContent = "RD$" + total.toLocaleString();

}

function increasePOSItem(index) {

    posCart[index].qty++;
    renderPOSCart();

}

function decreasePOSItem(index) {

    posCart[index].qty--;

    if (posCart[index].qty <= 0) {
        posCart.splice(index, 1);
    }

    renderPOSCart();

}

function removePOSItem(index) {

    posCart.splice(index, 1);
    renderPOSCart();

}

function clearPOSCart() {

    if (!confirm("¿Limpiar la orden actual?")) return;

    posCart = [];
    renderPOSCart();

}

function completePOSOrder() {

    if (posCart.length === 0) {
        alert("No hay productos en la orden.");
        return;
    }

    let sales = JSON.parse(localStorage.getItem("sales")) || [];

    let total = 0;

    posCart.forEach(item => {
        total += item.qty * item.price;
    });

    const sale = {
        ticket: "LC-" + String(sales.length + 1).padStart(5, "0"),
        date: new Date().toLocaleString(),
        items: posCart,
        total: total,
        status: "Completed"
    };

    sales.push(sale);

    localStorage.setItem("sales", JSON.stringify(sales));

    alert(
`Venta guardada correctamente

Ticket: ${sale.ticket}
Total: RD$${total.toLocaleString()}`
    );

    posCart = [];
    renderPOSCart();

}
/* =====================================================
   LOS COQUITOS SALES
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
                <td>${itemsCount}</td>
                <td><strong>RD$${sale.total.toLocaleString()}</strong></td>
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
