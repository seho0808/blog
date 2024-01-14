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

<br/>

### **아이템 8 - 값 typeof vs 타입 typeof**

```ts
class Car {
  width: 10;
  height: 10;
}

const carInstance: Car = new Car(); // 방식 1: 맞음.
const carInstance2: InstanceType<typeof Car> = new Car(); // 방식 2: 맞음.
const carInstance3: typeof Car = new Car(); // 오류. typeof Car은 생성자 타입이다.
```

<br/>

`Car`은 인스턴스 타입을 가리킨다. `new Car()`로 생성된 인스턴스의 타입이다. `typeof Car`은 `Car` 클래스의 생성자 타입이다.
`InstanceType<생성자 타입>`을 통해 다시 인스턴스 타입으로 돌려놓을 수 있다.

<br/>

### **아이템 9 - 단언 보다 선언 쓰기**

단언이 꼭 필요한 경우에서 내가 며칠 전에 썼던 정확한 유스케이스가 나와서 반가웠다.

```ts
document.querySelector("#myButton").addEventListener("click", (e) => {
  e.currentTarget; // EventTarget type은 너무 broad한 타입이다.
  const button = e.currentTarget as HTMLButtonElement; // 이제 HTMLButtonElement에서 구현되어있는 필드를 사용할 수 있다.
  // ...
});
```

<br/>

타입스크립트에서는 컴파일 타임에 DOM에 접근할 수 없고, 뭐가 정확히 튀어나오는지 모르기 때문에 우리가 타입 단언을 해주어야 문제 없이 사용할 수 있다.

그리고 타입 단언은 서브타입에서만 쓸 수 있다고 한다! 사실 그 외에 써본 적이 없어서 해당 오류를 마주한 적이 없었다.
