---
slug: "/blog/varaible-environment-vs-lexical-environment"
date: "2023-12-03"
title: "Variable Environment"
subtitle: "Variable Environment"
---

## **Variable Environment**

<p class="text-time">최초 업로드 2023-12-03 / 마지막 수정 2023-12-13</p>

VariableEnvironment의 존재 이유는 무엇일까?

ECMAScript의 Execution Context 부분을 2회독하였지만 관련 내용은 찾기가 힘들었다. 그래서 임우찬님의 [블로그](https://m.blog.naver.com/dlaxodud2388/222655214381)에서 Variable Environment의 존재 의의를 찾았는데, 이분이 말씀하신 작동 원리의 출처는 블로그 내에서는 불명확했다. 스택오버플로우를 찾던 중 [비슷한 글](https://stackoverflow.com/questions/69417158/how-will-the-lexical-environment-and-the-variable-environment-will-look-like-at)을 발견하여 두 개의 글을 합쳐서 정리해본다.

<br/>

```javascript
function a() {
  let var2 = 10000;
  let var1 = 10000;
  if (true) {
    var var1 = 100;
    let var2 = 10;
    if (true) {
      let var2 = 11;
    }
  }
  if (true) {
    let var2 = 12;
  }
}
```

<br/>

위의 코드를 보면 블록 스코프는 여러개이고 함수 스코프는 단 한개만 있다. 우리가 이미 알다시피 콜 스택에 쌓이는 Execution Context는 함수 마다 한 개씩 존재하고
Execution Context안에는 Lexical Environment 한 개와 Variable Environment 한 개가 존재한다. 여기서 문제는 블록 스코프가 여러 개 생겼을 때 블록 스코프마다
Execution Context를 달아주어야하는가이다. JS는 그렇게 설계되어있지 않다고 한다. 함수 스코프 내부의 블록 스코프에는 Execution Context 없이 새로운 Lexical Environment가 생성되고, Outer Lexical
Environment는 외부 블록 스코프를 호출한다고 한다. let과 const는 블록 스코프 단위이기 때문에 블록 스코프 마다 한 개씩 생성되는 Lexical Environment의 Record에서 주로 관리하고, var은 함수 스코프 단위이기 때문에 함수 스코프 마다 한 개씩 생성되는 Variable Environment의 Record에서 주로 관리한다고 한다. (Lexical Environment에서 var 초기화도 된다는 내용들도 있어서 "주로"라고 표현했다. 내부에 복합적으로 돌아가는 로직들이 있는듯하다.)

ECMAScript를 다 샅샅이 뒤지기 어렵고 한 번 읽는다고 이해되는 것이 아니기에, 꼬리를 무는 궁금증을 갖기 시작하면 답을 찾기 어려운 것을 깨달았다. 내부 로직에는 디테일이 많아서
명쾌한 설명이 적고 스택오버플로우/블로그 포스트도 적은 것 같다.

추가로 배운 점

- 일부 Stackoverflow 글에서는 VariableEnvironment가 FunctionDeclaration과 VariableStatement를 포함한다고 되어있지만 이는 ES5까지만이고, ES6부터는 오로지 VariableStatement만을 포함한다고 한다.

- thisBinding이 execution context 내에 저장되는 것 또한 ES5의 이야기이고, 최신 버전에서는 this binding이 environment record안에 변수와 함수 바인딩들과 같은 레벨에 위치한다.
  블로그 글과 Stackoverflow 답변 마다 이야기가 조금씩 달라서 자세히 보니 ES5와 ES6의 차이점에서 비롯된 것이 많았다.

참고:

- [ECMAScript 2024](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-execution-contexts)
- [ECMAScript 5.1](https://262.ecma-international.org/5.1/#sec-10.3)
- [Variable Environment vs lexical environment](https://stackoverflow.com/questions/23948198/variable-environment-vs-lexical-environment)
- [[JavaScript] ES6의 Execution Context(실행 컨텍스트)의 동작 방식과 Lexical Nesting Structure(Scope chain)](https://m.blog.naver.com/dlaxodud2388/222655214381)
- [Why do we need VariableEnvironment to identify the state of an Execution Context in Javascript?](https://stackoverflow.com/questions/61682119/why-do-we-need-variableenvironment-to-identify-the-state-of-an-execution-context)
- [How will the Lexical environment and the Variable Environment will look like at the following code](https://stackoverflow.com/questions/69417158/how-will-the-lexical-environment-and-the-variable-environment-will-look-like-at)
