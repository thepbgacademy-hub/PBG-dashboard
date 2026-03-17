# Student Dashboard

Static student dashboard designed for GitHub Pages. The frontend is intentionally thin: it renders JSON from an n8n webhook/API and falls back to local sample data when no endpoint is configured.

## Files

- `index.html`: GitHub Pages entry point
- `styles.css`: dashboard visual design
- `app.js`: page bootstrapping and API loading
- `src/dashboard.js`: formatting, normalization, and markup rendering helpers
- `src/api.js`: n8n fetch wrapper
- `src/sample-data.js`: local fallback payload
- `tests/dashboard.test.js`: direct Node assertion script

## Local Preview

Open `index.html` in a browser for a quick preview, or serve the folder with any static server.

Run the test script with:

```powershell
node tests/dashboard.test.js
```

## Configure n8n

Edit `window.DASHBOARD_CONFIG` in `index.html` and set:

- `endpoint`: your n8n webhook or API URL
- `studentId`: the student key to request

Example:

```html
<script>
  window.DASHBOARD_CONFIG = {
    endpoint: 'https://your-n8n-instance/webhook/student-dashboard',
    studentId: 'student-1001',
    academyName: 'Guild Academy',
  };
</script>
```

Expected JSON from n8n:

```json
{
  "student": {
    "id": "student-1001",
    "firstName": "Jordan",
    "lastName": "Rivers",
    "program": "Writing and Entrepreneurship",
    "cohort": "Spring 2026 Cohort"
  },
  "status": {
    "label": "On Track",
    "updatedAt": "2026-03-17"
  },
  "progress": {
    "percent": 92,
    "completed": 11,
    "total": 12,
    "summary": "Current coursework is strong."
  },
  "balances": {
    "cash": 325.75,
    "guildies": 480
  },
  "upcoming": [
    {
      "title": "Essay Draft",
      "dueDate": "2026-03-21",
      "course": "Writing Lab"
    }
  ],
  "transactions": [
    {
      "title": "Tutoring Deposit",
      "date": "2026-03-15",
      "amount": 150,
      "type": "cash"
    },
    {
      "title": "Weekly Momentum Bonus",
      "date": "2026-03-14",
      "amount": 80,
      "type": "guildies"
    }
  ],
  "notes": [
    {
      "title": "Coach Note",
      "body": "Strong week."
    }
  ],
  "links": [
    {
      "label": "Open Assignments",
      "href": "https://example.com/assignments",
      "description": "Review tasks and upcoming submissions."
    }
  ]
}
```

## Suggested Google Sheets Tabs

- `students`: `student_id`, `first_name`, `last_name`, `program`, `cohort`
- `progress`: `student_id`, `percent`, `completed`, `total`, `summary`, `status_label`, `updated_at`
- `balances`: `student_id`, `cash_balance`, `guildies_balance`
- `transactions`: `student_id`, `date`, `title`, `amount`, `type`
- `deadlines`: `student_id`, `course`, `title`, `due_date`
- `notes`: `student_id`, `title`, `body`
- `links`: `student_id`, `label`, `href`, `description`

## Deploy To GitHub Pages

1. Put these files into the GitHub repository that will host the site.
2. Push to the branch you want to publish.
3. In GitHub, open repository `Settings` > `Pages`.
4. Set the source to deploy from the branch and folder containing `index.html`.
5. After Pages publishes, confirm the site loads with sample data first, then wire in the live n8n endpoint.
