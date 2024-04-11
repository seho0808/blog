---
slug: "/blog/drag-drop-reflow-optimization"
date: "2024-04-11"
title: "드래그 드랍 리플로우 최적화"
subtitle: "드래그 드랍 리플로우 최적화"
---

## **드래그 드랍 리플로우 최적화**

<p class="text-time">최초 업로드 2024-04-11 / 마지막 수정 2024-04-11</p>

<div class="video-container">
  <video src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/main-vid.mp4" controls></video>
  <sub class>영상 1. 순수 React로 만든 dnd</sub>
</div>

최근 모 회사의 과제로 React로 dnd를 만들어보았다. 부드러운 UX를 만드는 것이 생각보다 매우 어려웠는데(~리페인트 맞추기 + 그리디 구현으로 인해 장장 40시간의 여정~), 나름 뿌듯했다. 근데 다 만들고 보니 리플로우 관련해서 큰 문제가 있나 싶어서 좀 파봤다.

아래 코드를 보면 딱봐도 리플로우가 엄청 발생할 것처럼 생겼다. 그래서 코드를 짜면서도 계속 리플로우 발생을 줄이기 위해 batch로 스타일을 적용시키고 싶었는데, 여러 요소에 한 번에 클래스이름이나 스타일을 적용하는 DOM API가 없어서 오또케를 외치며 그냥 최대한 할 수 있는만큼 단순한 DOM Manipulation을 적용했었다.

<br/>

```ts
/**
 * Card들의 Translate을 계산해줍니다.
 * @param droppable translate를 계산하고 적용시킬 droppable. 현재 드래그 중인 Card 위치에 있는 droppable입니다.
 * @param card 드래그 중인 Card
 * @param initial pointerdown 후 첫 setDroppableTranslates 호출인지 확인.
 */
function setDroppableTranslatesLinear(
  droppable: HTMLElement,
  card: HTMLElement,
  initial: boolean
) {
  const children = Array.from(droppable.children) as HTMLElement[];
  let orderIdx = 0;
  const cardRect = card.getBoundingClientRect();
  const cardBottomY = cardRect.top + cardRect.height;
  // 이렇게 순회해서 하나씩 style을 직접 건드리면 리플로우가 여러 번 발생할 것 같았음.
  children.forEach((c, idx) => {
    if (c === card) return;
    if (c.className === "droppable-placeholder") return;
    const r = c.getBoundingClientRect();
    const childBottomY = r.top + r.height;
    if (cardBottomY > childBottomY) {
      c.style.transform = ``;
      orderIdx++;
    } else {
      let styleString = `transform: translate(0, ${getEmptySpaceWithGap(
        card
      )}px);`;
      if (!initial) styleString += "transition: 0.25s";
      c.setAttribute("style", styleString);
    }
  });
//...
```

<br/>

그래서 프로젝트 끝난 며칠 뒤에 다시 조사를 좀 해봤다. 근데 생각보다 흥미로운 사실 몇 가지를 발견했다.

1. getComputedStyle, getBoundingClientRect, offsetHeight, scrollTop 등 현재 UI에서 read하는 오퍼레이션도 리플로우(레이아웃)을 발생시킨다고 한다!!!!!!!

2. dom read끼리 모아주고 write 끼리 모아주어서 레이아웃 쓰래싱이라는 것을 해결해주어야한다고 한다...

위 사실을 무수한 소스에서 읽고 (링크가 많아서 페이지 맨 아래에 두었다.) 크롬 데브 모드로 진입해보았다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc1.png" alt="jpg rock"/>
  <sub class>그림 1. 16.7ms 프레임 단위로 pointermove가 핸들링되는 모습</sub>
</div>

일단 보면 60hz에 맞춘 16.7ms마다 pointermove가 트리거 되는 것을 볼 수가 있다. (좀 의문인거는 내 화면은 144hz인데 브라우저 pointermove, mousemove같은 이벤트 처리는 디폴트로 16.7ms인가보다. css 애니메이션 자체는 144hz로 일어나는 것 같다.) 내가 50ms 쓰로틀링 처리를 해두어서 실제 처리는 3~4번의 pointermove마다 일어난다. 위 그림에 보면 1번 프레임은 뭐가 많고 2,3,4는 적고 5가 다시 좀 많다. 5번이 그 스로틀링 쿨이 돌아서 다시 트리거 되는 부분이다. 이제 그 첫 1프레임을 확대해보자.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc2.png" alt="jpg rock"/>
  <sub class>그림 2. 첫 pointermove 내의 getDroppableTranslatesLinear가 4ms가 걸리는 모습</sub>
</div>

첫 pointermove에서는 O(n)으로 해당 Droppable의 모든 자식들의 Translate이 적용된다. 쉽게 설명하자면 Done 목록에서 하나의 카드를 드래그 시작하면 나머지 Done 목록의 모든 자식들이 빠진 카드의 빈 공간 만큼 아래로 Translate되는 것이다. 이걸 적용하는 코드가 위에 내가 4.38ms로 하이라이트한 `getDroppableTranslatesLinear`이다. 그리고 이 함수는 위에서 소스 코드로도 설명했던 코드다. 문제는 보라색 점들이 무수히 찍혀있는 것들이다. `setAttribute`, `getBoundingClientRect`에 의해 트리거된 무수한 보라색 점들이 모두 레이아웃(리플로우)이다. 내가 해당 스크린샷을 찍을 때는 To-dos 목록에 34개의 카드를 넣어두었는데, 카드 수를 늘릴 수록 레이아웃 개수도 늘어나고 4.38ms도 더 큰 숫자가 된다.

그래서 수많은 블로그들에서 읽은 "Layout Thrashing"이라는 것을 완화하기 위해 O(n)으로 모든 요소의 `getBoundingClientRect`를 먼저 읽은(dom read operation) 후 스타일들을 다시 처음부터 순회하며 적용(dom write operation)해주었다.

<br/>

```ts
// 변경 전
function setDroppableTranslatesLinear(
  droppable: HTMLElement,
  card: HTMLElement,
  initial: boolean
) {
  const children = Array.from(droppable.children) as HTMLElement[];
  let orderIdx = 0;
  const cardRect = card.getBoundingClientRect();
  const cardBottomY = cardRect.top + cardRect.height;
  children.forEach((c, idx) => {
    if (c === card) return;
    if (c.className === "droppable-placeholder") return;
    const r = c.getBoundingClientRect(); // O(1) read 연산
    const childBottomY = r.top + r.height;
    if (cardBottomY > childBottomY) {
      c.style.transform = ``; // O(1) write 연산
      orderIdx++;
    } else {
      let styleString = `transform: translate(0, ${getEmptySpaceWithGap(
        card
      )}px);`;
      if (!initial) styleString += "transition: 0.25s";
      c.setAttribute("style", styleString); // O(1) write 연산
    }
  });
//...

// 변경 후
function setDroppableTranslatesLinear(
  droppable: HTMLElement,
  card: HTMLElement,
  initial: boolean
) {
  const children = Array.from(droppable.children) as HTMLElement[];
  let orderIdx = 0;
  const cardRect = card.getBoundingClientRect();
  const cardBottomY = cardRect.top + cardRect.height;
  const rects = children.map((c) => c.getBoundingClientRect()); // O(n) read 연산
  children.forEach((c, idx) => {
    if (c === card) return;
    if (c.className === "droppable-placeholder") return;
    const childBottomY = rects[idx].top + rects[idx].height;
    if (cardBottomY > childBottomY) {
      c.style.transform = ``; // O(1) write 연산
      orderIdx++;
    } else {
      let styleString = `transform: translate(0, ${getEmptySpaceWithGap(
        card
      )}px);`;
      if (!initial) styleString += "transition: 0.25s";
      c.setAttribute("style", styleString); // O(1) write 연산
    }
  });

```

<br/>

자 그래서 얼마나 성능 개선이 되었는지가 궁금할 것이다. 놀랍게도 아무런 변화가 없었다...ㅋㅋ 아마 "O(n)으로 두 번 순회하는 코스트 === read write을 batch로 각각 적용 시켜서 얻는 리플로우 개선"인듯하다. 만약 아래 코드 처럼 단 한 번의 read로 줄인다면 무조건 개선이겠지만, 위의 내 코드의 경우에는 세 네번 이상 실험했는데도 4.00ms 대의 실행속도가 변하지 않았다.

<br/>

```ts
//// 진짜로 무조건 개선되는 코드 (gyujae님의 블로그에서 가져왔습니다)
function resizeAllParagraphs() {
  const box = document.getElementById("box");
  const paragraphs = document.querySelectorAll(".paragraph");

  for (let i = 0; i < paragraphs.length; i += 1) {
    paragraphs[i].style.width = box.offsetWidth + "px";
  }
}
// 레이아웃 스래싱을 개선한 코드
function resizeAllParagraphs() {
  const box = document.getElementById("box");
  const paragraphs = document.querySelectorAll(".paragraph");
  const width = box.offsetWidth;

  for (let i = 0; i < paragraphs.length; i += 1) {
    paragraphs[i].style.width = width + "px";
  }
}
```

<br/>

결론적으로 나의 최적화 작업은 실패로 돌아갔다. 언젠가 또 더 큰 깨달음을 얻어서 코드를 다시 진화시킬 수 있지 않을까 싶다.

실용성으로만 치자면 reflow 총합이 8ms 언저리 이내로 일어나면 하나의 프레임 이내에 모든 것을 처리할 수 있을 것이다. 그리고 다른 비동기처리 함수들도 처리할 것을 생각하면 16.67ms에서 한 3ms 이상 정도의 오버헤드를 남겨두는 것은 필수적으로 필요해보인다.

<br/>

참고자료:

[What forces Layout Thrashing](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

[Avoid Layout Thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

[cssTriggers list](https://csstriggers.com/)

[gyujae님의 블로그](https://velog.io/@nuo/%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%B5%9C%EC%A0%81%ED%99%94)

[Toast UI 포트스](https://ui.toast.com/fe-guide/ko_PERFORMANCE)
