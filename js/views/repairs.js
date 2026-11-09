export function render(container) {
  container.innerHTML = `
    <header class="page-header">
      <h1>Repair History</h1>
      <p class="page-subtitle">Past problems, fixes and costs.</p>
    </header>

    <section class="card">
      <p class="empty-state">No repairs recorded yet.</p>
    </section>
  `;
}