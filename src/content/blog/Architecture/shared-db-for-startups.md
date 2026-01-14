---
slug: "/blog/shared-db"
date: "2026-01-08"
title: "The Shared Database Pattern"
subtitle: "The pragmatic middle ground between Monoliths and Microservices"
---

# Shared Database for Startups

The <span class="text-skyblue">_Fundamentals of Software Architecture_</span> describes the **Service-Based Architecture** as a practical middle ground between a monolithic architecture and full-blown microservices. It offers <span class="text-yellow">faster development speed</span> but introduces specific architectural flaws that require careful alignment.

### The Startup Perspective

This architecture is the <span class="text-skyblue">de facto standard for growing startups</span>. It allows teams to decompose a monolith without incurring the massive operational overhead of full microservices.

However, the risks shift depending on your stage:

- **Operational Velocity:** <span class="text-orange">Coupling and Migrations (1, 2) are the biggest hurdles to iteration speed.</span> When every feature requires a coordinated deployment, your ability to pivot slows down.
- **Scale & Stability:** <span class="text-red">Connection Saturation and SPOF (4, 5) become the immediate killers</span> if you experience sudden high traffic.

## 1. The Coupling Trap (Deployment)

The most significant risk is <span class="text-red">Database Coupling</span>.

In a shared database environment, the database schema becomes a public API. <span class="text-orange">A single change to a table structure can instantly break multiple services</span> that rely on it. This forces teams to coordinate deployments, effectively re-introducing the "monolithic deployment" problem despite having separate services.

## 2. Migration Complexities

Schema migrations become significantly harder to manage.

The most common approach is to designate a <span class="text-yellow">single primary service</span> to handle all schema migrations, while other services purely consume the data. However, this creates a dependency where deployment pipelines must be strictly ordered: <span class="text-orange">the migration service must deploy and succeed before any other service can deploy new code that relies on those schema changes.</span>

## 3. Concurrency & Data Ownership

When multiple services access the same mutable data, <span class="text-red">race conditions become inevitable</span>. In a monolithic app, you might rely on in-memory locks or long database transactions. In a shared database, those luxury tools become performance killers or deadlock traps.

| Scenario                                                                        | Monolithic Solution                                                                                                                                                            | Shared DB Solution                                                                                                                           | Key Difference                                                                                  |
| :------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Lost Update**<br>_(Service A & B update balance at the same time)_            | **Flexible Choice**<br>Can use either **Pessimistic** (`SELECT FOR UPDATE`) for high contention or **Optimistic** (`Version`) for high concurrency. Easy to switch strategies. | **Optimistic Lock Only**<br>(`Version Column`)<br>Must use `WHERE version = ?`. Pessimistic locks are too risky (deadlocks across services). | Monoliths let you choose the right tool; Shared DB forces Optimistic Locking to survive.        |
| **Inconsistent Read**<br>_(Service A calculates stats while Service B updates)_ | **Isolation Levels**<br>Adjust DB transaction isolation (e.g., Repeatable Read).                                                                                               | **Read Replica / Eventual Consistency**<br>Separate analytical queries to a replica to avoid blocking writes from other services.            | You often must accept that you are reading "slightly stale" data to preserve write performance. |
| **State Mismatch**<br>_(Service A sees "Active", Service B sets "Banned")_      | **Shared Memory**<br>Check state in the same memory heap or session object.                                                                                                    | **Distributed Lock**<br>May need an external coordinator (Redis) for critical state changes.                                                 | DB state alone is insufficient if business logic requires strict ordering across services.      |

### The "Optimistic" Reality

The standard fix is **Optimistic Locking** (checking a version column on write).

```sql
UPDATE users
SET balance = 150, version = version + 1
WHERE id = 1 AND version = 5;
```

However, this relies on <span class="text-orange">strict discipline across all teams</span>. If a single new service forgets to include the `version` check in its WHERE clause, it can silently corrupt data integrity for everyone else.

## 4. Connection Saturation

The database becomes a shared resource for connections as well.

Unlike a monolith where one connection pool manager oversees everything, independent services manage their own pools. <span class="text-orange">One high-traffic service can saturate the database's max connection limit, starving other services of connections.</span> This leads to a <span class="text-red">cascading failure</span> where a non-critical service can bring down critical ones simply by exhausting the database's capacity.

## 5. Single Point of Failure

The shared database defeats the isolation goal of distributed systems.

If the database experiences downtime or performance degradation, <span class="text-red">the entire system fails simultaneously</span>. You lose the ability for non-critical features to fail gracefully while core services remain operational. A single heavy query from a reporting service can consume all CPU/IO, bringing down the critical checkout flow.

## 6. Technology Lock-in

You lose the ability to choose the right tool for the job.

In a shared environment, all services must conform to the same database technology. <span class="text-orange">You cannot use a Graph DB for social features or a Document DB for product catalogs</span> if the monolith database is PostgreSQL. This forces compromises where services effectively misuse the database for patterns it wasn't designed for.

## 7. Bounded Context Leakage

Ideally, services communicate only through APIs. A shared database tempts developers to cheat.

It is easy for Service A to query Service B's tables directly because "the data is right there." This breaks encapsulation and creates <span class="text-red">invisible coupling</span>. Logic that belongs in Service B starts leaking into Service A's SQL queries, making the domain boundaries fuzzy and the system harder to refactor.
