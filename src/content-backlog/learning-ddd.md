---
slug: "/blog/learning-domain-driven-design"
date: "2024-09-20"
title: "Learning DDD 정리"
subtitle: "Learning Domain Driven Design 정리"
---

## **Learning Domain Driven Design 정리**

<p class="text-time">최초 업로드 2024-09-20 / 마지막 수정 2024-09-23</p>

아침마다 지하철에서 40분씩 읽고 출근 후 15분씩 정리해보았다.

## Chapter 1 - Analyzing Business Domains

Core Domain, Generic Domain, Supporting Domain 이렇게 비즈니스 도메인들을 나누는 법(생각 프레임워크)에 대해 설명한다.
이렇게 나눔으로써 얼마나 큰 이점이 발생하는지는 아직은 의문이긴하다. 왜냐하면 이미 해당 프레임워크는 비즈니스를 하는 사람들의 뇌 속에 자연적으로 어렴풋하게 혹은 선명하게 존재하기 때문이다.
뒷 챕터들에 영향을 준다고 믿고 계속 읽을 계획이다.

조금 인상적이었던 점은 얼마나 세밀하게 도메인을 나누어야하는지에 대한 지침들이 적혀있다는 점이다. 나중에 효용성있다고 판단하면 나누기 연습도 할 것.

## Chapter 2 - Discovering Domain Knowledge

"Use Ubiquitous Language"가 핵심이다. 비즈니스 사이드 사람들과 엔지니어들의 소통이 오염되지 않고 전달되려면 단어들을 명확히 규정해놓아야한다는 의미같다.
계속해서 비즈니스 사이드에서 도메인 정보가 업데이트 되면 해당 정보를 엔지니어들이 받아서 설계에 포함하는 방식이며, 서로 통일된 단어들을 사용해야되기 때문에
엔지니어적인 요소는 최대한 제거하고 비즈니스 사이드에서 사용하는 용어들을 위주로 체계를 정립해야한다고 한다.

## Chapter 3 - Managing Domain Complexity

- Subdomain은 자연적으로 존재하며 발견되는 것이다.
- Bounded Context는 엔지니어들이 디자인하는 것이다.

개발 편의성에 따라 Subdomain들을 어떤 Bounded Context에 넣을지 엔지니어들이 정하는 것이다.
하나의 Bounded Context 내에서는 하나의 Ubiquotous Language가 사용되며, 서로 다른 컨텍스르에서는 다른 언어가 사용된다.
Bounded Context는 다른 Boundex Context들과 별개 개체로 존재하며 혼자서 진화해나갈 수 있다.
Bounded Context 여러개가 모여서 시스템을 만든다.
MSA 관점에서 Bounded Context가 Microservice 한 개가 아닐까 짐작해본다.

## Chapter 4 -
