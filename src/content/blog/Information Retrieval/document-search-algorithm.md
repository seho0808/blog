---
slug: "/blog/document-search-algorithm"
date: "2024-05-21"
title: "문서 검색 알고리즘"
subtitle: "문서 검색 알고리즘을 공부해보자"
---

## **문서 검색 알고리즘**

<p class="text-time">최초 업로드 2024-05-21 / 마지막 수정 2024-05-25</p>

_<span class="text-purple">해당 포스트에서는 string search(스트링의 등장 위치 검색)가 아닌 full text search(키워드로 문서 검색)의 모든 옵션들을 두루 살펴봅니다.</span>_

**리서치가 아직 완벽하지 않은 포스트입니다.**

rndcircle에 합류하면서 가장 처음 받은 미션은 "연구실 데이터 검색 시스템 구축"이다. 사실 검색 시스템이라고 해봤자 지금 당장의 데이터 수는 3만개의 행과 10개 남짓의 열 정도이다.
대신 각 엔트리 마다 수많은 텍스트 데이터가 들어가 있다. 이 정도면 아무 DB에 넣고 Full-Text Search 인덱싱 기법 중 하나를 선택해서 적용하면 될 것이라고 생각했다.

하지만 앞으로 스케일러블한 시스템을 만들기 위해서는 좀 공부가 더 필요했다. 당장은 데이터가 적지만 세계의 모든 연구실 데이터를 다 파싱해놓는다는 가정(100만개의 행과 각 열마다 많은 양의 비정형 텍스트 데이터)하에 가상의 시스템을 설계해보자.

선택지들을 먼저 공부해보자.

- RDBMS - Full-Text Search Inverted Index (빈도수 점수)
- NoSQL - Lucene / Elastic Search Inverted Index (빈도수 점수)
- Elastic Search와 여러 Vector DB에 구현되어있는 Vector Search (Embedding 거리 점수)

벡터 검색을 빼면 모두 결국에는 단어 인덱싱+빈도수로 검색한다. 단어를 어떻게 토큰화하고 관리하는지에 따라 구현이 갈릴 뿐이다. 직접 테스팅하지 않고 짧게만 리서치해본 결과 Elastic Search는 RDB보다 훨씬 인덱싱을 상황에 맞게 [튜닝](https://stackoverflow.com/questions/20515069/elasticsearch-vs-sql-full-text-search)할 수 있고 scalability가 높다고한다. 이에따라 Elastic Search이 설정은 복잡하지만 데이터가 많을 때 훨씬 더 빠르다고 한다.

Embedding으로 검색하는 것은 벡터 기반 검색이다. 전통적인 인덱싱+빈도수 기법과는 차이가 있다. 각 문서마다의 벡터 거리 계산을 해야하기 때문이다. 고로 전통적인 inverted indexing이 아닌 Vector Indexing을 사용한다고 한다. 아직 리서치가 완벽하지 않다. 벡터 인덱싱은 기법이 복잡하고 다양하기에 다음 포스트에서 따로 다루겠다. 그 후에 이 포스트 또한 정갈하게 업데이트하겠다.

|                  | 빈도수             | 임베딩            |
| ---------------- | ------------------ | ----------------- |
| 속도             | 상대적으로 빠름    | 상대적으로 느림\* |
| 문맥 파악        | X                  | O                 |
| 정확한 매칭 검색 | O                  | X                 |
| 리소스           | 상대적으로 Low     | 상대적으로 High   |
| 전반적인 정확도  | 상대적으로 덜 정확 | 상대적으로 정확   |

[\*100만개 데이터 포인트가 넘어가면 임베딩이 더 빨라진다.](https://haystack.deepset.ai/benchmarks)

<br/>

### **RDBMS FTS의 원리?**

자세한 내용은 [RDB FTS 포스트](https://seholee.com/blog/rdb-full-text-search-indexing) 참고.

- [Mysql에서의 Full-Text Search](https://dev.mysql.com/doc/refman/8.3/en/fulltext-search.html) ([쉬운 한글 설명](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%ED%92%80%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%9D%B8%EB%8D%B1%EC%8A%A4Full-Text-Index-%EC%82%AC%EC%9A%A9%EB%B2%95))

  - default parser 혹은 ngram parser 혹은 MeCab parser 세 개중에 선택 가능.
  - default parser 혹은 MeCab 사용 시 세 가지 방식의 Search가 있다고함: 자연어검색, Boolean 검색, 쿼리 확장 검색
  - Stopword들을 지정해서 그 단어들을 배제하며 인덱스를 생성시켜서 효율적인 관리가 가능함.

- [Postgresql에서의 Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
  - [tsvector](https://www.postgresql.org/docs/current/datatype-textsearch.html)로 lexemes를 만든다. lexeme 변환은 소문자화, 어근 추출들이 포함되어있다.
  - tsvector의 결과를 gin이나 rum이라는 역색인 함수에 넣어서 저장한다.
  - tsquery로 검색을 한다.
  - 읽으면서 개인적으로 느낀점은 영어와 같이 단어가 잘 나누어지는 언어에는 좋아보이지만 일어와 중어처럼 띄어쓰기가 애매한 동양언어에서는 잘 작동할지가 의문이다. 잘 작동하지 않기에 형태소 분석기를 사용하는듯하다. [mecab-ko를 사용하는 예시](https://taejoone.jeju.onl/posts/2024-01-27-postgres-16-korean/)가 있다.

<br/>

### **Elastic Search의 원리?**

Node라는 단위로 여러개의 가상의 객체로 샤드들을 나누어 저장한다. 마치 쿠버네티스를 연상케하는 구조이다. 스케일링에 좋아보이고 인덱스 하나에 대해 검색을 할 때 여러 개의 Node들에서 병렬로
처리하기에 속도가 더 빠를 수 있다고 한다. 하나의 PC내에 여러 개의 노드가 있다면 멀티스레드를 최대한 사용한다는 느낌이 아닐까 싶다. 여기서 내가 드는 생각은, Postgresql 같은 DB도 파티셔닝하면 병렬 처리가 가능한데 그러면 Elastic Search 속도에 비빌 수 있지 않을까?라는 점이다. 상황에 따라 다를 수 있겠지만 정확한 벤치마크를 찾고 싶다. 근데 애초에 NoSQL이 파티셔닝 환경에서 더 퍼포먼트하다는 것으로 알고 있기에 설정하기는 아마 Elastic Search가 더 간단하려나라는 생각이다.

=> 해당 문단은 뇌피셜 덩어리라서 나중에 더 많이 공부하다보면 많이 바뀔 수 있는 내용이다.

<br/>

### **RDBMS vs Elastic Search**

- 나중에 시스템이 커져서 정말로 Elastic Search를 사용해야한다면 조심해야한다. DB와 Elastic Search를 같이 사용하면 ES에서 DB 정보를 실시간 Sync해줘야하는데 이게 머리아플 것이다.
- 실시간 Sync는 조금 어렵기 때문에 로그 정리 후 OLAP과 비슷한 용도로 많이 사용하는 듯하다.
- Search Engine 중 Elastic Search 다음으로는 Splunk, Solr 이 두 가지가 반, 반의반 정도의 점유율을 보이고, 나머지들은 거의 롱테일 수준이다.
- Elastic Search를 메인 DB로 쓰면 단점이 많다고 한다. => rndcircle의 경우에는 transactional db처럼 많은 write이 일어나지 않아서 read 위주로 일어나기에 메인 DB로도 괜찮을 수 있다.
- 현재 DB에서 FTS를 이미 쓰고 있다면 문제가 있지 않은 이상 굳이 Elastic Search를 사용하는 것은 오버킬 + 오버엔지니어링 + 오버프라이스 일 수 있다.
- Elastic Search와 RDB의 벤치마크가 참고하기 좋은 것들이 많지는 않았는데 전반적으로 튜닝에 따라서 좌우가 많이되고 Postgres 튜닝으로도 충분한 경우가 많았다.

<br/>

### **중점적으로 보아야하는 것**

"RDBMS vs Elastic Search vs Vector DB"가 쟁점이 아니라 "인덱싱+빈도수 방식" vs "임베딩 검색 방식"이 쟁점이다. <span class="text-orange">본질에 접근하려면 Elastic Search, Pinecone, Weaviate, RDBMS의 플랫폼적 비교가 아니라 인덱싱 방식 자체를 비교해야한다. 각 DB마다 인덱싱 방식이 일부 구현되어있을 수도 있고 아닐 수도 있기 때문이다.</span> 또 다른 중요한 점은 tf-idf/BM25는 단어의 빈도수가 중요하기에 "lexical / spelling similarity" 즉 스펠링과 정확한 단어 비교가 요점이고 임베딩 검색 방식은 "semantic similarity" 즉 문맥이 중요하다. "scoop"과 "ice cream"은 유사한 문맥이지만 단어 비교로는 잡히지 않는다. 그렇기에 Inverted index와 BM25는 데이터가 적어서 제대로된 임베딩 벡터를 만들기 어려운 유스케이스일 때에는 강력하게 작동하고 반대로 데이터가 매우 많다면 임베딩 검색이 압도적으로 정확도면에서 강력할 수 있다.

<br/>

### **BM25 원리**

BM25는 아래의 tf-idf(term frequencey-inverse document frequency)공식과 유사하다.

$$
\text{TF-IDF}(t, d) = \text{TF}(t, d) \cdot \text{IDF}(t)
$$

$$
\text{IDF}(t) = \log \left(\frac{N}{\text{df}(t)}\right)
$$

- $N$은 총 문서 개수
- $\text{df}(t)$는 문자열 t를 포함하고 있는 문서의 개수
- tf값은 하나의 다큐먼트 내에서 그 단어가 가지는 빈도수이다. fox가 10번 등장했고 총 1000개의 단어가 있다면 tf는 0.01이다.
- idf의 요점은 등장하는 단어들이 희귀한 단어인데 그 문서에 포함이 되어있다면 점수를 높게 주는 방식이다.
- 즉, 문서 안에서의 빈도수와 다른 문서에 비해서 얼마나 희귀한 단어가 등장하느냐의 곱이다.

BM-25의 공식은 다음과 같다.

$$
\text{score}(D, Q) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}
$$

- $D$는 점수 산출하려는 문서
- $Q$는 q1,..., qn의 단어 모음
- $score(D, Q)$가 최종 BM25값
- $f(q_i, D)$는 문서 $D$에서 $q_i$의 빈도수
- $\text{IDF}(q_i)$는 공식이 조금 복잡하다. $\text{IDF}(q_i) = \log \left(\frac{N - n(q_i) + 0.5}{n(q_i) + 0.5} + 1\right)$
  - $N$이 전체 문서 개수이다.
  - $n(q_i)$는 단어 $q_i$를 가지고 있는 문서의 개수이다.
  - 희귀한 단어를 문서가 가지고 있을수록 점수가 높아진다. weight가 너무 커지는 것을 막기위해 idf에는 log가 항상 들어간다.
- $k_1$과 $b$는 자유 파라미터라고 한다.
- $D$는 문서의 단어 개수이다. $avgdl$은 문서들의 평균 단어 개수이다. 다른 문서들에 비해 상대적으로 짧은 문서일수록 점수가 올라가고, 긴 문서일수록 점수가 떨어진다. 매우 흥미로운 점이다. 단어 개수가 많은 문서에 패널티를 주어서 문서끼리의 비교를 공정하게 한다는 것이다.

BM25는 tf-idf에 문서 길이 패널티와 추가 파라미터들을 달아놓은 것이라고 이해하면 될듯하다. inverted index처럼 각 문서마다 단어들의 등장 빈도 등을 저장해두고 검색 해야할듯싶다. 실제 [Weaviate BM25 doc](https://weaviate.io/developers/weaviate/search/bm25)을 참고해보면 개별적으로도 검색 알고리즘으로 사용되고 Vector 서치와 Hybrid로도 사용될 수 있는 것을 볼 수 있다. [벤치마크 예시](https://about.xethub.com/blog/you-dont-need-a-vector-database)에서 Embedding Search vs Embedding Search 속도 비교를 볼 수 있으며 다다음 섹션에서 벤치마크에 대해 조금 더 자세히 설명한다. BM25 혼자만으로도 꽤 높은 정확도를 보이기에 BM25가 라이브러리들에 구현되어있다. 참고로 BM25는 전통적인 인덱스들과 마찬가지로 Inverted Indexing을 사용한다.

<br/>

### **Vector(Embedding) Search 원리**

임베딩 자체의 설명은 해당 포스트에서는 생략하겠다. 임베딩 서치는 대부분 벡터 데이터베이스를 사용하고 있다. 벡터 데이터베이스는 벡터 인덱스라는 새로운 종류의 인덱싱을 사용한다.
벡터 인덱싱의 종류들 중 approximate하게 측정하는 것이 곧 ANN(Approximage Nearest Neighbor)의 종류들이다. 인덱싱의 종류를 살펴보자:

- flat indexing: 인덱싱이라고 부르기도 애매한 방식이다. Brute Force로 raw하게 벡터들을 거리계산한다. (KNN 알고리즘과 동일하다) 이게 인덱싱이라고 불리는 이유는 추측컨데 index자체가 없으면 데이터에 대한 검색 자체가 안되기 때문에 raw한 벡터들을 매핑해놓고 Brute force하는 것을 flat index라고 부르는듯하다.
- HNSW (Hierarchical Navigable Small World)
- ANNOY (Approximate Nearest Neighbor Oh Yeah)
- Inverted File Index (IVF)
- LSH (Locality Sensitive Hashing)

위의 방식들은 복잡하고 내용이 방대해서 다음 포스트에서 빠른 벡터 검색 방식들만 따로 다룰 예정이다.

임베딩을 문장에서 추출하는 것과 단어에서 추출하는 것이 dimension이나 implication적으로 차이가 있을까?

- Word2Vec처럼 단어 마다 임베딩을 만들어주는 가벼운 임베딩 모델이 있는가하면 BERT, GPT, Sentence-BERT 등은 프로세싱을 거쳐서 문장 자체를 고정된 임베딩 벡터로 만들어준다.
- 문장으로 만든 임베딩 벡터는 문맥을 더 포함하고 있기에 정보량이 더욱 풍부하다.
- 텍스트 분류, 감정 분석 등에는 Word2Vec이 충분할 수 있다.
- 대화 시스템, 문서 요약, 번역 등은 문맥이 중요하기에 문장 벡터가 무조건적으로 용이하다.

Embedding Search의 속도 병목은 두 가지이다: 벡터로의 변환 + 가장 가까운 벡터 찾기 (O(벡터개수\*벡터길이))

- 벡터로의 변환 속도 최적화는 모델 경량화가 정론인듯하다. (이미 핸들링 되어있는 모델들은 DistilBERT, MobileBERT, TinyBERT)
- 가까운 벡터 찾기 속도 최적화는 Approximate Nearest Neighbor을 사용한다. (Faiss, Annoy, HNSW 등 매우 다양한 기법이 있다)

[Vector DB 순위](https://db-engines.com/en/ranking/vector+dbms)에 있는 벡터 DB들과 Elastic Search내부의 Vector 검색의 차이가 있을까? 최적화 정도의 차이가 있다고 한다. Elastic Search는 전통적인 검색 기능과 벡터 검색을 모두 서포트한다. 하지만 [벡터 검색의 기능들이 상당히 제한적](https://discuss.elastic.co/t/pros-and-cons-of-using-elastic-as-a-vector-database/338733)이라서 방대한 양의 텍스트로 벡터 검색을 할 예정이라면 Vector DB를 고려해볼만하다.

<br/>

### **벤치마크: BM25 vs Embedding Search**

BM25는 나이브하지만 꽤 강력하다. Embedding Search보다 근소하게 정확도가 낮다. 그래서 [RAG구축 아티클](https://about.xethub.com/blog/you-dont-need-a-vector-database)에서는 성능 벤치마크를 한 이후에 내린 결론이 BM25로 top 50결과를 추출한 이후에 Embedding Search로 순위 재조정하는 것이다. 이렇게하면 훨씬 빠르고 정확한 앙상블 메서드가 된다고 한다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/document-search-algorithm/bm25-embedding-ensemble.webp" alt="embedding ensemble"/>
  <sub class>그림 1. 출처: https://about.xethub.com/blog/you-dont-need-a-vector-database</sub>
</div>

위의 앙상블 방식을 쓰지 않고 Embedding Search + ANN만을 사용하는 방식(FAISS, HNSW, ANNOY)으로도 높은 정확도 튜닝이 가능하다. (모델과 데이터에 따라 다를듯하긴하다.)

<br/>

### **벤치마크: 빈도수 vs 벡터**

Elastic Search에 우리가 언급했던 모든 인덱싱이 이미 구현되어있다.
임베딩 서치가 의미가 있으려면 전통적인 빈도수 매칭보다 유의미하게 **정확도**나 **속도**가 빨라야할 것이다. 정확도와 속도가 가장 중요한 벤치마크이다. 벤치마크 논문들을 찾아보자:

- [전반적인 비교](https://blog.meilisearch.com/full-text-search-vs-vector-search/). 서론에서 이미 언급했던 내용이긴하다. 벡터는 맥락이 중요할 때 좋고 빈도수는 정확한 단어 매칭이 중요할 때 좋다.
- [Vector DB끼리의 비교](https://pureinsights.com/blog/2023/comparing-vector-search-solutions-2023/). Elastic Search는 ANN을 서포트하지 않는 것이 핵심이다.
- [Vector DB 인기 및 비용 비교](https://benchmark.vectorview.ai/vectordbs.html).
- [DPR(임베딩 기반)과 BM25(빈도수 기반)를 각 솔루션에서 사용했을 때를 비교](https://haystack.deepset.ai/benchmarks). 가장 중요한 벤치마크 자료이다.
  - Retriever Accuray 그래프에서 BM25가 하위권에 뭉쳐있고 벡터기반이 훨씬 높은 고지에 안착해서 뭉쳐있다.
  - Retriever Speed 그래프에서 `BM25/ElasticSearch`가 문서 수 300_000까지는 압도적으로 빠르다가 500_000이 넘어가면서 점점 HNSW가 빨라지는 것이 인상적이다.

결론:

- <span class="text-orange">정확도: 검색 정확도는 벡터 기반 DPR + HNSW가 모든 구간에서 압도적으로 정확함.</span>
- <span class="text-orange">속도: 수십만개의 데이터에서는 압도적으로 BM25가 빠름. 수백만개의 데이터에서는 HNSW가 빠름.</span>

<br/>

### **Elastic Search 한글 서포트?**

rndcircle에서 한글 서포트는 매우 중요하다. 벡터 DB는 벡터들을 생성해야하기 때문에 한글로 벡터들을 만들 수 있는 플러그인이 필요할 수 있다. Elastic Search에서 한글 서포트 및 다른 언어들이 서포트되는지 확인해보자. 찾아보니 [Nori라는 플러그인을 연동](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-nori.html)시켜야 한글 사용이 가능한 것으로 보인다. [Nori는 Elastic사에서 공식적으로 개발](https://esbook.kimjmin.net/06-text-analysis/6.7-stemming/6.7.2-nori)하는 형태소 분석기라고 한다. 문제는 Nori는 형태소 분석기이기 때문에 임베딩 벡터 자체를 만들 수는 없다. 그렇기에 외부에서 임베딩을 만들 수 있는 플러그인을 자체설정으로 도입을 해야하는 것으로 보여진다.

[2024년 1월 기준 Multilingual 분석을 사용하는 유스케이스](https://developers.redhat.com/articles/2024/01/10/multilingual-semantic-similarity-search-elasticsearch)가 있다. 여기를 보면
구글에서 무료 배포한 universal-sentence-encoder을 elastic search와 융합해서 사용한다.

<br/>

### **rndcircle의 유스케이스에 걸맞는 솔루션?**

rndcircle팀에서는 수많은 전문용어들이 존재하는 연구실들의 연구 정보들에 대해 문서 검색을 시행한다. 전문용어가 많기 때문에 fine tuning한 뉴럴넷이 없는 이상 제대로된 임베딩을 만들어낼 수 없으리라 생각된다. 그렇다면 비즈니스 플랜은 아래와 같다.

- 임시: 일단 RDBMS inverted indexing으로 임시 거처를 확보
- 안정화: Elastic Search로 최적화된 검색 시스템 확보
  - Elastic Search의 BM25와 Vector 옵션들이 rndcircle의 데이터에 어떻게 작동하는지 벤치마킹
  - Elastic Search 다양한 옵션들을 공부 => 벤치마크 => 배포 => 공부 => 벤치마크 => 배포를 반복하며 안정적인 시스템 확보
- 고도화: HuggingFace 모델 선택 후 임베딩 Fine Tuning + Vector DB로 벡터 검색 구현 및 고도화
  - 데이터가 쌓일수록 Vector DB의 효용이 커질 것으로 예상되므로 임베딩 벡터를 만들 수 있는 Fine Tuned 모델을 만들고 여러 Vector DB 솔루션들로 속도 / 정확도 테스팅
  - 그런데 고려할 점은 과연 Vector DB가 더 빠를까?이다. 정확도 & 속도 이 두 가지가 제일 중요한데, 정확도는 올라가도 속도가 빠른지는 테스팅을 해봐야알듯하다. - [벤치마크](https://haystack.deepset.ai/benchmarks) 상으로는 속도는 조금 느려지지만 정확도는 매우 빨라진다. 흥미롭게도 자료량이 100만개를 넘어가면 FAISS(HNSW)가 BM25를 추월할 것으로 예상한다. 대용량 자료에서는 Vector DB가 정확도 속도 모두 우세할 수 있다.
- 유저 UI상 정확한 단어 검색과 Vector 기반 검색을 선택지(selector) 혹은 화면 split으로 나누는 것도 방법일듯함.

<br/>

### **추가 정보**

추후 계속 추가 예정

- knowledge graph를 이용한 information retrieval 성능 개선 ([Knowledge Graphs: An Information Retrieval Perspective](https://staff.fnwi.uva.nl/m.derijke/wp-content/papercite-data/pdf/reinanda-2020-knowledge.pdf))

<br/>

### **참고 자료**

- [DB 랭킹](https://db-engines.com/en/ranking)
- [Vector DB vs BM25 벤치마크](https://haystack.deepset.ai/benchmarks)
- [Pinecone - Faiss: The Missing Guide](https://www.pinecone.io/learn/series/faiss/vector-indexes/)
