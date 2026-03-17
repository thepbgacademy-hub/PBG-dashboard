export const sampleDashboardData = {
  student: {
    id: 'student-demo-001',
    firstName: 'Jordan',
    lastName: 'Rivers',
    program: 'Writing and Entrepreneurship',
    cohort: 'Spring 2026 Cohort',
  },
  status: {
    label: 'On Track',
    updatedAt: '2026-03-17',
  },
  progress: {
    percent: 92,
    completed: 11,
    total: 12,
    summary: 'Current coursework is strong, with one major draft remaining this cycle.',
  },
  balances: {
    cash: 325.75,
    guildies: 480,
  },
  upcoming: [
    {
      title: 'Essay Draft',
      dueDate: '2026-03-21',
      course: 'Writing Lab',
    },
    {
      title: 'Pitch Deck Revision',
      dueDate: '2026-03-24',
      course: 'Founder Studio',
    },
  ],
  transactions: [
    {
      title: 'Tutoring Deposit',
      date: '2026-03-15',
      amount: 150,
      type: 'cash',
    },
    {
      title: 'Weekly Momentum Bonus',
      date: '2026-03-14',
      amount: 80,
      type: 'guildies',
    },
  ],
  notes: [
    {
      title: 'Coach Note',
      body: 'Strong week. Keep your writing cadence steady and submit the draft early if possible.',
    },
  ],
  links: [
    {
      label: 'Open Assignments',
      href: 'https://example.com/assignments',
      description: 'Review tasks and upcoming submissions.',
    },
    {
      label: 'Book Coaching',
      href: 'https://example.com/coaching',
      description: 'Schedule tutoring or accountability sessions.',
    },
  ],
};
