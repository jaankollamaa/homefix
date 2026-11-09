// Dashboard view. The numbers are placeholders ("–").
// In Phase 6 they will be calculated from the saved data.
export function render(container) {
  container.innerHTML = `
    <header class="page-header">
      <h1>Dashboard</h1>
      <p class="page-subtitle">An overview of your household.</p>
    </header>

    <section class="stats-grid" aria-label="Summary">
      <article class="stat-card">
        <p class="stat-label">Appliances</p>
        <p class="stat-value">–</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Upcoming maintenance</p>
        <p class="stat-value">–</p>
      </article>
      <article class="stat-card">
        <p class="stat-label">Overdue maintenance</p>
        <p class="stat-value">–</p>
      </article>
    </section>

    <section class="card">
      <h2>Recent activity</h2>
      <p class="empty-state">Nothing here yet. Add an appliance to get started.</p>
    </section>
  `;
}