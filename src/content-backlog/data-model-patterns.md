---
slug: "/blog/learning-domain-driven-design"
date: "2024-10-01"
title: "Data Model Patterns 정리"
subtitle: "Data Model Patterns 정리"
---

## **Data Model Patterns by David C. Hay 정리**

<p class="text-time">최초 업로드 2024-10-01 / 마지막 수정 2024-10-01</p>

급변하는 DB 모델링은 어떻게 해야 항상 확장성 있게 할까가 매우 큰 고민이었다. 이를 해결하고자했다.

예전에는 기획이 온전하게 나오고 난 뒤에 DB를 짰기 때문에 DB가 하루가 다르게 변하는 일까지는 없었다. (많아도 일주일에 두세번?)
하지만 현재 디써클에서 하루에도 몇 번씩 DB가 바뀌고 비즈니스 로직이 급변하여 기존 테이블들이 꼬이는 일이 잦았다.
이는 개발팀의 초반 설계를 더 멀리 볼 수 있는 설계로 했다면 어느정도 커버되었으리라 생각된다.
DB 모델링 경험이 부족하다고 느껴져서 모델링 예시들이 많이 나오는 책을 찾아보았다. 그러다가 1990년대에 쓰여진 Data Model Patterns라는 책을 찾았고,
한국에서는 아예 판매를 하지 않아서 아마존 킨들로 구매후 아이패드로 읽고 있다. 해당 책에서는 오라클의 CASE\* Method를 기반으로 설계를 한다(여러 메서드 중 Barker 메서드 기반).

많은 예시들과 추상화된 패턴을 보고 현재 디써클의 DB들, 그리고 앞으로 설계할 DB들에 적용시켜보는 것이 목표이다!

### **Chapter2 Data Modeling Conventions**

Data Modeling에는 세 가지 컨벤션이 있다고 한다.

- Syntactic Conventions: 문법적 컨벤션, 즉, ER 다이어그램을 그릴 때의 가장 기초적인 규칙을 이야기한다.
  - Entities:
- Positional Conventions: 위치적 컨벤션, ER 다이어그램 내에서 엔티티들이 판에서 어떤 위치에 존재하는지를 이야기한다.
  - 왼쪽 위일수록 추상적인 개념이고 오른쪽 아래쪽일수록 tangible한 개념이라고 한다. 고로 crow feet방향이 항상 왼쪽 혹은 위를 향해야한다.
  -
  - 글쓴이의 말로는 당시 수많은 소스들에서 포지셔닝을 하는 것에 대해서는 컨벤션을 깊게 이야기하지 않고 꼭 지키지 않는 편이라고 했다.
- Semantic Conventions
