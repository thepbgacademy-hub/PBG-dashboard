const DEMO_USER_ID = '123465';
const DEMO_PASSWORD = 'admin';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function isValidDemoLogin({ userId = '', password = '' } = {}) {
  return String(userId).trim() === DEMO_USER_ID && String(password) === DEMO_PASSWORD;
}

export function createSessionState(credentials = {}) {
  if (isValidDemoLogin(credentials)) {
    return {
      authenticated: true,
      userId: DEMO_USER_ID,
      error: '',
    };
  }

  return {
    authenticated: false,
    userId: '',
    error: 'Invalid user ID or password.',
  };
}

export function renderLoginMarkup({ error = '' } = {}) {
  const errorMarkup = error
    ? `<p class="login-error" role="alert">${escapeHtml(error)}</p>`
    : '';

  return `
    <section class="login-screen">
      <article class="login-frame">
        <div class="login-frame__brand">
          <img
            class="login-frame__sigil"
            src="./assets/academy-sigil.svg"
            alt="Guild Academy sigil"
          >
          <div>
            <p class="section-label">Academy Access</p>
            <h3>Student login</h3>
          </div>
        </div>

        <p class="login-frame__intro">
          Enter your academy credentials to unlock the student console.
        </p>

        <form id="login-form" class="login-form">
          <label class="login-field">
            <span>User ID</span>
            <input id="login-user-id" name="userId" type="text" inputmode="numeric" autocomplete="username">
          </label>

          <label class="login-field">
            <span>Password</span>
            <input id="login-password" name="password" type="password" autocomplete="current-password">
          </label>

          ${errorMarkup}

          <button class="login-submit" type="submit">Unlock Dashboard</button>
        </form>

        <div class="login-hint">
          <p class="section-label">Demo Credentials</p>
          <p>UI: <strong>${DEMO_USER_ID}</strong></p>
          <p>PW: <strong>${DEMO_PASSWORD}</strong></p>
        </div>
      </article>
    </section>
  `;
}
