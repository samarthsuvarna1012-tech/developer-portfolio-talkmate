CodeMaker AI – Forensic Repository Audit & /api/chat Recovery
Objective

Your job is NOT to redesign this project.

Your job is to inspect the current repository and determine why TalkMate AI displays "Request failed" in production.

Previous AI reports contradict each other and must not be trusted.

The repository is the only source of truth.

Current Project

This repository contains:

Developer Portfolio
TalkMate AI
CodeMaker AI
Workspace IDE
AI Chat
Coding Agent
Agent Orchestrator
Knowledge Graph
Memory Engine
Source Control Center

These modules are already implemented.

Do not simplify them.

Do not replace them.

Do not redesign the architecture.

Critical Rules

Before changing any file:

Inspect the repository.
Determine the actual architecture.
Verify every assumption.
Explain findings.
Only then make the smallest safe fix.

Never:

remove functionality
replace Gemini
remove SSE
remove provider abstraction
remove AI Core
remove Workspace
remove Coding Agent
remove Knowledge Graph
remove Memory
rewrite the UI
rewrite the backend
Repository Audit

Inspect:

package.json
package-lock.json
tsconfig*
vite.config.*
vercel.json
README
.env.example
api/
src/
routing
build scripts
deployment configuration

Determine:

Express?
Vercel Functions?
Hybrid?
Cloud Run?
Which deployment is actually active?
Backend Inventory

Locate every backend implementation.

Search for:

server.ts

server.js

api/chat

api/contact

api/health

GoogleGenAI

generateContent

generateContentStream

text/event-stream

GEMINI_API_KEY

For every implementation report:

file
purpose
active?
deployed?
referenced?
Gemini Audit

Determine:

Installed SDK version.

Every model string.

Every place models are selected.

Whether models differ across modules.

Do not blindly replace models.

If model validity cannot be verified:

Report

NOT VERIFIED

Environment Audit

Inspect all environment usage.

Never expose secrets.

Report only:

referenced variables
required variables
missing variables
unused variables
/api/chat End-to-End Trace

Trace:

Frontend

↓

fetch()

↓

/api/chat

↓

routing

↓

handler

↓

validation

↓

rate limiting

↓

Gemini

↓

SSE

↓

frontend parser

Verify:

payload
response
parser
streaming
errors
Frontend Audit

Inspect every frontend caller.

Including:

TalkMate

Voice Widget

AI Chat

Workspace

Coding Agent

Orchestrator

Determine whether every caller sends the payload expected by /api/chat.

Do not assume payload names.

Inspect actual code.

SSE Audit

Verify:

Content-Type

Cache-Control

Connection

chunk format

double newline

done event

error event

response.end()

Then inspect the frontend parser for:

ReadableStream

TextDecoder

buffer splitting

JSON parsing

partial chunk handling

AbortController

cleanup

Build Audit

Run only commands appropriate for the repository.

If available:

npm install

npm run lint

npm run build

If Vercel:

vercel build

Inspect generated functions.

Do not stop after a successful build.

Runtime Audit

If a deployment exists:

Test:

GET /api/health

GET /api/chat

POST /api/chat

Use a proper JSON request.

Do not use malformed PowerShell curl.

Record:

status

headers

body

SSE stream

errors

Root Cause

Classify only after evidence.

Possible causes:

deployment mismatch
stale migration
payload mismatch
body parser
SSE bug
frontend parser
missing environment variable
Gemini model
routing
architecture conflict

Only choose causes supported by evidence.

Fix Policy

After diagnosis:

Make the smallest safe fix.

Never rewrite unrelated code.

Never remove features.

Never redesign architecture.

Explain every changed file.

Regression

After fixing:

Run:

npm run lint

npm run build

vercel build (if applicable)

Retest:

GET /api/health

GET /api/chat

POST /api/chat

Verify:

streaming
frontend
TalkMate
Voice Widget
AI Chat
Coding Agent
Orchestrator
Final Report

Use exactly this structure:

# Root Cause

# Current Architecture

# Backend Inventory

# Gemini Status

# API Trace

# Changes Made

# Verification

# API Status

# Frontend Status

# Deployment Status

# Remaining Problems

# Next Commands
Working Rules
Verify before changing.
Do not assume.
Do not fabricate successful tests.
If something cannot be verified, explicitly state NOT VERIFIED.
Preserve all existing functionality.
Minimize changes.
Keep commits focused.