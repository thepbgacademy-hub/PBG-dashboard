import { fetchDashboardData } from './src/api.js';
import { renderDashboardMarkup } from './src/dashboard.js';
import { createSessionState, renderLoginMarkup } from './src/login.js';
import { sampleDashboardData } from './src/sample-data.js';

const root = document.querySelector('#dashboard-root');
const connectionStatus = document.querySelector('#connection-status');
const logoutButton = document.querySelector('#logout-button');
const config = window.DASHBOARD_CONFIG ?? {};
const sessionKey = 'guild-academy-session';

function readSession() {
  try {
    const raw = window.sessionStorage.getItem(sessionKey);
    return raw ? JSON.parse(raw) : { authenticated: false, userId: '' };
  } catch {
    return { authenticated: false, userId: '' };
  }
}

function writeSession(session) {
  try {
    window.sessionStorage.setItem(sessionKey, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

function clearSession() {
  try {
    window.sessionStorage.removeItem(sessionKey);
  } catch {
    // Ignore storage failures and fall back to in-memory navigation.
  }
}

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

function setToolbarState(authenticated) {
  if (connectionStatus) {
    connectionStatus.hidden = !authenticated;
  }

  if (logoutButton) {
    logoutButton.hidden = !authenticated;
  }
}

function renderLogin(error = '', values = {}) {
  if (!root) {
    return;
  }

  setToolbarState(false);
  root.innerHTML = renderLoginMarkup({ error, userId: values.userId ?? '' });
  const form = document.querySelector('#login-form');
  const demoButton = document.querySelector('#demo-access-button');

  if (!form) {
    return;
  }

  async function unlockWithCredentials(userId, password) {
    const session = createSessionState({ userId, password });
    writeSession(session);
    await loadDashboard();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.querySelector('#login-user-id')?.value ?? '';
    const password = document.querySelector('#login-password')?.value ?? '';
    await unlockWithCredentials(userId, password);
  });

  demoButton?.addEventListener('click', async () => {
    const userIdInput = document.querySelector('#login-user-id');
    const passwordInput = document.querySelector('#login-password');

    if (userIdInput) {
      userIdInput.value = '123465';
    }

    if (passwordInput) {
      passwordInput.value = 'admin';
    }

    await unlockWithCredentials('123465', 'admin');
  });
}

async function loadDashboard() {
  if (!root) {
    return;
  }

  setToolbarState(true);

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

logoutButton?.addEventListener('click', () => {
  clearSession();
  renderLogin();
});

const session = readSession();

if (session.authenticated) {
  loadDashboard();
} else {
  renderLogin();
}
