---
slug: "/blog/event-loop-examples"
date: "2023-12-01"
title: "Event Loop Examples"
subtitle: "이벤트 루프 예시 코드"
---

## **이벤트 루프 예시 코드**

<p class="text-time">최초 업로드 2023-12-04 / 마지막 수정 2023-12-04</p>

이벤트 루프를 직접 눈으로 확인하기 위해 예시 세 가지를 만들어보았다.

<br/>

```javascript
// 예시 1
function foo() {
  for (let i = 0; i < 20000; i++) {
    console.log(i);
  }
}

function bar() {
  console.log("done");
}

setTimeout(bar, 0);
foo();
```

<br/>

예시 1은 브라우저와 node에서 모두 잘 작동한다. 20000개의 아웃풋이 다 나올 때까지 bar이 기다린다.
foo의 아웃풋의 갯수를 늘리면 bar의 "done"도 그만큼 늦게 로깅된다. setTimeout이 0일 때 4ms의 최소시간으로
초기화된다고 한다. 그런데 블로킹 중인 실행 컨텍스트가 있으면 태스크 큐에 완료된 작업이 있어도 계속 기다려야한다. 이를 직관적으로 볼 수 있다.

<br/>

```html
<!-- 예시 2 -->
<!DOCTYPE html>
<html>
  <head> </head>

  <body>
    <style>
      .box {
        width: 200px;
        height: 200px;
        background-color: green;
      }
    </style>
    <div class="box"></div>

    <button onclick="print20000();">run console log</button>

    <button onclick="flipColor();">flip box color</button>

    <script>
      function print20000() {
        for (let i = 0; i < 200000; i++) {
          console.log(i);
        }
      }

      function flipColor() {
        const elem = document.querySelector(".box");
        const curr = elem.style.backgroundColor;
        if (curr === "" || curr === "green") {
          elem.style.backgroundColor = "blue";
        } else {
          elem.style.backgroundColor = "green";
        }
      }
    </script>
  </body>
</html>
```

<br/>

예시 2에서는 Timer함수 말고 DOM API로 블로킹이 발생하는지 시험해보았다. 결과는 생각과는 조금 달랐다.
지금 `print20000`에 있는 i의 최대치가 `200_000`으로 `20_000` 보다 10배 큰 상태인데, 이는 조금 더 현저하게
딜레이를 주기위해 늘려놓은 것이다. 20,000으로 설정 => run console log 클릭 => flip box color 클릭을 하면
console log가 다 나오기 전에 box color이 거의 동시다발적으로 바뀌어버리는것을 볼 수 있다. 반대로 200,000으로 설정 => run console log 클릭 => flip box color 클릭을 하면 console log가 다 나오기 전에 box color이 변하지만 동시다발적이진 않고 몇 초간 기다려야한다.

여기서 볼 수 있는 것은 console log도 Web API이기 때문에 200,000개의 로깅 작업을 V8에서 브라우저에 넘겨준 직후 태스크 큐에서 작업을 받아서 처리할 수 있고, 이와 동시다발적으로 브라우저는 V8에서 넘겨 받은 console log 프린트 작업을 비동기적으로 처리할 수 있다는 것이다.

아래 그림은 해당 프로세스를 정리한 플로우이다.

<br/>

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/event-loop-ex.png" alt="event-loop-example-flow"/>
  <sub class>그림 1. 이벤트 루프 플로우</sub>
</div>

<br/>

위의 그래프처럼 V8에서 브라우저로 API를 쏴주면 브라우저에서는 멀티스레드로 작동하기 때문에 위와 같이 `flipColor`이 `print20000`보다 작동이 빠르게 멈추었다고 생각했다. V8에서 정확히 어떤 타이밍에 브라우저로 넘겨주는지 알 수 있으면 더욱 좋을 것 같다고 생각하여 코드를 조금 수정해보았다. 아래 코드에서는 box2를 이용해 `print20000`의 for loop `console.log`가 브라우저의 로깅보다 훨씬 빠르다는 것을 증명한다. `box2`가 브라우저 dev tool에 나오는 로깅이 종료되기 훨씬 이전에 변경되고, 그와 동시에(!) `flipColor`이 실행된다.
고로 위의 이벤트 루프 플로우가 맞았음을 볼 수 있다.

<br/>

```html
<!-- 예시 3 -->
<!DOCTYPE html>
<html>
  <head> </head>

  <body>
    <style>
      .box {
        width: 200px;
        height: 200px;
        background-color: green;
      }
      .box2 {
        width: 0px;
        height: 0px;
        background-color: grey;
      }
    </style>
    <div class="box"></div>
    <div class="box2"></div>

    <button onclick="print20000();">run console log</button>

    <button onclick="flipColor();">flip box color</button>

    <script>
      function print20000() {
        for (let i = 0; i < 200000; i++) {
          console.log(i);
        }
        // box2로 print20000이 끝나는 시점을 체크할 수 있다.
        const elem = document.querySelector(".box2");
        elem.style.width = "200px";
        elem.style.height = "200px";
      }

      function flipColor() {
        const elem = document.querySelector(".box");
        const curr = elem.style.backgroundColor;
        if (curr === "" || curr === "green") {
          elem.style.backgroundColor = "blue";
        } else {
          elem.style.backgroundColor = "green";
        }
      }
    </script>
  </body>
</html>
```
