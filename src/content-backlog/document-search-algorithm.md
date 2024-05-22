---
slug: "/blog/document-search-algorithm"
date: "2024-05-21"
title: "문서 검색 알고리즘"
subtitle: "문서 검색 알고리즘을 공부해보자"
---

## **문서 검색 알고리즘**

<p class="text-time">최초 업로드 2024-05-21 / 마지막 수정 2024-05-21</p>

_해당 포스트에서는 string search(스트링의 등장 위치 검색)가 아닌 full text search(키워드로 문서 검색)의 모든 옵션들을 두루 살펴봅니다._

rndcircle에 합류하면서 가장 처음 받은 미션은 "연구실 데이터 검색 시스템 구축"이다. 사실 검색 시스템이라고 해봤자 지금 당장의 데이터 수는 3만개의 행과 10개 남짓의 열 정도이다.
대신 각 엔트리 마다 수많은 텍스트 데이터가 들어가 있다. 이 정도면 아무 DB에 넣고 Full-Text Search 인덱싱 기법 중 하나를 선택해서 적용하면 될 것이라고 생각했다.

하지만 앞으로 스케일러블한 시스템을 만들기 위해서는 좀 공부가 더 필요했다. 당장은 데이터가 적지만 세계의 모든 연구실 데이터를 다 파싱해놓는다는 가정(100만개의 행과 각 열마다 많은 양의 비정형 텍스트 데이터)하에 가상의 시스템을 설계해보자.

선택지들을 먼저 공부해보자.

- RDBMS - Full-Text Search
- NoSQL - Lucene / Elastic Search
- BM25 - tf-idf variant
- Embedding Search (BM25 앙상블 혹은 Approximate Nearest Neighbor로 최적화)

RDBMS와 NoSQL 모두 결국에는 단어 인덱싱의 종류이다. 단어를 어떻게 토큰화하고 관리하는지에 따라 구현이 갈릴 뿐이다. 직접 테스팅하지 않고 짧게만 리서치해본 결과 Elastic Search는 RDB보다 훨씬 인덱싱을 상황에 맞게 [튜닝](https://stackoverflow.com/questions/20515069/elasticsearch-vs-sql-full-text-search)할 수 있고 scalability가 높다고한다. 이에따라 Elastic Search이 설정은 복잡하지만 데이터가 많을 때 훨씬 더 빠르다고 한다.

Embedding으로 검색하는 것은 벡터 기반 검색이다. 전통적인 인덱싱과는 차이가 있다. 각 문서마다의 벡터 값과 검색하는 벡터값과의 거리 계산을 해야하기 때문이다. 고로 전통적인 inverted indexing이 아닌 Vector Indexing을 사용한다고 한다.

## **RDBMS Full-Text Search의 원리?**

## **Elastic Search의 Inverted Index 원리?**

## **벤치마크: RDBMS Inverted Index vs Elastic Search Inverted Index**

- 나중에 시스템이 커져서 정말로 Elastic Search를 사용해야한다면 조심해야한다. DB와 Elastic Search를 같이 사용하면 ES에서 DB 정보를 실시간 Sync해줘야하는데 이게 머리아플 것이다.
- 실시간 Sync는 조금 어렵기 때문에 로그 정리 후 OLAP과 비슷한 용도로 많이 사용하는 듯하다.
- Elastic Search 다음으로는 Splunk, Solr 이 두 가지가 반, 반의반 정도의 점유율을 보이고, 나머지들은 거의 롱테일 수준이다.
- Elastic Search를 메인 DB로 쓰면 단점이 많다고 한다. => rndcircle의 경우에는 transactional db처럼 많은 write이 일어나지 않아서 read 위주로 일어나기에 메인 DB로도 괜찮을 수 있다.
- 현재 DB에서 FTS를 이미 쓰고 있다면 문제가 있지 않은 이상 굳이 Elastic Search를 사용하는 것은 오버킬 + 오버엔지니어링 + 오버프라이스 일 수 있다.

## **BM25 원리**

이제부터는 위에서 보았던 전통적인 DB 접근 방식이 아닌 ML(통계학 + 컴공 + 수학)에서 출발한 알고리즘들에 대해 알아볼 것이다. 참고로 아래에 있는 알고리즘(BM25, 벡터 기반 검색)들을 Elastic Search에서도 제공한다. 고로 "Elastic Search vs 다른 시스템"이 아니라 "전통적인 Inverted 인덱싱 방식" vs "BM25" vs "임베딩 인덱스 방식"이다. <span class="text-orange">본질에 접근하려면 Elastic Search, Pinecone, Weaviate, RDBMS의 플랫폼적 비교가 아니라 인덱싱 방식 자체를 비교해야한다. 각 DB마다 인덱싱 방식이 일부 구현되어있을 수도 있고 아닐 수도 있기 때문이다.</span>

BM-25의 공식은 다음과 같다.

$$
\text{score}(D, Q) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}
$$

- $D$는 점수 산출하려는 문서
- $Q$는 q1,..., qn의 단어 모음
- $score(D, Q)$가 최종 BM25값
- $f(q_i, D)$는 문서 $D$에서 $q_i$의 빈도수
- $IDF(q_i)$는 공식이 조금 복잡하다. 아래의 idf와 유사한 느낌인데 더 복잡하다. 결국 요지는
-

tf-idf(term frequencey-inverse document frequency)공식과 유사하다.

$$
\text{TF-IDF}(t, d) = \text{TF}(t, d) \cdot \text{IDF}(t)
\text{IDF}(t) = \log \left(\frac{N}{\text{df}(t)}\right)
$$

- $N$은 총 문서 개수
- $df(t)$는 문자열 t를 포함하고 있는 문서의 개수

그냥 tf-idf에 기능을 조금 더 달아놓은 것이라고 이해하면 될듯하다. inverted index처럼 각 문서마다 단어들의 등장 빈도 등을 저장해두고 검색 해야할듯싶다. 실제 [Weaviate BM25 doc](https://weaviate.io/developers/weaviate/search/bm25)을 참고해보면 개별적으로도 검색 알고리즘으로 사용되고 Vector 서치와 Hybrid로도 사용될 수 있는 것을 볼 수 있다. [벤치마크 예시](https://about.xethub.com/blog/you-dont-need-a-vector-database)에서 Embedding Search vs Embedding Search 속도 비교를 볼 수 있으며 다다음 섹션에서 벤치마크에 대해 조금 더 자세히 설명한다. BM25 혼자만으로도 꽤 높은 정확도를 보이기에 BM25가 라이브러리들에 구현되어있다.

## **Embedding Search 원리**

임베딩 자체의 설명은 해당 포스트에서는 생략하겠다. 임베딩을 정확히 어떤 디멘션으로 만들고 사용하는지에 초점을 두겠다.
임베딩 서치는 대부분 벡터 데이터베이스를 사용하고 있다. 벡터 데이터베이스는 벡터 인덱스라는 새로운 종류의 인덱싱을 사용한다.
벡터 인덱싱의 종류들 중 approximate하게 측정하는 것이 곧 ANN(Approximage Nearest Neighbor)의 종류들이다.

- flat indexing: 인덱싱이라고 부르기도 애매한 방식이다. Brute Force로 raw하게 벡터들을 거리계산한다. (KNN 알고리즘과 동일하다) 이게 인덱싱이라고 불리는 이유는 추측컨데 index자체가 없으면 데이터에 대한 검색 자체가 안되기 때문에 raw한 벡터들을 매핑해놓고 Brute force하는 것을 flat index라고 부르는듯하다.
- HNSW (graph indexing): Hierarchical Navigable Small World는 ANN의 한 종류이다.

Embedding Search의 병목은 두 가지이다: 벡터로의 변환 + 가장 가까운 벡터 찾기 (O(벡터개수\*벡터길이))

- 벡터로의 변환 속도 최적화는 모델 경량화가 정론인듯하다. (이미 핸들링 되어있는 모델들은 DistilBERT, MobileBERT, TinyBERT)
- 가까운 벡터 찾기 속도 최적화는 Approximate Nearest Neighbor을 사용한다. (Faiss, Annoy, HNSW 등 매우 다양한 기법이 있다)

## **벤치마크: BM25 vs Embedding Search**

BM25는 나이브하지만 강력하다. Embedding Search보다 근소하게 정확도가 낮다. 그래서 [RAG구축 아티클](https://about.xethub.com/blog/you-dont-need-a-vector-database)에서는 성능 벤치마크를 한 이후에 내린 결론이 BM25로 top 50결과를 추출한 이후에 Embedding Search로 순위 재조정하는 것이다. 이렇게하면 훨씬 정확한 앙상블 메서드가 된다고 한다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/document-search-algorithm/bm25-embedding-ensemble.webp" alt="embedding ensemble"/>
  <sub class>그림 1. 출처: https://about.xethub.com/blog/you-dont-need-a-vector-database</sub>
</div>

위의 앙상블 방식을 쓰지 않고 Embedding Search + ANN만을 사용하는 (이전 섹션에서 언급했음) 방식도 가능하며, 가벼운 구현을 하고 싶다면 BM25도 가능하리라 보여진다. BM25만 쓰면 인덱싱이 어려워서 속도가 더 느릴수도?

## **추측 벤치마크**

Elastic Search에 우리가 언급했던 모든 인덱싱이 이미 구현되어있다.
임베딩 서치가 의미가 있으려면 전통적인 inverted indexing보다 유의미하게 정확도나 속도가 빨라야할 것이다. 벤치마크 논문들을 찾아보자:

-

## **실제 벤치마크**

추측이 맞는지 실제로 샘플 데이터셋으로 비교를 해보자.
