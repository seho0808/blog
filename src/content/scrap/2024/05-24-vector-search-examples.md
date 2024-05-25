---
slug: "/scrap/2024-05-24"
date: "2024-05-24"
title: "05-24 5 Use Cases for Vector Search"
subtitle: "5 Use Cases for Vector Search"
---

## **5 Use Cases for Vector Search**

<p class="text-time">최초 업로드 2024-05-24 / 마지막 수정 2024-05-25</p>

[원본 링크](https://rockset.com/blog/5-use-cases-for-vector-search/)

원본 링크에서는 다섯 가지 임베딩 검색 예시를 소개한다:

- [2019 - PinText: A Multitask Text Embedding System in Pinterest](https://medium.com/pinterest-engineering/pintext-a-multitask-text-embedding-system-in-pinterest-b80ece364555)
- [2022 - Introducing Natural Language Search for Podcast Episodes](https://engineering.atspotify.com/2022/03/introducing-natural-language-search-for-podcast-episodes/)
- [2023 - How eBay's New Search Feature Was Inspired By Window Shopping](https://innovation.ebayinc.com/tech/engineering/how-ebays-new-search-feature-was-inspired-by-window-shopping/)
- [2018 - Listing Embeddings in Search Ranking](https://medium.com/airbnb-engineering/listing-embeddings-for-similar-listing-recommendations-and-real-time-personalization-in-search-601172f7603e)
- [2018 - Personalized Store Feed with Vector Embeddings](https://medium.com/doordash/personalized-store-feed-with-vector-embeddings-251ad7a2c09a)

<br/>

### **2019 - Pinterest**

제너럴한 모델(multi-task model)을 만들어서 세 가지 기능에 똑같은 모델을 사용한다: 관련 핀, 검색, 홈 피드

쿼리스트링(q)과 관련 텍스트 데이터(p)를 다음과 같이 구성해서 묶어서 모델에 넣는다.

p는 "유저가 클릭했거나 저장한 핀에 대한 텍스트 데이터"로 고정이다. 하지만 q는 기능에 따라 다르다.

- 관련 핀 q: 선택된 주제
- 검색 q: 검색어
- 홈 피드 q: 사용자의 관심사

p와 q를 합쳐서 임베딩을 만든 후 해당 임베딩으로 검색한다.

결국 이미지에 대한 임베딩은 안쓰고 텍스트 기반 임베딩으로 모두 핸들링한다.

<br/>

### **2022 - Spotify**

- 검색어와 유사한 내용의 팟캐스트 검색을 위해 벡터 검색을 도입함.
- BERT는 문장 임베딩 보다는 단어 임베딩에 적합하여 다중 언어 + 문장 임베딩에 좋은 [Universal Sentence Encoder CMLM model](https://arxiv.org/pdf/2012.14388)를 썼다고 함.
- 팟캐스트 임베딩으로는 제목과 설명 등의 메타데이터를 사용했고, 검색어 임베딩으로는 검색어 텍스트를 써서 서로의 cosine similarity를 비교했다고함. (cosine similarity가 고차원에서는 euclidean보다 좋을 때가 훨씬 많기에 보통 cosine 쓰는듯함.)
- 정확한 키워드 매칭도 중요하기 때문에 elastic search와 vector search(vespa라는 서드파티 사용)결과를 합쳐서 보여줌.

<br/>

### **2023 - Ebay**

- 이미지 임베딩과 텍스트 임베딩 두 가지를 통해서 이미지 검색을 한다. (멀티 모달 모델이다.)
- "이미지"와 "제목" - 이 두 가지를 각자 encoder을 통과 시킨 후 서로 정답인 pair이면 서로 가까이 가도록하고 오답이면 서로 멀리가도록 하는 loss function을 사용한다. 그러면 알아서 인코더 내부 로직이 알맞은 이미지와 제목 페어링이 되도록 설정된다.
- 레이블링이 필요없기에 self-supervised이다.
- 해당 아키텍처는 Siamese Network 혹은 Contrastive Loss라고도 불린다.

<br/>

### **2018 - Airbnb**

- 450만개의 리스팅과 8억개의 검색 기록에서 어떤 순서로 사람들이 리스팅을 클릭했는지에 대한 데이터를 모아서 사용함.
- 기술적 방법:
  - 뉴럴넷 어프로치는 아님.
  - 처음에는 랜덤으로 모든 리스팅들을 벡터 공간에 뿌려놓음.
  - Sliding Window로 순차 방문 데이터들을 훑으면서 페이지 방문들이 같은 세션의 윈도우에 동시에 발생하면 벡터를 가까이가도록 하고 윈도우 내에서 발생안하면 멀리가도록 설정.
- "They found that the algorithm with vector embeddings resulted in a 21% uptick in CTR and 4.9% increase in users discovering a listing that they booked."
  - => 벡터 임베딩 도입으로 CTR 21% 증가, 예약할 곳을 찾을 확률 4.9% 증가

<br/>

### **2018 - DoorDash**

- word2vec을 조금 바꾼 store2vec이라는 알고리즘을 사용해서 유사한 가게를 찾을 수 있었음.
- store2vec:
  - 하나의 store(가게)은 단어 하나임.
  - 하나의 문장은 유저 세션에서 방문한 store(가게)들을 묶은 것임.
  - sliding window는 5로 했을 때 잘 나왔다고함.
  - 세션 마다 5개씩 묶인 상점들의 정보를 통해 모델은 가게들 간의 유사도를 벡터로 표현할 수 있음.
- store2vec 추천 시스템으로 CTR 5% 증가. => 에어비앤비의 성과에 비하면 꽤 미미한듯하다.

<br/>
