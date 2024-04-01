---
slug: "/blog/npm-yarn-pnpm"
date: "2024-04-01"
title: "npm vs yarn vs pnpm"
subtitle: "npm, yarn, pnpm의 차이점을 분석해보자"
---

## **npm vs yarn vs pnpm**

<p class="text-time">최초 업로드 2024-04-01 / 마지막 수정 2024-04-01</p>

#### npm

2009년에 node가 나오면서 npm도 같이 생겼다고 한다. 어제 [node 다큐멘터리](https://www.youtube.com/watch?v=LB8KwiiUGy0)를 보면서 알았다. 


#### yarn 
등장 배경: 
2016년에 react팀에서 Sebastian McKenzie에 의해 npm의 단점을 보완하기 위해 출시했다. 출시 당시 보완점은 아래와 같다.

1. 성능: 같은 PC에서 다운받았던 패키지는 local cache에 있으면 가져다 써서 더 빠름.
2. 성능: 가능하다면 패키지 인스톨을 병렬처리로해서 더 빠름.
3. 안정성: yarn.lock이라는 lock파일을 도입하여 npm에서 개발자 컴퓨터마다 특정 파일들의 버전이 많이 다른 문제를 해결했다.
4. 보안: yarn registry에 등록된 checksum을 통한 검증으로 패키지가 유효한지 (해커가 넣은 것이 아닌지 등) 확인이 가능함.

=> npm에서는 위와 같은 내용들을 다시 보완해서 2024년 현재에는 yarn과 npm이 거의 유사하다고 함.

#### pnpm 
등장 배경: 
2016 년 경에 Alexander Gugel이 만들었다고 함.
아래 특이사항은 [링크](https://pnpm.io/motivation)에서 확인가능.

1. 성능: node_modules 여러 프로젝트에 거쳐서 겹쳐있는 것들이 차지하는 디스크 스페이스를 줄이기 위해 글로벌 공통 스토어를 쓴다고함.
2. 성능: Resolving, Fetching, Linking을 async하게 진행해서 더 빠르다고 함.

=> pnpm의 어프로치는 npm이나 yarn과는 상당히 달라서 자주 패키지를 설치하는 PC에서는 pnpm이 압도적으로 유리할 수 있음.

=> 나중에 써봐야 어떤 느낌일지 알듯함. 아직 안써봐서 모름.
