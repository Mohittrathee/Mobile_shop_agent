This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features
- Purple header with bot icon
- Green user bubbles, gray bot bubbles
- Quick reply buttons
- Emoji + attachment icons
- Online status
- Timestamps
- Floating card, centered
- 100% responsive

## Tech Stack & Architecture
- **Next.js 16** (App Router)
- **Tailwind CSS v4** (CSS-first @import)
- **Gemini 2.0 Flash** (Google AI)
- **marked + DOMPurify** (safe Markdown)
- **TypeScript** (type-safe)
- **Vercel** (deployment)

src/
├── app/
│   ├── page.tsx        ← Main UI + AI logic
│   ├── layout.tsx      ← CSS import
│   └── globals.css     ← Tailwind @import
├── data/
│   └── phones.json     ← 2025 phones
├── public/
└── ...

## Setup Instructions 
```bash
cd mobile-guru-ai
npm install
cp .env.example .env.local
# Paste your Gemini key in .env.local

Known Limitations

Static phone data (update phones.json)
Free Gemini tier (15 RPM)
No voice input
No persistent chat history
```

## Getting Started

First, run the development server:

```bash
npm run dev



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

License
MIT — free to use and modify.
