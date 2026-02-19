# M1: Project Planning

## Project Overview
**Theme:** Student Finance Tracker  
**Purpose:** Help students track their spending and manage their budget appropriately.

## What the App Does
- Adds transactions (expenses)
- Edits and delete transactions
- Searches transactions
- Sees total spending
- Sets a budget limit
- Saves data in in local storage
- Export/import data as JSON

## Simple Wireframe

### Mobile View (Small Screen)
+------------------+
| Finance Tracker |
| [Navigation] |
+------------------+
| About |
| Dashboard |
| Transactions |
| Add Form |
| Settings |
+------------------+

### Desktop View (Large Screen)
+----------------------------------------+
| Student Finance Tracker |
| [About] [Dashboard] [Transactions] |
+----------------------------------------+
| Dashboard Stats | Transactions |
| - Total: $500 | [Table with data] |
| - Budget: $1000 | |
+----------------------------------------+

## Data Structure

Each transaction looks like this:
```json
{
  "id": "txn_0001",
  "description": "Lunch",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-02-15",
  "createdAt": "2025-02-15T10:00:00Z",
  "updatedAt": "2025-02-15T10:00:00Z"
}

Validation Rules (Regex)
Description: No spaces at start or end

Amount: Must be a positive number (can have cents)

Date: Must be YYYY-MM-DD format

Category: Only letters, spaces, and hyphens

Advanced: Detect duplicate words (like "coffee coffee")

Accessibility Plan
Keyboard Navigation
Tab key moves between elements
Enter key submits forms
All buttons work with keyboard

Screen Readers
All images have descriptions
Form inputs have labels
Error messages are announced
Budget alerts are announced

Visual
Good color contrast (purple on white)
Focus indicators visible
Skip link to main content
Works on mobile and desktop

File Structure
alu-student-finance-tracker/
├── index.html          (Main page)
├── styles/
│   └── styles.css      (All styling)
├── scripts/
│   ├── validators.js   (Check user input)
│   ├── state.js        (Store data)
│   └── app.js          (Main logic)
├── tests.html          (Test regex patterns)
├── seed.json           (Sample data)
└── docs/
    └── planning.md     (This file)

Development Plan
M1: Planning (this document)
M2: Create HTML and CSS
M3: Add form validation
M4: Add/edit/delete/search features
M5: Dashboard statistics
M6: Save data and import/export
M7: Final testing and polish
