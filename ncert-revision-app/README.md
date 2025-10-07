# NCERT Revision App (Full-version scaffold)

This is a generated scaffold for the assignment: **PDF viewer + Quiz + Dashboard + Chat UI + RAG placeholders**.

## What is included
- Next.js app (API routes) + Tailwind CSS setup files
- Components: Source selector, PDF viewer integration (react-pdf), Quiz panel, Chat panel, Dashboard
- API route stubs: uploadPdf, generateQuiz, ragQuery — these include placeholder logic and example prompts
- README + instructions to run locally
- `.gitignore`

> NOTE: This scaffold contains placeholders for LLM calls and PDF extraction. Replace the placeholders with your actual backend code (OpenAI calls, Supabase integration, pdf-parse or pdfjs-based extraction, and embedding storage).

## ⚠️ Important: Deployment Requirements

**This app requires a Node.js server to run API routes.** GitHub Pages only serves static files and cannot execute server-side code.

### Recommended Deployment Platforms:
- **Vercel** (Recommended - built for Next.js): https://vercel.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **Render**: https://render.com

### Why GitHub Pages Won't Work for Full Functionality:
- GitHub Pages serves static HTML/CSS/JS only
- Next.js API routes (`/pages/api/*`) require a Node.js runtime
- Features like quiz generation, RAG queries, and PDF processing need server-side execution

### Environment Variables Required:
Create a `.env.local` file with:
```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## How to run locally
1. Install dependencies:
```bash
npm install
# or
yarn
```

2. Create `.env.local` file with required environment variables (see above)

3. Run the dev server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Where to put NCERT PDFs
Place your seed PDFs in `/public/pdfs/`. The app looks for PDFs there.

## What to implement / polish
- Implement backend PDF text extraction (e.g., `pdf-parse` or `pdfjs-dist`) in `pages/api/uploadPdf.js`.
- Hook LLM (OpenAI or other) in `lib/llm.js`. Keep keys server-side (use env vars).
- Implement embeddings storage (Supabase pgvector or Pinecone) for RAG.
- Replace grading stubs in `pages/api/generateQuiz.js`.

## Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in with GitHub
3. Click "New Project" and import your repository
4. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (will be your Vercel URL)
5. Deploy!

Vercel will automatically detect Next.js and configure everything correctly.

## Files of interest
- `pages/index.js` — main UI: source selector, pdf viewer, tabs (Quiz / Chat / Dashboard)
- `components/` — UI components
- `pages/api/` — API route stubs
- `lib/llm.js` — small wrapper with example prompts
- `lib/apiUtils.js` — API fetch utilities with error handling

## Troubleshooting

### "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" Error
This error occurs when:
1. The app is deployed to GitHub Pages (which can't run API routes)
2. API routes return 404 HTML pages instead of JSON
3. **Solution**: Deploy to Vercel, Netlify, or another platform that supports Next.js

### API Routes Not Working
- Ensure you're running `npm run dev` locally
- Check that `.env.local` has the required environment variables
- Verify the API route files exist in `/pages/api/`

Good luck — use this as a starting point and iterate quickly. If you want, I can now:
- Expand any API route to include a working OpenAI integration (you must provide your key),
- Add a simple local keyword-based grader,
- Or scaffold Supabase integration.
