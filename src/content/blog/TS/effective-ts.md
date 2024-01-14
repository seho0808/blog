---
slug: "/blog/effective-typescript-review"
date: "2023-01-14"
title: "이펙티브 타입스크립트"
subtitle: "이펙티브 타입스크립트에서 인상적이었던 내용들"
---

## **이펙티브 타입스크립트**

<p class="text-time">최초 업로드 2023-01-14 / 마지막 수정 2023-01-14</p>

<br/>

이펙티브 타입스크립트 공부하며 인상적이었던 내용을 정리하려고 한다.

<br/>

### **아이템 7 - 타입 유니온/인터섹션**

```ts
interface A {
  x: number;
  y: number;
}

interface B {
  y: number;
  z: number;
}

type temp1 = keyof (A | B); // 'y'
type temp2 = keyof A & keyof B; // 'y'
type temp3 = keyof (A & B); // 'x' | 'y' | 'z'
type temp4 = keyof A | keyof B; // 'x' | 'y' | 'z'

const v1: A & B = {
  x: 1,
  y: 1,
  z: 1,
};

const v2: A & B = {
  x: 1,
  y: 1,
  z: 1,
  s: 10, // 내 린터는 오류라고 하지만, 책에는 괜찮다고 나와있다. ts 설정 차이인지 버전 차이인지 아직 모르겠다.
};
```

<br/>

`A | B`와 `A & B`가 타입스크립트에서는 반대로 쓰인다. 이 점을 명심하자. `"a" | "b"` 와 `A | B`가 다르게 작동한다.
책에서는 가독성을 높이기 위해 extends를 쓰라고 한다. 그리고 extends를 쓸 때, 집합을 보듯이 봐야 잘 읽힌다고 나와있다.
