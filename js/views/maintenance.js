export function render(container) {
  container.innerHTML = `
    <header class="page-header">
      <h1>Maintenance</h1>
      <p class="page-subtitle">Upcoming, overdue and completed tasks.</p>
    </header>

    <section class="card">
      <p class="empty-state">No maintenance tasks yet.</p>
    </section>
  `;
}