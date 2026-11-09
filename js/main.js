import { render as renderDashboard } from './views/dashboard.js';
import { render as renderAppliances } from './views/appliances.js';
import { render as renderMaintenance } from './views/maintenance.js';
import { render as renderRepairs } from './views/repairs.js';
import { initThemeToggle } from './theme.js';

// Each route has a page title and a function that draws its content.
const routes = {
  dashboard: { title: 'Dashboard', render: renderDashboard },
  appliances: { title: 'My Appliances', render: renderAppliances },
  maintenance: { title: 'Maintenance', render: renderMaintenance },
  repairs: { title: 'Repair History', render: renderRepairs },
};

const DEFAULT_ROUTE = 'dashboard';

const content = document.getElementById('content');
const navLinks = document.querySelectorAll('.nav-link');

// Reads "#appliances" from the URL and returns "appliances".
// Unknown or empty hashes fall back to the dashboard.
function getRouteName() {
  const name = window.location.hash.slice(1);
  return Object.hasOwn(routes, name) ? name : DEFAULT_ROUTE;
}

function highlightActiveLink(activeName) {
  navLinks.forEach((link) => {
    if (link.dataset.route === activeName) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function showCurrentRoute() {
  const name = getRouteName();
  const route = routes[name];

  document.title = `${route.title} – HomeFix`;
  highlightActiveLink(name);

  content.replaceChildren(); // clear the previous page
  route.render(content);
}

window.addEventListener('hashchange', showCurrentRoute);
showCurrentRoute(); // draw the right page when the app first loads
initThemeToggle();