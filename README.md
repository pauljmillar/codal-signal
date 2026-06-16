# Codal Signal

Prospect intelligence for technical sales. Demo prototype built for the Codal VP of Engineering application.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Anthropic SDK · Cheerio

## Run locally
```
npm install
cp .env.example .env.local   # set ANTHROPIC_API_KEY
npm run dev
```

## Deploy
Push to GitHub, import into Vercel, add `ANTHROPIC_API_KEY` env var.
