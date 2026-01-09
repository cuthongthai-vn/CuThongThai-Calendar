# Contributing Guide

Thank you for considering contributing to CuThongThai_Calendar!

---

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/CuThongThai_Calendar.git
   cd CuThongThai_Calendar
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Add your credentials
   ```
5. **Start dev server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add new macro indicator chart
fix: resolve VNINDEX data fetching issue
docs: update API documentation
refactor: extract data service layer
chore: update dependencies
```

---

## Code Style

### JavaScript

- Use **ESNext** features
- Follow **Airbnb style guide** loosely
- Use **JSDoc** for type annotations
- Prefer **const** over let
- Use **arrow functions** for callbacks

**Example:**
```javascript
/**
 * Fetch macro indicators
 * @param {FilterOptions} filters - Query filters
 * @returns {Promise<MacroIndicator[]>}
 */
export async function getMacroIndicators(filters = {}) {
    const supabase = getSupabaseClient();
    // ...
}
```

### Components

- Use **functional components**
- Prefer **server components** when possible
- Extract complex logic to **custom hooks**
- Keep components **focused and small**

**Example:**
```javascript
export default function MyComponent({ data }) {
    return (
        <div className="container">
            {/* JSX here */}
        </div>
    );
}
```

### Styling

- Use **Tailwind CSS** utility classes
- Avoid inline styles unless necessary
- Follow **mobile-first** approach
- Use **semantic color names** from theme

---

## Project Conventions

### File Organization

```
feature/
├── FeaturePage.js        # Main page component
├── FeatureClient.js      # Client component (if needed)
├── components/
│   ├── Section1.js
│   ├── Section2.js
│   └── ...
└── utils/
    └── helpers.js
```

### Naming Conventions

- **Components:** PascalCase (`MacroChart.js`)
- **Utilities:** camelCase (`dateHelpers.js`)
- **Constants:** UPPER_SNAKE_CASE (`API_ENDPOINT`)
- **CSS classes:** kebab-case or Tailwind utilities

### Import Order

1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Utilities/helpers
5. Types/constants

```javascript
import { useState } from 'react';
import Link from 'next/link';
import { LineChart } from 'recharts';
import MacroChart from '@/components/ui/MacroChart';
import { formatDate } from '@/lib/utils/dateHelpers';
```

---

## Testing

### Manual Testing

Before submitting PR, test:

- [ ] All pages load without errors
- [ ] Data fetching works correctly
- [ ] Charts render properly
- [ ] Responsive design on mobile
- [ ] No console errors

### API Testing

```bash
# Test endpoint
curl http://localhost:3000/api/events

# Check response format
# Verify error handling
```

---

## Pull Request Process

1. **Create feature branch** from `main`
2. **Make your changes** following conventions
3. **Test thoroughly**
4. **Update documentation** if needed
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open Pull Request**

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How was this tested?

## Screenshots
If applicable
```

---

## Key Areas for Contribution

### 🐛 Bug Fixes

- Data fetching errors
- Chart rendering issues
- UI/UX improvements
- Performance optimizations

### ✨ New Features

- New macro indicators
- Additional chart types
- Enhanced AI analysis
- Mobile app (React Native)

### 📚 Documentation

- Improve README
- Add code comments
- Write tutorials
- Translate to English

### 🎨 Design

- UI/UX improvements
- Dark/light mode
- Accessibility (a11y)
- Mobile responsiveness

---

## Common Tasks

### Adding a New Macro Indicator

1. **Add to database schema** (if needed)
2. **Update fetcher script** to collect data
3. **Add to pivotData helper** in page component
4. **Create chart component**
5. **Add to dashboard UI**

### Adding a New Chart Type

1. **Create chart component** in `components/ui/`
2. **Add data transformation logic**
3. **Integrate into page**
4. **Add responsive handling**
5. **Test with real data**

### Updating AI Analysis

1. **Modify prompt** in `src/ai_analyst.js`
2. **Test with sample events**
3. **Verify output format**
4. **Update database schema** if needed

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Contact maintainers for guidance

---

**Thank you for contributing! 🙏**
