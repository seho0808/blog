---
slug: "/"
date: "1997-08-08"
title: "seholee.cv"
subtitle: "Home | Web Dev / Software Engineer Seho Lee"
---

## 안녕하세요, <br/> **웹 개발자 이세호** 입니다.

프론트엔드와 백엔드에 모두 관심이 있으며, 다양한 환경에서 풀스택 개발자로서 일했습니다. <br/>
총 <span class="text-skyblue">네 번의 프로덕션 경험</span>이 있습니다. 중견기업 납품, 인하우스 B2C 마케팅 플랫폼 제작, <br/>
군 인트라넷 체계 개발, B2C 플랫폼 1인 개발 등 모놀리식 아키텍처 위주의 프로젝트 경험이 있습니다. <br/>

항상 <span class="text-orange">기대 이상의 것</span>을 만들어내는 것을 추구합니다. 업무가 주어질 때 100% 빈틈 없는 디자인이나 <br/>
기획은 존재하지 않는다고 생각합니다. <span class="text-green">소통과 공부</span>로 그 빈틈을 기대 이상으로 채우는 것이 <br/>
개발자로서 보람을 느낄 수 있는 부분이라고 생각합니다. <br/>

<br/>

<h2 class="subtitle"> &lt;/&gt; 직무 경험 </h2>

**카카오** &nbsp;<span class="text-grey">카카오 커머스기술팀</span> <br/>
FE 인턴 &nbsp;2024-01&#126;2024-02 <br/>
<span class="text-grey">Vanilla JS, Typescript</span> <br/>

- 페이지 빌더 개발 <br/>

  - 이커머스 페이지를 드래그 드랍으로 구성할 수 있는 <span class="text-pink">노코드 툴 제작 (바닐라 JS)</span>
  - innerHTML, createElement, Web Component 등의 WebAPI를 비교분석하며 사용. <a href="/blog/inner-html-vs-create-element/"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a>
  - DOM 수동 조작, Diffing, Key 등 <span class="text-green">렌더링 최적화를 위해 여러 구조를 구현</span>해보고 장단점을 비교분석함.
  - 유지보수의 편의를 위해 커밋과 PR 관리를 잘게 쪼개고 알맞은 단위로 정리하는 방법을 배움.

<br/>

**국방부** &nbsp;<span class="text-grey">대한민국 국방부</span> <br/>
SW 개발병 &nbsp;2022-01&#126;2023-07 <br/>
<span class="text-grey">전자정부프레임워크, Spring 3.0&#126;3.8, Cubrid, Tensorflow</span> <br/>

- AI 모니터링 체계 대시보드 개발 <br/>

  - <span class="text-red">초 단위</span>로 업데이트되는 대시보드를 <span class="text-yellow">순수 JS</span>와 <span class="text-orange">WebAPI</span>만으로 개발
  - CPU 데이터를 표기해주는 차트를 Chart.js로 구현
  - Figma를 통한 기초적인 화면 디자인 <a href="https://www.figma.com/proto/7rmPe8ksPJyFLjVAxSOuI9/aimon?type=design&node-id=20-1070&t=qH1siTP1d4N3EDII-1&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=42%3A885&show-proto-sidebar=1&mode=design"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a>

- AI 모니터링 체계 백엔드 개발 <br/>

  - 다수의 서버에서 초 단위로 CPU와 메모리 정보 수집
  - 60초 단위로 Poke하며 응답 상태에 따라 서버 건강을 진단
  - <span class="text-green">수백만 개</span>의 CPU데이터에서 일부를 빠르게 추출하기 위해 <span class="text-pink">인덱스</span>를 활용

- AI 모니터링 체계 머신러닝 모델 개발 <br/>

  - Tensorflow로 Transformer 모델의 Encoder만을 사용하여 시계열 모델 틀 제작 (2인 개발)
  - CPU/메모리/유저 행동 이벤트 세 가지를 90초 단위로 넣어 미래 60초의 CPU 부하를 판별하는 모델 개발
  - 정확도 0%에서 기존의 <span class="text-purple">오랜 리서치</span>와 <span class="text-skyblue">우연한 계기</span>로 거짓 긍정 오답률을 높이면 정확도가 <span class="text-green">20%이상으로 상승함을 발견</span>

  - Worst Case를 20~30%확률로 예측할 수 있는 모델을 파이썬 서버로 배포
  - 모델의 CPU 예측 근거를 산출하기 위해 XAI 논문 다수 리서치

- <span class="text-orange">유저 데이터 수집</span> 스크립트 개발 <br/>

  - 유저의 행동 하나 하나를 트래킹하기 위해 이벤트 핸들러로 모든 DOM 엘리먼트의 클릭 이벤트 수집
  - 오래된 체계가 &lt;Frame&gt;태그로 개발되어있어, 재귀로 이벤트 핸들러 부착
  - <span class="text-yellow">CORS 우회</span>를 위해 Google Analytics의 방식을 모방하여 <span class="text-blue">img태그의 src 파라미터</span>로 데이터 전송

- 인트라넷 체계 유지보수

  - 배포 직전인 인트라넷 체계 중 하나를 배포 기준에 맞도록 보안성 검토 기반으로 수정
  - 오류 방지를 위해 일부 VARCHAR 필드를 ENUM으로 변경

<br/>

**스마일드래곤** &nbsp;<span class="text-grey">다수의 마케팅 플랫폼으로 연 매출 80억 이상을 달성한 회사</span> <br/>
풀스택 개발자 &nbsp;2021-01&#126;2021-09 <br/>
<span class="text-grey">Next.js 10, MariaDB, Typescript</span> <br/>

- 체험뷰 <a href="https://chvu.co.kr"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a> 4인 개발 총괄

  - PHP로 개발된 기존 웹사이트를 재개발하여 <span class="text-red">5초가 넘게 걸리던 초기 렌더링을</span> <span class="text-green">0.2~0.5초로 감소</span> (FCP 기준)
  - 2021년 배포한 상태에서 큰 업데이트 없이, 2023년 10월 기준 <span class="text-yellow">누적 5만명의 유저</span>와 <span class="text-orange">일일 수천명의 접속자</span>를 기록
  - 이미지가 많은 플랫폼이었기에, 이미지 별 압축 알고리즘을 상이하게 적용시켜 <span class="text-blue">로드 속도 최적화</span>
  - 캠페인 페이지(/campaign)의 스크롤 Lazy Loading, UI Skeleton 구현으로 로드 속도 개선
  - 장기적 생산성을 높이기 위해 <span class="text-skyblue">수시로 리팩토링과 추상화</span>
  - 무통장 입금 API 연동, PASS 인증 API 연동

- <span class="text-purple">SEO</span> 업무

  - 체험뷰를 포함한 스마일드래곤의 <span class="text-pink">열 개 이상의 웹사이트</span>들이 html 수정, 메타데이터 수정과 백링크 작업 <br/> 등을 거치도록 하여 특정 키워드에 대해 구글과 네이버에서 <span class="text-purple">검색 순위 상위권</span> 달성

- 개발팀 업무 기준 확립

  - 커밋 컨벤션을 정하여 티켓 번호와 태그가 포함된 커밋 메시지 규칙 정립
  - 기술문서 작성 제도를 정립하여 전체적인 아키텍처, 기능 별 작동 플로우, 작동 세부사항 정리

- 산업기능요원 현역 TO 취득

<br/>

**윌비시티필드** &nbsp;<span class="text-grey">시드 투자 20억의 테크 스타트업</span> <br/>
프론트엔드 개발자 &nbsp;2020-06&#126;2020-12<br/>
<span class="text-grey">React, Firebase</span> <br/>

- 넵스 스마트 오피스 솔루션 개발

  - 좌석과 회의실 이용률을 한 눈에 볼 수 있는 대시보드를 기획 및 개발
  - 캘린더에서 시작과 끝나는 날짜를 편리하게 터치할 수 있는 회의실 예약 기능 개발
  - 좌석 예약 기능/백오피스 기능 개발 참여

- 직장인 테마 MBTI 개발
  - 직장인을 테마로 한 MBTI 테스트를 기획 및 개발하여 <span class="text-yellow">일일 방문자 최고 2천명 기록</span>

<br/>
<br/>

<h2 class="subtitle"> &lt;/&gt; 사이드 프로젝트 </h2>

**VHUB 글로벌 버튜버 플랫폼** <a href="https://vhub.club"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a> &nbsp;2023-07&#126;2023-09 <br/>
<span class="text-grey">Next.js 13, Supabase, Node.js</span> <br/>

- 기획, 디자인, 개발 모두 1인으로 <span class="text-blue">9주</span> 동안 진행한 플랫폼
- Next.js와 Supabase 연동 중 <span class="text-red">공식 문서가 부족</span>한 상태에서 소스 코드를 읽으며 <span class="text-green">직접 분석하여 효율적으로 연동</span>

  - React cache로 createServerComponentClient를 래핑하여 <span class="text-orange">요청 당 하나의 DB 커넥션</span>이 유지되도록 구현
  - 소스 코드에서 싱글톤 체크를 확인하여 createClientComponentClient를 useEffect로 컴포넌트 별 구현

- 최소한의 리소스로 안정적인 서비스를 유지하기 위해 백엔드와 프론트엔드에서 <span class="text-skyblue">단계적인 캐싱을 설계</span>
  - 프론트엔드에서 반복 사용되는 데이터는 레이아웃 컴포넌트에 useSWR로 캐싱
  - 동일한 유명 버튜버가 자주 검색되는 점을 파악하여 Nex.js 13 fetch 웹 서버 캐싱을 이용하여 <br/>
    <span class="text-green">API 응답 속도 250% 개선</span> (뉴욕 서버, 뉴욕 클라이언트 기준 100ms에서 40ms로 개선) 및 DB 부하 분산
- 유튜브, 트위치의 실시간 방송 관련 API 연동
- 데이터 수집을 위해 웹사이트들을 실시간으로 크롤링 하는 각종 스크립트 개발 (10분~1시간 주기)

<br/>

**군용 채팅앱 미어캣** <a href="https://github.com/osamhack2022-v2/APP_Meerkat_IQDan"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a> &nbsp;2022-11 <br/>
<span class="text-grey">React Native, MariaDB, Prisma</span> <br/>

- 2022 군장병 공개 SW 해커톤 <span class="text-orange">3등</span> (정보통신산업진흥원장상)
- <span class="text-yellow">종단간 암호화</span>(E2EE)를 1대1 방식, 다대다 방식으로 구현
- AsyncStorage를 이용한 메시지 로컬 저장 및 매니징

<br/>
<br/>

<h2 class="subtitle"> &lt;/&gt; 학력 </h2>

**버지니아 공대** &nbsp;2016-08&#126;2020-05 <br/>

- 전공 - Computational Modeling & Data Analytics
- 부전공 - Computer Science, Mathematics, and Statistics
- 학점 - 3.39/4.00

<br/>
<br/>

<h2 class="subtitle"> &lt;/&gt; 출판 </h2>

**2021 Geothermal Energy 논문 기고** <a href="https://geothermal-energy-journal.springeropen.com/articles/10.1186/s40517-021-00200-4"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a>

- 학부 4학년 때 박사, 교수님들이 정립한 이론을 바탕으로 <span class="text-purple">직접</span> 지열 예측 머신러닝 모델을 구현/훈련
- 지하 3km 지열 예측을 위해 기존의 물리 모델을 머신러닝으로 정확도 개선
- 2024년 3월 기준 <span class="text-pink">21회의 인용</span>

**2016 IEEE 논문 기고 <a href="https://ieeexplore.ieee.org/document/7428573"><img class="link-icon" src="/icons/link-variant.svg" alt="link"/></a>**

- 목소리 감정인식 알고리즘의 기초적인 하이브리드 알고리즘이 컨퍼런스에서 통과되어 아카이빙

<br/>
<br/>

<h2 class="subtitle"> &lt;/&gt; 자격증 및 시험 </h2>

- 정보처리기사 (2020년)
- IBT TOEFL 108 점 - Reading 27, Listening 29, Speaking 29, Writing 23 (2020년)
- AWS Certified Solutions Architect Associate (2020년)
