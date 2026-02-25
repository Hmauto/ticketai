# TicketAI - AI-Powered Customer Support Platform

🎫 **TicketAI** is an intelligent customer support ticket management platform that uses AI to automatically classify, prioritize, and route support tickets.

[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Deploy on Railway](https://img.shields.io/badge/Deploy%20on-Railway-0B0D0E?style=for-the-badge&logo=railway)](https://railway.app)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- OpenAI API key
- Vercel account (for frontend)
- Railway account (for backend)

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/ticketai.git
cd ticketai
./scripts/setup.sh
```

### 2. Configure Environment Variables

```bash
# Copy example files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit with your values
nano .env
```

### 3. Run Database Migrations

```bash
./database/migrate.sh migrate
```

### 4. Seed Demo Data (Optional)

```bash
./scripts/seed.sh --demo
```

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
ticketai/
├── frontend/          # Next.js 14 application (Vercel)
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   └── next.config.js
├── backend/           # Node.js/Express API (Railway)
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│   ├── railway.json
│   └── Dockerfile
├── database/          # Migrations and scripts
│   ├── migrations/
│   └── migrate.sh
├── scripts/           # Deployment and utility scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── seed.sh
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `JWT_SECRET` | Secret for JWT signing | `min-32-chars...` |
| `FRONTEND_URL` | Frontend URL | `https://ticketai.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection for queues | - |
| `SENTRY_DSN` | Error tracking | - |
| `SENDGRID_API_KEY` | Email service | - |
| `LOG_LEVEL` | Logging level | `info` |

See `.env.example` for the complete list.

---

## 🚀 Deployment

### Automatic (GitHub Actions)

Push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Deploy updates"
git push origin main
```

### Manual Deployment

```bash
# Deploy everything
./scripts/deploy.sh

# Deploy specific components
./scripts/deploy.sh --skip-frontend  # Backend only
./scripts/deploy.sh --skip-backend   # Frontend only
```

### Platform-Specific

#### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

#### Backend (Railway)

```bash
cd backend
railway up
```

---

## 📊 API Documentation

### Authentication

All API endpoints (except health check) require authentication via Bearer token:

```http
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Health Check
```http
GET /health
```

#### Tickets
```http
GET    /api/tickets          # List tickets
POST   /api/tickets          # Create ticket
GET    /api/tickets/:id      # Get ticket
PUT    /api/tickets/:id      # Update ticket
DELETE /api/tickets/:id      # Delete ticket
```

#### AI Analysis
```http
POST /api/ai/classify        # Classify ticket
POST /api/ai/suggest         # Get response suggestion
```

#### Analytics
```http
GET /api/analytics/dashboard # Dashboard metrics
GET /api/analytics/trends    # Trend data
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit
npm run test:integration
```

---

## 📈 Monitoring

### Sentry Integration

Error tracking is configured for both frontend and backend. Set your `SENTRY_DSN` to enable.

### Health Checks

- **Frontend**: `https://ticketai.vercel.app/api/health`
- **Backend**: `https://api.ticketai.app/health`

### Logs

View logs in respective platforms:
- **Vercel**: Dashboard → Project → Logs
- **Railway**: Dashboard → Service → Logs

---

## 🛠️ Development

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) |
| AI/ML | OpenAI GPT-4 |
| Queue | Redis + Bull |
| Email | SendGrid |
| Monitoring | Sentry, LogRocket |

### Code Style

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Row-level security (RLS) in database
- Helmet.js for security headers
- Rate limiting on API endpoints
- Input validation with Zod

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📧 Email: support@ticketai.app
- 💬 Discord: [Join our community](https://discord.gg/ticketai)
- 📚 Documentation: [docs.ticketai.app](https://docs.ticketai.app)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Hosted on [Vercel](https://vercel.com/) & [Railway](https://railway.app/)
- Database by [Supabase](https://supabase.com/)

---

<p align="center">
  Made with ❤️ by the TicketAI Team
</p>
