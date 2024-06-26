---
slug: "/blog/information-retrieval-metric"
date: "2024-05-24"
title: "Information Retrieval Metric"
subtitle: "정보 검색 평가 방식을 알아보자."
---

## **Information Retrieval Metric**

<p class="text-time">최초 업로드 2024-05-24 / 마지막 수정 2023-05-24</p>

문서 검색을 평가하려면 relevance 값을 precision 공식에 넣어야한다.

$$
\text{Precision} = \frac{\text{Number of Relevant Documents Retrieved}}{\text{Total Number of Documents Retrieved}}
$$

문제는 relevance값이 모호하다는 것이다. 위키피디아나 각종 소스들의 relevance를 설명하는 정보들은 애매모호하게 이해안되게 설명한다. 그냥 이해가 쉽게되려면 데이터셋들을 직접 보면서 예시를 피부로 느끼는 것이 매우 좋다고 판단했다. 데이터셋 마다 기준이 조금씩 다르다. 내가 찾은 대표적인 데이터셋들은 다음과 같다:

- [캐글 데이터셋 예시](https://www.kaggle.com/datasets/dmaso01dsta/cisi-a-dataset-for-information-retrieval/data?select=CISI.REL): QnA 형식. 질문의 대답을 쪼개어서 여러 개의 문단으로 나누고 정답을 1, 0 형식으로 제공
- [facebook 데이터셋 설명](https://haystack.deepset.ai/benchmarks): QnA 형식. 질문의 대답과 대답이 아닌 문장들을 랜덤하게 섞어서 대답이 포함되어있는지 1, 0 형식으로 제공.
- [Cranfield Collections](http://ir.dcs.gla.ac.uk/resources/test_collections/cran/): 오래된 초창기 IR데이터셋이며 작다고한다. 열어보니 QnA형식이고 -1~4 정수형식으로 점수가 매겨져있음.
- [TREC Collections](http://trec.nist.gov/data.html): TREC은 대부분의 IR과 웹 검색 알고리즘 벤치마크로 사용된다고 함. TREC에는 수십개의 주제별로 연도별 데이터셋이 정돈되어있다. [Law 관련 문서 중 하나](https://trec-legal.umiacs.umd.edu/guidelines/topic401.pdf)를 살펴본 결과 어떤 문서가 자신들이 정의한 "관련도 있음" 카테고리들 5가지에 충족될 때 관련있다고 정의한다. [Blog 예시](https://trec.nist.gov/data/blog/06/06.topics.851-900.txt)는 그냥 QnA 형식이다.

대부분 QnA 형식이거나 어떤 관련도 메트릭을 정의해놓고 그거대로 데이터셋을 수동으로 만든 형태이다.

rndcircle에서 현재 내가 생각하는 알맞은 솔루션은 논문의 abstract와 conclusion에서 키워드들을 tf-idf나 bm25로 여러 개 자동 추출한뒤, 키워드가 query이고 answer이 abstract+conclusion의 텍스트인 것이 좋을 것 같다. 이후 연구실 논문들의 매칭 점수를 합산한 것 & 평균낸 것 & median낸 것이 종합적인 검색 메트릭으로 작동해야한다. 이것의 단점은 tf-idf와 bm25에 데이터 relevance가 국한되는 것이다. 이외에도 수많은 방식을 고민해보아야한다.

<br/>

## **참고 자료**

- [harpribot/awesome-information-retrieval](https://github.com/harpribot/awesome-information-retrieval) - 수많은 IR 데이터셋을 정리해두었다.
