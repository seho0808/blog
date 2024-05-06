---
slug: "/blog/state-management"
date: "2024-01-07"
title: "웹 비콘"
subtitle: "웹 비콘"
---

## **웹 비콘**

<p class="text-time">최초 업로드 2024-05-06 / 마지막 수정 2024-05-06</p>

### **기존의 웹 비콘과 현대의 beacon api**

웹 비콘은 Analytics데이터를 보내기 위해 사용된다. Access-Control-Allow-Origin이 제대로 설정되어있다면 AJAX로 보낼 수 있다. AJAX의 문제점은 페이지 이동 시 unload를 기다리지 않는다는 점이다.
이를 막기 위해 과거에는 다음과 같은 방식들이 사용되었다.

- 페이지 이동을 AJAX 응답까지 기다리기
- img src태그를 이용해서 AJAX 응답 기다리기 => 대부분의 브라우저는 이미지가 다 로드될 때까지 unload를 기다리게 한다.
- unload 직전에 몇 초 동안 강제로 머무르는 코드를 만들기.

이는 퍼포먼스에 악영향을 줄 수 있기에 beacon api가 등장해서 페이지 이동 후에도 async로 정보가 전달되도록 한다.

<br/>

### **아직도 존재하는 img의 장점**

위의 unload 장점 외에도 img src를 사용하면 CORS 자동 우회가 되기 때문에 Access-Control-Allow-Origin 설정을 관리해주지 않아도 된다.

<br/>

### **img src를 사용했을 때 2048자를 넘어간다면?**

get request의 최대 길이인 (url 최대 길이) 2048자가 넘어간다면 문제가 생긴다.

내가 생각한 해결책:

1. 버퍼(queue) 하나를 놓고 쪼개어서 요청을 onload마다 새로 보내는 방식. 순서가 보장된다.
2. 병렬로 여러 개의 img로 보내는 방식. 순서가 보장되지 않기 때문에 TCP 패킷처럼 합치기 위한 번호나 헤더가 필요할 수도 있겠다.
3. 그냥 CORS 관리해주고 beacon api쓰기. beacon api는 POST이기 때문에 길이 제한이 없다.

1번과 2번은 누락된 정보만큼을 null처리를 해주던지 해야할듯하다. 기업에서 Analytics를 관리할 때는 누락된 정보 처리를 어떻게 할지 정해야할 것이다.

<br/>

### **웹 비콘의 다양한 형태**

배너 이미지가 될수도 있고, 안보이는 컴포넌트, 혹은 1픽셀의 이미지일수도 있다.

<br/>

### **참고 자료**

- [beacon api](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API)