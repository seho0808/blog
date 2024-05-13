---
slug: "/blog/service-worker"
date: "2024-05-11"
title: "Service Worker"
subtitle: "Service Worker"
---

## **Service Worker**

<p class="text-time">최초 업로드 2024-05-11 / 마지막 수정 2024-05-11</p>

크롬 익스텐션을 초기 설정하다가 Service Worker이라는 개념을 만났다.

### **브라우저의 Service Worker**

Web Worker과 유사한 형식의 Service Worker은 자바스크립트 파일이며 웹 페이지와 완전히 별개로 라이프사이클을 가지고 있다. DOM 액세스가 불가능하며, 브라우저와 서버 사이에서 중개자 역할을 하는 객체라고 생각할 수 있다. 페이지가 꺼져도 Worker은 살아있을 수 있고, 페이지가 켜져있어도 Worker은 없을 수도 있다.

Service Worker은 어디에 사용되는가:

- 브라우저 컨텐트를 캐싱하고 캐싱 로직을 세밀하게 조정 가능. (오프라인 상태에서도 사용되는 캐시)
- 인터넷이 꺼졌는데 POST등을 날리면 인터넷이 켜질 때까지 대기하다가 추후에 백그라운드 데이터 동기화 가능. (네트워크 요청을 가로채서 알아서 핸들링)
- 웹 페이지가 켜져있지 않은 상태에서 브라우저에 알림을 보낼 수 있다.

<br/>

추가적인 디테일:

- Service Worker은 라이프 사이클이 존재함. 다운로드(해당 웹사이트 접속시 자동으로) => 설치 => 활성화 => 업데이트()
- Service Worker는 "브라우저 내에 있는 프록시"와 같다고 보면 이해하기 편하다는 설명이 많다. 아마 캐싱이 둘 사이의 가장 큰 유사점이지 않나 싶다. Service Worker은 브라우저 내부에 위치하지만
  브라우저와 서버사이에서 프록시처럼 웹 페이지들을 저장하여 오프라인에서 볼 수 있도록 할 수 있다.
- Service Worker는 Worker context에서 실행되기 때문에 메인 V8 스레드와 분리되어있는 Worker 스레드에서 실행된다. Service Worker 내에서는 직접적인 DOM 액세스가 불가능하다.
- 보안 때문에 HTTPS에서만 작동가능하다. (HTTP는 보안이 뚫리기 쉽고, 뚫리면 Service Worker이 강력한 API이기 때문에 해킹되더라도 사용못하도록 사전 차단)

### **크롬 익스텐션의 Service Worker**

좀 다른 개념임. proxy의 역할도 하지만 추가적인 역할이 있음.

> "they also respond to extension events such as navigating to a new page, clicking a notification, or closing a tab."
> 새 페이지로 이동하거나 알림을 클릭하거나 탭을 종료할 때 이벤트에 반응할 수 있음.

## **참고 자료**

- [Extension Service Workers 공식 문서](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- [Service Worker API mdn](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
