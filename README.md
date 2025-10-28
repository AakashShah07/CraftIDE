# Vibe — The AI-Powered Next.js IDE


Vibe is your personal AI-powered coding workspace.
Type what you want to build — and Vibe will instantly generate Next.js components, create files, and run them live in the browser.
It’s like ChatGPT + VSCode + Next.js — all blended into one smooth experience.

![App Screenshot](https://i.ibb.co/tMrscjcw/Screenshot-from-2025-10-29-01-30-16.png)

![App Screenshot](https://i.ibb.co/XfwtZ0w8/Screenshot-from-2025-10-29-01-30-22.png)
## Features
* AI Code Generation — Describe what you want, and get working Next.js components instantly.

* File Management — Automatically creates and edits files in a project workspace.

* Instant Preview — Run and visualize your generated code right away.

* Shadcn + Tailwind Integration — Clean UI components out of the box.

* Type-Safe AI Backend — Built with tRPC, Zod, Prisma, and Inngest.

* Full Next.js Support — Generates pages, components, and routes dynamically.


## Tech Stack

* Framework	Next.js 15 (Turbopack), React 19
* Language	TypeScript
* Styling	Tailwind CSS v4 + tailwind-merge + tailwindcss-animate
* UI Components	Radix UI + shadcn/ui patterns
* State/Forms	TanStack React Query, tRPC, Zodvalidation
* AI Engine  E2B Code Interpreter + Inngest Agent Kit
* Animations	Framer Motion
* Database   Prisma ORM + PostgreSQL
* Deployment	Vercel (recommended)

## Project Structure


```bash
src/
├── app/                # Next.js app directory
│   ├── page.tsx        # Main AI workspace UI
│   ├── api/            # API routes
│   └── components/     # Generated components
├── components/
│   ├── ui/             # Shadcn UI building blocks
│   ├── code-view/      # Code renderer
│   ├── file-explorer/  # Visual file explorer
│   ├── hint.tsx        # AI code hint handler
│   ├── tree-view.tsx   # Directory tree visualizer
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── inngest/            # Background AI job 


```



## How It Works

#### 1. Prompt Input:
You describe your intent (e.g., “Create a login form using Shadcn UI”).

#### 2. AI Engine:
The E2B code interpreter + Inngest pipeline parses your request, generates TypeScript/React code, and writes it to your project directory.

#### 3. Live Preview:
The new file (e.g., app/login/page.tsx) is rendered instantly inside a sandboxed Next.js environment.

#### 4. Iterate Naturally:
You can refine prompts, modify code inline, or preview instantly — just like you’re coding with a human pair programmer.

## Contribution Guidelines

* Fork the repo & create a feature 
"branch: git checkout -b feature/your-feature"

* Commit changes with descriptive messages.

* Open a pull request for review.
## Support

“Don’t just code. Converse with your code.” – Vibe Philosophy

Developer: [Aakash Shah](https://github.com/AakashShah07)

