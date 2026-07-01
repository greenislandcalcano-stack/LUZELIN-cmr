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
