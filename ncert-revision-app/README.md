# NCERT Revision App (Full-version scaffold)

This is a generated scaffold for the assignment: **PDF viewer + Quiz + Dashboard + Chat UI + RAG placeholders**.

## What is included
- Next.js app (API routes) + Tailwind CSS setup files
- Components: Source selector, PDF viewer integration (react-pdf), Quiz panel, Chat panel, Dashboard
- API route stubs: uploadPdf, generateQuiz, ragQuery — these include placeholder logic and example prompts
- README + instructions to run locally
- `.gitignore`

> NOTE: This scaffold contains placeholders for LLM calls and PDF extraction. Replace the placeholders with your actual backend code (OpenAI calls, Supabase integration, pdf-parse or pdfjs-based extraction, and embedding storage).

## How to run
1. Install dependencies:
```bash
npm install
# or
yarn
```
2. Run the dev server:
```bash
npm run dev
```
3. Open http://localhost:3000

## Where to put NCERT PDFs
Place your seed PDFs in `/public/pdfs/`. The app looks for PDFs there.

## What to implement / polish
- Implement backend PDF text extraction (e.g., `pdf-parse` or `pdfjs-dist`) in `pages/api/uploadPdf.js`.
- Hook LLM (OpenAI or other) in `lib/llm.js`. Keep keys server-side (use env vars).
- Implement embeddings storage (Supabase pgvector or Pinecone) for RAG.
- Replace grading stubs in `pages/api/generateQuiz.js`.

## Files of interest
- `pages/index.js` — main UI: source selector, pdf viewer, tabs (Quiz / Chat / Dashboard)
- `components/` — UI components
- `pages/api/` — API route stubs
- `lib/llm.js` — small wrapper with example prompts

Good luck — use this as a starting point and iterate quickly. If you want, I can now:
- Expand any API route to include a working OpenAI integration (you must provide your key),
- Add a simple local keyword-based grader,
- Or scaffold Supabase integration.

# ncert-revision-app
