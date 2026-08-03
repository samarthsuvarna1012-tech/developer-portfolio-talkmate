# Developer Portfolio & TalkMate AI

A student-focused portfolio site built with React, TypeScript, Vite, Vercel Functions, and Gemini-powered AI streaming. The project highlights practical web development work, a conversational AI assistant experience, and the engineering choices behind it.

## Overview

This portfolio is designed to feel like a capable student developer’s space: honest, curious, and focused on real projects. It includes:

- A student-centered hero section and project showcase
- A featured TalkMate AI experience with streaming chat, personas, voice interaction, and file handling
- Vercel serverless functions for secure AI proxying and contact form handling
- A clear, modern portfolio layout for projects, learning, and contact

## Tech Stack

- React 19 + TypeScript
- Vite
- Vercel Functions
- Gemini API via Google GenAI
- Tailwind CSS + motion animations

## Features

- Responsive portfolio layout
- TalkMate AI chat experience with SSE streaming
- Multiple AI personas and prompt starters
- File upload support and basic validation
- Contact form delivery through a configurable Formspree endpoint, with server-side validation and rate-limit protection

## TalkMate AI

TalkMate AI is the flagship project in this portfolio. It explores how a student can build an AI assistant experience end to end by combining a React frontend, Vercel Functions, and streaming LLM responses.

## Architecture

The app is split into a React frontend and native Vercel Functions:

- React client handles the UI and chat state
- Serverless API validates requests and keeps the Gemini API key server-side
- Gemini responses are streamed back to the client using Server-Sent Events

## Engineering Decisions

- Server-side AI calls keep API credentials out of the browser
- SSE provides a more responsive chat experience than waiting for a full payload
- Personas are selected by ID and mapped to server-owned prompts, so the client cannot supply arbitrary system instructions
- Chat requests have message, history, attachment, timeout, and rate limits to reduce accidental misuse
- File handling is limited to validated MIME types and a 5 MB maximum to keep the experience predictable and safe

## TalkMate AI Case Study

### Why I built it

I wanted to move beyond a static portfolio and learn what it takes to build an AI feature responsibly. TalkMate lets visitors ask about the portfolio, explore technical ideas, and try a conversational interface built around real frontend and backend concerns.

### Architecture

```text
React + TypeScript UI
        ↓
Vercel Functions (validation, rate limits, server-owned personas)
        ↓
Gemini API
        ↓
Streaming response over Server-Sent Events (SSE)
```

### Engineering choices and challenges

- **SSE:** streaming makes a response feel immediate and allows the UI to show progress instead of waiting for one large response.
- **Vercel Functions:** the serverless API keeps the Gemini key out of the browser and provides a single place for validation, timeouts, and abuse controls.
- **Server-owned personas:** the UI chooses an approved persona ID; the corresponding instruction remains on the server.
- **Async UI state:** the chat tracks sending, streaming, retry, errors, saved sessions, and automatic scrolling without blocking the rest of the page.
- **Voice and files:** the interface gives helpful feedback for unsupported speech features, permission failures, and invalid uploads.

### What I learned

This project taught me how AI APIs, streaming, frontend state management, backend boundaries, input validation, and prompt design work together in a real product feature.

> TalkMate is a personal AI project. Responses may occasionally be inaccurate.

## What I Learned

- How to connect frontend applications to LLM APIs
- How to build streaming interfaces with SSE
- How to structure serverless APIs for AI-backed features
- How to think about accessibility, validation, and secure API use in student projects

## Run Locally

1. Install dependencies: npm install
2. Copy .env.example to .env.local, add your Gemini API key, and configure a Formspree `CONTACT_FORM_ENDPOINT` if you want the contact form to deliver messages
3. Start the frontend: npm run dev
4. Use `vercel dev` when you also need to run the local Vercel Functions.

## Deploy to Vercel

Import the repository into Vercel, then configure `GEMINI_API_KEY` and (optionally) `CONTACT_FORM_ENDPOINT` in Project Settings → Environment Variables. The included rewrite serves all non-API paths through the React SPA while allowing `/api/chat`, `/api/contact`, and `/api/health` to reach their functions.
