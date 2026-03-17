import assert from 'node:assert/strict';

import {
  formatCurrency,
  formatGuildies,
  formatProgressLabel,
  normalizeDashboardPayload,
  renderDashboardMarkup,
} from '../src/dashboard.js';

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
  assert.match(markup, /\$325\.75/);
  assert.match(markup, /480 Guildies/);
  assert.match(markup, /Essay Draft/);
  assert.match(markup, /Tutoring Deposit/);
});

runTest('renderDashboardMarkup exposes command-center layout hooks', () => {
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
  assert.match(markup, /operations-grid/);
  assert.match(markup, /ledger-panel/);
});
