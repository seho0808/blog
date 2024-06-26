---
slug: "/blog/rdb-full-text-search-indexing"
date: "2024-05-25"
title: "RDB Full Text Search"
subtitle: "RDB에서 Full Text Search의 작동 원리를 공부해보자"
---

## **RDB Full Text Search**

<p class="text-time">최초 업로드 2024-05-25 / 마지막 수정 2024-05-25</p>

<br/>

MySQL과 Postgresql에서 full-text search가 어떻게 구현되어있는지 공부해보자.

<br/>

## **MySQL InnoDB**

<span class="text-orange">MySQL InnoDB는 세 가지 파서 옵션을 지원한다: 디폴트, ngram, MeCab</span>

InnoDB의 inverted index는 B-tree 계열 대신 "inverted lists"라는 자료구조를 사용한다는데 난 이게 무슨 뜻인지 아직도 정확하게는 모르겠다.

> _["InnoDB uses inverted lists for FULLTEXT indexes."](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)_

Inverted list라는게 inverted index각각 리스트 하나씩 갖고 있다는 뜻이지 일반적인 list에 inverted index key들을 나열해놓았을 리는 없을 것이다. 아마 sublinear하게 찾을 수 있는 B-tree, hashtable, trie 등의 계열일텐데 공식문서에 더 세부적으로 적혀있는 것을 찾지는 못했다. 예상하자면 "동물"이라고 검색하면 sublinear하게 inverted index list를 찾은 후 그 list 내에서는 O(n)으로 모두 읽는 식일 것이다.

<br/>

#### **디폴트 파서**

MySQL 디폴트 파서는 이름이 언급이 안되어서 처음에 문서를 읽으면 헷갈린다. 사실은 매우 단순하다. ngram이나 MeCab을 명시하지 않으면 자동으로 디폴트 파서를 쓴다.
디폴트 파서는 띄어쓰기, 콤마, 점을 delimiter으로 두고 문자를 나눈다. 나누어진 문자는 inervted indexing에 쓰인다.

디폴트 파서를 쓰면 세 가지 select 옵션을 사용할 수 있다.

- Natural Language Mode: 디폴트 파서의 inverted index 결과 값을 사용해서 검색한다.

  - 단어의 tf-idf나 BM25 유사한 알고리즘을 사용하여 Relevance 점수로 정렬한다. (Relevance is computed based on the number of words in the row (document), the number of unique words in the row, the total number of words in the collection, and the number of rows that contain a particular word.)
  - 소스코드:

  ```sql
  SELECT * FROM articles
  WHERE MATCH (title,body)
  AGAINST ('database' IN NATURAL LANGUAGE MODE);
  ```

- Boolean Mode: 디폴트 파서의 inverted index에서 단어 유무를 선택할 수 있다.

  - 정렬 랭킹은 $\text{tf} * \text{idf} * \text{idf}$라는 특이한 공식을 쓴다고 한다. idf에 강조를 두었으니 희귀한 단어를 갖고 있다면 점수가 배로 뻥튀기된다.
  - 소스코드:

  ```sql
  SELECT * FROM articles WHERE MATCH (title,body)
  AGAINST ('+MySQL -YourSQL' IN BOOLEAN MODE);
  ```

- Query Expansion: 디폴트 파서에서 쿼리 서칭을 두 번한다. 한 번 서칭한 결과물을 모두 합쳐서 새로운 쿼리로 만든다. 그 후에 두 번째 쿼리문을 날린다.

  - 예를 들어서 "사람"을 검색해서 나오는 3 개의 결과 "사람 사회적 동물이다", "사람 사랑", "사람 이윤" - 이것들을 모두 쿼리로 취급해서 "사람", "사회적", "동물이다", "사랑", "이윤" 이 모든 키워드를 쿼리문으로 하여 두 번째 쿼리를 날린다. (예시를 위해 띄어쓰기 delimiter로 설명해보았다. 한글은 사실 조사 때문에 ngram이나 MeCab같은 것을 써야한다.)
  - 굉장히 흥미로운 방식이다. Synonym을 휴리스틱하게 찾아서 레버리지할 수 있는 솔루션이다.
  - 소스코드:

  ```sql
  SELECT * FROM articles
  WHERE MATCH (title,body)
  AGAINST ('database' WITH QUERY EXPANSION);
  ```

  <br/>

#### **ngram 파서**

ngram을 쓰면 n개의 문자 단위로 계속 쪼개어서 그 문자들로 inverted indexing을 한다. 문자 n 설정값과 데이터셋 종류 마다 성능(메모리, 디스크, 연산량)이 천차만별일 것이다.

```
n=1: 'a', 'b', 'c', 'd'
n=2: 'ab', 'bc', 'cd'
n=3: 'abc', 'bcd'
n=4: 'abcd'
```

<br/>

#### **MeCab 파서**

공식문서에는 일본어 관련해서 적혀있다. 아마 공식 지원은 일본어가 유일한듯하다. 일본어에서는 띄어쓰기가 없어서 의미를 나누기 어려운데, MeCab은 단어를 의미구절로 나누어서 이를 해결해준다.

```sql
SELECT COUNT(*) FROM articles WHERE MATCH(title,body) AGAINST('データベース管理' IN NATURAL LANGUAGE MODE);
```

위 구문에서 데이터베이스 관리라고 되어있는데 이를 데이터베이스(データベース), 관리(管理)로 나누어서 inverted indexing을 적용한다.

<br/>

## **PostgreSQL**

#### **tsvector & tsquery**

tsvector은 MySQL 디폴트 파서처럼 문자들을 띄어쓰기 등을 delimiter로 두고 쪼개어준다.

```sql
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector;
                      tsvector
----------------------------------------------------
 'a' 'and' 'ate' 'cat' 'fat' 'mat' 'on' 'rat' 'sat'
```

tsquery는 그냥 Postgres에서 만든 query포맷이다. 직접 알맞게 작성해주어야한다.

```sql
SELECT 'fat:ab & cat'::tsquery;
    tsquery
------------------
 'fat':AB & 'cat'
```

`'문자열'::tsvector`, `'문자열'::tsquery` 이렇게 적으면 강제로 문자열을 tsvector이나 tsquery형식으로 정하는 것이다. (자주 사용하지 않는다.)

`to_tsvector('문자열')`, `to_tsquery('문자열')` 이렇게 적으면 문자열을 postgres가 이해할 수 있는 언어로 알아서 파싱(normalize)해준다. (유저 인풋 클리닝 마지막 단계에 자주 사용한다.)

tsquery와 tsvector을 @@을 사이에 두고 좌우에 배치하면 true(t) 혹은 false(f)로 응답을 받을 수 있다.

```sql
SELECT to_tsvector('fat cats ate fat rats') @@ to_tsquery('fat & rat');
 ?column?
----------
 t
```

<br/>

#### **GIN index**

```sql
CREATE INDEX name ON table USING GIN (column);
```

GIN(Generalized Inverted Index)를 사용해서 쿼리를 빠르게 만들 수 있다. GIN은 그냥 MySQL과 매우 유사한 Inverted Index라고 해석할 수 있겠다. 공식 문서에 따르면 추가로 lossy index인 GiST(Generalized Search Tree)도 존재한다고 한다. [GiST는 빠르지만 Lossy하다.](https://www.postgresql.org/docs/9.1/textsearch-indexes.html)

<span class="text-orange">GIN의 핵심 아이디어는 다음과 같다: 꼭 텍스트 데이터가 아니더라도, 어떤 데이터 타입이든 inverted index로 인덱싱할 수 있도록하기.</span> 이는 Postgres만의 기능이다.

<br/>

#### **보너스: RUM index**

GIN보다 내용이 build, insert 두 가지가 느린 대신 더 많은 정보를 내포할 수 있다고 한다. 더 많은 정보를 인덱스에 포함시켜서 "ranking", "phrase search", "order by timestamp" 이 세 가지가 빨라진다고 한다.

<br/>

## **참조 자료**

- [MySQL Natural Language Full-Text Searches](https://dev.mysql.com/doc/refman/8.3/en/fulltext-natural-language.html)
- [MySQL ngram 공식 문서](https://dev.mysql.com/doc/refman/8.3/en/fulltext-search-ngram.html)
- [MySQL MeCab 공식 문서](https://dev.mysql.com/doc/refman/8.3/en/fulltext-search-mecab.html)
- [tsvector, tsquery](https://www.postgresql.org/docs/current/datatype-textsearch.html)
- [PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [RUM](https://github.com/postgrespro/rum)
