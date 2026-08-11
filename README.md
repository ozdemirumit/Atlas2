# Project Atlas

Project Atlas is an enterprise-grade AI Infrastructure Operations Platform.

Its purpose is to help infrastructure teams understand complex environments, analyze operational problems, assess risk, and generate explainable recommendations without allowing AI to perform unauthorized infrastructure changes.

Atlas is not a traditional monitoring tool and it is not an autonomous operator. It is designed as an intelligent decision-support platform that can correlate infrastructure data, vendor knowledge, operational history, topology, health checks, and human-approved workflows.

The project has an approved documentation baseline (`1.0.0 Approved` for all 47 governed documents) and a completed foundational implementation (`ATLAS-IMP-001`).

---

## Executive Summary

Modern enterprise infrastructure spans storage systems, SAN switches, virtualization platforms, operating systems, backup platforms, directory services, network services, and vendor-specific tools. These domains are often managed through separate consoles, APIs, scripts, runbooks, and operational knowledge.

Project Atlas aims to create a unified AI-assisted operations platform for this environment. It uses modular MCP connectors, an infrastructure knowledge graph, retrieval-augmented generation, AI agents, policy controls, and enterprise governance to help engineers investigate incidents, understand impact, and prepare safe remediation plans.

Atlas is built for enterprise environments from the beginning. Security, RBAC, LDAP and Active Directory integration, audit logging, Syslog, SIEM integration, explainability, approval workflows, and reproducible deployment are core requirements, not optional later additions.

---

## Core Principle

> **AI assists. Humans decide.**

Atlas may analyze, correlate, explain, recommend, prepare plans, estimate impact, and propose rollback steps. It must not execute operationally risky actions without explicit human approval and policy control.

---

## Product Vision

Atlas is the AI-powered operating platform that understands enterprise infrastructure, reasons about operational problems, and assists engineers in making safe, explainable, and informed decisions.

Key capabilities include:

- Infrastructure discovery and relationship mapping
- Infrastructure knowledge graph (`ATLAS-026`)
- Vendor and operational knowledge management (`ATLAS-015` / `ATLAS-027`)
- Health checks and scheduled assessments (`ATLAS-023`)
- Root cause analysis (`ATLAS-042`)
- Change impact analysis (`ATLAS-044`)
- Risk scoring and service interruption estimation
- Recommendation and rollback planning (`ATLAS-043`)
- Human-controlled approval workflows (`ATLAS-037`)
- Enterprise audit and compliance evidence (`ATLAS-032`)

---

## Development Status

- **Documentation Baseline**: `1.0.0 Approved` (47 governed documents, 78 ADRs)
- **Implementation Status**: **ATLAS-IMP-001 (Completed)**
  - Runnable modular-monolith FastAPI backend (`backend/`)
  - PostgreSQL 18 migration baseline (`backend/alembic/`)
  - ADR-003 Development Identity Provider (`Local Operator` - `C0` scope)
  - Enterprise React 19 + TypeScript + Vite operations workspace (`frontend/`)
  - Quality assurance test suite (100% test pass, mypy strict, ruff lint)

---

## Repository Structure

```text
AGENTS.md          AI development rules and instruction precedence
README.md          Main project overview and setup instructions
docs/              Product, architecture, platform, security, AI, and development documents
backend/           FastAPI backend modular-monolith API, models, and migrations
frontend/          Enterprise React 19 + TypeScript operations workspace
scripts/           Project automation, bootstrap, dev servers, and quality checks
docker-compose.yml Docker composition profile for PostgreSQL 18 and backend
pyproject.toml     Python project dependencies and tooling configurations
```

---

## Getting Started

### Prerequisites

- Python 3.12+ (or `uv`)
- Node.js 20+ (with `npm` or `pnpm`)
- Docker & Docker Compose (optional for containerized PostgreSQL)

### Local Quickstart

1. **Bootstrap Dependencies**:
   ```cmd
   scripts\bootstrap.cmd
   ```
   *Alternatively (manual virtualenv setup):*
   ```cmd
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -e .[dev]
   cd frontend && npm install
   ```

2. **Launch Local Development Servers**:
   ```cmd
   scripts\dev.cmd
   ```
   - **Web Workspace Shell**: `http://localhost:5173`
   - **Interactive API Documentation**: `http://localhost:8000/docs`
   - **System Health Endpoint**: `http://localhost:8000/health`

3. **Development Identity (ADR-003)**:
   The local development launcher explicitly enables a server-configured identity named `Local Operator`. This identity carries `C0` read permission (`identity.self.read`) and is disabled by default in production.

4. **Run Quality Checks**:
   ```cmd
   scripts\check.cmd
   ```
   *Or run individual checks:*
   ```cmd
   .\.venv\Scripts\python.exe -m pytest backend/tests
   .\.venv\Scripts\python.exe -m mypy --explicit-package-bases backend/app
   .\.venv\Scripts\python.exe -m ruff check .
   ```

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the documentation lifecycle, review and approval workflow, versioning policy, and pull request expectations.
