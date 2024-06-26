---
slug: "/blog/drag-drop-reflow-optimization"
date: "2024-04-11"
title: "드래그 드랍 리플로우 최적화"
subtitle: "드래그 드랍 리플로우 최적화 - 레이아웃 쓰래싱(Layout Thrashing) 최적화"
---

## **드래그 드랍 리플로우 최적화**

<p class="text-time">최초 업로드 2024-04-11 / 마지막 수정 2024-04-25</p>

_<span class="text-purple">해당 포스트는 Layout Thrashing 최적화를 통해 수백 ms가 걸릴 수 있는 함수를 4ms짜리 핸들러로 리팩토링하는 과정을 담고 있습니다.</span>_

<div class="video-container">
  <video src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/main-vid.mp4" controls></video>
  <sub class>영상 1. React로 만든 dnd</sub>
</div>

최근 모 회사의 과제로 React로 dnd를 만들어보았다. 부드러운 UX를 만드는 것이 생각보다 매우 어려웠는데(리페인트 맞추기 + 그리디 구현으로 인해 장장 3일간의 여정. 하지만 면접 피드백에서 바닐라 위주로 구현되어있는 것 같다는 피드백이 들어왔고 나도 더 리액트스럽게 짜야했다고 동의했다.) 다 만들고 보니 리플로우 관련해서 큰 문제가 있나 싶어서 좀 파봤다. 맨 처음 이 포스트를 썼을 때는 실패한 최적화에 대한 글이었는데, 며칠 뒤에 다시 놓친 부분을 수정했더니 극적인 변화를 가져왔다.

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

그래서 프로젝트 끝난 며칠 뒤에 다시 조사를 좀 해봤다. 매우 흥미로운 사실 몇 가지를 발견했다.

1. getComputedStyle, getBoundingClientRect, offsetHeight, scrollTop 등 현재 UI에서 read하는 오퍼레이션도 리플로우(레이아웃)을 발생시킨다고 한다!!!!!!!

2. dom read끼리 모아주고 write 끼리 모아주어서 [레이아웃 쓰래싱](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)이라는 것을 해결해주어야한다고 한다...

3. style 자체를 같은 핸들러 내에서 같이 건드리면 디폴트로는 배치로 적용된다. (레이아웃 스래싱이 아니라면)

style 적용을 여러 줄에 거쳐서 해도 브라우저가 알아서 배치로 작동시켜준다. (이거는 그 어디서도 깔끔하게 설명안해주길래 내가 직접 코드로 테스팅해보았다.) 문제는 read 오퍼레이션이랑 write 오퍼레이션을 따로 묶어서 적용해주어야하는 것이다. 그게 개발자가 코드를 잘 작성해주어야하는 부분이고, 나머지는 브라우저가 알아서 배치로 처리해준다.

style을 한 번에 적용해야된다는 [글 - Making several style changes at once 섹션 참고](https://dev.opera.com/articles/efficient-javascript/?page=3#stylechanges)이 있는데, 이 글은 2006년에 Opera 개발자에 의해 쓰인 글이라 2024년 기준 거의 공룡급으로 낡은 글이다. (하지만 무수히 많은 현대 블로그 글들에서 인용하고 있었다.) 처음엔 이게 진리인줄알았는데, 꼭 style을 `setAttribute`로 하지 않아도 하나의 핸들러 내에서만 write끼리 묶어서 적용해주면 크롬 브라우저 퍼포먼트 탭에서 하나의 reflow로 잘 취급해주는 것을 확인했다. (여러 줄에 `.style = "somthing"`을 해주어도 된다는 뜻이다. 대신 read operation이 중간에 섞이면 안됨.) `setAttribute`는 하나의 dom요소에는 적용하기 좋은데 여러 개를 loop을 돌며 적용할 때 동시에 하기 불가능하다. 그래서 `.style`을 여러 줄에 쓰고 최신 브라우저 최적화에 맡기는 판단이 최선이 아닐까?라고 생각중이다.

아무튼 Layout Thrashing 관련 팩트들을 무수한 소스에서 읽고 (링크가 많아서 페이지 맨 아래에 두었다.) 또 개인적으로 테스팅해보았다.

이제 위에 적어둔 소스코드의 함수의 퍼포먼스를 측정하기 위해 크롬 데브 모드로 진입해보자. 그림 1은 dnd 전반의 pointermove 상태를 보여주고 그림 2는 하나의 핸들링 콜백을 확대한 것이다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc1.png" alt="jpg rock"/>
  <sub class>그림 1. 16.7ms 프레임 단위로 pointermove가 핸들링되는 모습</sub>
</div>

일단 보면 60hz에 맞춘 16.7ms마다 pointermove가 트리거 되는 것을 볼 수가 있다. (좀 의문인거는 내 화면은 144hz인데 브라우저 pointermove, mousemove같은 이벤트 처리는 디폴트로 16.7ms인가보다. css 애니메이션 자체는 144hz로 일어나는 것 같다.) 내가 50ms 쓰로틀링 처리를 해두어서 실제 처리는 3~4번의 pointermove마다 일어난다. 위 그림에 보면 1번 프레임은 뭐가 많고 2,3,4는 적고 5가 다시 좀 많다. 5번이 그 스로틀링 쿨이 돌아서 다시 트리거 되는 부분이다. 이제 그 첫 1프레임을 확대해보자.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc2.png" alt="jpg rock"/>
  <sub class>그림 2. 첫 pointermove 내의 getDroppableTranslatesLinear가 4ms가 걸리는 모습</sub>
</div>

첫 pointermove에서는 O(n)으로 해당 Droppable의 모든 자식들의 Translate이 적용된다. 쉽게 설명하자면 Done 목록에서 하나의 카드를 드래그 시작하면 나머지 Done 목록의 모든 자식들이 빠진 카드의 빈 공간 만큼 아래로 Translate되는 것이다. 이걸 적용하는 코드가 위에 내가 4.38ms로 하이라이트한 `getDroppableTranslatesLinear`이다. 그리고 이 함수는 위에서 소스 코드로도 설명했던 코드다. <span class="text-red">문제는 보라색 점들이 무수히 찍혀있는 것들이다.</span> `setAttribute`, `getBoundingClientRect`에 의해 트리거된 무수한 보라색 점들이 모두 레이아웃(리플로우)이다. 내가 해당 스크린샷을 찍을 때는 To-dos 목록에 34개의 카드를 넣어두었는데, 카드 수를 늘릴 수록 레이아웃 개수도 늘어나고 4.38ms도 더 큰 숫자가 된다.

그래서 수 많은 블로그들에서 읽은 "Layout Thrashing"이라는 것을 완화하기 위해 O(n)으로 모든 요소의 `getBoundingClientRect`를 먼저 읽은(dom read operation) 후 스타일들을 다시 처음부터 순회하며 적용(dom write operation)해주었다.

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
      )}px);`; // 내가 놓치고 있던 O(1) read 연산
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
  const cardHeight = getEmptySpaceWithGap(card); // O(1) read (read는 read끼리 위로 빼주기)
  const rects = children.map((c) => c.getBoundingClientRect()); // O(n) read (read는 read끼리 위로 빼주기)
  children.forEach((c, idx) => {
    if (c === card) return;
    if (c.className === "droppable-placeholder") return;
    const r = rects[idx];
    const childBottomY = r.top + r.height;
    if (cardBottomY > childBottomY) {
      c.style.transform = ``; // O(1) write (write는 write 끼리)
      orderIdx++;
    } else {
      let styleString = `transform: translate(0, ${cardHeight}px);`;
      if (!initial) styleString += "transition: 0.25s"; // O(1) write (write는 write 끼리)
      c.setAttribute("style", styleString);
    }
  });
//...
```

<br/>

자 그래서 얼마나 성능 개선이 되었는지가 궁금할 것이다. 해당 포스트를 처음 작성했을 당시 처음에 위의 코드를 수정했을 때에는 내가 놓친 부분(getEmptySpaceWithGap가 read 오퍼레이션이라는 것을 까먹음)이 있었어서 잘못 최적화해놓고 효과가 없는 것인 줄 알았다. 근데 며칠 뒤에 코드를 다시 수정 후 제대로 테스팅 해보고 나니 엄청나게 극적으로 성능 개선이 되는 것을 확인했다. 해당 포스트 위쪽에 있던 그림 1, 2는 34개의 카드 컴포넌트로 테스팅했다면 이번엔 약330개의 카드 컴포넌트를 To-Dos에 넣고 드래그를 테스팅한 그림 3, 4를 아래에 첨부하겠다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc3.png" alt="jpg rock"/>
  <sub class>그림 3. 최적화 전: 약 330개의 카드 컴포넌트로 테스팅했을 때 함수 하나에 133ms가 나왔다.</sub>
</div>

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/dnd-reflow/sc4.png" alt="jpg rock"/>
  <sub class>그림 4. 최적화 후: 레이아웃 쓰래싱(Thrashing) 최적화 후 133ms가 4ms가 되었다! ^______^</sub>
</div>

<br/>

결론적으로 나의 최적화 작업은 실패라고 생각했었지만!!! 며칠 뒤에 다시 해보니 성공해버렸다.

<br/>

## **마치며**

[react-beautiful-dnd](https://react-beautiful-dnd.netlify.app/iframe.html?id=board--simple)에서 performance 측정결과 reflow(layout)가 최적화 전의 나의 앱과는 다르게 연속적으로 발생하지 않는 것을 보고 분명 batch로 스타일 적용이 가능한 방식이 있다고 생각해서 Layout Thrashing 최적화를 다시 시도해봤는데, 결국 해냈다. (나중에 다시 고민해보니 react dnd는 리액트를 사용해서 dnd를 구현해놓았기 때문에 dom operation 최적화가 자동으로 이루어졌을 것이다. 내 코드는 바닐라와 react가 섞인 느낌이다.) 하나의 핸들러 안에서 레이아웃을 발생시키는 작업들을 일괄로 read를 먼저 모두 한 후에 write을 일괄 적용시켜주면 브라우저는 알아서 묶어서 하나의 리플로우(레이아웃)로 진행시켜준다.

조만간 지금 진행 중인 회사들의 면접이 끝나면 dnd 라이브러리들의 내부 또한 다시 파보아서 내 코드와 비교해봐야겠다. (지난번에 했었는데 저 에어비엔비 라이브러리 복잡도가 장난이 아니었다.)

<br/>

참고자료:

- [What forces Layout Thrashing](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

- [Avoid Layout Thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

- [cssTriggers list](https://csstriggers.com/)

- [gyujae님의 블로그](https://velog.io/@nuo/%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%B5%9C%EC%A0%81%ED%99%94)

- [Toast UI 포트스](https://ui.toast.com/fe-guide/ko_PERFORMANCE)
