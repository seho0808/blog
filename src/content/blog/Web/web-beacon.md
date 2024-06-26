---
slug: "/blog/web-beacons"
date: "2024-05-07"
title: "웹 비콘"
subtitle: "웹 비콘"
---

## **웹 비콘**

<p class="text-time">최초 업로드 2024-05-07 / 마지막 수정 2024-05-11</p>

### **웹 비콘과 beacon api**

Access-Control-Allow-Origin이 제대로 설정되어있다면 AJAX로 타 웹사이트에 Analytics정보를 보낼 수 있다. AJAX의 문제점은 페이지 이동 시 unload를 기다리지 않는다는 점이다. 즉, 정보가 누락될 수 있다. 이를 막기 위해 과거에는 다음과 같은 방식들 중 하나가 사용되었다.

- 페이지 이동을 AJAX 응답까지 기다리기
- img src태그를 이용해서 AJAX 응답 기다리기 => 대부분의 브라우저는 이미지가 다 로드될 때까지 unload를 기다리게 한다.
- unload 직전에 몇 초 동안 강제로 머무르는 코드를 만들기.

img src태그를 사용하는 것이 웹 비콘이며 보통은 Analytics데이터를 보내기 위해 사용된다. 다만 위의 솔루션들은 퍼포먼스에 악영향을 줄 수 있기에 2014년에 beacon api가 등장해서 페이지 이동 후에도 async로 정보가 전달되도록 한다.

<br/>

### **아직도 존재하는 img의 장점**

위의 unload 장점 외에도 img src를 사용하면 CORS 자동 우회가 되기 때문에 Access-Control-Allow-Origin 설정을 관리해주지 않아도 된다. 또한 특정 상황에서 유익하다.

아래는 beacon api에서는 어렵지만 img src 웹 비콘을 사용하면 가능한 구현들이다. (배너 이미지가 될수도 있고, 안보이는 컴포넌트, 혹은 1픽셀의 이미지일수도 있다.)

- 이메일에 웹 비콘을 넣어서 사용자가 언제 이메일을 열람했는지, 몇 번 열람했는지, ip는 어디인지 확인할 수 있다.
- 서드 파티 입장에서 타 사이트의 광고 이미지를 비콘화해서 어떤 순서로 레퍼럴되어서 타고 들어왔는지 보다 정확하게 측정가능하다. (rel="no-referrer"등도 무시가능)
- 데스크탑 - 휴대폰 디바이스 여러 개를 왔다갔다하면서 브라우징 할 때에도 행동을 트래킹할 수 있음. (이건... 잘 쓰면 Beacon API도 가능할수도)

<br/>

### **img src를 사용했을 때 2048자를 넘어간다면?**

get request의 최대 길이인 (url 최대 길이) 2048자가 넘어간다면 문제가 생긴다.

내가 생각한 해결책:

1. 버퍼(queue) 하나를 놓고 쪼개어서 요청을 onload마다 새로 보내는 방식. 순서가 보장된다.
2. 병렬로 여러 개의 img로 보내는 방식. 순서가 보장되지 않기 때문에 TCP 패킷처럼 합치기 위한 번호나 헤더가 필요할 수도 있겠다.
3. 그냥 CORS 관리해주고 beacon api쓰기. beacon api는 POST이기 때문에 길이 제한이 없다.

1번과 2번은 누락된 정보만큼을 null처리를 해주던지 해야할듯하다. 기업에서 Analytics를 관리할 때는 누락된 정보 처리를 어떻게 할지 정해야할 것이다.

<br/>

### **참고 자료**

- [beacon api](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API)
