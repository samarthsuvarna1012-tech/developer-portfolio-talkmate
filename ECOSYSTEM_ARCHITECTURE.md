# Project Notes and Architecture Overview

## Overview

This file is a loose working document for the set of projects in this portfolio and related experiments. The goal is to keep the projects organized without forcing them into one monolithic system.

- **Developer Portfolio** — Personal site and project showcase
- **TalkMate AI** — Small interactive AI chat experiment
- **CodeMaker AI** — Prototype workspace idea for project tooling and AI-assisted workflows
- **DevOS** — Work-in-progress concept for developer workflow ideas
- **EVOLVEX** — Experimental concept project

## Project Isolation

Each project is kept separate so it can be built and run independently when needed. This keeps the workflow simple and prevents one project from becoming tightly coupled to another.

```
Portfolio
    │
    ├── TalkMate AI (integrated)
    │
    ├── CodeMaker AI (external)
    │
    ├── DevOS (external)
    │
    └── EVOLVEX (external)
```

---

## Part 1: Current Project Inspection

### Developer Portfolio (Current Repository)

| Aspect | Details |
|--------|---------|
| **Framework** | React 19 + TypeScript + Vite |
| **Runtime** | Browser (SPA), Node.js (Vercel Functions) |
| **Package Manager** | npm |
| **Build System** | Vite |
| **Deployment** | Vercel (frontend + serverless functions) |
| **Frontend/Backend** | SPA + Vercel Functions (`/api/*`) |
| **Environment Variables** | `GEMINI_API_KEY`, `CONTACT_FORM_ENDPOINT` |
| **Authentication** | None (public portfolio) |
| **API Architecture** | REST + SSE (Server-Sent Events) |
| **Database** | None (localStorage for chat sessions) |
| **Storage** | Browser localStorage |
| **Background Workers** | None |
| **WebSocket/SSE** | SSE for streaming AI responses |
| **Autonomous Execution** | No |
| **Sandbox** | No |
| **External AI Providers** | Google Gemini (via `@google/genai`) |
| **Deployment Config** | `vercel.json` (rewrites for SPA + API) |

### TalkMate AI (Integrated)

| Aspect | Details |
|--------|---------|
| **Framework** | React 19 + TypeScript |
| **Runtime** | Browser |
| **Build System** | Vite (part of portfolio build) |
| **Deployment** | Vercel (same as portfolio) |
| **API Endpoints** | `/api/chat`, `/api/health` |
| **Authentication** | None (rate-limited by IP) |
| **Streaming** | SSE from Vercel Functions |
| **File Handling** | Up to 5MB, validated MIME types |

---

## Part 2: Global Ecosystem Architecture

### High-Level Architecture

```
                         USER / INTERNET
                                │
                                ▼
                       DEVELOPER PORTFOLIO
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
           TalkMate         CodeMaker AI        DevOS
               │                │                │
               └────────────────┼────────────────┘
                                │
                         Shared Integration
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
             Projects        Identity        Events
                │
                ▼
          Future Projects
```

### DevOS as Global Intelligence Layer

```
                    DEVOS (Global Intelligence)
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      CodeMaker    TalkMate    EVOLVEX
          │           │           │
          └───────────┼───────────┘
                      │
               Future Projects
```

**DevOS Capabilities** (exposed via SDK/contracts, not direct coupling):
- Cognitive Memory
- Autonomous Planning
- Code Intelligence
- Tool Execution
- Knowledge Graph
- Learning/Self-Improvement
- Autonomous Evolution
- Continuous Optimization

**DevOS Architecture Preservation:**
- Domain Layer: Platform-neutral business logic
- Application Layer: Use cases, orchestration
- Infrastructure Layer: Node.js-specific adapters (fs, path, crypto, child_process)
- Modules: Pluggable capabilities
- SDK/Contracts: Stable interfaces for external consumption

---

## Part 3: Project Registration Model

### Project Registration Contract

```typescript
interface ProjectRegistration {
  projectId: string;           // Unique identifier (e.g., "codemaker", "talkmate", "devos", "evolvex")
  name: string;                // Display name
  version: string;             // Semantic version
  repository: string;          // Git repository URL
  environment: 'development' | 'staging' | 'production';
  runtime: 'node' | 'browser' | 'edge' | 'container';
  capabilities: string[];      // e.g., ["code-generation", "repository-analysis", "autonomous-engineering"]
  health: HealthEndpoint;      // Health check configuration
  permissions: PermissionSet;  // What this project can do
  deployment: DeploymentInfo;  // Deployment metadata
  integrationEndpoints: IntegrationEndpoints; // How other projects communicate with this
}

interface HealthEndpoint {
  url: string;
  expectedStatus: number;
  timeoutMs: number;
}

interface PermissionSet {
  read: string[];           // Project IDs this project can read
  analyze: string[];        // Project IDs this project can analyze
  suggest: string[];        // Project IDs this project can suggest changes to
  simulate: string[];       // Project IDs this project can simulate changes on
  createBranch: string[];   // Project IDs this project can create branches in
  modify: string[];         // Project IDs this project can modify
  test: string[];           // Project IDs this project can test
  deploy: string[];         // Project IDs this project can deploy
  rollback: string[];       // Project IDs this project can rollback
}

interface DeploymentInfo {
  provider: string;         // e.g., "vercel", "railway", "fly.io", "aws"
  url: string;              // Production URL
  region?: string;
  scaling?: 'serverless' | 'container' | 'static';
}

interface IntegrationEndpoints {
  apiBaseUrl?: string;      // REST API base
  sdkPackage?: string;      // NPM package for SDK
  eventBusTopic?: string;   // Event bus topic name
  webhookUrl?: string;      // Webhook endpoint
}
```

### Example Registrations

```json
{
  "projectId": "devos",
  "name": "DevOS",
  "version": "1.0.0",
  "repository": "https://github.com/org/devos",
  "environment": "production",
  "runtime": "node",
  "capabilities": [
    "cognitive-memory",
    "autonomous-planning",
    "code-intelligence",
    "tool-execution",
    "knowledge-graph",
    "learning",
    "evolution",
    "optimization"
  ],
  "health": { "url": "https://devos.example.com/health", "expectedStatus": 200, "timeoutMs": 5000 },
  "permissions": { "read": ["*"], "analyze": ["*"], "suggest": ["*"], "simulate": ["*"], "createBranch": [], "modify": [], "test": [], "deploy": [], "rollback": [] },
  "deployment": { "provider": "railway", "url": "https://devos.example.com", "scaling": "container" },
  "integrationEndpoints": { "apiBaseUrl": "https://devos.example.com/api", "sdkPackage": "@devos/sdk" }
}
```

```json
{
  "projectId": "codemaker",
  "name": "CodeMaker AI",
  "version": "1.0.0",
  "repository": "https://github.com/org/codemaker",
  "environment": "production",
  "runtime": "node",
  "capabilities": [
    "code-generation",
    "repository-analysis",
    "autonomous-engineering",
    "testing",
    "deployment"
  ],
  "health": { "url": "https://codemaker.example.com/health", "expectedStatus": 200, "timeoutMs": 5000 },
  "permissions": { "read": ["devos"], "analyze": ["devos"], "suggest": ["devos"], "simulate": ["devos"], "createBranch": ["devos"], "modify": [], "test": ["devos"], "deploy": [], "rollback": [] },
  "deployment": { "provider": "fly.io", "url": "https://codemaker.example.com", "scaling": "container" },
  "integrationEndpoints": { "apiBaseUrl": "https://codemaker.example.com/api", "sdkPackage": "@codemaker/sdk" }
}
```

---

## Part 4: Global DevOS Capabilities

### Supported Operations

| Operation | Scope | Description |
|-----------|-------|-------------|
| `analyze-project` | PROJECT | Deep analysis of a single registered project |
| `audit-security` | PROJECT/WORKSPACE/GLOBAL | Security vulnerability scanning |
| `analyze-dependencies` | PROJECT/WORKSPACE/GLOBAL | Dependency analysis and updates |
| `detect-technical-debt` | PROJECT/WORKSPACE/GLOBAL | Code quality and debt detection |
| `plan-upgrade` | PROJECT/WORKSPACE | Upgrade planning with risk assessment |
| `simulate-change` | PROJECT | Dry-run changes without applying |
| `create-change` | PROJECT | Create PR/branch with changes |
| `run-tests` | PROJECT | Execute test suites |
| `verify-build` | PROJECT | Verify build succeeds |
| `optimize` | PROJECT/WORKSPACE | Performance and bundle optimization |
| `rollback` | PROJECT | Rollback deployment |
| `learn` | GLOBAL | Cross-project learning |
| `monitor` | GLOBAL | Health and performance monitoring |

### Scope Definitions

- **PROJECT**: Single project (e.g., "Upgrade CodeMaker")
- **WORKSPACE**: Related project group (e.g., "Upgrade CodeMaker + TalkMate")
- **GLOBAL**: All registered projects (e.g., "Audit every registered project")

### Permission Gates

All operations require explicit authorization:
- `READ` → View project metadata, code, logs
- `ANALYZE` → Run read-only analysis
- `SUGGEST` → Propose changes (PRs, recommendations)
- `SIMULATE` → Dry-run in isolated environment
- `CREATE_BRANCH` → Create feature branches
- `MODIFY` → Direct code modifications (requires approval)
- `TEST` → Execute test suites
- `DEPLOY` → Deploy to staging/production (requires approval)
- `ROLLBACK` → Rollback deployments

---

## Part 5: Global Permission Model

### Permission Matrix

| Actor \ Target | DevOS | CodeMaker | TalkMate | EVOLVEX |
|----------------|-------|-----------|----------|---------|
| **DevOS** | FULL | READ/ANALYZE/SUGGEST/SIMULATE | READ/ANALYZE | READ/ANALYZE |
| **CodeMaker** | READ/ANALYZE/SUGGEST | FULL | READ | READ |
| **TalkMate** | READ (via API) | READ (via API) | FULL | READ |
| **Portfolio** | READ (public) | READ (public) | READ (integrated) | READ (public) |
| **EVOLVEX** | READ/ANALYZE | READ | READ | FULL |

### Security Principles

1. **Authentication**: All service-to-service communication uses mutual TLS or signed JWTs
2. **Authorization**: RBAC with project-level granularity
3. **Project Isolation**: No project can arbitrarily modify another
4. **Service Authentication**: Each service has unique identity
5. **Least Privilege**: Default deny, explicit allow
6. **Audit Logging**: All cross-project operations logged
7. **Approval Gates**: Sensitive operations require human approval
8. **Rollback Capability**: Every deployment/change is reversible

---

## Part 6: Service-to-Service Integration

### Integration Hierarchy (Preferred Order)

```
1. Stable SDK / Contract (HIGHEST PREFERENCE)
         ↓
2. Authenticated REST/gRPC API
         ↓
3. Event Bus (for async, decoupled communication)
         ↓
4. Direct Implementation Coupling (AVOID)
```

### Integration Patterns

#### DevOS → Registered Projects
- DevOS consumes project SDKs/contracts
- Uses authenticated API calls for operations
- Subscribes to project events for monitoring

#### CodeMaker → DevOS
- CodeMaker imports `@devos/sdk`
- Calls DevOS capabilities via typed client
- No direct DevOS source dependency

#### TalkMate → CodeMaker/DevOS
- TalkMate (portfolio) calls CodeMaker/DevOS via REST API
- Server-side proxy keeps credentials secure
- Rate-limited and validated

#### Portfolio → All Projects
- Portfolio displays project cards with live status
- Fetches health/status via public endpoints
- No backend coupling

---

## Part 7: CodeMaker Integration

### CodeMaker as Primary Engineering Workspace

```
TalkMate (User Interface)
    │
    ▼
CodeMaker (Engineering Workspace)
    │
    ▼
DevOS (Intelligence Layer)
    ├── Planning
    ├── Memory
    ├── Code Intelligence
    ├── Execution
    ├── Knowledge
    ├── Learning
    └── Evolution
```

### CodeMaker Capabilities (via DevOS SDK)

| Capability | DevOS Module | Integration Method |
|------------|--------------|-------------------|
| Project Discovery | Code Intelligence | `@devos/sdk.discoverProjects()` |
| Project Analysis | Code Intelligence | `@devos/sdk.analyzeProject(id)` |
| Task Creation | Planning | `@devos/sdk.createTask(spec)` |
| Agent Execution | Execution | `@devos/sdk.executeAgent(task)` |
| Code Modification | Code Intelligence + Execution | `@devos/sdk.modifyCode(diff)` |
| Testing | Execution | `@devos/sdk.runTests(project)` |
| Verification | Execution | `@devos/sdk.verifyBuild(project)` |
| Deployment | Execution | `@devos/sdk.deploy(project, env)` |
| Monitoring | Memory + Learning | `@devos/sdk.monitor(project)` |

**Critical**: CodeMaker does NOT duplicate DevOS functionality. It consumes DevOS via SDK.

---

## Part 8: TalkMate Integration

### TalkMate as Conversational Control Layer

```
User: "Check all my projects for dependency vulnerabilities."
    │
    ▼
TalkMate: Intent Recognition → "security-audit", scope: "global"
    │
    ▼
DevOS: Orchestrates audit across registered projects
    │
    ▼
Project Registry → Analyze Projects (parallel)
    │
    ▼
Aggregated Results
    │
    ▼
TalkMate: Formatted response to user
```

### TalkMate Security

- Never exposes secrets to client
- Server-side API proxies all external calls
- Validates and sanitizes all inputs
- Rate-limits per session/IP
- No direct database access

---

## Part 9: Portfolio Project Cards

### Updated Project Cards

#### 1. DevOS — AI-Native Developer Operating System

```typescript
{
  id: 'devos',
  title: 'DevOS',
  tagline: 'AI-Native Developer Operating System',
  description: 'A modular 30-module autonomous architecture providing cognitive memory, autonomous planning, code intelligence, tool execution, knowledge graphs, learning/self-improvement, and continuous optimization. DevOS serves as the global intelligence layer for the entire AI ecosystem.',
  category: 'DevTools',
  tags: ['TypeScript', 'Node.js', 'AI Agents', 'Autonomous Systems', 'Knowledge Graphs', 'Modular Architecture'],
  link: 'https://devos.example.com',
  githubUrl: 'https://github.com/org/devos',
  isFeatured: true,
  stats: 'Core Platform • 30 Modules',
  status: 'development', // 'live' | 'development' | 'pre-release' | 'coming-soon'
  deployment: { provider: 'railway', url: 'https://devos.example.com' }
}
```

#### 2. CodeMaker AI — Autonomous Software Engineering Platform

```typescript
{
  id: 'codemaker',
  title: 'CodeMaker AI',
  tagline: 'Autonomous Software Engineering Platform',
  description: 'An AI-native engineering workspace featuring autonomous agents, repository intelligence, code generation/modification, testing, and deployment workflows. Integrates with DevOS for planning, memory, and code intelligence.',
  category: 'DevTools',
  tags: ['React', 'TypeScript', 'AI Agents', 'Code Generation', 'Repository Analysis', 'DevOS Integration'],
  link: 'https://codemaker.example.com',
  githubUrl: 'https://github.com/org/codemaker',
  isFeatured: true,
  stats: 'Engineering Workspace • Autonomous',
  status: 'development',
  deployment: { provider: 'fly.io', url: 'https://codemaker.example.com' }
}
```

#### 3. TalkMate AI — Conversational AI Platform

```typescript
{
  id: 'talkmate-ai',
  title: 'TalkMate AI',
  tagline: 'Conversational AI Assistant',
  description: 'A voice-friendly AI assistant with streaming responses, multiple personas, file handling, and accessible conversational UX. Built with React, Vercel Functions, and Gemini API.',
  category: 'AI',
  tags: ['React 19', 'TypeScript', 'Vercel Functions', 'Streaming AI', 'Voice UI', 'SSE'],
  link: '/talkmate',
  githubUrl: 'https://github.com/samarthsuvarna1012-tech/developer-portfolio-talkmate',
  isFeatured: true,
  stats: 'Portfolio Highlight • AI Assistant',
  status: 'live',
  deployment: { provider: 'vercel', url: 'https://portfolio.example.com/talkmate' }
}
```

#### 4. EVOLVEX — Evolutionary Cyber-Defense Laboratory

```typescript
{
  id: 'evolvex',
  title: 'EVOLVEX',
  tagline: 'Evolutionary Cyber-Defense Laboratory',
  description: 'An experimental platform for evolving cyber defense strategies through autonomous agent simulation, adversarial testing, and continuous adaptation. Integrates with DevOS for orchestration and learning.',
  category: 'Cloud',
  tags: ['Cybersecurity', 'Evolutionary Algorithms', 'Agent Simulation', 'Adversarial Testing', 'DevOS Integration'],
  link: 'https://evolvex.example.com',
  githubUrl: 'https://github.com/org/evolvex',
  isFeatured: false,
  stats: 'Research Platform • Experimental',
  status: 'pre-release',
  deployment: { provider: 'aws', url: 'https://evolvex.example.com' }
}
```

---

## Part 10: Card Interaction & Status

### Status Indicators

| Status | Label | Description |
|--------|-------|-------------|
| `live` | **Live** | Fully deployed and operational |
| `development` | **In Development** | Active development, not deployed |
| `pre-release` | **Pre-Release** | Deployed to staging, pre-production |
| `coming-soon` | **Coming Soon** | Planned, not yet started |

### Card Actions (Only Show Valid Links)

| Action | Condition |
|--------|-----------|
| View Project | `link` exists and status !== 'coming-soon' |
| Live Demo | `deployment.url` exists and status === 'live' |
| GitHub | `githubUrl` exists |
| Architecture | `architectureUrl` exists (optional) |
| Documentation | `docsUrl` exists (optional) |

---

## Part 11: Ecosystem Visualization

### Visual Representation in Portfolio

```
                  AI ECOSYSTEM

              ┌───────────────┐
              │   TalkMate    │
              │ Conversation  │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   CodeMaker   │
              │ Engineering   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │    DevOS      │
              │ Intelligence  │
              └───────┬───────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       EVOLVEX     Projects    Future Apps
```

Implementation: SVG/Canvas diagram or styled HTML/CSS consistent with portfolio design.

---

## Part 12: Global Deployment Architecture

### Deployment Targets by Project

| Project | Hosting Target | Build Command | Output | Runtime | Backend Needs |
|---------|---------------|---------------|--------|---------|---------------|
| Portfolio | Vercel | `npm run build` | `dist/` | Edge/Node | Serverless Functions |
| TalkMate | Vercel (same) | `npm run build` | `dist/` | Edge/Node | Serverless Functions |
| CodeMaker | Fly.io / Railway | `docker build` | Container | Node.js | Persistent DB, Workers, Sandbox |
| DevOS | Railway / Fly.io | `docker build` | Container | Node.js | Persistent DB, Workers, Message Queue |
| EVOLVEX | AWS / GCP | `docker build` | Container | Node.js/Python | GPU, Persistent Storage, Workers |

### Architecture Diagram

```
                        INTERNET
                           │
                           ▼
                    ┌─────────────┐
                    │  Portfolio  │  (Vercel - Static + Functions)
                    └──────┬──────┘
                           │
           ┌───────────────┼────────────────┐
           ▼               ▼                ▼
       TalkMate         CodeMaker          DevOS
       (Vercel)         (Fly.io)           (Railway)
       Frontend         Frontend           Runtime
           │               │                │
           ▼               ▼                ▼
       TalkMate API    CodeMaker API    DevOS Services
       (Functions)     (Container)      (Container)
                           │                │
                           └───────┬────────┘
                                   │
                              Workers/
                              Execution
                              (Shared or per-project)
```

### Key Principles

1. **Frontend on Vercel/Edge**: Static assets + serverless functions
2. **Backend on Container Platforms**: Persistent processes, databases, workers
3. **No Serverless for Long-Running**: Agents, sandboxes, workers need containers
4. **Independent Scaling**: Each project scales independently
5. **Shared Nothing**: No shared databases or message brokers unless explicitly designed

---

## Part 13: Environment Variables

### Portfolio (.env.example) — Current

```bash
# Set these in Vercel Project Settings → Environment Variables.
# GEMINI_API_KEY is required for TalkMate.
GEMINI_API_KEY=

# CONTACT_FORM_ENDPOINT is the endpoint of your configured form provider.
CONTACT_FORM_ENDPOINT=
```

### CodeMaker (.env.example) — Template

```bash
# CodeMaker AI Environment Variables
# ====================================

# Core
NODE_ENV=production
PORT=3000
PROJECT_ID=codemaker

# Database
DATABASE_URL=postgresql://user:pass@host:5432/codemaker
REDIS_URL=redis://host:6379

# DevOS Integration
DEVOS_API_URL=https://devos.example.com/api
DEVOS_SDK_TOKEN=sk-devos-xxx
DEVOS_WEBHOOK_SECRET=whsec-xxx

# Authentication
AUTH_SECRET=xxx
JWT_SECRET=xxx
OAUTH_GITHUB_CLIENT_ID=xxx
OAUTH_GITHUB_CLIENT_SECRET=xxx

# AI Providers
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
GEMINI_API_KEY=xxx

# GitHub Integration
GITHUB_APP_ID=xxx
GITHUB_APP_PRIVATE_KEY=xxx
GITHUB_WEBHOOK_SECRET=xxx

# Sandbox/Execution
SANDBOX_RUNTIME=firecracker
SANDBOX_CPU_LIMIT=2
SANDBOX_MEMORY_LIMIT=4096
SANDBOX_TIMEOUT=300

# Monitoring
SENTRY_DSN=xxx
LOG_LEVEL=info

# Feature Flags
ENABLE_AUTONOMOUS_MODE=false
ENABLE_EXPERIMENTAL_FEATURES=false
```

### DevOS (.env.example) — Template

```bash
# DevOS Environment Variables
# ===========================

# Core
NODE_ENV=production
PORT=3000
PROJECT_ID=devos

# Database
DATABASE_URL=postgresql://user:pass@host:5432/devos
REDIS_URL=redis://host:6379
VECTOR_DB_URL=xxx  # For embeddings/knowledge graph

# Module Configuration
MODULES_ENABLED=memory,planning,code-intelligence,execution,knowledge,learning,evolution,optimization

# Authentication & Authorization
AUTH_SECRET=xxx
JWT_SECRET=xxx
SERVICE_JWT_SECRET=xxx  # For service-to-service auth

# AI Providers (Multi-provider support)
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
GEMINI_API_KEY=xxx
OLLAMA_BASE_URL=http://localhost:11434

# Event Bus
EVENT_BUS_URL=redis://host:6379
EVENT_BUS_PREFIX=devos

# Sandbox/Execution
SANDBOX_RUNTIME=firecracker
SANDBOX_DEFAULT_CPU=2
SANDBOX_DEFAULT_MEMORY=4096

# GitHub Integration (for code intelligence)
GITHUB_TOKEN=xxx
GITHUB_APP_ID=xxx
GITHUB_APP_PRIVATE_KEY=xxx

# Monitoring
SENTRY_DSN=xxx
LOG_LEVEL=info
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=30000

# Learning/Evolution
LEARNING_ENABLED=true
EVOLUTION_ENABLED=false  # Requires explicit enable
EVOLUTION_SCHEDULE=0 2 * * *  # Daily at 2 AM
```

### EVOLVEX (.env.example) — Template

```bash
# EVOLVEX Environment Variables
# =============================

# Core
NODE_ENV=production
PORT=3000
PROJECT_ID=evolvex

# Database
DATABASE_URL=postgresql://user:pass@host:5432/evolvex
REDIS_URL=redis://host:6379

# DevOS Integration
DEVOS_API_URL=https://devos.example.com/api
DEVOS_SDK_TOKEN=sk-devos-xxx

# AI Providers
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx

# Simulation/Execution
SIMULATION_ENGINE=custom
MAX_CONCURRENT_SIMULATIONS=10
SIMULATION_TIMEOUT=3600

# Security
ENCRYPTION_KEY=xxx
SANDBOX_ISOLATION=strict

# Monitoring
SENTRY_DSN=xxx
LOG_LEVEL=info
```

### Environment Variable Categories

| Category | Prefix | Exposure |
|----------|--------|----------|
| Public Config | `PUBLIC_` or `VITE_` | Client-side (build-time) |
| Server Config | (no prefix) | Server-side only |
| Secrets | `*_SECRET`, `*_KEY`, `*_TOKEN` | Server-side only, never in client |

**Never commit actual secrets.** Use hosting provider secret management.

---

## Part 14: Domain / Routing Strategy

### Proposed Domain Structure

```
yourdomain.com                          → Portfolio (Vercel)
yourdomain.com/projects                 → Portfolio Projects Section
yourdomain.com/talkmate                 → TalkMate AI (integrated)

codemaker.yourdomain.com                → CodeMaker AI (Fly.io)
codemaker.yourdomain.com/api            → CodeMaker API

devos.yourdomain.com                    → DevOS (Railway)
devos.yourdomain.com/api                → DevOS API
devos.yourdomain.com/health             → DevOS Health

evolvex.yourdomain.com                  → EVOLVEX (AWS)
evolvex.yourdomain.com/api              → EVOLVEX API
```

### Configuration

- Use environment-based configuration (`process.env.DOMAIN_ROOT`)
- Subdomain routing via DNS + hosting provider
- SSL/TLS managed by hosting providers
- CORS configured per-service

---

## Part 15: Health and Observability

### Health Check Standards

Every independently deployed service MUST implement:

```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;           // Semantic version
  build: string;             // Build ID / commit SHA
  timestamp: string;         // ISO 8601
  uptime: number;            // Seconds
  dependencies: DependencyHealth[];
  checks: HealthCheck[];
}

interface DependencyHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs?: number;
  error?: string;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  component: string;
  details?: Record<string, unknown>;
}
```

### Portfolio Health (Current)

- `/api/health` → `{ status: "ok" }` (basic)

### Enhanced Health for All Services

| Service | Health Endpoint | Readiness Endpoint | Deep Checks |
|---------|-----------------|-------------------|-------------|
| Portfolio | `/api/health` | `/api/ready` | Build version, API connectivity |
| TalkMate | `/api/health` | `/api/ready` | Gemini API, SSE streaming |
| CodeMaker | `/health` | `/ready` | DB, Redis, DevOS, Sandbox, GitHub |
| DevOS | `/health` | `/ready` | All modules, DB, Vector DB, Event Bus, AI Providers |
| EVOLVEX | `/health` | `/ready` | DB, Redis, DevOS, Simulation Engine |

### Observability Stack (Recommended)

- **Logs**: Structured JSON → Loki/Elastic
- **Metrics**: Prometheus + Grafana
- **Traces**: OpenTelemetry → Tempo/Jaeger
- **Alerting**: AlertManager/PagerDuty
- **Error Tracking**: Sentry

---

## Part 16: Security Review

### Cross-Project Security Checklist

| Area | Status | Notes |
|------|--------|-------|
| Service Authentication | 🔄 Planned | mTLS or signed JWTs between services |
| CORS | ✅ Portfolio configured | Per-service configuration needed |
| CSRF | ✅ Portfolio (stateless) | Required for CodeMaker/DevOS forms |
| Rate Limiting | ✅ Portfolio (IP-based) | Per-service, per-endpoint needed |
| Authentication | 🔄 Planned | OAuth/OIDC for CodeMaker/DevOS |
| Authorization | 🔄 Planned | RBAC with project-level granularity |
| Project Isolation | ✅ Architectural | Enforced by deployment separation |
| SSRF Protection | 🔄 Planned | Egress controls, allowlists |
| Path Traversal | 🔄 Planned | Input validation, sandboxing |
| Command Execution | 🔄 Planned | Sandbox isolation (Firecracker/gVisor) |
| Repository Access | 🔄 Planned | GitHub App with minimal permissions |
| Secrets Management | 🔄 Planned | Vault/Sealed Secrets/Provider secrets |
| Prompt Injection | 🔄 Planned | Input sanitization, output validation |
| Agent Permissions | 🔄 Planned | Capability-based, approval gates |
| Sandbox Escape | 🔄 Planned | Firecracker/gVisor, no host access |
| Dependency Vulnerabilities | 🔄 Planned | Automated scanning (Dependabot/Trivy) |
| Cross-Project Operations | 🔄 Planned | Explicit approval, audit logging |

### Security Principles

1. **Default Deny**: No cross-project access without explicit permission
2. **Least Privilege**: Each service gets minimum required permissions
3. **Defense in Depth**: Multiple layers (network, application, runtime)
4. **Audit Everything**: All cross-project operations logged
5. **Rotate Secrets**: Automated rotation for service credentials
6. **Validate Inputs**: All external inputs validated and sanitized
7. **Isolate Execution**: Sandboxes for untrusted code execution

---

## Part 17: Avoiding Over-Engineering

### What We Do NOT Need (Yet)

| Technology | Reason | When to Add |
|------------|--------|-------------|
| Kubernetes | Overkill for 4 services | >10 services, complex scaling |
| Service Mesh | Complexity without benefit | >20 services, mTLS at scale |
| Message Broker (Kafka/RabbitMQ) | Redis pub/sub sufficient | High-throughput event streaming |
| Distributed Tracing | Nice-to-have | Production debugging needed |
| Multiple Databases | Start with one per service | Polyglot persistence justified |
| Custom Auth System | Use OAuth/OIDC providers | Enterprise SSO requirements |

### Start Simple

1. **Container platforms** (Fly.io, Railway) for backends
2. **Vercel** for frontends
3. **PostgreSQL + Redis** per service
4. **REST + SSE** for communication
5. **GitHub Actions** for CI/CD
6. **Provider secrets** for secret management

---

## Part 18: Validation Checklist

### Portfolio (Current)

| Check | Command | Status |
|-------|---------|--------|
| Install | `npm install` | ✅ |
| Typecheck | `npm run lint` | 🔄 Pending |
| Build | `npm run build` | 🔄 Pending |
| Tests | (none configured) | ⚠️ Need tests |
| Security Audit | `npm audit` | 🔄 Pending |

### CodeMaker (Future)

| Check | Command | Status |
|-------|---------|--------|
| Install | `npm install` | ⏳ Not created |
| Typecheck | `npm run typecheck` | ⏳ Not created |
| Lint | `npm run lint` | ⏳ Not created |
| Tests | `npm test` | ⏳ Not created |
| Build | `npm run build` | ⏳ Not created |
| Docker Build | `docker build .` | ⏳ Not created |
| Security Audit | `npm audit` | ⏳ Not created |

### TalkMate (Integrated)

| Check | Command | Status |
|-------|---------|--------|
| Typecheck | Part of portfolio | 🔄 Pending |
| Build | Part of portfolio | 🔄 Pending |

### DevOS (Future)

| Check | Command | Status |
|-------|---------|--------|
| Install | `npm install` | ⏳ Not created |
| Typecheck | `npm run typecheck` | ⏳ Not created |
| Lint | `npm run lint` | ⏳ Not created |
| Tests | `npm test` | ⏳ Not created |
| Build | `npm run build` | ⏳ Not created |
| Docker Build | `docker build .` | ⏳ Not created |

### EVOLVEX (Future)

| Check | Command | Status |
|-------|---------|--------|
| Install | `npm install` / `pip install` | ⏳ Not created |
| Typecheck/Lint | TBD | ⏳ Not created |
| Tests | TBD | ⏳ Not created |
| Build | TBD | ⏳ Not created |

---

## Part 19: Portfolio Validation

### Current Portfolio Checks

| Check | Status |
|-------|--------|
| All project cards render | 🔄 After update |
| Responsive layouts work | ✅ |
| Links work | 🔄 After update |
| No fake links | 🔄 After update |
| Animations accessible | ✅ (respects prefers-reduced-motion) |
| Project status accurate | 🔄 After update |
| No console errors | ✅ |
| No broken routes | ✅ |
| No missing assets | ✅ |
| SEO metadata updated | 🔄 After update |
| Descriptions technically accurate | 🔄 After update |
| Mobile layout correct | ✅ |

---

## Part 20: Final Deliverable Summary

### Ecosystem Architecture Summary

```
Portfolio (Vercel) ←→ TalkMate (integrated)
                          │
                          ▼
                    CodeMaker (Fly.io) ←→ DevOS (Railway) ←→ EVOLVEX (AWS)
```

**Connection Methods:**
- Portfolio → TalkMate: Direct (same deployment)
- Portfolio → CodeMaker/DevOS/EVOLVEX: Public API + health endpoints
- TalkMate → CodeMaker/DevOS: Server-side proxy via portfolio functions
- CodeMaker → DevOS: `@devos/sdk` (authenticated API)
- DevOS → All Projects: SDK + authenticated API + event bus
- EVOLVEX → DevOS: SDK + authenticated API

### Project Status Summary

| Project | Development | Build | Tests | Deployment | Integration |
|---------|-------------|-------|-------|------------|-------------|
| Portfolio | ✅ Complete | ✅ Ready | ⚠️ Missing | ✅ Vercel configured | ✅ TalkMate integrated |
| TalkMate | ✅ Complete | ✅ Ready | ⚠️ Missing | ✅ Vercel (with Portfolio) | ✅ Portfolio integrated |
| CodeMaker | ⏳ Not started | ⏳ | ⏳ | ⏳ | ⏳ |
| DevOS | ⏳ Not started | ⏳ | ⏳ | ⏳ | ⏳ |
| EVOLVEX | ⏳ Not started | ⏳ | ⏳ | ⏳ | ⏳ |

### Portfolio Changes (This Session)

1. `src/data/portfolioData.ts` — Added DevOS, CodeMaker, EVOLVEX project data
2. `src/types.ts` — Extended `Project` interface with `status`, `deployment` fields
3. `src/components/ProjectsSection.tsx` — Updated to render new projects, status badges
4. `src/components/EcosystemVisualization.tsx` — New component for ecosystem diagram
5. `src/pages/EcosystemPage.tsx` — New page for detailed ecosystem view
6. `ECOSYSTEM_ARCHITECTURE.md` — This documentation

### Deployment Configuration Summary

| Project | Hosting | Build Command | Output | Runtime | Key Env Vars | Domain |
|---------|---------|---------------|--------|---------|--------------|--------|
| Portfolio | Vercel | `npm run build` | `dist/` | Edge | `GEMINI_API_KEY`, `CONTACT_FORM_ENDPOINT` | `yourdomain.com` |
| TalkMate | Vercel | `npm run build` | `dist/` | Edge | `GEMINI_API_KEY` | `yourdomain.com/talkmate` |
| CodeMaker | Fly.io | `docker build` | Container | Node.js | See template | `codemaker.yourdomain.com` |
| DevOS | Railway | `docker build` | Container | Node.js | See template | `devos.yourdomain.com` |
| EVOLVEX | AWS | `docker build` | Container | Node/Python | See template | `evolvex.yourdomain.com` |

### Integration Contracts Summary

| From → To | Contract | Auth | Transport |
|-----------|----------|------|-----------|
| TalkMate → CodeMaker | REST `/api/v1/*` | Service JWT | HTTPS |
| TalkMate → DevOS | REST `/api/v1/*` | Service JWT | HTTPS |
| CodeMaker → DevOS | `@devos/sdk` | Service JWT | HTTPS |
| DevOS → Projects | `@{project}/sdk` + Events | Service JWT | HTTPS + Redis Pub/Sub |
| Portfolio → All | Public Health/Status | None (public) | HTTPS |

### Security Summary

| Protection | Status |
|------------|--------|
| Service Authentication | 🔄 Planned (JWT/mTLS) |
| CORS | ✅ Portfolio / 🔄 Others |
| Rate Limiting | ✅ Portfolio / 🔄 Others |
| Authentication | 🔄 Planned (OAuth) |
| Authorization | 🔄 Planned (RBAC) |
| Project Isolation | ✅ Architectural |
| SSRF Protection | 🔄 Planned |
| Command Execution Safety | 🔄 Planned (Sandbox) |
| Secrets Management | 🔄 Planned (Provider) |
| Prompt Injection Defense | 🔄 Planned |
| Agent Permissions | 🔄 Planned |
| Audit Logging | 🔄 Planned |
| Dependency Scanning | 🔄 Planned |

### Validation Report

| Check | Portfolio | CodeMaker | TalkMate | DevOS | EVOLVEX |
|-------|-----------|-----------|----------|-------|---------|
| Build | 🔄 Pending | ⏳ N/A | 🔄 Pending | ⏳ N/A | ⏳ N/A |
| Typecheck | 🔄 Pending | ⏳ N/A | 🔄 Pending | ⏳ N/A | ⏳ N/A |
| Lint | 🔄 Pending | ⏳ N/A | 🔄 Pending | ⏳ N/A | ⏳ N/A |
| Tests | ⚠️ Missing | ⏳ N/A | ⚠️ Missing | ⏳ N/A | ⏳ N/A |
| Security Audit | 🔄 Pending | ⏳ N/A | 🔄 Pending | ⏳ N/A | ⏳ N/A |
| Deployment Ready | ✅ Config exists | ⏳ N/A | ✅ Config exists | ⏳ N/A | ⏳ N/A |

### Deployment Readiness

| Project | Status |
|---------|--------|
| Portfolio | **READY FOR DEPLOYMENT** (configuration complete) |
| TalkMate | **READY FOR DEPLOYMENT** (integrated with Portfolio) |
| CodeMaker | **NOT READY** (project not created) |
| DevOS | **NOT READY** (project not created) |
| EVOLVEX | **NOT READY** (project not created) |

---

## Important Distinction

> **READY FOR DEPLOYMENT** ≠ **ACTUALLY DEPLOYED**

- Portfolio + TalkMate: Configuration complete, can be deployed to Vercel now
- CodeMaker, DevOS, EVOLVEX: Architecture documented, but projects don't exist yet
- Only mark **LIVE** after real deployment and production verification

---

## Next Steps

1. **Immediate**: Validate portfolio build with new project cards
2. **Short-term**: Deploy Portfolio + TalkMate to Vercel (mark LIVE)
3. **Medium-term**: Create CodeMaker repository with documented architecture
4. **Medium-term**: Create DevOS repository with documented architecture
5. **Long-term**: Create EVOLVEX repository with documented architecture
6. **Ongoing**: Implement integration contracts as projects come online
7. **Ongoing**: Enhance security, observability, and permission model

---

*Document Version: 1.0.0*
*Last Updated: 2026-08-09*
*Status: Architecture Defined — Implementation Pending for CodeMaker, DevOS, EVOLVEX*