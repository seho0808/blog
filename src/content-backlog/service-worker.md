---
slug: "/blog/service-worker"
date: "2024-05-11"
title: "Service Worker"
subtitle: "Service Worker"
---

## **Service Worker**

<p class="text-time">최초 업로드 2024-05-11 / 마지막 수정 2023-05-11</p>

크롬 익스텐션을 초기 설정하다가 Service Worker이라는 친구를 만났다.

### **브라우저의 Service Worker**

- Service Worker는 "브라우저 내에 있는 프록시"와 같다고 보면 이해하기 편하다는 설명이 많다. 아마 캐싱이 둘 사이의 가장 큰 유사점이지 않나 싶다. Service Worker은 브라우저 내부에 위치하지만
  브라우저와 서버사이에서 프록시처럼 웹 페이지들을 저장하여 오프라인에서 볼 수 있도록 한다.
- Service Worker는 Worker context에서 실행되기 때문에 메인 V8 스레드와 분리되어있는 Worker 스레드에서 실행된다. 직접적인 DOM 액세스가 불가능하다.
-

### **크롬 익스텐션의 Service Worker**

## **참고 자료**

- [Extension Service Workers 공식 문서](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- [Service Worker API mdn](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
