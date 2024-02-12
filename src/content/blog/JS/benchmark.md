---
slug: "/blog/benchmark-js"
date: "2024-02-12"
title: "JS 벤치마킹"
subtitle: "JS 코드의 속도를 비교 테스팅해보자"
---

## **JS로 벤치마킹 해보기**

<p class="text-time">최초 업로드 2023-02-12 / 마지막 수정 2023-02-12</p>

innerHTML vs createElement 속도 비교가 궁금해서 테스팅해보았다.

```html
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.6/platform.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.min.js"></script>
  </head>

  <body>
    <script>
      console.log("Benchmark starting...");
      var suite = new Benchmark.Suite();

      // add tests
      suite
        .add("FirstTest", function () {
          // create5Children() // 1세트
          // create100Children() // 2세트
          createEvent100Children(); // 3세트
        })
        .add("SecondTest", function () {
          // parse5Children() // 1세트
          // parse100Children() // 2세트
          parseEvent100Children(); // 3세트
        })
        // add listeners
        .on("cycle", function (event) {
          const test = event.target;
          console.log(test.name + " completed.");
          console.log(String(test)); // Logs the test name and its performance metrics
          console.log("Time taken: " + test.stats.mean * 1000 + " ms"); // Specifically logs the time taken
        })
        .on("complete", function () {
          console.log("Fastest is " + this.filter("fastest").map("name"));
        })
        // run async
        .run({ async: true });

      // 벤치마크 1세트
      function create5Children() {
        const div = document.createElement("div");
        const children = [];
        for (let i = 0; i < 5; i++) {
          const temp = document.createElement("div");
          temp.textContent = "hello";
          children.push(temp);
        }
        div.append(...children);
      }

      // 벤치마크 1세트 => 다를 바가 없음. 거의 같음.
      function parse5Children() {
        const div = document.createElement("div");
        let str = "";
        for (let i = 0; i < 5; i++) {
          str += `<div>hello</div>`;
        }
        div.innerHTML = str;
      }

      // 벤치마크 2세트
      function create100Children() {
        const div = document.createElement("div");
        const children = [];
        for (let i = 0; i < 100; i++) {
          const temp = document.createElement("div");
          temp.textContent = "hello";
          children.push(temp);
        }
        div.append(...children);
      }

      // 벤치마크 2세트 => 근소하게 더 빠름.
      function parse100Children() {
        const div = document.createElement("div");
        let str = "";
        for (let i = 0; i < 100; i++) {
          str += `<div>hello</div>`;
        }
        div.innerHTML = str;
      }

      // 벤치마크 3세트
      function createEvent100Children() {
        // 0.205 ms ~ 0.312 ms
        const div = document.createElement("div");
        const children = [];
        for (let i = 0; i < 100; i++) {
          const temp = document.createElement("div");
          temp.textContent = "hello";
          temp.addEventListener("click", () => console.log("hi"));
          children.push(temp);
        }
        div.append(...children);
      }

      // 벤치마크 3세트
      function parseEvent100Children() {
        // 0.218 ms ~ 0.248 ms
        const div = document.createElement("div");
        let str = "";
        for (let i = 0; i < 100; i++) {
          str += `<div>hello</div>`;
        }
        div.innerHTML = str;
        for (let i = 0; i < 100; i++) {
          div.children[i].addEventListener("click", () => console.log("hi"));
        }
      }

      function parseEvent100Children2() {
        // 2.452 ms
        const div = document.createElement("div");
        const children = [];
        for (let i = 0; i < 100; i++) {
          const temp = htmlStringToDomNode(`<div>hello</div>`);
          temp.addEventListener("click", () => console.log("hi"));
          children.push(temp);
        }
        div.append(...children);
      }

      // 유틸
      function htmlStringToDomNode(htmlString) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.firstChild;
      }
    </script>
  </body>
</html>
```
