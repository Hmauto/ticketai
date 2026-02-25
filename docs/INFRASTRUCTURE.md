# TicketAI Infrastructure Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Vercel Edge Network (CDN)                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js 14 Frontend                                │   │
│  │  • React Server Components                          │   │
│  │  • Static Site Generation                           │   │
│  │  • Edge Functions                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Railway (Backend Services)                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Node.js / Express API                              │   │
│  │  • REST API Endpoints                               │   │
│  │  • Webhook Handlers                                 │   │
│  │  • Background Jobs                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  Supabase    │ │  Redis   │ │   OpenAI     │
│  PostgreSQL  │ │  Queue   │ │   API        │
└──────────────┘ └──────────┘ └──────────────┘
```

## Component Details

### Frontend (Vercel)

**URL**: `https://ticketai.vercel.app`

**Features**:
- Next.js 14 with App Router
- Server-side rendering for SEO
- Edge functions for API routes
- Automatic preview deployments
- Global CDN

**Scaling**:
- Auto-scales based on traffic
- No configuration needed
- Pay per usage

### Backend (Railway)

**URL**: `https://api.ticketai.app`

**Features**:
- Node.js with TypeScript
- Automatic deployments from Git
- Horizontal scaling
- Health checks
- Rolling deployments

**Resources**:
- 2+ replicas for high availability
- Auto-restart on failure
- Health check endpoint: `/health`

### Database (Supabase)

**URL**: `https://zywvnaactgvetvfidmzl.supabase.co`

**Features**:
- PostgreSQL 15
- Row Level Security (RLS)
- Realtime subscriptions
- Automatic backups
- Point-in-time recovery

**Connection**:
```
postgresql://postgres:[PASSWORD]@db.zywvnaactgvetvfidmzl.supabase.co:5432/postgres
```

### Queue (Redis)

**Purpose**: Background job processing

**Jobs**:
- Email sending
- AI classification
- Analytics aggregation
- Webhook delivery

### AI Service (OpenAI)

**Models**:
- GPT-4 Turbo for classification
- Text Embedding 3 for semantic search

**Rate Limits**:
- Monitor usage in OpenAI dashboard
- Implement retry logic with exponential backoff

## Deployment Flow

```
Developer Push
      │
      ▼
┌─────────────┐
│ GitHub      │
│ Repository  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ GitHub      │────▶│  Run Tests  │
│ Actions     │     └──────┬──────┘
└─────────────┘            │
                           ▼
                    ┌─────────────┐
                    │  Tests Pass │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │ Deploy to   │           │ Deploy to   │
       │ Vercel      │           │ Railway     │
       └──────┬──────┘           └──────┬──────┘
              │                         │
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │ Frontend    │           │ Backend     │
       │ Live        │           │ Live        │
       └─────────────┘           └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ Run DB      │
                                 │ Migrations  │
                                 └─────────────┘
```

## Environment Configuration

### Development

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
DATABASE_URL=postgresql://localhost:5432/ticketai_dev
REDIS_URL=redis://localhost:6379
```

### Staging

```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api-staging.ticketai.app

# Backend
DATABASE_URL=postgresql://...staging...
NODE_ENV=staging
```

### Production

```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.ticketai.app

# Backend
DATABASE_URL=postgresql://...production...
NODE_ENV=production
LOG_LEVEL=warn
```

## Security Considerations

### Network
- HTTPS only (enforced by platforms)
- CORS configured for specific origins
- API rate limiting

### Authentication
- JWT tokens with expiration
- Refresh token rotation
- Secure cookie settings

### Data
- Encryption at rest (provided by Supabase)
- Encryption in transit (TLS 1.3)
- Row Level Security policies

### Secrets
- No secrets in code
- Environment variables for all sensitive data
- Regular rotation of API keys

## Monitoring & Alerting

### Metrics
- Request latency
- Error rates
- Database connection pool
- Queue depth

### Logs
- Structured JSON logging
- Correlation IDs for tracing
- Centralized log aggregation

### Alerts
- High error rate
- Database connection failures
- Queue backlog
- High latency

## Backup & Recovery

### Database
- Daily automated backups (Supabase)
- Point-in-time recovery (7 days)
- Manual backup before deployments

### Code
- Git version control
- Tagged releases
- Rollback capability

## Cost Optimization

### Vercel
- Use static generation where possible
- Optimize images
- Enable caching

### Railway
- Right-size instances
- Use spot instances for non-critical workloads
- Monitor and set budgets

### Supabase
- Archive old data
- Use connection pooling
- Monitor query performance

### OpenAI
- Cache common responses
- Use appropriate model tiers
- Monitor token usage

## Troubleshooting

### Common Issues

**Frontend build fails**:
- Check Node.js version (18+)
- Clear `.next` cache
- Check for TypeScript errors

**Backend won't start**:
- Verify DATABASE_URL
- Check port availability
- Review logs in Railway dashboard

**Database connection errors**:
- Verify connection string
- Check IP allowlist
- Test with `psql`

**AI classification slow**:
- Check OpenAI API status
- Verify rate limits
- Review queue processing

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
