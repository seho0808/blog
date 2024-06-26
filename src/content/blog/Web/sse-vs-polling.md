---
slug: "/blog/sse-vs-polling"
date: "2024-04-29"
title: "SSE vs Polling"
subtitle: "브라우저 - 서버 간의 지속적인 통신 방법에 대해 알아보자"
---

## **SSE vs Polling**

<p class="text-time">최초 업로드 2024-04-29 / 마지막 수정 2024-05-01</p>

육군본부에서 구현했었던 AI 모니터링 체계가 일반 폴링(regular polling) 방식이었는데, 부하를 확인했을 때 적어서 굳이 추가적으로 최적화를 해주지 않았던 기억이 있다.

그때 서버가 겪고 있던 부하를 요약해보자면:

- 부하 1: 두 개의 타 서버의 CPU 점유율 초 단위로 받기
- 부하 2: 수십 명의 피감시 체계 유저 브라우저에서 날아오는 하루 몇 천건의 유저 행동
- 부하 3: AI 모니터링 체계가 사용중이라면 거기서 요청하는 5초 단위의 감시데이터

아쉬운 점을 요약해보자면:

- 부하 1의 경우: 초 단위로 일방적으로 받기 때문에 SSE를 쓰는게 더 좋지 않았나 싶다. (비록 서버-클라이언트가 아닌 서버-서버의 SSE이지만.)
- 부하 2의 경우: 이것은 산발적으로 오는 요청들이기에 일반적인 HTTP 요청이 좋은 것 같다.
- 부하 3의 경우: 일단 AI 모니터링 체계를 사용하는 유저 수가 10명 미만으로 예정되어있었기에 (유지보수하는 부서만 보고 있으면됨) 요청량이 많지는 않다. 그리고 대시보드 실시간 데이터의 주기가 5초로 주기가 꽤 길어서 SSE 보다 일반 폴링을 써도 괜찮아보이고, 같은 데이터라도 무조건 다시 받아와야하기에 일반 폴링도 문제가 없어 보인다.

부하 1이 가장 아쉬운 부분인 것 같다.

내가 위 개선점을 고민하면서 SSE와 폴링 모두 Keep-Alive 옵션을 사용하는 것을 보았기에 정확하게 어떤 차이가 있는지 잘 이해하고 싶었다.
공부를 하다보니 http/1.1, http/2, http/3에서의 Keep-Alive 관련 옵션이 너무 상이하게 적용되어서 이 개념들을 먼저 정리하고 넘어가야했다. (Keep-Alive는 http/2와 3에서는 지원을 안하며, 사파리에서는 오류를 일으킬 수도 있다. 자세히 알아보자.)

해당 글의 일부는 스택오버플로우 글들에 의존하며, 링크를 모두 첨부해두었다. 스택오버플로우 글들의 팩트 체크를 시도해보았지만, 공식적인 출처가 불명확했다. 일부 게시글 관련 비공식적으로 컨트리뷰터들이 적은 메일이나 정보 등은 찾을 수 있었다.

<br/>

## **HTTP 버전 별 지속적인 통신**

### **HTTP/1.1에서의 지속적인 통신**

HTTP/1.1의 [2022년 Keep-Alive 1.0과의 차이](https://datatracker.ietf.org/doc/html/rfc9112#name-keep-alive-connections)과 [2022년 Persistence 스펙](https://datatracker.ietf.org/doc/html/rfc9112#section-9.3)과 [1997년 Persistence 스펙](https://www.rfc-editor.org/rfc/rfc2068#section-8.1)을 참고해서 적어보았다:

- HTTP/1.0에서는 Keep-Alive를 명시적으로 적어주어야하고 실험적 구현이었기에 서버에 따라서 제대로 구현이 안되어있을 수도 있다.
- 하지만 <span class="text-orange">HTTP/1.1에서는 기본적으로 Keep-Alive설정이 생략되어도 적용된다.</span>
- 다만, [timeout과 max 파라미터](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive)의 디폴트 값은 스펙에는 적혀있지 않다.
- 그렇기에 HTTP/1.1에서 `Connection: Keep-Alive`와 함께 `Keep-Alive: timeout=5, max=1000`를 원하는 값으로 헤더에 주는 것은 유의미하다. (서버 마다 구현한 디폴트 값이 다를 수 있기에)
- 스택오버플로우 기준으로 [서버에서는 Keep-Alive 시간을 무시하고 자기 마음대로 정할 수 있다](https://stackoverflow.com/questions/19155201/http-keep-alive-timeout)고한다.

추가적인 디테일:

- Connection 옵션이 "close"로 설정된 경우: 현재 응답 이후 연결이 지속되지 않는다.
- 지속적인 연결을 지원하지 않는 클라이언트는 모든 요청 메시지에 "close" 옵션을 포함해야 한다.
- 지속적인 연결을 지원하지 않는 서버는 1xx 코드가 아닌 모든 요청 메시지에 "close" 옵션을 포함해야 한다.
- 파이프라이닝(요청 응답 받기 전에 클라이언트에서 계속 추가 요청 보내는 것) 방식으로 클라이언트는 보내"도"(MAY) 된다. 서버는 그 응답을 받아서 병렬 처리를 해주어도 되고, 직렬로 처리해도된다. 다만, 받은 요청 순서대로 응답을 보내주어야한다. HTTP에는 TCP처럼 패킷 순서를 알려주는 방식이 표준에는 없기에 중요하다. => HTTP/2.0에서 해결하고자하는 문제 중 하나다.
- 매우 매우 놀랍게도 커넥션 끊기에는 명확한 기준이 없다. (HTTP 완벽 가이드 4.7장 참고)
- 커넥션 끊기가 서버랑 클라이언트 어느쪽에서든 발생할 수 있고 오류에 취약하기에 멱등하지 않은 POST의 경우 파이프라이닝을 사용하지 않는 것을 권장한다. (HTTP 완벽 가이드 4.7장 참고)
- [TCP Keep-Alive와 HTTP Keep-Alive는 완전 다르다](https://stackoverflow.com/questions/9334401/http-keep-alive-and-tcp-keep-alive). RFC 1122 4.2.3.6 TCP Keep-Alives 명시를 수십분 동안 열심히 읽었는데, 알고보니 이름만 같았다.

<br/>

### **HTTP/2에서의 지속적인 통신**

<span class="text-orange">HTTP/2는 기본적으로 지속적이다.</span>

HTTP/1.1에서 Status Line, Header, Body를 묶어서 Message라고 부르며 이것이 하나의 요청 단위이다.
HTTP/2에서는 Frame과 Message와 Stream이 하나의 요청 단위이다:

- Frame: Header 혹은 Data (HTTP/1.1로 치면 Header 혹은 Body의 일부)
- Message: 여러 개의 Frame. 하나의 메세지 단위임. (HTTP/1.1로 치면 Status Line + Header + Body)
- Stream: 하나의 응답을 위한 하나의 요청. 여러 개의 요청이 동시에 오고 갈 수 있음. (HTTP/1.1로 치면 한 번의 응답을 위한 요청.)

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/sse/http2-stream.svg" alt="http2 stream"/>
  <sub class>그림 1. 출처: https://web.dev/articles/performance-http2</sub>
</div>

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/sse/http2-stream2.png" alt="http2 stream"/>
  <sub class>그림 2. CPU 스케쥴링처럼 블락 단위로 나뉘어있다. 출처: https://web.dev/articles/performance-http2</sub>
</div>

이렇게 설계(멀티플렉싱)했기에 HTTP/1.1에서처럼 여러 개의 TCP요청으로 리소스 여러 개를 병렬로 가져오는 것이 아니라 하나의 연결 안에서 모든 리소스를 요청할 수 있고,
이러면 당연히 지속적인 통신일 수 밖에 없다. 그럼 HTTP/2는 도대체 언제 끊기냐!면 [스펙 9.1 Connection Management](https://datatracker.ietf.org/doc/html/rfc9113#name-connection-management)에 따르면 클라이언트는 그 페이지에서 완전히 이탈할 때까지 연결을 유지해야하고, 서버는 최에에에대한 연결을 유지하다가 idle로 판단되면 GOAWAY 프레임을 클라이언트에 보내야한다고 한다. 그리고 재미있는 점은 [크롬 탭이랑 윈도우끼리도 동일한 도메인에 대해서는 HTTP/2통신을 공유한다는 게시글](https://stackoverflow.com/a/75502115/14971839)이 있다. 그리고 HTTP/2는 스트림들을 끼워 맞춰주어야하기 때문에 벤치마킹 시 HTTP/1.1보다는 CPU를 더 쓰는 경향이 있다고 한다.

<br/>

### **HTTP/3에서의 지속적인 통신**

HTTP/3은 구글의 QUIC(Quick UDP Internet Connections)기반이고 QUIC은 UDP기반이다. <span class="text-orange">흥미롭게도 TCP에서 가지는 핸드셰이크, 연결성, 패킷 순서 보장등을 UDP위에서 구현한 것이 QUIC이다. 그렇기에 멀티플렉싱을 제공하는 지속적인 통신이 기본 옵션이라고 생각해야할 것이다.</span>

- 멀티플렉싱을 HTTP의 애플리케이션 레이어가 아닌 트랜스포트 레이어에서 구현하기 때문에, HTTP/2보다 안정적으로 멀티플렉싱이 가능하다. HTTP/2는 멀티플렉싱 도중에 하나의 스트림에서 문제가 생기면 다른 [스트림들이 TCP에서 다 일시정지(Head of Line Blocking in TCP)](https://stackoverflow.com/questions/45583861/how-does-http2-solve-head-of-line-blocking-hol-issue)가 된다고 한다. HTTP/2에서는 스트림들이 하나의 TCP 연결을 공유하기에 어찌보면 당연하다. 이런 문제를 HTTP/3에서는 근본적으로 트랜스포트 레이어에서 해결하기에 다른 스트림들을 멈추는 불상사는 생기지 않는다고 한다. UDP에서는 여러 개의 통신을 한 번에 날리기에 트랜스포트 레이어에서 하나의 연결을 공유한다는 개념이 없다.
- HTTPS를 HTTP/2이하에서 구현하면 TCP 핸드셰이크 이후 TLS 핸드셰이크를 하는데, QUIC은 한 번의 핸드셰이크에 TLS를 포함해버려서 이러한 관점에서는 더 효율적이라고 한다.
- TCP에서의 패킷 순서 맞추기는 커널에 구현되어있다. [반대로 QUIC은 UDP위에 다시 만든 프로토콜이기에 순서 맞추기는 유저 메모리 공간의 QUIC 라이브러리로 구현되어있고, 이는 유저 앱 프로세스에서 실행되며 커널 단에서 최적화된 것이 아니기에 CPU를 http/2에 비해 더 소모한다고 한다.](https://youtu.be/DWC0ELc6oIE?si=4cFhFsjYbV6fJbUP&t=391)
- TCP에서는 패킷 순서 등이 모두 노출되어있다. TLS레이어를 써봤자 TLS는 TCP Payload만 암호화하기에 TCP 헤더는 평문이다. QUIC은 이를 헤더까지 모두 암호화한다. 그래서 복호화가 더 느리다. 대신 보안은 조금 더 좋을 수 있다.
- 프로토콜이라는 것이 약속을 한 번해서 쓰기 시작하면 과감하게 업데이트하기 어렵기 때문에 TCP 발전이 어려웠던 것을 QUIC이 일정부분 해소하려고 하지만 커널 레벨에서 최적화가 이루어지고 있는 것이 아니기에 CPU 소모는 심해진 상태.

이외에도 수많은 디테일들이 있지만 생략했다. 나중에 더 잘 알게되면 여기에 추가하도록하자. RFC는 9000번이다.

<br/>

## **폴링과 SSE**

### **일반 폴링 (Regular Polling)**

일반 폴링은 정해진 시간(n초)에 따라 HTTP 요청을 주기적으로 보낸다.

- HTTP/1.0: Keep-Alive가 없다면 매번 TCP 핸드셰이크를 한다.
- HTTP/1.1: Keep-Alive가 디폴트이기에 자동으로 요청 사이의 TCP 연결이 유지된다. 폴링 시간 간격이 길어서 timeout되면 TCP 3-way 핸드셰이크가 매번 수행될 수도 있다.
- HTTP/2와 3: 통신이 거의 항상 유지되는 것으로 예상되기에 새로운 TCP Handshake는 거의 발생하지 않는다. 하나의 스트림이 생겼다가 응답 후 사라진다.

<br/>

### **롱 폴링 (Long Polling)**

[롱 폴링](https://ko.javascript.info/long-polling)은 "데이터가 바뀌거나 처리된 후 응답을 받고 싶은 경우" 유용하다.

- HTTP/1.0: 맨 처음에 클라이언트가 서버에 요청을 보내고나서 데이터가 돌아오는 시간이 1초가 될지, 3초가 될지, 10초가 될지 미정이다. 서버에서 응답이 올 때까지 클라이언트에서 통신을 열어두다가, 응답이 오는 즉시 TCP통신을 끝낸다. (혹은 Keep-Alive로 유지한다.) 끝낸 후에 다시 다음 요청을 보낸다. (직후가 될 수도 있고 몇 초 기다려도 되는듯하다.)
- HTTP/1.1: 1.0과 동일하지만, 원래 Keep-Alive가 디폴트로 적용된다. timeout과 max의 정확한 수치 조정이 필요하다면 적용한다. 서버에서는 timeout과 max를 무시할 수도 있다.
- HTTP/2와 3: 서버에서 언젠가 응답이 돌아올 때까지 하나의 스트림을 유지하는 방식으로 구현할 수 있다. 사실상 연결이 끊기지 않는 한 늦게 오는 응답이 곧 자동으로 롱 폴링처럼 동작한다. 따로 설정해줄 것이 없다.

<br/>

### **SSE (Server Side Events)**

SSE는 서버에서 클라이언트로 계속해서 데이터를 푸시하는 단방향 HTTP 연결이다. 클라이언트는 연결이 끊기면 계속 재연결을 시도한다. ([스펙](https://html.spec.whatwg.org/multipage/server-sent-events.html)에서는 몇 초 단위 정도로 설정하라고 나옴.) HTTP 204 No Content가 날아오면 재연결을 멈춘다.

- HTTP/1.0: 지원되지 않는다.
- HTTP/1.1: `Connection:keep-alive`, `Content-Type: text/event-stream`을 보내면 SSE가 활성화된다. (`keep-alive`는 디폴트 지원이기에 생략가능.) 서버에서는 이 헤더를 보고 SSE를 시작할지 정하게 되고, 계속 스트림의 데이터를 보낸다. 브라우저는 연결을 유지하는 노력을 계속해야하고 끊어졌을 때 재연결하는 로직도 만들어놓아야한다. ([EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)가 현대 브라우저에서의 구현체이다.) 하나의 TCP 연결 전체를 SSE용도로 계속 차지한다. 브라우저에서 도메인 당 [6개의 SSE가 최대 연결이다.](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- HTTP/2와 3: `Content-Type: text/event-stream`만 필요하다. 하나의 스트림을 계속 유지하면서 요청을 안보내도 응답이 계속 오는 형식이다. 하나의 TCP 연결의 일부를 차지한다. HTTP/1.1처럼 브라우저에서 스트림 정보를 받아오는 로직을 EventSource API 내부에 구현해둔다. (HTTP/2의 경우 END_STREAM or RST_STREAM 플래그가 포함된 프레임이 클라이언트 혹은 서버에서 발송되거나 전체 통신을 종료하는 GOAWAY 프레임이 날라오지 않는 한 스트림은 유지된다.)

프록시와 브라우저에서의 캐싱을 최대한 컨트롤하기 위해 `Cache-Control: no-store`을 사용하는 것이 권장되지만, 이 헤더는 무조건적으로 어떻게 작동될지 프록시 서버들을 조종할 수 없다. (브라우저는 당연히 조종가능.) 이렇게 해달라고 요청만 할 뿐, 프록시 서버 자체는 마음대로 행동할수도 있다. [SSE 스펙](https://html.spec.whatwg.org/multipage/server-sent-events.html) 상에는 EventSource 클래스의 constructor내에서 `no-store`설정을 하라고 되어있다.

<br/>

## **성능 비교**

### **HTTP/1.1, HTTP/2, HTTP/3 속도?**

[HTTP/2와 3의 비교 논문](https://ieeexplore.ieee.org/document/9500258)과 [영상](https://www.youtube.com/watch?v=-0yu_zOFilg&ab_channel=AntonPutra)과 [비교 실험](https://www.yanxurui.cc/posts/http/2023-11-22-http-comparison/)을 찾아보니 전반적으로 HTTP/2는 1.1에 비해서 멀티플렉싱으로 많이 빨라졌지만, 3의 경우에는 인터넷 환경이 좋을 경우 오히려 상대적으로 느려진다고 한다. Throughput은 올라가지만 속도는 내려가며, 통신 환경이 원활하지 않은 모바일 기기 등에 좋은 것이 HTTP/3이라고 한다. 위에서 언급했었던 HTTP/3의 한계도 한몫하는 것 같고, 아직 HTTP/3가 공식적으로 도입된지 2년이 채 되지 않았기 때문에 발전을 지켜보아야할듯하다.

<br/>

### **TCP 연결 하나당 유지 비용?**

새로운 TCP 연결을 만들 때의 오버헤드:

- 핸드셰이크: 새로 커넥션 만들고 끊을 때마다 3-way, 4-way handshake가 일어난다.
- TCB: TCB 블록 할당 및 TCB마다 존재하는 메타데이터 메모리에 유지
- 느린 시작: 새 연결이 생기면 TCP는 느린 시작을 한다. 하나의 패킷을 보내고 다음에는 두 개의 패킷 다음에는 네 개의 패킷을 보낼 수 있는 식으로 점진적으로 패킷 수를 늘려가는 방식이다.
  인터넷 세계의 혼잡도를 줄이기 위해 만들어졌다고 한다. HTTP/1.1에서 새로 연결을 계속 한다면 느린 시작(slow start)은 악영향을 줄 수 있다.

[TCP 한 개를 유지하면 하나의 TCB블록을 유지하는 것과 동일하다.](https://beta.computer-networking.info/syllabus/default/protocols/tcp.html#:~:text=For%20each%20established%20TCP%20connection,on%20this%20connection%20RFC%20793.) 이는 링크를 타고 들어가면 원본 RFC 793에도 나오는 내용이다. TCB 블록 안에는 연결에 대한 다양한 상태가 보존되고 버퍼 메모리 위치 관련된 정보가 저장되는듯하다. 이 TCB 블록이 여러 개 생성되었다가 사라지는 것과 TCB 블록의 메타데이터량이 곧 HTTP/1.1에서의 메모리 오버헤드 일듯하다. 통신 오버헤드는 요청 마다 핸드셰이크가 계속 발생한다는 점이다. HTTP/2는 단 하나의 TCP 연결을 클라이언트와 서버에서 유지하고 핸드셰이크도 발생시키지 않으며 메모리 오버헤드도 더 적기에 매우 월등해보인다. 또한 HTTP/2에서는 파이프라이닝이 기본이고 느린 시작도 단 한 번만 발생하기에 훨씬 빠르다. 망가진 패킷 재전송이나 혼잡 지연은 HTTP/1.1이나 2나 모두 존재하기에 비교 항목에서 제외한다.

<br/>

### **결론**

1초 마다 데이터를 받을 경우 HTTP/3을 제외한 성능을 비교하면:

<span class="text-red">HTTP/2 SSE > HTTP/2 폴링 >>>> HTTP/1.1 SSE >> HTTP/1.1 폴링</span>

- HTTP/2에서는 파이프라이닝이 무조건 지원되어서 HTTP/1.1보다 훨씬 빠르다. HTTP/1.1에 존재하는 TCP 연결 오버헤드도 HTTP/2에는 없다.
- SSE는 "요청" -> "응답"에서 "요청"이 필요없이 "응답"만 받기에 폴링보다 더 빠르다.

<br/>

### **Polling 외에 Keep-Alive의 사용처**

위에서 설명 되었듯이 당연하게도 1.1에만 해당되는 내용이다. 2와 3은 자동으로 연결이 지속된다.

- 동영상이나 오디오 스트리밍에서 Keep-Alive를 사용한다고 함.
- 웹 소켓 연결 초기화 시 HTTP를 사용하는데 이때 Keep-Alive가 사용된다고 함.
- 폴링이 아니더라도 지속적으로 서로 요청과 응답을 반복하는 스트림이 필요한 경우.

<br/>

### **마치며**

생각보다 깊이가 있는 주제였다. 원래는 HTTP 1.1만 하려고했는데 2.0과 3.0의 점유율을 찾아보니 50%를 넘어가는 시대가 되어서, 웹의 세계는 빠름을 느꼈다. HTTP/1.1 Keep-Alive 스펙까지는 탐구할만했지만, HTTP/3.0이 UDP기반으로 돌아간다는 것을 보고 조금 지치기 시작했다. HTTP/2.0과 HTTP/3.0도 다시 읽어봐야겠다. 근데 다람쥐책 분명히 1년전에 한 번 정독했는데 진짜 뇌에서 거의 다 증발해버린 것 같다. 실무 경험 기반으로한 공부가 잘 안 까먹는 것 같긴하다. 흥미로운 점은, 다람쥐 책을 읽으면서 동시에 RFC를 읽어보니, 다람쥐 책의 상당 부분이 곧 HTTP RFC 내용들을 그대로 풀어서 적은 것이었다는 점이다.

<br/>

### **참고 자료**

- [롱 폴링](https://ko.javascript.info/long-polling)
- [SSE 스펙](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [SSE 사용법](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [HTTP 완벽 가이드 4.5장 지속 커넥션 (다람쥐 책)](https://product.kyobobook.co.kr/detail/S000001033001)
- [RFC 9112 - HTTP/1.1 개정판 스펙](https://datatracker.ietf.org/doc/html/rfc9112)
- [RFC 9113 - HTTP/2.0 개정판 스펙](https://datatracker.ietf.org/doc/html/rfc9113)
- [쉬운 QUIC 설명 영상](https://www.youtube.com/watch?v=y8xHJJWwJt4&ab_channel=PieterExplainsTech)
- [http/2, http/3 비교 영상](https://www.youtube.com/watch?v=DWC0ELc6oIE&ab_channel=HusseinNasser)
