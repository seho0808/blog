---
slug: "/blog/next-js-cache-part-2"
date: "2023-12-28"
title: "Next js 13에서 추가된 캐싱 기능들을 정리해보자 [2편]"
subtitle: "Next js 13에서 추가된 캐싱 기능들을 정리해보자 [2편]"
---

## **Next js 13에서 추가된 캐싱 기능들을 정리해보자 \[2편\]**

<p class="text-time">최초 업로드 2023-12-28 / 마지막 수정 2023-12-28</p>

<br/>

<div class="image-container">
  <img class="md-image" src="/images/caching-overview-fixed.jpg" alt="next_js_caching_flow"/>
  <sub class>그림 1. 실제로 고려해야되는 캐싱들</a></sub>
</div>

## **Full Route Cache**

1편에서 보았던 브라우저에서의 캐싱 기법을 넘어서 서버의 기법들을 살펴보자. 가장 먼저 그림에서 볼 수 있는 것은 Full Route Cache이다.
이는 Router Cache가 브라우저에 RSC Payload를 저장하는 것과 반대로, 서버에 RSC Payload를 저장해둔다. 근데 이는 사실 일반적으로 생각하는 캐싱과는 조금 다를 수 있다.
왜냐하면 빌드 타임에 상당히 의존적이기 때문이다. 빌드 타임에 먼저 캐싱될 RSC Payload가 생성되고, 런타임에 Static Route로 만들어진 페이지가 호출되면, 앞서 빌드 타임에 만들어진 "캐싱"(캐싱 같지 않은, 빌드 타임에 만들어진 정보 - static payload 같은 단어가 더 어울려 보인다.) 된 RSC Payload가 사용된다. 명심해야할 것은, Dynamic Route에는 적용이 안된다.

위의 정보와 그 외의 핵심을 나열하자면,

1. Next.js는 Opting Out을 하지 않으면 모든 Static Route에 Suspence 단위로 RSC Payload를 빌드 타임에 캐싱해둔다. 빌드 마다 반영구적이다.
2. 반영구적인 이유는 revalidation이 가능은 하기 때문이다. 뒤에 설명될 Data Cache를 통해서 페이지를 렌더링했으면, 그 정보만 revalidate하면 해당 부분의 Payload만 재생성된다.
3. 2번 때문에 Data Cache와 Full Route Cache는 밀접한 관계를 지닌다.
4. 캐싱이라고 할 수 있는 이유는 재배포 시 외에, Data Cache를 통해서 revalidate할 수 있기 때문이다.
5. Dynamic Page에는 적용이 안되기 때문에, 매 request마다 새로운 데이터로 SSR하는 페이지에는 사용하기 어렵다. (억지로 매번 revalidate할 수는 있지만, 부자연스럽다.)
6. Suspense 단위이기에 Data Cache revalidation을 통한 HTML 리렌더를 작은 단위 별로 나누어서 할 수 있다.

<br/>

## **Data Cache**

Next에서 서버사이드 [fetch API](https://nextjs.org/docs/app/api-reference/functions/fetch)를 직접 만들었다. 근데 이게 다른 호출 라이브러리/모듈(node-fetch, http 등)을 기반으로
만든 것인지 의문이 들긴한다. GIT을 까보면 알 수도 있겠지만, 거기까지 갈 엄두는 안난다. 나중에 기회가 되면 해볼 것이다. 근데 일단 공식 문서에서 유추해보면, fetch API를 그대로
서버에 구현한 것으로 보여진다. fetch는 원래 브라우저에서만 사용할 수 있는 브라우저용 API이다. Node에서는 node-fetch, http, axios 라이브러리/모듈 등이 있고, axios의 경우 서버와 클라이언트 각자
따로 구현해놓았다. (axios의 경우 서버는 http 모듈 기반, 브라우저는 XMLHttpRequests 기반으로 만들어져있다고 한다.) 아무튼, 이렇게 fetch를 직접 만들어서 Next.js 13부터는 Next 자체적으로 서버 사이드 캐싱을 정말로 할 수 있게 되었다. 필자는 해당 기능이 Next.js 13에서 캐싱 중에서는 가장 핵심이 되는 기능으로 꼽을 수 있다고 생각한다. <span class="text-orange">DB 부하를 줄일 수 있는 직접적 수단이다.</span>

사용할 때에는 시간 혹은 수동(on-demand)으로 revalidate로직을 설정할 수 있다.

<br/>

```javascript
// 시간 기반 revalidation
fetch("https://...", { next: { revalidate: 3600 } });

// 수동 revalidation
fetch("https://...", { next: { tags: ["asdf"] } }); // 첫번째 요청의 결과
revalidateTag("asdf"); // 수동 revalidate
fetch("https://...", { next: { tags: ["asdf"] } }); // 새로 가져온 두 번째 요청의 결과

// Opt out
fetch(`https://...`, { cache: "no-store" });
```

<br/>

주의점은 Opt out 혹은 revalidation을 안할 시 자동으로 <span class="text-red">영원히 런타임 멈출 때까지 첫 요청이 캐싱</span>됩니다. 그렇기 떄문에 fetch를 Next.js 서버 사이드에서 쓸 때 매우 조심해야합니다.

<br/>

## **Request Memoization**

이 캐싱 기법은 굉장히 단순하다. 유저가 날린 하나의 Request에 대해 현재 서버에서 다른 서버로 날리는 모든 요청에 대해 2개 이상의 같은 HTTP요청이 있으면 1개로 줄이는 것이다.
즉, <span class="text-orange">Caching이라는 단어보다 Deduping이라는 단어가 더 와닿는다.</span> 여기서 추가로 신경 써야할 것은 React cache이다. 최상단에 있는 그림에서 커스텀으로 추가해준 "React cache vs Next fetch"가
이 부분이다. React cache도 마치 React memo처럼 함수 결과값을 하나의 Request에 대해 저장해둘 수 있어서 유용하게 쓸 수 있다. 물론 하나의 요청 이후에는 휘발된다. 이는 Next.js에서 추가한
Request Memoization이랑 상당히 비슷하다. React cache로도 수동으로 요청 Deduping을 명시적으로 해줄 수 있다.

<br/>

```javascript
// 아래 코드는 Next.js 내부 서버 코드임.
// 1. Next.js fetch를 통한 암묵적인 deduping
await fetch("https://example.com/asdf");
await fetch("https://example.com/asdf");
// => 두 개의 요청이 단 한 번만 날아가도록 자동으로 Next.js에서 처리해줌.

// 2. React cache를 통한 명시적인 deduping
// 해당 예시는 필자가 supabase연동에 사용했었던 코드인데, 한 번의 request동안 DB connection이 하나만 유지되도록 한다.
// 위처럼 fetch가 아니라 아래처럼 요청이 api를 통하는 경우, 이렇게 처리해주는 것이 깔끔할 수 있다.
export const serverClient = cache(() => {
  const cookieStore = cookies();
  return (
    createServerComponentClient < Database > { cookies: () => cookieStore }
  );
});
```

<br/>

## **마치며**

Next.js 13에는 네 가지 캐싱 기법이 새로 소개되었지만, 실제로 쓸 수 있는 프론트엔드 캐싱기법(이제는 프론트엔드에 서버도 어느정도 오버래핑된다고 봐야하지 않을까?)은 이것 이상으로 많다. 그 중 자주 쓰이는 것들을 최대한 담아보고자했다. 여태까지 소개했던 내용들을 되짚어보자면 아래와 같다.

1. Web API에서 제공하는 fetch API를 사용한 캐싱
2. 브라우저에서의 useSWR을 이용한 캐싱
3. 브라우저에서 Next.js가 제공하는 Router Cache를 이용한 RSC Payload 캐싱
4. 서버에서 Next.js가 제공하는 Full Route Cache를 이용한 RSC Payload 캐싱
5. 서버에서 Next.js가 제공하는 fetch를 이용한 Data Cache
6. 서버에서 Next.js는 자동으로 fetch들을 deduping 함
7. 서버에서 React cache를 이용해서 함수를 memoize할 수 있음
8. DB와 웹 서버 사이에 하나의 캐싱 툴을 둘 수 있음 (이건 사실 더 백엔드적인 캐싱이기에 다루지 않았음)
