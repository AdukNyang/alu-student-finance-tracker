# Student Finance Tracker

**Live Demo:** Coming soon (will be deployed on GitHub Pages)

A simple web app that helps students track their spending, set budgets, and see where their money goes. Built with vanilla HTML, CSS, and JavaScript - no frameworks, just the basics done right.

## What It Does

Tracks your expenses with:
- Add, edit, and delete transactions
- Search using regex patterns (find all coffee purchases, transactions with cents, etc.)
- Sort by date, amount, or description
- Dashboard showing total spending, top category, and recent trends
- Budget alerts when you're spending too much
- Save everything in your browser (no server needed)
- Import/Export your data as JSON
- Works on mobile, tablet, and desktop
- Fully keyboard accessible

## How To Run It

1. Clone this repo
2. Open `index.html` in any browser
3. That's it - no build process, no npm install, nothing

Or just visit the live demo link above.

## What's In The Code

- `index.html`: The main page with all sections
- `styles/styles.css`: All the styling (purple theme, responsive design)
- `scripts/validators.js`: Regex patterns for validating form inputs
- `scripts/state.js`: Manages all transaction data and localStorage
- `scripts/app.js`: Main logic - handles forms, sorting, search, etc.
- `tests.html`: Tests all the regex patterns with examples
- `seed.json`: Sample data with 10 transactions to try out
- `docs/planning.md`: Initial planning and wireframes

## Regex Patterns Used

### 1. Description - No Extra Spaces
**Pattern:** `/^\S(?:.*\S)?$/`
- Blocks leading/trailing spaces
- Valid: "Lunch at cafeteria"
- Invalid: "  Lunch  "

### 2. Amount - Money Format
**Pattern:** `/^(0|[1-9]\d*)(\.\d{1,2})?$/`
- Positive numbers with optional cents
- Valid: "12.50", "100", "0.99"
- Invalid: "-5", "12.345"

### 3. Date - YYYY-MM-DD
**Pattern:** `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
- Standard date format
- Valid: "2025-02-15"
- Invalid: "15/02/2025"

### 4. Category - Letters Only
**Pattern:** `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
- Letters, spaces, hyphens
- Valid: "Food", "Public-Transport"
- Invalid: "Food123"

### 5. Duplicate Words (Advanced)
**Pattern:** `/\b(\w+)\s+\1\b/i`
- Catches repeated words using back-reference
- Finds: "coffee coffee", "the the"
- Why advanced: Uses `\1` back-reference

## Accessibility Features

- Keyboard navigation works everywhere (Tab, Enter, Escape)
- Skip-to-content link for screen readers
- ARIA live regions announce budget alerts
- Good color contrast (tested with WCAG AA)
- All form inputs have proper labels
- Focus indicators are visible

## Keyboard Shortcuts

| Key | What It Does |
|-----|--------------|
| Tab | Move to next element |
| Shift + Tab | Go back |
| Enter | Submit form or click button |
| Space | Toggle checkbox |

## Why This Way?

- **No frameworks:** Wanted to understand the fundamentals first
- **Mobile-first CSS:** Started with small screens, scaled up
- **Modular JS:** Separated validation, state, and UI logic
- **localStorage:** Simple persistence without a backend
- **Purple theme:** Because why not? Looks better than default blue

## Testing

1. Open `tests.html` to see all regex patterns tested
2. Import `seed.json` to load sample data
3. Try keyboard navigation (Tab through everything)
4. Resize browser to test responsive design

## Development Notes

Built over several days following the assignment milestones. Learned a lot about regex patterns, accessibility, and DOM manipulation. All code written and tested by me - it's not perfect, but it works and I understand every line.

## Project Structure

```
alu-student-finance-tracker/
├── index.html
├── styles/
│   └── styles.css
├── scripts/
│   ├── validators.js
│   ├── state.js
│   └── app.js
├── docs/
│   └── planning.md
├── tests.html
├── seed.json
└── README.md
```

## Technologies

- HTML5 (semantic tags)
- CSS3 (Flexbox, media queries)
- Vanilla JavaScript (ES6)
- localStorage API

## Contact

- **Email:** a.nyang@alustudent.com
- **GitHub:** [AdukNyang](https://github.com/AdukNyang)

## License

Educational project for ALU coursework.
