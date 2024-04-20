---
slug: "/blog/jpg-png-webp"
date: "2024-04-20"
title: "JPG, PNG, WebP에 대해 알아보자"
subtitle: "JPG, PNG, WebP에 대해 알아보자"
---

## **JPG, PNG, WebP에 대해 알아보자**

<p class="text-time">최초 업로드 2024-04-20 / 마지막 수정 2024-04-20</p>

몇 년전에 개발할 때에는 무지성으로 이미지 압축 알고리즘을 가져다가 줄이는 데에만 신경썼었지만, 내부 로직을 알아야 전반적으로 더 수월하고 좋은 설계가 나온다는 사실 때문에
더 깊게 각 이미지 압축 방식의 원리에 대해 알아보고자 한다.

jpg는 손실(해당 글에서는 무손실 jpg는 언급하지 않는다)이고 png는 무손실이며 WebP는 무손실과 손실 중에 선택할 수 있다.

해당 포스트의 결론만 요약해서 말하자면

- jpg는 복잡한 사진에서 인간이 인지하기 어려운 디테일들을 삭제하는 방식으로 압축한다. 실사 이미지에 적합하다.
- png는 반복되는 문자열(비트) 패턴을 최대한 줄여서 인코딩하는 데에 집중하기 때문에 단순한 그래픽 이미지에 강하다.
- webp는 기존 jpg와 png에서 부족한 부분들을 보완해주며 압축률이 훨씬 높다.

<br/>

## <span class="text-skyblue">**JPG 압축 과정**</span>

1. Color Space Conversion
2. Chrominance Downsampling
3. DCT (Discrete Cosine Transform)
4. Quantization
5. Run Length and Huffman Encoding

1, 2를 묶어서 생각하고 3, 4, 5를 묶어서 생각하면 편하다.
아래 글은 사실 개념과 수학적 표현을 정리한 것이라, 시각적 이해를 위해서는 [JPEG 알고리즘 설명 영상](https://www.youtube.com/watch?v=Kv1Hiv3ox8I&ab_channel=BranchEducation)을 보는 것을 추천한다.

<br/>

#### <span class="text-yellow">1. Color Space Conversion - 색 변환</span>

<span class="text-yellow">왜 하는 것인가:</span> 인간의 눈은 밝기를 감지하는 세포가 R, G, B를 구분하는 세포보다 압도적으로 더 많다 (100:6 비율)
그렇기 때문에 밝기를 감지하는 정보는 최대한 유지하고 색 정보를 분리 시켜서 압축시켜도 눈이 잘 알아채지 못한다.

<span class="text-yellow">과정:</span> 기본 비트맵 이미지는 R, G, B 세 개의 채널(행렬)로 이루어져 있다. 이것을 Y (밝기 행렬), Cb (크로마 블루), Cr (크로마 레드)로 변환해준다.
RGB와 YCbCr 서로의 변환은 아무 사이드 이펙트 없이 이루어질 수 있다. Y가 밝기를 나타내는 행렬이기 때문에 Y는 냅두고 Cb, Cr에 이제 무언가 처리를 해주어야한다.

<span class="text-yellow">결과:</span> R, G, B 세 개의 행렬이 이제 Y, Cb, Cr 세개의 행렬로 변환되었다. 실제로 이루어진 압축은 없다.

<br/>

#### <span class="text-yellow">2. Chrominance Downsampling - 크로미넌스 다운샘플링</span>

<span class="text-yellow">왜 하는 것인가:</span> 위에서 Y, Cb, Cr로 분리된 상태에서 Cb, Cr만 압축해준다. 이로써 이미지 용량이 줄어든다.

<span class="text-yellow">과정:</span> Cb, Cr의 행렬에서 네 개의 cell 마다 평균을 내어서 각각 1/4로 크기를 압축시켜줄 수 있다. (여기서 압축 비율은 보통 1/4을 쓰는듯하다.)

<span class="text-yellow">결과:</span> Y, Cb, Cr의 행렬이 Y, Cb', Cr'으로 변형되었고, Cb'와 Cr'은 기존에 비해 1/4씩 용량이 줄어들었다.

<br/>

#### <span class="text-yellow">3. DCT (Discrete Cosine Transform) - 이산 코사인 변환</span>

<span class="text-yellow">왜 하는 것인가:</span> JPG의 핵심 과정중 하나로 단순한 코사인 함수들의 덧셈으로 이미지를 나타낸다. 3단계인 DCT의 결과는 4단계인 양자화를 거치고 나서 5단계에서 실제로 압축이 이루어진다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/jpg-png-webp/dct-sc.png" alt="dct pic"/>
  <sub>그림 1. DCT를 하기 위한 basis functions - 최하단 참고 자료의 "DCT 설명 영상" 발췌</sub>
</div>

<span class="text-yellow">과정:</span> 여기서부터 잘 읽으면 잘 이해할 수 있다. 생각보다 쉽다. 위 그림을 보면 64개의 8x8 필터가 있다. 첫 열과 첫 행의 필터들이 각각 X와 Y에만 코사인을 적용시킨 필터들이다.
그리고 나머지 필터들은 첫 행과 첫 열에 있는 필터들의 합성이다. 합성 방식은 그냥 곱셈이다. 아래 $B_{uv}(x,y)$가 곧 위 그림에서 [0, 0] 부터 [7, 7]에 해당하는 각 필터들을 구하는 방식이다.

$$
B_{uv}(x, y) = C(u) C(v) \cos\left[\frac{(2x+1)u\pi}{2N}\right] \cos\left[\frac{(2y+1)v\pi}{2N}\right]
$$

$$
F(u, v) = \frac{1}{4} C(u) C(v) \sum_{x=0}^{7} \sum_{y=0}^{7} P'(x, y) \cos \left[\frac{(2x+1)u\pi}{16}\right] \cos \left[\frac{(2y+1)v\pi}{16}\right]
$$

- $u, v$: 각각 basis function의 행과 열의 인덱스를 나타냄.
- $B_{uv}(x, y)$: ($N$x$N$ 픽셀일 때) 주파수 u, v에서의 basis function. $B_{00}$은 전체 평균 밝기를 측정한다고 한다.

- $F(u, v)$: (8x8 픽셀일 때) 주파수 u, v에서의 DCT 계수 => 우리가 결국 구하고자 하는 값임. 공식을 직관적으로 생각하면 8x8 이미지를 8x8 필터에 겹쳐놓고 칸 마다 서로 곱셈해서 다 더하는 것임. 예시로 가상의 13번 필터를 쓴다고 해보자. 그렇다면 연산은 Hadamard Product(element-wise product)가 될 것이다. 아래 연산이 곧 $F(u, v)$와 동일하다고 할 수 있다(계수들 빼면). 코사인 두 개 곱한 것의 결과가 곧 Filter한 개의 x, y에서의 요소 값이기 때문이다.

$$
Filter_{13} = \begin{bmatrix}
1 & -1 & 1 & \dots \\
-3 & 1 & -1 & \dots \\
5 & -3 & 3 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
, \quad
Image_{8*8} = \begin{bmatrix}
5 & 4 & 3 & \dots \\
77 & 22 & 33 & \dots \\
4 & 1 & 6 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
$$

$$
Filter_{13}\odot Image_{8*8}  = \begin{bmatrix}
1*5 & -1*4 & 1*3 & \dots \\
-3*77 & 1*22 & -1*33 & \dots \\
5*4 & -3*1 & 3*6 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
=\begin{bmatrix}
5 & -4 & 3 & \dots \\
-231 & 22 & -33 & \dots \\
20 & -3 & 18 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix} = \text{result!!!}
$$

- $P'(x, y)$: 이미지에서 x, y위치의 픽셀 값에서 128을 빼서 -128~127의 범위로 바꾼 값

- $C(u), C(v)$: 스케일링 인자. u 또는 v가 0일때에는 $\frac{1}{\sqrt{2}}$, 나머지는 1로 설정

위에 존재하는 $F$ 함수를 거치면 원래 있었던 원본 이미지에서 떼어낸 8x8짜리 픽셀 행렬이 basis function들의 결합으로 바뀐다. 아래의 그림 2를 보면
"Image"라고 되어있는 8x8 원본 이미지가 "DCT Coeffs"라고 하는 8x8 행렬로 변하게 된다. "DCT Coeffs"가 곧 basis function들의 결합을 나타내는 계수 행렬이다.
그리고 "DCT Coeffs"가 3단계의 결과값이다.
여기서 가장 인간 눈에 잘보이는 정보를 내포하고 있는 네 개의 Coeff를 떼어낸 "Four DCT Components"가 압축 후 원복한 상태의 이미지이다. 실제로 인간 눈에 덜 중요한
basis function들의 Coeff를 삭제하는 작업은 4단계 양자화에서 이루어진다.

<div class="image-container">
  <img class="md-image" src="https://d1ykeqyorqdego.cloudfront.net/new-assets/jpg-png-webp/dct-sc2.png" alt="dct pic"/>
  <sub>그림 2. DCT의 결과 - 최하단 참고 자료의 "DCT 설명 영상" 발췌</sub>
</div>

<span class="text-yellow">결과:</span> 8x8 픽셀 행렬이 코사인 함수들의 8x8 계수 행렬로 변환되었다. 실제로 이루어진 압축은 없다.

<br/>

#### <span class="text-yellow">4. Quantization - 양자화</span>

<span class="text-yellow">왜 하는 것인가:</span> DCT의 결과로 나온 계수 행렬에서 덜 중요한 정보를 제거함으로서 행렬의 상당 부분을 0으로 만들 수 있다.

<span class="text-yellow">과정:</span> 위의 그림2에서 보았단 "DCT Coeffs"라고 하는 행렬을 quantization table이라고 하는 우리가 정한 테이블로 나눈 후 정수로 반올림해서 0으로 만든다.
Q의 값들은 우리가 임의로 정한다. 당연히 세밀한 패턴일수록 보기 힘들기에 굵직한 패턴들은 작은 값으로 나누어서 중요도를 높인다.

$$
F = \begin{bmatrix}
160 & -20 & 10 & \dots \\
-3 & 7 & -6 & \dots \\
5 & -1 & 3 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
, \quad
Q = \begin{bmatrix}
16 & 11 & 10 & \dots \\
12 & 12 & 14 & \dots \\
14 & 13 & 16 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
$$

$$
F\div Q = \begin{bmatrix}
\text{r}(160/16) & \text{r}(-20/11) & \text{r}(10/10) & \dots \\
\text{r}(-3/12) & \text{r}(7/12) & \text{r}(-6/14) & \dots \\
\text{r}(5/14) & \text{r}(-1/13) & \text{r}(3/16) & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
=\begin{bmatrix}
10 & -2 & 1 & \dots \\
0 & 1 & 0 & \dots \\
0 & 0 & 0 & \dots \\
\vdots & \vdots & \vdots & \ddots
\end{bmatrix}
$$

- $F$는 3단계의 결과였던 DCT 계수 행렬이다.
- $Q$는 우리가 임의로 정한다. 인간에게 중요한 패턴일수록 작게해서 나누기가 덜되도록한다.
- $r$은 반올림을 의미한다.

<span class="text-yellow">결과:</span> DCT의 결과였던 계수 행렬에서 인간의 눈에 덜 중요한 복잡한 패턴을 0만들었다. 0이 많은 행렬이 되었다. 실제로 이루어진 압축은 없다.

<br/>

#### <span class="text-yellow">5. Run Length and Huffman Encoding - 런 길이 부호화와 허프만 부호화</span>

<span class="text-yellow">왜 하는 것인가:</span> 0으로 만든 값들을 실제로 압축에 쓰기 위해 부호화를 한다.

<span class="text-yellow">과정:</span> 먼저 4단계 양자화의 결과값이 왼쪽위에 유의미한 값이 몰려있고 오른쪽 아래로 갈수록 0이 많다. 그래서 [지그재그](https://youtu.be/Kv1Hiv3ox8I?si=Rc1k0f07rspBPB9c&t=680)로 Run Length Encoding을 적용해주어서 압축한다. 그 후 [Huffman Encoding](https://www.youtube.com/watch?v=iEm1NRyEe5c&ab_channel=PizzeyTechnology)을 적용해서 다시 한 번 데이터 크기를 줄인다. 부호화를 두 번하는 2단 압축이다. 자세하게는 들어가지 않겠다. 글로 적는 것 보다 영상들을 보면 매우 쉽고 빠르게 이해할 수 있다. 허프만 인코딩을 짧게 말하자면 "자주 등장하는 것(문자)을 작은 단위의 바이트로 치환하는 우선순위 큐를 만드는 것"이라고 할 수 있다.

<span class="text-yellow">결과:</span> 양자화의 결과였던 0이 많아진 계수 행렬을 실제로 압축하였다. 이미지의 실제 크기가 획기적으로 줄어들었다. 이로써 기본 JPG 압축 파이프라인은 끝이다.

<br/>

## <span class="text-skyblue">**PNG 압축 과정**</span>

1. Filtering
2. LZSS
3. Huffman Encoding

jpg에 비하면 png의 압축 방식은 (부호화 과정을 제외하면) 상당히 직관적이다.
png 또한 영상 자료가 월등히 좋기 때문에 아래 내용은 요약본으로만 참고하고 쉬운 이해가 필요하다면 [PNG 알고리즘 설명 영상](https://www.youtube.com/watch?v=EFUYNoFRHQI&t=507s&ab_channel=Reducible)을 보자.

<br/>

#### <span class="text-yellow">1. Filtering - 필터링</span>

<span class="text-yellow">왜 하는 것인가:</span> 2번 단계인 LZSS가 효율적으로 적용될 수 있게 하기 위해 필터링을 먼저 적용한다.
필터링은 각 row마다 특정 연산을 해주어서 최~~~대한 반복되는 패턴이 많아지도록 한다. LZSS를 사용한 png 압축은 이미지의 하나의 픽셀 주변에 유사한 픽셀이 많이 존재하고
그 사이에 패턴이 있지 않을까, 그러면 그 패턴을 이용해서 압축할 수 있지 않을까하는 의문에서 출발된 알고리즘이기 때문에 반복되는 패턴이 최대한 많도록 Filtering으로 전처리를 해준다.
그 후에 LZSS는 슬라이딩 윈도우를 통해 일정 구간 내에서 반복되는 패턴을 캡쳐해서 압축한다.

<span class="text-yellow">과정:</span>

행렬에 아래와 같이 두 개의 행이 있다고 하자. jpg에서는 8x8로 블록들을 떼어내고 연산한 것과 달리 png에서는 행 단위로 모두 연산한다. 아래 행렬이 이미지라고 한다면
3x4 픽셀의 이미지이다.

$$
r_1=[120,130,140,150], \
r_2=[100,110,120,130], \
r_3=[1, 2, 3, 4]
$$

이제 필터링을 적용할 것이다. 필터링은 다섯 가지 종류가 있다. 각 필터는 바로 윗 줄(윗 행)과 현재 행을 이용해서 현재 행의 값을 바꾼다. 마치 PS할 때 접하는 DP 문제들의 연산과 유사하다.

- none: 원본 데이터를 그대로 사용
- sub: 왼쪽 픽셀을 빼줌 $X - L$

  $r_2$에 적용시 $[100, 110-100, 120-110, 130-120] = [100, 10, 10, 10]$이다.

- up: 위 픽셀을 빼줌 $X - U$

  $r_2$에 적용시 $[100-120, 110-130, 120-140, 130-150] = [256-20, 256-20, 256-20, 256-20]$이다. 8비트이기에 마이너스는 256에서 빼준다.

- average: 왼쪽과 위를 이용해서 연산 $X - (U+L)/2$

- paeth: 왼쪽과 위와 왼쪽위(대각선)을 이용해서 연산하는데, 상당히 복잡해서 생략.

average와 paeth는 예시를 생략했다. 이 필터들을 각 행마다 제일 좋은 것을 판별해서 5가지중 하나를 계속 선택해서 적용한다. 100개의 행이 있으면 각자 다른 필터를 사용하는 것이다. 행 마다 가장 좋은 필터를 판별하는 방식은 휴리스틱에 의존한다. 현재 자주 쓰이는 방식은 필터를 적용했을 때 행의 총합이 가장 0에 가까운 필터를 행마다 일일이 확인하는 방법이라고 한다.

<span class="text-yellow">결과:</span> 필터링이 된 n x m 크기의 이미지. 원본 n x m과 픽셀 크기는 동일하다.

<br/>

#### <span class="text-yellow">2. LZSS - 슬라이딩 윈도우로 압축</span>

<span class="text-yellow">왜 하는 것인가:</span> png의 핵심인 LZSS는 슬라이딩 윈도우를 이용해서 반복되는 패턴을 압축한다.

<span class="text-yellow">과정:</span> "reeeepazaa raaaapazaa"이라는 단어가 있다고 하자. sliding window size를 16이라고하면 LZSS 후 "re[1,3]pazaa ra[1,3][11,5]"로 변환이 된다. [n개 전부터, m개의 문자를 반복]이라는 뜻이다. e와 a의 경우 원복하면서 그 문자를 재귀적으로 다시 재사용하면 된다.

원복을 해본다면

"re[1,3]pazaa ra[1,3][11,5]"

=> "ree[1,2]pazaa ra[1,4][11,5]"

=> "reee[1,1]pazaa ra[1,4][11,5]"

=> "reeee[1,0]pazaa ra[1,4][11,5]"

=> "reeeepazaa ra[1,4][11,5]"

이런식으로 될 것이다. 마찬가지로 "pazaa"의 경우 11개의 인덱스 이전부터 5개 만큼 하나하나 복사해오면 원복된다. 이제 이러한 과정으로 png 이미지 전체를 하나의 문자열로 놓고 압축하면된다. 보통 32KB단위(꽤 크다)로 sliding window를 정해놓고 수행한다고 한다.

<span class="text-yellow">결과:</span> 필터링 된 픽셀 행렬을 n x m길이의 문자열로 바꾸어버린 후 LZSS를 통해 압축했다. 이제 행렬이 아닌 그냥 1차원 데이터이다.

<br/>

#### <span class="text-yellow">3. Huffman Encoding - 허프만 부호화</span>

<span class="text-yellow">왜 하는 것인가:</span> 최종적으로 압축된 LZSS의 결과물을 인코딩(부호화)로 한 번 더 압축한다. jpg와 마찬가지로 허프만 부호화를 사용하지만 png만을 위한 최적화 기법이 많다고 한다는데 자세히는 찾아보지 않았다.

<span class="text-yellow">과정:</span> 생략 (JPG와 동일하다.)

<span class="text-yellow">결과:</span> 최종 png 압축 파일.

<br/>

## <span class="text-skyblue">**WebP 압축 과정**</span>

#### <span class="text-yellow">Lossy WebP </span>

Lossy WebP는 JPG 압축 과정의 맨 앞에 하나의 과정이 추가된 방식이다. [Lossy WebP 보충 설명 아티클](https://medium.com/@duhroach/how-webp-works-lossly-mode-33bd2b1d0670)에 자세한 설명이 있다.

핵심은 다음과 같다.

1. png에서 쓰는 필터링을 JPG에 가져와서 사용하자는 취지이다. 그래서 jpg dct 직전에 필터링을 먼저한다.
2. png에서는 row단위로 필터링 되는데 webp에서는 블록 단위(n x n)으로 필터링된다.
3. 필터링 방식은 여러가지가 있다. (통계학적인 접근이 포함되어있는 필터(True Motion Filter)도 있는 것 같다. 아닐수도 있다.)
4. png 필터링처럼 각 필터를 적용해보고 베스트 매치를 채용한다. 베스트 매치는 가장 원본과 유사한 것으로 채용한다고 한다.
5. 각 n x n 단위 블록마다 필터링을 적용해준다.
6. 필터링 이후 원래 JPG 알고리즘을 진행한다. (DCT => 양자화 => 부호화)

<br/>

#### <span class="text-yellow">Lossless WebP</span>

Lossless WebP는 PNG보다 상당히 복잡한데, 추상적으로 생각하면 전반적인 골자 자체는 굉장히 쉽게 이해할 수 있다.

자, PNG를 우리는 어떻게 압축했는가? 먼저 존재하던 픽셀 데이터를 필터링해서 압축하기 좋게 만든 후, 무손실 압축인 LZSS를 사용했다.

Lossless WebP도 이 과정은 똑같다. 픽셀 데이터를 먼저 여러 가지의 "Transform"을 거쳐서 압축하기 좋게 만든다. 그 이후 똑같은 계열의 무손실 압축인 LZ77을 사용한다.

디테일로 들어가자면 어떤 Transform이 어떻게 적용되느냐가 관건인 것 같은데, 이해가 어려워서 자세히 들여다보지는 않았다.

<br/>

## **마치며**

우리가 흔히 쓰는 이미지 포맷들 안에 이렇게 많은 알고리즘들이 들어가있고, 휴대폰이나 컴퓨터가 페이지를 로딩하거나 이미지를 보여줄 때마다 png, jpg의 복호화처리가 순식간에
일어난다는 것이 신기하다. 이미지에 포맷에 대해 무지했었는데, 조금이라도 알게된 것 같다.

<br/>

## **참고 자료**

- [JPEG 알고리즘 설명 영상](https://www.youtube.com/watch?v=Kv1Hiv3ox8I&ab_channel=BranchEducation)
- [PNG 알고리즘 설명 영상](https://www.youtube.com/watch?v=EFUYNoFRHQI&t=507s&ab_channel=Reducible)
- [WebP 공식 문서 설명](https://developers.google.com/speed/webp/docs/compression)
- [Lossy WebP 보충 설명 아티클](https://medium.com/@duhroach/how-webp-works-lossly-mode-33bd2b1d0670)
- [DCT 설명 영상 - 이해에 도움은 되었지만 여러 소스들에서 공식을 계속 들여다 본 후에야 이해가 되었음.](https://www.youtube.com/watch?v=DS8N8cFVd-E&t=196s&ab_channel=BarryVanVeen)
- [Huffman Encoding 설명 영상 - 영상에서 오류가 있음. pq 나열할 때 작은 값이 항상 트리 노드의 왼쪽 자식으로 가야함.](https://www.youtube.com/watch?v=iEm1NRyEe5c&ab_channel=PizzeyTechnology)
