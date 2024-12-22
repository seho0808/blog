---
slug: "/blog/js-dev-python-event-loop"
date: "2024-12-22"
title: "JS 개발자가 본 파이썬의 이벤트 루프"
subtitle: "JS 개발자가 본 파이썬의 이벤트 루프"
---

## **JS 개발자가 본 파이썬의 이벤트 루프**

<p class="text-time">최초 업로드 2024-12-22 / 마지막 수정 2024-12-22</p>

V8과 다르게 파이썬에서는 이벤트 루프를 처리하는 동작 자체가 인터프리터에 포함되어있지 않다. 그렇기 때문에 파이썬에서는 이벤트 루프를 처리해 줄 스레드(큐, 태스크 관리를 위한)가 필요하다.

<br/>

`asyncio.run(main)`을 사용하게 되면 파이썬 인터프리터는 이벤트 루프를 실행하고 종료될 때까지 기다린다. 그렇기 때문에 메인 스레드는 블로킹된다.

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
