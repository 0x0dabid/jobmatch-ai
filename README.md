# JobMatch AI

AI-powered job matching and resume optimization tool.

## What It Does

1. **Paste** a job description
2. **Upload** your resume (paste text for now, PDF coming soon)
3. **Get** instant AI analysis:
   - Job Fit Score (0-100)
   - Strengths & Gap Analysis
   - Tailored Resume (optimized for this specific job)
   - Cover Letter (customized)
   - Interview Prep Questions & Answers
   - Salary Estimate
   - Actionable Tips

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **AI**: GLM via Z.ai API
- **Jobs Data**: JSearch API (RapidAPI) — coming soon
- **Deploy**: Vercel

## Getting Started

```bash
# Clone
git clone https://github.com/0x0dabid/jobmatch-ai.git
cd jobmatch-ai

# Install
npm install

# Set up environment
cp .env.example .env.local
# Add your ZAI_API_KEY to .env.local

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Description | Get It |
|---|---|---|
| `ZAI_API_KEY` | Z.ai API key for AI analysis | [z.ai](https://z.ai) |
| `RAPIDAPI_KEY` | RapidAPI key for job search (optional) | [rapidapi.com](https://rapidapi.com) |

## Roadmap

- [x] Core AI analysis (fit score, resume, cover letter, interview prep)
- [x] Dark theme landing page
- [x] Responsive dashboard UI
- [ ] PDF resume upload
- [ ] Job search integration (JSearch API)
- [ ] User accounts & history
- [ ] Stripe payments (freemium model)
- [ ] Job application tracking
- [ ] Chrome extension (auto-analyze jobs on LinkedIn/Indeed)

## Monetization Plan

- **Free**: 3 analyses per month
- **Pro** ($19/mo): Unlimited analyses + all features
- **Premium** ($39/mo): Everything in Pro + interview coaching, salary negotiation AI, application tracker

## License

MIT
