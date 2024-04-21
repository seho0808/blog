---
slug: "/blog/monad"
date: "2024-04-21"
title: "모나드"
subtitle: "모나드"
---

## **모나드**

<p class="text-time">최초 업로드 2024-04-21 / 마지막 수정 2023-04-21</p>

예전부터 계속 모나드 패턴에 대한 언급은 보았었는데, 항상 이해가 잘 안되었었다.
유튜브에 있는 모나드 영상들을 쭉 한 번 보다가 좋은 소스로 이해하여 간단하게 정리해놓으려고 한다. 나중에 더 큰 깨달음을 얻는다면 포스트를 변경할 수도 있다. (아직 연구와 시도를 더해야 이해가 깊어질 것 같은 느낌이다.)

보통 함수형 프로그래밍에서 말하는 pure function이나 immutability 같은 것들은 리액트 훅 구조를 쓰다보면 흔하게 접하는 것들이라 어렴풋이는 사용처를 알고 있었다.

그런데 모나드는 블로그들을 몇 시간을 읽어도 이해가 안되었었다. 그러다가 오늘 [모나드 영상](https://www.youtube.com/watch?v=C2w45qRc3aU&ab_channel=StudyingWithAlex)을 보고
이해가 되었다. 아래 내용은 영상을 기반으로 예시를 하나 만들면서 내가 이해한 것을 정리해보았다.

<br/>

### **결론**

모나드는 여러 개의 순수 함수를 순차적(a(b(c(x)))처럼)으로 호출할 때 a, b, c 함수들 내에서 똑같이 처리해주고 싶은 공통 사이드 이펙트들이 있다면 그것을 외부로 빼낸 것이다.

예시로 보면 이해가 되는데 막상 내가 설명하려고 보니 말이 계속 추상적이게 된다. 예시를 참고하자.

<br/>

### **예시**

함수 square, double, half를 순서대로 값 x에 적용하고 싶을 때, square(double(half(x)))처럼 호출할 수 있을 것이다. 그런데, 만약 square, double, half에서 각자 정해진 오퍼레이션 말고 공통적으로 수행하는 어떠한 연산이 있어서 이걸 추상화해서 밖으로 빼고 싶다고 하자. 예를 들어서 각 오퍼레이션의 실행 과정을 배열로 기록하고 싶다면 어떻게할까?

가장 쉬운 방법은 밖에 배열을 두고 값을 append하는 것일 것이다.

```ts
const logs = [];

function square(n) {
  const res = n * n;
  logs.push(`${n} squared is ${res}`);
  return res;
}

function double(n) {
  const res = 2 * n;
  logs.push(`${n} doubled is ${res}`);
  return res;
}

function half(n) {
  const res = Math.floor(n / 2);
  logs.push(`${n} halved is ${res}`);
  return res;
}
```

위 코드의 문제는 무엇일까? 함수형 프로그래밍 관점에서는 square, double, half가 pure function이면 더 아름다우리라 생각이 든다. 현재는 logs를 수정하는 side effect를 남기기에 pure하지 못하다.
그렇다면 우리는 순수 함수로 로그를 수집하고 싶을 것이다. (순수 함수를 쓰는 이유를 묻는다면 순수 함수는 같은 값에 대해 동일한 결과를 항상 내고 사이드 이펙트가 없기에 모듈화하여 테스팅하고 자르고 붙이기 매우 좋다. 함수가 스케일러블해기 위한 초석이라고 할 수 있지 않을까..) 이때 필요한 것이 모나드이다.

```ts
type NumberWithLogs = {
  res: number;
  logs: string[];
};

function runWithLogs(
  input: NumberWithLogs,
  operation: (n: number) => NumberWithLogs
): NumberWithLogs {
  const newMonadic = operation(input.n);
  return {
    res: newMonadic.res,
    logs: input.logs.concat(newMonadic.logs),
  };
}

function makeMonadic(n) {
  return {
    res: n,
    logs: [],
  };
}

function pipeline(monadic: m, ...params) {
  let curr = m;
  for (let i = 0; i < params.length; i++) {
    curr = runWithLogs(m, params[i]);
  }
  return curr;
}

function square(n) {
  const res = n * n;
  return {
    res,
    logs: [`${n} squared is ${res}`],
  };
}

function double(n) {
  const res = 2 * n;
  return {
    res,
    logs: [`${n} doubled is ${res}`],
  };
}

function half(n) {
  const res = Math.floor(n / 2);
  return {
    res,
    logs: [`${n} halved is ${res}`],
  };
}

const a = runWithLogs(makeMonadic(n), square);
const b = runWithLogs(a, double);
const c = runWithLogs(b, half);

const d = pipeline(makeMonadic(n), square, double, half);
```
