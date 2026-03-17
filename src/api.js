import { normalizeDashboardPayload } from './dashboard.js';

export async function fetchDashboardData({ endpoint, studentId, fallbackData }) {
  if (!endpoint) {
    return {
      data: normalizeDashboardPayload(fallbackData),
      source: 'sample',
    };
  }

  const url = new URL(endpoint);

  if (studentId) {
    url.searchParams.set('studentId', studentId);
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API returned ${response.status}`);
  }

  const payload = await response.json();
  const data = payload?.data ?? payload;

  return {
    data: normalizeDashboardPayload(data),
    source: 'live',
  };
}
