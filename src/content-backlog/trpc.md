---
slug: "/blog/rest-graphql-trpc"
date: "2024-06-06"
title: "REST vs GraphQL vs tRPC"
subtitle: "REST vs GraphQL vs tRPC"
---

## **REST vs GraphQL vs tRPC**

<p class="text-time">최초 업로드 2024-06-06 / 마지막 수정 2024-06-06</p>

#### 요약

|         | 오버헤드                                                        | 확장성 | 러닝커브 |
| ------- | --------------------------------------------------------------- | ------ | -------- |
| REST    | 낮음                                                            | 높음   | 낮음     |
| GraphQL | 중간 - 쿼리 파싱, 검증, 실행 등                                 | 높음   | 중간     |
| tRPC    | 낮음 - 타입스크립트에 의존, 경량화된 RPC 호출로 오버헤드가 적음 | 중간   | 중간     |

- tRPC는 도입 시 프론트랑 백엔드가 타입스크립트로 묶인다는 제약이 있음. 대신 타입을 한 곳에서만 지정한다는 것이 편리.
- tRPC는 백엔드와 프론트 기능들이 tightly coupled되어도 괜찮고, 장기적으로 백엔드를 따로 스케일링하거나 다용도로 사용하지 않을 때 좋음.

현재 내가 진행하는 프로젝트는 추후 백엔드가 다양한 기능을 가질 것이고 커질 수 있기 때문에 프론트와 완전한 분리가 유리할 것으로 판단하여 HTTP2 기반 Rest와 GraphQL혼용.

#### GraphQL 네트워크 구성

#### tRPC 네트워크 구성
