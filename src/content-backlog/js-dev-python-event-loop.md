---
slug: "/blog/js-dev-python-event-loop"
date: "2024-12-22"
title: "JS 개발자가 본 파이썬의 이벤트 루프"
subtitle: "JS 개발자가 본 파이썬의 이벤트 루프"
---

## **JS 개발자가 본 파이썬의 이벤트 루프**

<p class="text-time">최초 업로드 2024-12-22 / 마지막 수정 2024-12-22</p>

JS + V8과 달리, 파이썬에서는 이벤트 루프가 기본 실행 흐름의 일부로 내장되어 있지 않다. 대신, 파이썬은 asyncio와 같은 라이브러리를 통해 이벤트 루프를 구현하며, 이는 별도의 인터페이스로 제공된다. 따라서 이벤트 루프를 직접 생성하거나, 관리하는 코드를 작성해야 할 때가 있다.

<br/>

`asyncio.run(main)`을 사용하게 되면 파이썬 인터프리터는 이벤트 루프를 실행하고 종료될 때까지 기다린다. 디폴트로는 asyncio는 싱글 스레드 내에서 작동하기에 다른 스레드에 간섭하지는 않는다고 한다. [# 출처 섹션 본문 첫 문장 참고](https://docs.python.org/3/library/asyncio-dev.html?utm_source=chatgpt.com#concurrency-and-multithreading)

```python
import asyncio
import threading

async def main():
    print("Start")
    await asyncio.sleep(3)  # 3초 대기
    print("End")

def start_event_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main())

# 이벤트 루프를 별도의 스레드에서 실행
thread = threading.Thread(target=start_event_loop)
thread.start()

print("Main thread is not blocked")
thread.join()

```

```text
Main thread is not blocked
Start
End
```

## 코루틴

- [코루틴에 대한 자세한 설명이 적힌 글귀](https://dojang.io/mod/page/view.php?id=2418)

위 글을 읽어보면 코루틴의 원리를 대충이나마 파악할 수 있다. 결국 TCB, PCB 처럼 특정 구간만 코드를 실행시키고 상태를 저장시켰다가 다시 불러올 수 있는 구조이다. (그리고 그 상태는 다음 yield 직전까지의 상태이다.)
다만 전 섹션에서 살펴보았듯이, 디폴트로는 이것은 모두 싱글 스레드 내에서 실행되고 멀티 스레드로하고 싶다면 다른 멀티스레딩 라이브러리를 사용해야한다.

## 결론

파이썬에서는 JS와 다르게 이벤트 루프가 명시적으로 구현되며, 기본 실행 환경의 일부로 포함되지 않는다. 이는 비동기 프로그래밍(async/await)과 스레드 관리가 더욱 분리된 형태로 설계되었음을 보여준다.
JS에서는 "async await 쓰면 내가 알아서 메인 스레드 바깥에서 관리해주고 처리해줄게"의 느낌인 반면, 파이썬에서는 "async await 쓰면 메인 스레드 내에서 기본적으로 다 처리되고 추가적으로 스레드나 프로세스 관리가 필요할 수 있어"라는 느낌이다.

내부 구현이 다를 뿐 원하는 동작은 파이썬에서도 가능하다. promise.all과 유사한 asyncio.gather과 같은 함수를 쓰면 파이썬에서도 메인 스레드 내에서 IO작업은 블로킹 없이 여러 개의 요청을 처리할 수 있다.
