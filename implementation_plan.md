# Healix Enterprise Infrastructure Architecture

This document outlines the world-class, production-grade infrastructure architecture for the Healix AI Healthcare + IoT platform. Designed for global scale (10M+ devices), high availability, and rigorous security compliance, this architecture transitions Healix from a monolithic application to a resilient, distributed enterprise system.

## 1. Frontend Infrastructure (Next.js Edge Architecture)
- **Modular App Architecture**: Domain-driven design separating `/app/(marketing)`, `/app/(dashboard)`, `/app/(iot-tracking)`, and `/app/(biolabs)`.
- **SSR + ISR Optimization**: Marketing pages use ISR. Dashboards use SSR with edge caching. Live tracking uses Client-Side Rendering (CSR).
- **Error Boundaries & Suspense**: Granular React Error Boundaries per widget to prevent cascading UI failures.

## 2. API Infrastructure (Resilient Gateway) [PHASE 1 COMPLETE]
- **Resilience Patterns**: Circuit Breakers, Rate Limiting, and Structured Logging implemented to protect downstream services (Supabase/AI).

## 3. Database Architecture (Supabase / Postgres)
- **Tables**: `devices`, `telemetry` (partitioned), `trips`, `alerts`, `sos_events`, `patient_profiles`, `providers`, `ai_predictions`, `audit_logs`.
- **Partitioning & Indexing**: Time-series partitioning for telemetry; BRIN indexes.

## 4. IoT Telemetry Pipeline
- **Flow**: Device -> API Gateway -> Redis Buffer -> Postgres Batch Insert -> Realtime Broadcast.
- **Dead-Letter Queue (DLQ)**: Malformed or unauthenticated packets are routed to a DLQ for inspection.

## 5. Security Layer (Zero-Trust)
- **Auth**: Supabase Auth (JWT) with short-lived tokens.
- **Device Signatures**: HMAC-SHA256 signatures for IoT payloads.

## 6. AI & Data Pipeline [PHASE 2 FOCUS]
- **Architecture**: Async processing via Background Workers (Inngest / Upstash QStash).
- **Models**: Anomaly detection, route risk intelligence, predictive event forecasting.

## 7. Deployment Pipeline (CI/CD) [PHASE 1 COMPLETE]
- Automated GitHub Actions for CI validation and Vercel Production deployment.

## 8. Observability & Monitoring [PHASE 1 COMPLETE]
- Datadog configuration deployed for APM and Edge log ingestion.

---

> [!IMPORTANT]
> **User Review Required for Phase 2**
> Please review the execution plan for Phase 2. Once approved, I will implement the globally distributed caching layer and asynchronous worker infrastructure.

## Proposed Execution Plan: Phase 2 (Async Pipelines & Scalability)

Phase 2 transforms the architecture from synchronous API calls to an enterprise event-driven system, essential for AI processing and 10M+ device scale.

### 1. Global Redis Integration
We will upgrade the infrastructure to utilize Upstash Redis, shifting state management from the isolated Edge runtime to a globally replicated cache.
- **[MODIFY] `src/lib/infrastructure/rate-limiter.ts`**: Upgrade from the in-memory fallback to a true distributed Redis sliding-window algorithm.
- **[NEW] `src/lib/infrastructure/cache.ts`**: Implement an enterprise caching utility (stale-while-revalidate pattern) for heavy API responses.

### 2. Asynchronous AI Worker Queue
We will scaffold the infrastructure for processing IoT telemetry through AI inference engines *without* blocking the API gateway response.
- **[NEW] `src/app/api/inngest/route.ts`**: Setup the Inngest (or equivalent) queue endpoint for Vercel Serverless/Edge execution.
- **[NEW] `src/workers/ai-inference.ts`**: Create the background worker definition that receives telemetry events and processes risk scoring asynchronously.

### 3. Dead-Letter Queue (DLQ) Resilience
- **[NEW] `src/lib/infrastructure/dlq.ts`**: A utility to capture failed events (e.g., failed AI inference, malformed IoT packets) and push them to a Redis-backed queue or a dedicated Supabase DLQ table for automated retries and manual inspection.

> [!TIP]
> **To proceed:** If you approve of moving state management to Redis and implementing asynchronous background workers for the AI pipeline, reply with "Approved" to begin Phase 2.
