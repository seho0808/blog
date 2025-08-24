---
slug: "/blog/redis-valkey-usage"
date: "2025-08-24"
title: "Redis/Valkey Use Cases"
subtitle: "Delving into use cases of Redis and Valkey"
---

## **Delving into use cases of Redis/Valkey**

<p class="text-time">Initial Upload 2025-08-24 / Last Modified 2025-08-24</p>

_<span class="text-purple">I am a newbie in key–value stores but wanted to share the use cases I learned from the last few weeks of experience.</span>_

There are three main use cases of Redis/Valkey: <span class="text-orange">NoSQL</span>, <span class="text-orange">Caching</span>, and <span class="text-orange">Distributed Locking</span>

## **<span class="text-skyblue">1. Caching</span>**

- Most developers reach for Redis when they need caching. It’s <span class="text-orange">fast</span>, <span class="text-orange">reliable</span>, and works great as a <span class="text-orange">centrally managed data store</span>.
- The most important topics to study (<span class="text-yellow">Pareto principle — focus on the vital 20%</span>):

  1. <span class="text-skyblue">Cache Invalidation & Consistency</span>

     - Write Patterns: Write-through, write-around, and write-behind strategies.
     - Read Patterns: Cache-aside, read-through
     - Event-driven invalidation (pub/sub).
     - Keeping the cache and DB in sync.

  2. <span class="text-skyblue">Expiration & Eviction</span>

     - TTL strategies
     - Eviction policies(`LRU`, `LFU`, etc.) and tuning `maxmemory`.
     - Preventing cache stampedes

- Q: Invalidation vs. eviction — aren't they the same thing? Why the different terms?

- A: <span class="text-yellow">Eviction</span> is the <span class="text-red">AUTOMATIC</span> removal of a key:value pair (memory limits, TTL expiry, or an eviction policy like LRU/LFU),
  while <span class="text-yellow">invalidation</span> is the <span class="text-red">EXPLICIT</span> removal of data by the application (triggered by an event, like a DB update, to avoid stale data).

<br/>

## **<span class="text-skyblue">2. NoSQL</span>**

- <span class="text-yellow">What? You can use Redis as NoSQL?</span> ...I feel you. I had the exact same feeling when I first encountered the concept.
- As traffic grows, many teams choose a key-value store as the <span class="text-orange">primary data store</span> for specific business logic.

#### <span class="text-skyblue">When?</span>

- "Amazon 90% discount coupon — first 1,000 customers, first-come, first-served"
- "Rihanna concert ticket reservation"
- "Recording popular ordered items"

#### <span class="text-skyblue">Why?</span>

- These have <span class="text-orange">very high request concurrency</span>.
- BUT they also make updates, which cause each request to <span class="text-orange">hold locks on DB rows</span>.
- That makes the database <span class="text-orange">much less scalable</span>.
- One optimization choice is using a key-value store as the <span class="text-orange">primary data store</span>.

#### <span class="text-skyblue">How?</span>

- You can choose from many data structures that Redis/Valkey has to offer.
- If you use Redis/Valkey as the main data store, make sure you consider them as the <span class="text-red">SINGLE SOURCE OF TRUTH</span>.
  - For example, if you keep available stock count both on DB and Redis, it can easily become an <span class="text-orange">antipattern</span>.
  - One way to prevent a complicated situation is to simply <span class="text-skyblue">remove the column from the DB and only keep it in Redis</span>.

<br/>

## **<span class="text-skyblue">3. Distributed Locking</span>**

- I think there are mainly two reasons to use Redis/Valkey distributed locking:
  1. <span class="text-yellow">Application Level Lock.</span> DB locks only protect database state; sometimes you need to coordinate operations at the application layer.
  2. <span class="text-yellow">Reduce backpressure</span> on the DB.
- Number 2 is less tempting to me, since there are so many other solutions (Kafka, MQ, etc.).
- Number 1 is somewhat tempting, though you can still use other patterns to achieve it.
- Distributed Lock is a safe choice if you have a <span class="text-red">SINGLE REDIS CLUSTER</span>
  - This is because multiple Redis clusters enforce you to use <span class="text-skyblue">Redlock</span>, which is an <span class="text-red">inherently flawed algorithm</span>.
