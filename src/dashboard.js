function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  if (!value) {
    return 'TBD';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatCurrency(amount) {
  const value = Number(amount ?? 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatGuildies(amount) {
  const value = Math.round(Number(amount ?? 0));
  return `${new Intl.NumberFormat('en-US').format(value)} Guildies`;
}

export function formatProgressLabel(percent) {
  return `${Math.round(Number(percent ?? 0))}% complete`;
}

function buildFullName(student = {}) {
  if (student.fullName) {
    return student.fullName;
  }

  return [student.firstName, student.lastName].filter(Boolean).join(' ').trim() || 'Student';
}

function getStatusTone(label) {
  const normalized = String(label ?? '').toLowerCase();

  if (normalized.includes('attention')) {
    return 'needs-attention';
  }

  if (normalized.includes('track')) {
    return 'on-track';
  }

  return 'steady';
}

export function normalizeDashboardPayload(payload = {}) {
  const student = payload.student ?? {};
  const progress = payload.progress ?? {};
  const balances = payload.balances ?? {};

  return {
    student: {
      id: student.id ?? '',
      firstName: student.firstName ?? '',
      lastName: student.lastName ?? '',
      fullName: buildFullName(student),
      program: student.program ?? 'Guild Academy Program',
      cohort: student.cohort ?? 'Current Term',
    },
    status: {
      label: payload.status?.label ?? 'Steady Progress',
      updatedAt: payload.status?.updatedAt ?? '',
    },
    progress: {
      percent: Number(progress.percent ?? 0),
      completed: Number(progress.completed ?? 0),
      total: Number(progress.total ?? 0),
      summary: progress.summary ?? 'Progress is being tracked through n8n.',
    },
    balances: {
      cash: Number(balances.cash ?? 0),
      guildies: Number(balances.guildies ?? 0),
    },
    upcoming: Array.isArray(payload.upcoming) ? payload.upcoming : [],
    transactions: Array.isArray(payload.transactions) ? payload.transactions : [],
    notes: Array.isArray(payload.notes) ? payload.notes : [],
    links: Array.isArray(payload.links) ? payload.links : [],
  };
}

function renderDeadlineCard(item) {
  return `
    <article class="deadline-card">
      <p class="mini-label">${escapeHtml(item.course ?? 'Upcoming')}</p>
      <h4>${escapeHtml(item.title ?? 'Untitled item')}</h4>
      <p>Due ${escapeHtml(formatDate(item.dueDate))}</p>
    </article>
  `;
}

function renderTransaction(item) {
  const isGuildies = String(item.type ?? '').toLowerCase() === 'guildies';
  const amount = isGuildies
    ? formatGuildies(item.amount)
    : formatCurrency(item.amount);

  return `
    <article class="transaction">
      <div>
        <strong>${escapeHtml(item.title ?? 'Account activity')}</strong>
        <p class="transaction__meta">${escapeHtml(formatDate(item.date))}</p>
      </div>
      <div class="transaction__amount transaction__amount--${isGuildies ? 'guildies' : 'cash'}">
        ${escapeHtml(amount)}
      </div>
    </article>
  `;
}

function renderNote(item) {
  return `
    <article class="note-card">
      <p class="mini-label">${escapeHtml(item.title ?? 'Teacher Note')}</p>
      <p>${escapeHtml(item.body ?? '')}</p>
    </article>
  `;
}

function renderLink(item) {
  return `
    <a class="quick-link" href="${escapeHtml(item.href ?? '#')}">
      <div>
        <strong>${escapeHtml(item.label ?? 'Open')}</strong>
        <p class="quick-link__meta">${escapeHtml(item.description ?? 'Student shortcut')}</p>
      </div>
      <span aria-hidden="true">Open</span>
    </a>
  `;
}

function renderList(items, renderer, emptyLabel) {
  if (!items.length) {
    return `<p class="empty-state">${escapeHtml(emptyLabel)}</p>`;
  }

  return `<div class="list">${items.map(renderer).join('')}</div>`;
}

export function renderDashboardMarkup(payload) {
  const data = normalizeDashboardPayload(payload);
  const progressWidth = Math.max(0, Math.min(100, data.progress.percent));
  const statusTone = getStatusTone(data.status.label);

  return `
    <div class="dashboard">
      <section class="student-header">
        <article class="panel">
          <p class="section-label">Student Profile</p>
          <h3 class="student-header__name">${escapeHtml(data.student.fullName)}</h3>
          <div class="student-header__meta">
            <span class="meta-pill">${escapeHtml(data.student.program)}</span>
            <span class="meta-pill">${escapeHtml(data.student.cohort)}</span>
            <span class="meta-pill">${escapeHtml(formatDate(data.status.updatedAt))}</span>
          </div>
        </article>
        <article class="panel">
          <p class="section-label">Current Status</p>
          <div class="status-pill status-pill--${statusTone}">
            ${escapeHtml(data.status.label)}
          </div>
          <p class="card__subtext">${escapeHtml(data.progress.summary)}</p>
        </article>
      </section>

      <section class="summary-grid">
        <article class="panel">
          <p class="section-label">Course Progress</p>
          <p class="card__value">${escapeHtml(formatProgressLabel(data.progress.percent))}</p>
          <p class="card__subtext">${escapeHtml(`${data.progress.completed} of ${data.progress.total} milestones complete`)}</p>
          <div class="progress-meter" aria-hidden="true">
            <div class="progress-meter__track">
              <div class="progress-meter__fill" style="width:${progressWidth}%"></div>
            </div>
          </div>
        </article>

        <article class="panel">
          <p class="section-label">Cash On Deposit</p>
          <p class="card__value">${escapeHtml(formatCurrency(data.balances.cash))}</p>
          <p class="card__subtext">Available for tuition, sessions, and academy purchases.</p>
        </article>

        <article class="panel">
          <p class="section-label">Guildies Balance</p>
          <p class="card__value">${escapeHtml(formatGuildies(data.balances.guildies))}</p>
          <p class="card__subtext">Internal academy credits for rewards, unlocks, and perks.</p>
        </article>
      </section>

      <section class="content-grid">
        <div class="stack">
          <article class="panel">
            <p class="section-label">Upcoming Deadlines</p>
            ${renderList(data.upcoming, renderDeadlineCard, 'No deadlines are currently scheduled.')}
          </article>

          <article class="panel">
            <p class="section-label">Teacher Notes</p>
            ${renderList(data.notes, renderNote, 'No notes have been posted yet.')}
          </article>
        </div>

        <div class="stack">
          <article class="panel">
            <p class="section-label">Recent Account Activity</p>
            ${renderList(data.transactions, renderTransaction, 'No account activity to show yet.')}
          </article>

          <article class="panel">
            <p class="section-label">Quick Links</p>
            ${renderList(data.links, renderLink, 'No quick links configured yet.')}
          </article>
        </div>
      </section>
    </div>
  `;
}
