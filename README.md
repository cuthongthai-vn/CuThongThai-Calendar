# 🦉 CuThongThai_Calendar

> **Economic Calendar with AI Analysis** - Lịch Kinh Tế & Tin Nóng 24/7

Ứng dụng Next.js theo dõi sự kiện kinh tế, dashboard vĩ mô Việt Nam, và phân tích tác động thị trường (Vàng, Chứng Khoán, Forex) theo thời gian thực.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm hoặc yarn
- Supabase account
- Gemini API key

### Installation

```bash
# Clone repository
git clone <repo-url>
cd CuThongThai_Calendar

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env với credentials của bạn

# Run development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

---

## 📁 Project Structure

```
CuThongThai_Calendar/
├── app/                    # Next.js App Router
│   ├── page.js            # Homepage - Economic Calendar
│   ├── api/               # API Routes
│   │   ├── events/        # Economic events CRUD
│   │   ├── analyze/       # AI analysis endpoint
│   │   ├── macro/         # Macro data entry
│   │   ├── og/            # Open Graph images
│   │   └── cron/          # Scheduled jobs
│   ├── macro/             # Macro Dashboard
│   ├── assets/            # Assets & Pricing
│   ├── lifestyle/         # Lifestyle Metrics
│   ├── population/        # Population Data
│   └── admin/             # Admin Interface
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── calendar/      # Calendar components
│   │   ├── macro/         # Macro dashboard components
│   │   ├── lifestyle/     # Lifestyle components
│   │   └── population/    # Population components
│   ├── layout/            # Layout components (Navigation)
│   └── ui/                # Reusable UI components
├── lib/                   # Shared utilities (NEW)
│   ├── supabase/          # Database client
│   ├── auth/              # Authentication middleware
│   ├── services/          # Data service layer
│   ├── utils/             # Utility functions
│   └── errors/            # Error handling
├── src/                   # Backend scripts
│   ├── fetcher.js         # Main data fetcher
│   ├── scheduler.js       # Cron scheduler
│   ├── ai_analyst.js      # Gemini AI integration
│   ├── import_*.js        # Data import scripts
│   └── data/              # Static data
└── public/                # Static assets
```

---

## 🔧 Environment Variables

Tạo file `.env` với các biến sau (xem `.env.example`):

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_service_role_key

# AI Integration
GEMINI_API_KEY=your_gemini_key

# Security (cho protected endpoints)
ADMIN_API_KEY=your_random_secure_key
CRON_SECRET=your_cron_secret

# Development
NODE_ENV=development
DEBUG=false
```

**Generate secure keys:**
```bash
# Admin API key
openssl rand -hex 32

# Cron secret
openssl rand -hex 16
```

---

## 📊 Features

### 1. Economic Calendar
- Real-time economic events tracking
- AI-powered impact analysis
- Multi-country support (US, VN, CN)
- Sentiment analysis (Bullish/Bearish/Neutral)

### 2. Macro Dashboard
- **Exchange Rates:** USD/VND official vs black market
- **Interest Rates:** Reference rate & savings rates
- **GDP Growth:** YoY growth & absolute size
- **Inflation:** CPI tracking
- **Trade Balance:** Exports vs Imports
- **FDI Structure:** Investment breakdown
- **Debt Sustainability:** Public debt monitoring

### 3. Assets & Pricing
- **Gold Prices:** SJC vs World prices
- **Stock Market:** VNINDEX with candlestick charts
- **Real Estate:** Property prices in Hanoi & HCMC
- **Housing Affordability:** Salary per sqm metrics

### 4. Lifestyle Metrics
- Cost of living indicators
- Income trends
- Purchasing power analysis

### 5. Population Analytics
- Birth & death rates
- Age structure
- Dependency ratios
- Urbanization trends

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16.1 (App Router)
- **UI Library:** React 19
- **Language:** JavaScript (JSDoc for types)
- **Styling:** Tailwind CSS 4

### Data & Backend
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini API
- **Charts:** Recharts, Lightweight Charts

### Optimization (Recent)
- Centralized Supabase client
- Next.js Image optimization
- API authentication middleware
- Environment-aware logging
- Data service layer

---

## 🔌 API Routes

### Public Endpoints

**GET /api/events**
- Fetch all economic events
- Response: `Event[]`

**GET /api/macro**
- Fetch macro indicators
- Response: `MacroIndicator[]`

### Protected Endpoints (require `Authorization: Bearer <ADMIN_API_KEY>`)

**POST /api/events**
- Create new event
- Body: `{ event_name, event_time, country, ... }`

**PUT /api/events/[id]**
- Update event
- Body: Partial event object

**POST /api/analyze**
- Trigger AI analysis for event
- Body: `{ event_id }`

**POST /api/macro/manual-entry**
- Manual data entry
- Body: `{ indicator_key, date, value }`

---

## 🎨 Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Bundle Analysis

```bash
ANALYZE=true npm run build --webpack
# Opens analyze/client.html and analyze/server.html
```

### Database Scripts

```bash
# Import data
node src/import_assets.js
node src/import_population.js

# Fetch latest data
node src/fetcher.js
node src/fetch_vnindex_daily.js

# Run scheduler (for cron jobs)
node src/scheduler.js
```

---

## 📝 Code Patterns

### Using Centralized Supabase Client

```javascript
import { getSupabaseClient } from '@/lib/supabase/client';

export default async function MyPage() {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('table').select('*');
    return <div>{/* render data */}</div>;
}
```

### Using Data Services

```javascript
import { getMacroIndicators } from '@/lib/services/dataService';

const data = await getMacroIndicators({
    indicatorKeys: 'indicator_key.eq.VNINDEX'
});
```

### Protected API Routes

```javascript
import { withAuth } from '@/lib/auth/middleware';

export const POST = withAuth(async (request) => {
    // Only accessible with valid API key
    const body = await request.json();
    // ... handle request
});
```

### Environment-Aware Logging

```javascript
import { logger } from '@/lib/utils/logger';

logger.log('Debug info');    // Only in dev
logger.error('Error');        // Always shown
logger.debug('Deep debug');   // Only if DEBUG=true
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads calendar events
- [ ] Macro dashboard displays charts
- [ ] Assets page shows VNINDEX chart
- [ ] Navigation works across pages
- [ ] API endpoints respond correctly
- [ ] Admin page functions (if applicable)

### API Testing

```bash
# Test public endpoint
curl http://localhost:3000/api/events

# Test protected endpoint
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"event_name":"Test Event",...}'
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables on Vercel

Add all variables from `.env.example` to Vercel project settings.

### Cron Jobs

Configure Vercel Cron or external service to hit `/api/cron` with Authorization header.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

ISC

---

## 🙏 Credits

- Data sources: World Bank, IMF, GSO, SBV, VNDirect
- AI: Google Gemini
- Charts: Recharts, Lightweight Charts

---

**Built with ❤️ for Vietnamese investors**

🦉 **Cú Thông Thái** - "Đầu Tư Nhẹ Nhàng - Kết Quả Huy Hoàng"
