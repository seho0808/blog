---
slug: "/blog/jwt-jwe-jws"
date: "2024-04-19"
title: "JWT vs JWE vs JWS"
subtitle: "json web token에 대해 알아보자"
---

## **JWT vs JWE vs JWS**

<p class="text-time">최초 업로드 2024-04-19 / 마지막 수정 2024-04-24</p>

오늘 JWT 관련해서 정보들을 들여다보는 중에 내가 얼마나 무지했는지 깨달았다.
JWT RFC를 읽다보니 내가 잘못 알고 있던 정보들이 술술 나오기 시작해서 내가 이해한 것들 위주로 적어보려고 한다.

아래 글은 오로지 RFC 문서들만을 출처로 만든 글이다. 블로그 들에서 찾은 정보는 모두 RFC 내의 글에서 검증되는지 확인하고 RFC 내용을 근거로만 작성했다.

<br/>

### **1. JWT는 JWE 혹은 JWS로 구현되어야 한다.**

나는 JWT의 진화 형태가 JWE인가라고 어렴풋이 추측하고 있었다. 많이 잘못된 추측이었다. [JWT RFC section 7.1 - Creating JWT](https://datatracker.ietf.org/doc/html/rfc7519#section-7)를 보면

> _<span class="text-purple">3. ... The JWT MUST conform to either the [JWS] or [JWE] specification. ...</span>_

"JWT는 JWS 혹은 JWE로 구현되어야한다." => JWE는 JWT 이후에 나온 개념이 아니라 그 반대였다. JWT를 만드는 방식 중 하나가 JWE인 것이다!
다른 말로 하자면 우리가 매번 보던 [jwt.io](https://jwt.io/)는 JWT를 JWS를 사용해서 구현해놓은 형태일 뿐이다.

그래서 JWS와 JWE RFC를 읽어보았더니 이미 토큰의 형태가 다 명시되어있었다.

JWS RFC - JSON Web Signature (JWS) Overview 발췌:

- JOSE Header
- JWS Payload
- JWS Signature

JWE RFC - JSON Web Encryption (JWE) Overview 발췌:

- JOSE Header
- JWE Encrypted Key
- JWE Initialization Vector
- JWE AAD
- JWE Ciphertext
- JWE Authentication Tag

엥 이미 토큰의 형태가 다 명시되어있는데 그러면 우리는 그냥 jwt.io에서 쓰이는 토큰을 JWS로 부르면 되는 것 아닌가?
왜 굳이 JWE와 JWS를 하나로 묶어서 JWT로 만들 수 있다고 따로 문서를 만들었을까?

<br/>

### **2. JWT는 그렇다면 도대체 무엇인가**

<span class="text-orange">결론부터 말하자면: 위에서 추측한대로 JWT는 JWE와 JWS를 아우르는 인터페이스 같은 존재이다. JWT는 토큰이고 JWE와 JWS는 그 평문 토큰을 더 안전하게 만들어주는 추가 구현이다. JWE 혹은 JWS 방식 중 하나를 필수적으로 선택해야지만 JWT라고 부를 수 있다.</span> JWT가 JWE와 JWS 보다 RFC 번호가 더 후순위지만, JWE와 JWS를 추상화하는 존재이다. jwt.io는 JWT라고 불러도 되지만 JWS가 더 자세한 표현이다. JWE와 JWS의 RFC에서 어떻게 정보를 주고 받아야하는지에 대한 규약까지 우겨넣으면 내용이 너무 복잡해지기도 하고, 둘 다 payload(JWS)/plaintext(JWE)의 내용적인 것에 대한 규약은 공통되는 부분이기에 공통적인 통신 내용에 대한 규약을 몰아서 JWT RFC에서 설명하고 보안적인 부분을 JWS RFC, JWE RFC에서 각자 집중적으로 설명하는 것 같다. => 그 단적인 근거로 Claim이라는 단어의 등장 횟수를 RFC 마다 검색해보면 알 수 있을 것이다.

아래는 JWT를 구성하는 요소를 더 깊게 분석해본 내용이다.

<br/>

#### 2-1. JWT Claim

JWT RFC 맨 첫 장을 보면

> _<span class="text-purple">"The claims in a JWT are encoded as a JSON object that is used as the **payload** of a JSON Web Signature (JWS) structure or as the **plaintext** of a JSON Web Encryption (JWE) structure ..."</span>_

JWT의 claim이라는 것들이 JWS 구현에서는 payload이고 JWE 구현에서는 plaintext로 쓰여야한다고 되어있다.

RFC에는 JWT Claim이 정확히 무엇인지 설명이 없다. 하지만 위에 적혀진 것을 통해 claim은 JWT payload에 들어가는 정보라는 것을 알 수 있고, 그 형태는 JSON이기에 claim이 항상 key, value 페어로 이루어져있다는 사실은 추론할 수 있다.

[JWT RFC 4.1 - Registered Claim Names](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)을 읽으면 모든 JWT claim 종류가 나온다

- "iss" (Issuer) Claim => 발행자 정보 (optional)
- "sub" (Subject) Claim => 주제 정보 (optional)
- "aud" (Audience) Claim => 의도된 수신인 정보 (optional)
- "exp" (Expiration Time) Claim => 유통 기한 (optional)
- "nbf" (Not Before) Claim => 특정 시간 전까지는 사용하지 말라는 시간 정보 (optional)
- "iat" (Issued At) Claim => 발행 시간 (optional)
- "jti" (JWT ID) Claim => jwt uid (optional)

결국 정보(claim)를 JSON형태로 페이로드에 담는 것이 목표인데, 페이로드에 위와 같은 정보들을 담고 있어야한다는 것이 골자이다. 흥미로운 점은 모든 필드가 optional이어서, 그냥 비어있는 JSON 데이터를 header + 비어있는 payload ({}와 같이) + signature 형태로 서명하면, 그것 또한 JWT의 일종이 된다...

<br/>

#### 2-2. JWT Header

앞서 언급했듯이 JWT는 JWS 구현과 JWE 구현의 인터페이스 개념이다. 고로 JWS 구현과 JWE 구현에서 공통으로 사용되는 헤더만 JWT에 언급되어있다. 바로 "typ"과 "cty"이다. 둘 다 옵셔널이다.
JWT RFC에서는 다른 정보들과 JWT를 구분하기 위한 필드인 typ를 사용할시 대문자 "JWT"로 쓰라고 권한다고 되어있다. (즉, 헤더가 {"typ": "JWT"} 이런식이다)

JWT의 핵심인 Claim과 Header을 보았다. 이제 JWS와 JWE에 대해 더 알아보자.

<br/>

### **3. JWS에 대해 알아보자**

핵심만 찾아서 정리해보았다.

#### 3-1. 생성 방식의 핵심 ([5.1. Message Signature or MAC Computation](https://datatracker.ietf.org/doc/html/rfc7515#section-5.1)의 5번)

생성에 필수인 alg 헤더가 존재한다.
그리고 그 헤더가 곧 어떤 알고리즘으로 signature을 생성할 것인지이다. "ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload))" 인풋을
alg에 명시된 알고리즘에 넣어서 반환값을 받은 후 base64로 변환하면 그것이 곧 signature이다.

<br/>

#### 3-2. 검증 방식의 핵심([5.2. Message Signature or MAC Validation](https://datatracker.ietf.org/doc/html/rfc7515#section-5.2))

내용을 "ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload))"에 signature 알고리즘을 돌려서 동일한지 확인한다. => 우리가 이미 모두 알고있는 가장 흔한 JWT(JWS) 동작 방식이다.

<br/>

#### 3-3. 사용가능한 signature 알고리즘들

alg에 사용가능한 파라미터 종류 ([4.1.1. "alg" (Algorithm) Header Parameter](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1))

> A list of defined "alg" values for this use can be found in the IANA
> "JSON Web Signature and Encryption Algorithms" registry established
> by [JWA]; the initial contents of this registry are the values
> defined in Section 3.1 of [JWA].

사용가능한 알고리즘은 JWA RFC의 [3.1](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1)에 있다. (네 번째 RFC의 등장)

종류를 정리해보자면

- HS256, HS384, HS512 => SHA-256, 384, 512 해시 방식
- RS256, RS384, RS512 => RSA 비대칭 키 방식
- ES256, ES384, ES512 => 타원 곡선 암호화를 기반으로 한 비대칭 키 알고리즘
- PS256, PS384, PS512 => RSASSA-PSS 방식이라는데, 암호 수업이나 공부를 깊게 안해봐서 잘 모르겠다. RSA의 응용인듯하다.
- none => 아무 서명 알고리즘이 없는 경우

HS256(SHA-256)이 유일하게 무조건 구현되어야하는 알고리즘이라고 되어있다. 그만큼 흔하게 쓸만하다는 뜻이겠다.
그 외에는 RS256과 ES256이 Recommended로 표기되어있다.

<span class="text-orange">결론적으로 비대칭키랑 해싱 중에 선택할 수 있고 더 흔한 방식은 해싱 방식으로 보인다.</span>

<br/>

### **4. JWE에 대해 알아보자.**

JWE는 나는 사용하는 것을 실제로 본 적이 없는데, 아마 복잡하기도 하고 암복호화에 시간을 많이 써서 사용을 덜하는 것 같다.

<br/>

#### 4-1. JWE의 구조

BASE64URL(UTF8(JWE Protected Header)) || '.' ||

BASE64URL(JWE Encrypted Key) || '.' ||

BASE64URL(JWE Initialization Vector) || '.' ||

BASE64URL(JWE Ciphertext) || '.' ||

BASE64URL(JWE Authentication Tag)

<br/>

#### 4-2. JWE의 생성 방식

JWE의 생성 로직은 너무 복잡하게 쓰여져있어서 예시를 기반으로 가볍게 읽고 넘어갔다. 나중에 JWE를 쓸 일이 오면 다시 와서 자세히 공부하자.

[JWE 생성 예시](https://datatracker.ietf.org/doc/html/rfc7516#section-3.3) + [JWE 생성 방법](https://datatracker.ietf.org/doc/html/rfc7516#section-5.1)을 기반으로한 요약

- 랜덤한 CEK(Content Encryption Key)를 생성한다. (방식은 rfc4086을 참고하라고 적혀있다.)
- RSA 공개키(혹은 헤더에 정해진 방식)로 CEK를 암호화한다. 이것이 JWE Encrypted Key이다.
- JWE Encrypted Key를 base64로 변환한다.
- JWE IV(JWE Initialization Vector)이라는 것을 랜덤하게 생성한다.
- JWE IV base64로 변환한다.
- AAD(Additional Authenticated Data)라는 파라미터를 ASCII(BASE64URL(UTF8(JWE Protected Header)))로 설정한다.
- ciphertext, 128-bit-authentication-tag = 선택한encryptionMethod(CEK, plaintext, JWE IV, AAD)

<span class="text-orange">JWE의 핵심은 plaintext(JWS에서의 payload와 유사)를 암호화 후, 그 암호화에 쓰인 키도 다시 암호화해서 2중 암호화한 후 JWE 토큰을 발송한다.
받을 때에도 마찬가지로 2중 복호화를 해준다.</span> 암복호화에 쓰이는 알고리즘들도 JWS처럼 선택할 수 있다.

<br/>

### **5. JWS를 쓰며 기억해야할 것들**

JWE는 내가 한 번도 써본 적이 없어서 사용법을 말하기에는 많이 부족한 것 같고, 적어도 JWS를 쓸 때 조심해야되는 점을 짧게 적고 넘어가려고 한다.

<br/>

#### 5-1. 쿠키 사용시

- JWS로 구현된 JWT payload는 평문이기 때문에 signature자체는 내부 정보가 변형되었는지만 확인 가능함.
- 그렇기에 JWS는 무조건 https로 전송되어야함. http로 유출 시 문제 생기기 쉬움.
- XSS 공격같은 경우 js를 실행해서 document.cookie에서 JWS를 탈취할 수 있다. 그렇기에 HttpOnly 옵션으로 쿠키를 보호해야한다.
- Secure 옵션으로 https에서만 쿠키가 보내지도록하는 것도 설정해주어야한다.
- SameSite=strict 옵션으로 CSRF 공격에 대비해야한다. (lax는 get만 허용)
- JWS의 expire time을 짧게 잡으면 조금은 더 보안이 나아질 수 있다. 영원히 사용가능으로 해놓으면 해커는 탈취 후 영원히 그 유저인척 살아갈 수 있다.

예시 => `Set-Cookie: token=토큰; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure; HttpOnly; SameSite=strict;`를 https로 주고 받기.

<br/>

#### 5-2. bearer 사용시

- 똑같이 https 사용 권장.
- cookie가 자동으로 패스되는 점을 악용한 CSRF에는 강하다.
- cookie를 수동으로 헤더에 넣어주어야해서 쿠키가 js로 accessbile해야한다. 고로 XSS에는 약하기에 XSS자체를 차단하는 방법들을 강구해야한다.

예시 => `Authorization: bearer 토큰`를 https로 주고 받기

<br/>

### **여담**

> _<span class="text-purple">The suggested pronunciation of JWT is the same as the English word "jot".</span>_

RFC 읽던 도중 이런 문구도 있었다...

<br/>

### **마치며**

JWT RFC 29페이지 밖에 안되네 하고 읽다보니 JWE RFC, JWS RFC, JWA RFC가 줄줄이 등장해버려서 당황스러웠다. 천천히 차분히 깊게 알아가보자... 알게 되는 내용이 추가되면 해당 포스트에 추가할 수도 있겠다.

<br/>

### **참고 자료**

- [RFC 7515 - JWS](https://datatracker.ietf.org/doc/html/rfc7515)
- [RFC 7516 - JWE](https://datatracker.ietf.org/doc/html/rfc7516)
- [RFC 7518 - JWA](https://datatracker.ietf.org/doc/html/rfc7518)
- [RFC 7519 - JWT](https://datatracker.ietf.org/doc/html/rfc7519)
