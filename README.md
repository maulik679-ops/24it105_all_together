# TaskFlow - Full-Stack Task Management Platform

[![CI Pipeline](https://github.com/maulik679-ops/24it105_all_together/actions/workflows/ci.yml/badge.svg)](https://github.com/maulik679-ops/24it105_all_together/actions/workflows/ci.yml)

A modern, containerized, event-driven full-stack task management application with automated CI/CD workflows and AI-assisted task workflows.

---

## 🚀 Key Features & Practical Progression

* **Practical 06:** Full-stack Task Management CRUD application (React + Node/Express + MongoDB).
* **Practical 07:** Authentication, JWT token verification & secure middleware pipeline.
* **Practical 08:** React performance optimization, lazy loading & code splitting.
* **Practical 09:** In-memory caching layer (`node-cache`) with TTL and cache analytics.
* **Practical 10:** Asynchronous event-driven architecture with Node.js `EventEmitter`.
* **Practical 11:** Multi-container orchestration using Docker and Docker Compose.
* **Practical 12:** Continuous Integration (CI) pipeline with GitHub Actions, Jest & Supertest.
* **Practical 13:** Secure AI API integration with graceful degradation.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Lucide Icons, Glassmorphic Technical Precision CSS.
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Node-Cache.
* **Testing & CI/CD:** Jest, Supertest, GitHub Actions.
* **DevOps:** Docker, Docker Compose, Nginx.

---

## 🧪 Running Automated Tests

To execute the unit and integration test suite:

```bash
cd backend
npm test
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

On every `push` or `pull_request` targeting the `main` branch, the GitHub Actions workflow defined in `.github/workflows/ci.yml`:
1. Checks out the code repository.
2. Provisions a clean Node.js 18 runtime.
3. Installs backend dependencies (`npm install`).
4. Executes the automated test suite (`npm test`).
5. Reports test results with real-time pass/fail status directly in GitHub.
