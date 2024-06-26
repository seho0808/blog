---
slug: "/blog/mvc-mvvm-flux"
date: "2024-05-04"
title: "MVC, MVVM, Flux"
subtitle: "MVC, MVVM, Flux"
---

## **MVC, MVVM, Flux**

<p class="text-time">최초 업로드 2024-05-04 / 마지막 수정 2023-05-11</p>

해당 포스트에서 사용하는 용어 - MVC는 여러 갈래로 나누어서 설명해야 이해가 된다:

- Original MVC => 오리지널 1970년대 등장한 MVC. 주로 데스크톱 애플리케이션을 위한 것임.
- Stateless MVC => 컨트롤러가 http요청을 받는 백엔드에서의 MVC 구조.
- FE MVC => Stateless MVC를 SPA 기반 js(fe)-only 앱들로 가져오는 시기에 최초로 선현들이 썼던 접근법. 뷰가 모델을 구독하고 컨트롤러는 뷰에서 온 이벤트에 따라서 모델만 변경하는 구조. [초기 웹 프레임워크들이 해당 방식을 쓰다가 MVVM을 쓰다가 단방향으로 넘어갔다고 한다.](https://dev.to/ryansolid/comment/19pb3)

<br/>

### **결론**

수십 시간의 조사와 고민에 기반한 나의 결론:

- <span class="text-orange">MVC라고만 하면 굉장히 위험한 단어가 될 수 있다. 너무나도 많은 것을 내포하고 있기 때문이다. MVC의 단점이 무엇인가요?라는 질문은 명쾌한 대답이 없다. 일부 MVC의 국소적인 개념에서의 단점은 논할 수 있다. (예시로 FE MVC의 단점)</span>
- Original MVC의 렌즈로 보면 세상 모든 UI 코드는 M, V, C, +alpha로 혹은 M, V, C로 잘 나누어서 볼 수 있다.
- <span class="text-orange">FE MVC의 단점은 MVC를 정말 잘 구성하지 않으면 (1)양방향성에 빠지거나 (2)이벤트 핸들링과 비즈니스 로직이 M, V, C 각자 역할로 깔끔하게 분리가 안되어서 앱의 로직이 복잡해질 여지(가능성)가 크다는 것이다.</span> MVC는 기본적으로 단방향성을 추구한다.
- MVVM은 대놓고 양방향성을 추구하는 관점이다.
- Flux/Redux/React의 등장은 MVC 보다 훨씬 단방향성을 강조한 것이며 페이스북에서는 MVC와 Flux를 양방향 vs 단방향으로 대조하며 설명하지만, 이는 잘못된 것이다. MVC는 기본적으로 단방향이다. 페이스북에서는 일반적으로 통용되지 않는 양방향 FE MVC를 만들었다. (Original MVC에는 오히려 페이스북이 말한게 부합할 수도 있다. - "To any given Model there is attached one or more Views"라는 문구가 [The original MVC reports](https://www.duo.uio.no/bitstream/handle/10852/9621/Reenskaug-MVC.pdf?sequence=1&isAllowed=y)에 존재한다.)
- Flux는 데이터 흐름을 위한 아키텍처이고 React는 모델에 따라 뷰를 쉽게 렌더하는 DX/빠른 개발/편한 디버깅을 위한 아키텍처이다. 둘은 같이 사용되기 위해 만들어졌고 Flux의 후계자가 Redux이다.
- Flux가 모델이고 React가 뷰였지만, 현대의 React의 컴포넌트 단위의 useState과 useReducer은 Flux의 단방향 데이터 흐름을 계승해서 내포하고 있기 때문에 모델의 상당 부분은 컴포넌트 내부로 녹아서 흡수된 느낌이 있다.
- Flux와 MVC와 MVVM은 딱 장단점을 비교할 수 없다. 특정 프로젝트들을 만들며 생겨난 서로 다른 관점이라고 보는 것이 맞다.
- React의 컴포넌트는 Original MVC 관점으로 볼 수 있다. 오히려 리액트의 컴포넌트가 Original MVC관점과 유사하다. [원작자 Reenskaug의 설명을 보면](https://www.youtube.com/watch?v=WpkDN78P884&t=1826s&ab_channel=Confreaks) 화면의 하나의 요소 마다 MVC를 따로 갖고 있다고 설명한다.
- <span class="text-orange">MVC와 MVVM과 Flux는 다른 개념이지만, 100% 분리된 아키텍처라고는 하기 어렵다고 생각한다. 서로 조금씩 오버랩이 있거나 완전한 관점 차이가 있기에, 깔끔한 비교가 어렵다. 그냥 서로 세상을 바라보는 다른 렌즈라고만 생각하는게 맞을 듯하다.</span>

나의 미약한 몇 개월 안되는 바닐라 JS에서의 경험들이 MVC, MVVM, Flux를 모두 설명하기에 충분하다고 하기는 어렵지만, 지금으로서의 최선을 다해서 고민해보았다.

<br/>

### **오리지널 MVC - 1970년대 ~**

Trygve Reenskaug의 MVC가 최초의 MVC이다. [The original MVC reports](https://www.duo.uio.no/bitstream/handle/10852/9621/Reenskaug-MVC.pdf?sequence=1&isAllowed=y). 읽어보면 알겠지만, Reenskaug의 MVC는 추상적으로 적혀있고 실제 그가 추상화를 하며 생각했던 구현체는 현대에 통용되는 MVC와는 차이가 있을 가능성이 크다. 그때의 앱은 지금의 앱들과 복잡도가 달랐다.

MVC가 헷갈리는 이유는 완벽한 합의가 없기 때문이다. Reenskaug가 제안한 최초의 Original MVC 패턴은 존재하지만, 역사를 거치며 MVC는 조금씩 변해왔다.
하지만 현대의 MVC는 프로젝트 마다 다르게 해석되는 경향이 있고, 이에 따라 혼동이 빚어질 때가 많다.

세상의 모든 프레임워크와 라이브러리는 어떻게 [잘 구조화해보면 Original MVC에 매핑해서 설명](https://stackoverflow.com/a/65969849/14971839)할 수 있다. 이는 나 스스로도 혼자 고민해보면서 dispatcher이나 reducer이 Controller과 유사한 개념으로 설명될 수도 있음을 생각했다. 그리고 리액트의 컴포넌트 한 개는 잘 생각해보면 뷰와 컨트롤러와 모델이 합쳐진 작은 단위의 MVC으로 볼 수도 있다.

<br/>

### **Stateless MVC - 풀스택 관점 - 200x년대 ~ 201x년대**

주로 스프링, Django 등에서 정적 페이지 호스팅할 때 BE에서 웹페이지를 서빙하는 프레임워크에 자주 사용된다. Original MVC를 스태틱 페이지만 서빙하던 시절에 풀스택 관점으로 해석한 방향이라고 보면 될 것 같다.

- 컨트롤러에서 http 요청을 핸들링하고 상황에 따라 400, 500, 300, 200을 반환처리한다.
- 컨트롤러는 요청 정보를 관련 모델에 전달하고 모델은 알맞은 정보를 DB에서 가져오거나 가공해서 다시 컨트롤러에 보내준다.
- 컨트롤러는 모델 정보 혹은 모델 객체를 뷰에 넣어주어서 뷰에서 최신 모델(정보)을 사용할 수 있도록 해준다.

<br/>

### **FE MVC - client-only 관점 (바닐라 JS) - 201x년대**

프론트엔드에서 바닐라 JS로 짜는 FE MVC는 위에서 본 Stateless MVC와 많이 다르다. 여기서의 MVC는 SPA 개발 용도이다.
FE MVC는 과거 Original MVC와 Stateless MVC가 성공적이었다는 경험을 통해 바닐라 JS기반인 웹의 SPA에서 MVC를 도입해보자!하고 도입된 형태라고 볼 수 있다. 인터넷에 MVC를 검색하면 나오는
삼각형 모양의 MVC가 이 FE MVC를 지칭한다.

- 사용자 입력값, 화면 선택, 변경, 스케쥴, DB 정보 변경 등에 따라서 모델과 뷰가 계속해서 바뀐다.
- 모델은 DB에서 웹소켓이나 SSE로 정보를 받아서 계속 바뀌고 있어서 혹은 주기적으로 timeout으로 바뀔 수 있다.
- 모델이 바뀌면 컨트롤러를 통해 뷰의 변경을 트리거한다.
- 뷰는 사용자 인터렉션에 따라서 컨트롤러를 통해 모델 변경을 트리거한다.
- n개의 모델이 뷰를 바꾸고 m개의 뷰가 컨트롤러를 통해 모델을 바꾸면 여러개의 뷰와 여러개의 모델의 양방향성이 성립된다. => 디버깅 시 어디서 어디를 호출하여 로직이 문제가 있는지 찾기가 어려움.
- 컨트롤러는 뷰에서 발생하는 이벤트를 핸들링하여 모델을 변경한다.
- 모델은 본인이 변경되면 구독중인 뷰를 변경한다. (모델 => 뷰의 구독(바인딩)을 편하게 하기 위해서 옵저버, 프록시, defineProperty로 구현가능)
- 백엔드 fetch(db정보) 호출을 뷰, 컨트롤러, 모델 어디에 붙이느냐에 따라 많은 것이 바뀜. 일반적인 방법은 DB 호출은 모두 모델에 넣는 것이다.
- 모델에서 받은 DB정보를 바탕으로 뷰가 렌더되어야한다.
- <span class="text-orange">FE MVC의 단점은 MVC를 정말 잘 구성하지 않으면 여러 개의 MVC의 서로의 양방향성(정확히는 n개의 방향성. 여러 개의 M, V, C가 서로를 가리킬 수 있다.)에 빠져서 앱의 로직이 복잡해질 여지(가능성)가 크다.</span> 하지만 잘 구성하면 양방향성을 피해갈 수 있다. 해당 단점 때문에 이후 단방향 강조 시대가 도래한다.

프론트엔드에서의 MVC는 M, V, C가 서로 의존하게 될 가능성이 크다. 로직 분리가 어렵다. 이벤트 핸들링과 비즈니스 로직 처리가 조금만 실수하면 M, V, C 어디에든 흩뿌려질 수가 있고, MVC 구조로 파일을 나누어 놓으면 이런 로직 분리가 어려운 부분 때문에 M, V, C 중 한쪽이 많은 것을 담당해서 뚱뚱해지거나, 서로 담당하는 부분들이 오버랩되거나 한다. MVC라는 렌즈로 파일 구조를 세팅하고 만들어 나가는 것이 어렵다고 개발자들이 느끼기 시작하면서 MVVM과 Flux라는 렌즈를 찾아간 것이다. MVC와 MVVM과 Flux는 다른 개념이지만, 100% 분리된 아키텍처라고는 하기 어렵다고 생각한다. 서로 조금씩 오버랩이 있거나 완전한 관점 차이가 있기에, 깔끔한 비교가 어렵다. 그냥 서로 세상을 바라보는 다른 렌즈라고만 생각하는게 맞을 듯 싶다.

<br/>

### **MVVM - 200x 후반 ~ 201x 초반**

MS에서 만든 용어이다. [MVC와 MVVM은 직접적으로 비교하기가 어렵다.](https://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)

MVVM은 모델과 뷰가 서로 바인딩 되어있어서 모델이 변경되면 자동으로 뷰모델을 통해서 뷰가 변경되고, 반대로 뷰에서 무언가 이벤트가 발생하면 자동으로 모델이 변경된다. MVC는 양방향 데이터 흐름이 존재하기 쉽지만, 기본적으로는 단방향이어야 관리가 수월하다. 반대로, MVVM은 기본적으로 양방향성을 추구한다고 볼 수 있다.

<br/>

### **Flux - 2013년 이후**

Flux는 사실상 가장 통념적인 FE MVC를 다른 이름들(dispathcer - controller, store - model)로 부르는 아키텍처처럼 보이지만, Flux의 발표자인 Jing Chen이 레딧에 dispatcher은 controller과는 다른 구현체이며 여러 프로젝트들에서 동일한 형태로 구현하고 있다고 말하며 FE MVC와 Flux의 [차이점을 설명](https://www.reddit.com/r/programming/comments/25nrb5/comment/chjbo05/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)했다. Jing Chen의 설명을 읽어보면, Dispatcher은 이벤트에 따라 구독중인 model들을 변경한다고 한다. 결국 view => dispatcher =구독=> store =구독=> view의 더블 구독 사이클이지 않나 싶다.

[Flux 공식문서 - Dispatcher](https://facebookarchive.github.io/flux/docs/dispatcher/)에서 사용 방법을 직접 보자. `flightDispatcher.waitFor([CountryStore.dispatchToken]);`부분을 보면 신기하게도 race condition을 해결하기 위한 `waitFor`이 존재하는 것을 볼 수 있다. 생각보다 뉘앙스가 깊었다. Flux에서의 Dispatcher은 store끼리의 업데이트 순서를 보장할 수 있는 것이 꽤나 중요한듯하며 이는 아마 당시 Flux + React가 사용되는 방식 때문에 race condition을 조절할 필요가 있었는듯하다. 2024년 5월 현재의 Redux와 React에서는 이러한 상태끼리의 waitFor이 존재하지 않는 것 같은데, 구현 내부에 숨어있는 것일지도 모르겠다.

비록 2013년 페이스북에서는 통념적인 MVC가 아닌 양방향 바인딩이 된 뷰+모델을 썼지만, 양방향성의 문제를 최소화하기 위해 unidirectional data flow가 강조된 flux를 내놓았다. 하지만 내 생각에는 flux의 unidirection 철학이 진짜 빛이 났던건 flux에서가 아니라 React의 컴포넌트 계층 구조라고 생각한다. React(2013)에서 상태관리를 위해 Flux(2014)를 만든 것인데, unidrection 철학은 리액트의 뷰 계층 구조에서 props를 자식으로만 하달하는 것이 근본적인 MVC 개발 문제를 해결하며 가장 큰 의미를 가진다고 생각한다. (성능적으로 MVC 보다 단방향이 더 좋다고 하기 보다는 개발 속도/디버깅이 더 좋다고 하는 것이 맞다. 애초에 전체 리렌더 + VDOM diffing의 등장 자체가 빠른 개발과 디버깅을 위한 것이기 때문이다.) Flux는 Redux의 모태인데, Redux나 Flux나 React나 모두 단방향 데이터 흐름을 지향했기에 탄생한 구조들이라고 생각한다. 이런 관점을 기반으로 생각해보면, Flux나 Redux는 React와 같은 단방향 렌더링 프레임워크에만 쓰는 것이 자연스럽다.

<br/>

### **보너스: MVP**

Presenter가 컨트롤러와 유사한 구조. 모델과 뷰를 Presenter에서 모두 조작함. 뷰에서 이벤트가 발생하면 핸들링하며 변경이 필요한 모델과 뷰를 같이 변경해줌. 모델이 DB에서 무언가 읽어와서 변경 시 Presenter에 알려서 뷰를 변경함. 내가 카카오에서 최종으로 구현했었던 프로젝트의 형식이 결국 MVC의 아종인 MVP가 아니었나 싶다. 해당 프로젝트에서 나는 컨트롤러(프레젠터)에서 뷰와 모델을 모두 관리하는 방식으로 구현했다.

<br/>

### **리액트는 MVVM인가 MVC인가 Flux인가**

- Original MVC 관점으로는 리액트를 해석할 수 있다.
- FE MVC관점으로 해석 가능하나 조금 결이 다른 느낌이다. FE MVC는 각 MVC가 Model, View, Controller이라는 분리된 파일 구조이어야할 것 같은 뉘앙스가 있다. 그리고 모델에 따른 리렌더가 setState 내부 구현에 의존한다. 그래서 엄격하게는 FE MVC와는 다르다고 봐야한다. (근데 FE MVC의 개념 자체가 엄격하지 않은 것이 함정이긴하다. 통상적으로 M, V, C 폴더들을 갖고 서로 통신하는 느낌이다.)
- MVVM으로는 해석하기 훨씬 어렵다. input 태그 같은 것들을 사용할 때 양방향 바인딩을 구현할 수 있지만, 이것만으로 MVVM이라고 보기는 조금 어렵다.
- Flux는 원래 리액트와 분리된 개념이었다. Flux와 React는 같이 쓰이기 위해 개발되었다. 지금도 Redux라는 Flux의 후계자가 분리된 개념으로 존재한다. 고로 Flux와 React를 동일 선상에 놓기는 어렵지만 둘 다 단방향 바인딩을 추구한다는 점이 중요하다. 리액트의 useReducer같은 경우에는 Flux 아키텍쳐를 미니어처 버전으로 도입했다고 봐도 좋을 것 같다. useState의 작동 방식은 Flux의 단방향 데이터 흐름의 영감을 얻은 단방향 Model 흐름의 구현의 일종이라고 본다.

고로 리액트는 Original MVC에 가까우면서 FE MVC와는 멀고 Flux에 영감을 받았으며 MVVM과는 매우 멀다고 할 수 있다.

오리지널 MVC관점으로 해석할 때 메인 초기 컨트리뷰터 중 하나인 Pete Hunt는 [발표에서 React가 V혹은 VC](https://youtu.be/x7cQ3mrcKaY?si=Lk5-3s2yrp1JtLIS&t=86)라고 언급한다. 내 생각엔 Model도 들어가 있다고 말할 수 있을 것 같은데 왜 M은 언급하지 않은지 모르겠다.

<br/>

### **마치며**

MVC를 여러 번 공부해보았지만 매번 이해가 달라지는 것 같아서 정리해보았다. 그런데 아직도 온전히 모든 것을 꿰는 느낌은 아니다. 2000 ~ 2020 바닐라 JS 프로젝트 마다 MVC의 해석이 조금씩 달라져서 마치 춘추전국 시대를 연상케한다. MVVM와 MVP와 Flux는 상대적으로 안정적인 개념으로 보인다. 다만 내가 MVVM을 쓰는 라이브러리를 작은 것들 밖에 분석해보지 않아서 아직 경험이 조금 부족하다. 나중에 다시 MVVM으로 짜여진 JS 코드를 본다면 해당 포스트를 진화시킬 수 있을 것 같다.

<br/>

### 참고 자료

- [The original MVC reports](https://www.duo.uio.no/bitstream/handle/10852/9621/Reenskaug-MVC.pdf?sequence=1&isAllowed=y)
- [Original MVC 관련 블로그](https://syjdev.tistory.com/26)
- [Flux 원본 페이스북 발표](https://www.youtube.com/watch?v=nYkdrAPrdcw&list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v)
- [The Rise of Flux 아티클 - Reddit에서 Flux 원작자와 레딧러들의 공방을 볼 수 있다.](https://medium.com/wix-engineering/the-rise-of-flux-how-facebooks-shift-away-from-mvc-led-to-a-new-era-of-ui-architecture-61d78b4377b0)
- [프롱트 영상](https://www.youtube.com/watch?v=Y5vOfv67h8A&ab_channel=%ED%94%84%EB%A1%B1%ED%8A%B8)
- [Is MVC dead on the frontend?](https://medium.com/free-code-camp/is-mvc-dead-for-the-frontend-35b4d1fe39ec)
- [Why isnt' React considered MVC?](https://stackoverflow.com/questions/53729411/why-isnt-react-considered-mvc/65969849#65969849)
