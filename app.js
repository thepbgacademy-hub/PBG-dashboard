import { fetchDashboardData } from './src/api.js';
import { renderDashboardMarkup } from './src/dashboard.js';
import { sampleDashboardData } from './src/sample-data.js';

const root = document.querySelector('#dashboard-root');
const connectionStatus = document.querySelector('#connection-status');
const config = window.DASHBOARD_CONFIG ?? {};

function updateConnectionStatus(source, errorMessage = '') {
  if (!connectionStatus) {
    return;
  }

  connectionStatus.classList.remove('is-live', 'is-fallback');

  if (source === 'live') {
    connectionStatus.textContent = 'Connected to n8n live data';
    connectionStatus.classList.add('is-live');
    return;
  }

  connectionStatus.textContent = errorMessage
    ? `Showing sample data: ${errorMessage}`
    : 'Showing sample data';
  connectionStatus.classList.add('is-fallback');
}

async function loadDashboard() {
  if (!root) {
    return;
  }

  try {
    const result = await fetchDashboardData({
      endpoint: config.endpoint,
      studentId: config.studentId,
      fallbackData: sampleDashboardData,
    });

    root.innerHTML = renderDashboardMarkup(result.data);
    updateConnectionStatus(result.source);
  } catch (error) {
    root.innerHTML = renderDashboardMarkup(sampleDashboardData);
    updateConnectionStatus('sample', error.message);
  }
}

loadDashboard();
