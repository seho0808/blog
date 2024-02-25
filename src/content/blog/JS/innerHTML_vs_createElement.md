---
slug: "/blog/benchmark-js"
date: "2024-02-12"
title: "innerHTML vs createElement 속도"
subtitle: "JS 코드의 속도를 비교 테스팅해보자 - innerHTML vs createElement"
---

## **innerHTML vs createElement 속도 벤치마킹 해보기**

<p class="text-time">최초 업로드 2023-02-12 / 마지막 수정 2023-02-25</p>

innerHTML vs createElement 속도 비교가 궁금해서 테스팅해보았다.

- 단 하나의 createElement는 단 한 줄의 innerHTML 보다 빠르다.
- 4\~5개의 createElement는 4\~5줄의 innerHTML과 속도가 비슷하다.
- 100줄의 createElement는 100줄의 innerHTML 보다 훨씬 느리다.

결론:

- <span class="text-orange">속도 면에서는 innerHTML이 절대 뒤지는 편이 아니다.</span>
- innerHTML을 한줄씩 계속 파싱하면 조금 느리긴하다.
- 대량의 html 스트링을 한 번에 파싱할 때에는 createElement 보다 innerHTML이 월등히 좋다.
- <span class="text-skyblue">결국 속도 보다는 사용처가 중요해보인다. 컨트롤이 필요할 때는 createElement, 구조에 대해 가독성이 필요할 때는 innerHTML이 좋아보인다.</span>

<br/>

## **시각화**

<img src="/images/innerHTML-speed.png" style="width: 100%;"/>

<br/>

`create100`과 `parse100`이 확연한 차이를 보이는 것이 가장 흥미로운 점이었다. 100개의 `createElement` 보다 100줄의 `innerHTML`이 평균적으로 훨씬 빨랐다.

그리고 각종 스택 오버플로우 글들을 읽어본 결과 브라우저 JS 엔진이 실행 도중에 optimization을 해서 회차별로 시간이 빨라질 수 있다는 것이었다. 내 코드는 매우 단순해서
그런 최적화가 많이 돌지도 의문이지만 일단 x축 회차 간의 시간적 independence(시간적 데이터 독립성)는 보장되지 않는다. 서로 얽혀있을 수 있다는 뜻이다.

아쉬운 것은 아래 섹션 `코드를 만든 과정`에서 나온 것처럼
서브 밀리세컨드 데이터는 브라우저가 보안상 측정을 막아두어서 정확한 편차를 보기가 어렵다는 것이다. 이를 볼 수 있으면 더 세밀하게 데이터를 관찰할 수 있었을 것이다.

<br/>

## **코드를 만든 과정**

원래 Benchmark.js를 사용하다가 개별 테스트를 가져올 수 없어서 커스텀으로 브라우저에서 제공하는 `performance.now`를 사용해서 만들었는데
알고보니 개별 테스트는 브라우저로부터 가져올 수 없는 데이터였다. 이유는 아래에 나와있다.

지금 현재 6개의 테스트를 1000번씩 100회 반복한다. 그렇기에 꽤 오래걸리는 편이다.
테스트 횟수를 한 번에 1000번씩 하는 이유는 존재한다. 크롬 브라우저는 보안 문제 때문에
코드 `performance.now()`로 시간 측정하는 것의 정확도를 0.1ms로 제한한다고 한다. 그래서
한 번에 테스팅할 코드가 짧고 빠른 코드면 횟수를 많이 늘려서 [평균을 가져올 수 밖에 없다](https://stackoverflow.com/questions/52069915/accurately-measure-a-javascript-function-performance-while-displaying-the-output)고 한다.
Benchmark.js는 어떻게 +- 편차를 가져오는지 잘 모르겠다. 심지어 55회만 반복하고 꽤나 정확한? 수치를 가져왔다고 생각했는데
아닐 수도 있겠다.

`Benchmark.js` 내부 소스는 [단 한 개의 파일](https://github.com/bestiejs/benchmark.js/blob/main/benchmark.js)로 이루어져있다.
이 파일을 잘 살펴보면 아래와 같이 크롬 내부 무언가를 가져오는데 이것이 `performance.now()`인지 잘 모르겠다. 오늘은 탐구심 도파민이 소진되어서
더 깊게 들어가긴 피로하다. 다음 번에 흥미를 얻으면 다시 파보자.

<br/>

```js
// Detect Chrome's microsecond timer:
// enable benchmarking via the --enable-benchmarking command
// line switch in at least Chrome 7 to use chrome.Interval
try {
  if ((timer.ns = new (context.chrome || context.chromium).Interval())) {
    timers.push({ ns: timer.ns, res: getRes("us"), unit: "us" });
  }
} catch (e) {}
```

<br/>

## **코드 간략 설명**

6개의 테스트를 1000번씩 100회 반복 한다. 3분 이상 걸린다.
1000번은 나눌 수 없는 단위로 되어있다. 100번으로 줄일 수는 있다. 이유는 위에 설명되어있다.

```js
<!DOCTYPE html>
<html>

<head>
</head>

<body>
  <script>
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

    function parse5Children() {
      const div = document.createElement("div");
      let str = "";
      for (let i = 0; i < 5; i++) {
        str += `<div>hello</div>`;
      }
      div.innerHTML = str;
    }

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

    function parse100Children() {
      const div = document.createElement("div");
      let str = "";
      for (let i = 0; i < 100; i++) {
        str += `<div>hello</div>`;
      }
      div.innerHTML = str;
    }

    function createEvent100Children() {
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

    function parseEvent100Children() {
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

    function measureExecutionTime(testFunction) {
      const div = 1000
      const start = performance.now();
      for (let i = 0; i < div; i++) {
        testFunction();
      }
      const end = performance.now();
      return (end - start) / div;
    }

    function runTest(testName, testFunction, iterations = 100) {
      const results = [];
      for (let i = 0; i < iterations; i++) {
        const timeTaken = measureExecutionTime(testFunction);
        results.push({ testName, iteration: i + 1, timeTaken });
      }
      return results;
    }

    function runAllTests() {
      const allResults = [
        ...runTest("create5", create5Children),
        ...runTest("create100", create100Children),
        ...runTest("create100wEvents", createEvent100Children),
        ...runTest("parse5", parse5Children),
        ...runTest("parse100", parse100Children),
        ...runTest("parse100wEvent", parseEvent100Children),
      ];

      exportResultsToCSV(allResults);
    }

    function exportResultsToCSV(data) {
      let csvContent = "data:text/csv;charset=utf-8,Test Name,Iteration,Time Taken (ms)\n";
      data.forEach(({ testName, iteration, timeTaken }) => {
        csvContent += `${testName},${iteration},${timeTaken}\n`;
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "detailed_benchmark_results.csv");
      document.body.appendChild(link);
      link.click();
    }

    runAllTests();

  </script>
</body>

</html>
```

<br/>

## **시각화 코드**

아래 코드는 콜랩에서 실행하고 이미지로 다운로드 받았다. 원래는 plotly로 embed하려고 했는데 gatsby에서 iframe을 직접적으로 지원하지 않는다는 사실을 깨닫고
이미지로 서빙했다. 조금 충격이었다. 컴포넌트를 만들어서 다시 markdown에 넣는 식으로 해야되는데 그것까지 하기에는 시간이 부족하다.
csv코드는 위의 js 코드에서 추출해서 가져올 수 있다.

```python
import pandas as pd
import plotly.express as px

# Read the CSV file into a pandas DataFrame
file_path = '/detailed_benchmark_results.csv'
df = pd.read_csv(file_path)

# Generate a line plot with Plotly Express, now with a template for a prettier look
fig = px.line(df, x='Iteration', y='Time Taken (ms)', color='Test Name',
              title='회차 별 소요 시간',
              template='plotly_white')  # Using a light theme for a cleaner look

# Customize the layout further for a prettier look
fig.update_layout(
    xaxis_title='회차',
    yaxis_title='소요 시간 (ms)',
    legend_title='테스트 이름',
    plot_bgcolor='rgba(0,0,0,0)',  # Transparent background for the plot area
    xaxis=dict(
        showline=True,
        showgrid=True,
        gridcolor='lightgray',  # Lighter gridlines
        linewidth=2,
        linecolor='black',  # Darker axis line
    ),
    yaxis=dict(
        showline=True,
        showgrid=True,
        gridcolor='lightgray',
        linewidth=2,
        linecolor='black',
    ),
    font=dict(  # Customizing font
        family="Arial, sans-serif",  # A commonly used font family
        size=12,
        color="RebeccaPurple"  # A pleasant shade of purple
    ),
    legend=dict(
        bgcolor='rgba(255,255,255,0.5)',  # Semi-transparent legend background
        bordercolor='Black',
        borderwidth=1
    )
)

# Show the figure
fig.show()
fig.write_html('/plot.html')

```
