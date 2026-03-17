import assert from 'node:assert/strict';

import {
  formatCurrency,
  formatGuildies,
  formatProgressLabel,
  normalizeDashboardPayload,
  renderDashboardMarkup,
} from '../src/dashboard.js';
import {
  createSessionState,
  isValidDemoLogin,
  renderLoginMarkup,
} from '../src/login.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('formatCurrency renders usd balances', () => {
  assert.equal(formatCurrency(2450.5), '$2,450.50');
});

runTest('formatGuildies renders whole-number guildie balances', () => {
  assert.equal(formatGuildies(1280), '1,280 Guildies');
});

runTest('formatProgressLabel rounds progress values for display', () => {
  assert.equal(formatProgressLabel(87.2), '87% complete');
});

runTest('normalizeDashboardPayload shapes missing sections into safe defaults', () => {
  const result = normalizeDashboardPayload({
    student: { firstName: 'Ari', lastName: 'Lane' },
    balances: { cash: 400 },
  });

  assert.equal(result.student.fullName, 'Ari Lane');
  assert.equal(result.balances.cash, 400);
  assert.equal(result.balances.guildies, 0);
  assert.deepEqual(result.upcoming, []);
  assert.deepEqual(result.transactions, []);
});

runTest('renderDashboardMarkup includes balances, deadlines, and transactions', () => {
  const markup = renderDashboardMarkup(
    normalizeDashboardPayload({
      student: { fullName: 'Jordan Rivers' },
      status: { label: 'On Track' },
      progress: { percent: 92, completed: 11, total: 12 },
      balances: { cash: 325.75, guildies: 480 },
      upcoming: [
        { title: 'Essay Draft', dueDate: '2026-03-21', course: 'Writing Lab' },
      ],
      transactions: [
        { title: 'Tutoring Deposit', date: '2026-03-15', amount: 150, type: 'cash' },
      ],
      notes: [{ title: 'Coach Note', body: 'Strong week. Keep momentum.' }],
      links: [{ label: 'Open Assignments', href: 'https://example.com/assignments' }],
    }),
  );

  assert.match(markup, /Jordan Rivers/);
  assert.match(markup, /\$326/);
  assert.match(markup, /Guildies Balance/);
  assert.match(markup, />480</);
  assert.match(markup, /Essay Draft/);
  assert.match(markup, /Tutoring Deposit/);
});

runTest('renderDashboardMarkup exposes command-center status hooks', () => {
  const markup = renderDashboardMarkup(
    normalizeDashboardPayload({
      student: { fullName: 'Guildie Master', program: 'UCC', cohort: 'Spring' },
      status: { label: 'Active', updatedAt: '2026-03-17' },
      progress: { percent: 65, completed: 8, total: 12, summary: 'Mission is progressing.' },
      balances: { cash: 120, guildies: 250 },
      upcoming: [],
      transactions: [],
      notes: [],
      links: [],
    }),
  );

  assert.match(markup, /Mission Control/);
  assert.match(markup, /metric-panel metric-panel--progress/);
  assert.match(markup, /signal-dials/);
  assert.match(markup, /ledger-panel/);
});

runTest('renderDashboardMarkup exposes hud layout hooks', () => {
  const markup = renderDashboardMarkup(
    normalizeDashboardPayload({
      student: { fullName: 'Guildie Master', program: 'UCC', cohort: 'Spring' },
      status: { label: 'Active', updatedAt: '2026-03-17' },
      progress: { percent: 65, completed: 8, total: 12, summary: 'Mission is progressing.' },
      balances: { cash: 120, guildies: 250 },
      upcoming: [{ title: 'Checkpoint', dueDate: '2026-03-25', course: 'Secret Agent' }],
      transactions: [{ title: 'Workshop', date: '2026-03-12', amount: 45, type: 'cash' }],
      notes: [{ title: 'Admin', body: 'Good job!' }],
      links: [],
    }),
  );

  assert.match(markup, /hud-grid/);
  assert.match(markup, /student-frame/);
  assert.match(markup, /signal-cluster/);
  assert.match(markup, /hud-panel hud-panel--ledger/);
});

runTest('renderDashboardMarkup exposes featured lesson embed hooks', () => {
  const markup = renderDashboardMarkup(
    normalizeDashboardPayload({
      student: { fullName: 'Guildie Master', program: 'UCC', cohort: 'Spring' },
      status: { label: 'Active', updatedAt: '2026-03-17' },
      progress: { percent: 65, completed: 8, total: 12, summary: 'Mission is progressing.' },
      balances: { cash: 120, guildies: 250 },
      upcoming: [],
      transactions: [],
      notes: [],
      links: [],
    }),
  );

  assert.match(markup, /featured-lesson/);
  assert.match(markup, /youtube\.com\/embed\/Ky4XNOyO3sk/);
  assert.match(markup, /Featured Lesson/);
});

runTest('isValidDemoLogin accepts the configured demo credentials', () => {
  assert.equal(isValidDemoLogin({ userId: '123465', password: 'admin' }), true);
  assert.equal(isValidDemoLogin({ userId: '123465 ', password: ' Admin ' }), true);
  assert.equal(isValidDemoLogin({ userId: '123465', password: 'wrong' }), false);
});

runTest('createSessionState sets unlocked state for valid demo login', () => {
  assert.deepEqual(
    createSessionState({ userId: '123465', password: 'admin' }),
    {
      authenticated: true,
      userId: '123465',
      error: '',
    },
  );
});

runTest('createSessionState stays unlocked in front-end demo mode', () => {
  assert.deepEqual(
    createSessionState({ userId: '999999', password: 'wrong' }),
    {
      authenticated: true,
      userId: '999999',
      error: '',
    },
  );
});

runTest('renderLoginMarkup exposes hud login hooks and asset reference', () => {
  const markup = renderLoginMarkup({ error: '', userId: '123465' });

  assert.match(markup, /login-screen/);
  assert.match(markup, /academy-sigil\.svg/);
  assert.match(markup, /User ID/);
  assert.match(markup, /Password/);
  assert.match(markup, /123465/);
  assert.match(markup, /Use Demo Access/);
});
