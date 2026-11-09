export function render(container) {
  container.innerHTML = `
    <header class="page-header">
      <h1>My Appliances</h1>
      <p class="page-subtitle">Everything you own, in one place.</p>
    </header>

    <section class="card">
      <p class="empty-state">No appliances registered yet.</p>
    </section>
  `;
}