---
slug: "/blog/browser-image-compression"
date: "2024-03-16"
title: "browser-image-compression 분석"
subtitle: "browser-image-compression 라이브러리 & 이미지 압축 종류와 과정을 정리해보자"
---

## **browser-image-compression 분석**

<p class="text-time">최초 업로드 2024-03-16 / 마지막 수정 2024-03-16</p>

예전에 [체험뷰](https://chvu.co.kr) 개발할 떄 browser-image-compression을 썼었는데, 지금 체험뷰 사이트를 방문해보면 일부 이미지가 이상적인 압축 사이즈인 50kb~300kb를 많이 벗어난 1mb 언저리인 것들도 보인다. 이렇게 일부 이미지들 때문에 페이지 로드 속도가 저하되고 있다. 내가 예전에 구현할 때 썸네일에 2MB까지 자유(maxSizeMB)를 줬었다. 500kb 같이 낮은 숫자가 아니었던 이유는 특정 이미지들의 경우 500kb 미만으로 압축시 너무 화질이 안좋아보여서 웹사이트를 외관상 해친다고 생각했기 때문이다. 그럼 왜 이런 일이 발생했을까? 3년 전에는 내가 라이브러리 내부를 열어본다는 생각까지 못했던 것 같다. 우선 이미지 압축에 대한 용어부터 정리하고 이후 라이브러리 내부를 탐구하자.

#### **비트맵은 무엇인가?**

먼저 사진을 촬영하면 비트맵이라는 형식으로 저장이 된다고 한다. 이것이 어찌보면 가장 순수한 형태의 이미지 파일이라고 볼 수 있겠다.
하나의 픽셀마다 색이 지정되어 있는 것이 비트맵 형식이다. 이를 보통 사진기에서는 JPEG 형태로 변환한다.

#### **JPEG와 PNG는 무엇인가?**

JPEG와 PNG는 둘 다 비트맵 이미지를 압축하기 위한 파일 형식이다. JPEG는 우리가 모두 알듯이 확대하면 깨지고, PNG는 덜 깨진다. (뿌옇게 되는게 더 맞는 표현일 것이다.)
JPEG는 손실/무손실 압축이고 PNG는 무손실 압축이라고 한다. 복잡한 색이 얽혀있는 사진에서는 JPEG가 압축률이 더 좋고, 색이 단순하고 복잡한 패턴이 적을 경우에는
PNG가 더 압축률이 높다고 한다.

#### **RAW는 무엇인가?**

RAW가 비트맵 형식에 가까운 형식이다. 사진 촬영 시에 렌즈에서 받았던 모든 정보를 그대로 가지고 있어서 용량이 크다고 한다.

<br/>

## **그렇다면 browser-image-compression js 라이브러리는 무엇을 압축하는 것인가?**

> [라이브러리 설명 발췌](https://github.com/Donaldcwl/browser-image-compression?tab=readme-ov-file#readme): _You can use this module to compress jpeg, png, webp, and bmp images by reducing resolution or storage size before uploading to the application server to save bandwidth._

라이브러리 공식 설명에 따르면 브라우저에서 "resolution"을 줄이거나 "storage size"를 줄여서 jpeg, png, webp, bmp를 더 작게 압축한다.

소스를 열어보니 두 가지 옵션으로 압축한다.

1. `maxWidthOrHeight`: 새로운 canvas를 생성하고 더 작은 width, height로 브라우저에게 그리도록 한 후 결과물 canvas를 다시 이미지로 변환한다.
2. `maxSizeMB`: 흥미롭게도 `maxSizeMB`보다 작아질 때까지 루프로 이미지를 조금씩 퀄리티를 낮추는 형식으로 구현되어있다. width, height은 5%씩 줄일 수 있고, quality라는 인자를 통해서 또 매 루프 마다 얼마나 이미지 퀄리티가 줄어드는지 알 수 있다. 해당 라이브러리에서 jpg와 webp의 경우에는 `canvas.toDataURL(type, encoderOptions)`함수에서 [두 번째 인자가 quality관련](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)이라 이것을 사용한다. png의 경우에는 [UPNG](https://github.com/photopea/UPNG.js/blob/f6e5f93da01094b1ffb3cef364abce4d9e758cbf/README.md)의 `cnum`파라미터를 사용해서 압축한다. cnum은 png에서 허용되는 색 범위를 조절해서 압축한다.

<br/>

```js
// browser-image-compression에서 /lib/image-compression.js 내부 발췌
export default async function compress(file, options, previousProgress = 0) {
  // ...
  const maxSizeByte = options.maxSizeMB * 1024 * 1024;
  // 1차 압축: maxWidthOrHeight 활용해서 이미지 줄이기
  const [, origCanvas] = await drawFileInCanvas(file, options); // 여기에서 1차 압축
  const maxWidthOrHeightFixedCanvas = handleMaxWidthOrHeight(
    origCanvas,
    options
  );
  // ... 중략. maxWidthOrHeightFixedCanvase에서 orientationFixedCanvas로 변환. 회전 정보 처리.
  let quality = options.initialQuality || 1.0;
  const outputFileType = options.fileType || file.type;
  // 2차 압축: 요 아래로는 maxSizeMB활용해서 이미지 줄이기
  const tempFile = await canvasToFile(
    orientationFixedCanvas,
    outputFileType,
    file.name,
    file.lastModified,
    quality
  );
  const origExceedMaxSize = tempFile.size > maxSizeByte; // 2차 압축할지말지 결정.
  // ...
  let compressedFile;
  // ...
  // 무한 루프 돌려서 이미지 원하는 용량보다 작아질 때까지 조금씩 퀄리티나 폭/너비 줄임.
  const shouldReduceResolution =
    !options.alwaysKeepResolution && origExceedMaxSize;
  while (
    remainingTrials-- &&
    (currentSize > maxSizeByte || currentSize > sourceSize)
  ) {
    const newWidth = shouldReduceResolution
      ? canvas.width * 0.95
      : canvas.width;
    const newHeight = shouldReduceResolution
      ? canvas.height * 0.95
      : canvas.height;
    if (process.env.BUILD === "development") {
      console.log("current width", newWidth);
      console.log("current height", newHeight);
      console.log("current quality", quality);
    }
    [newCanvas, ctx] = getNewCanvasAndCtx(newWidth, newHeight);

    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

    if (outputFileType === "image/png") {
      quality *= 0.85;
    } else {
      quality *= 0.95;
    }
    compressedFile = await canvasToFile(
      newCanvas,
      outputFileType,
      file.name,
      file.lastModified,
      quality
    );
    // ...
  }
}
```

<br/>

## **3년 전 체험뷰 개발에서의 문제 탐구**

3년 전 체험뷰 개발 시 휴리스틱하게 어떤 이미지를 넣었을 때 어떤 정도의 용량이 나오는지 체크하고 browser-image-compression의 압축 파라미터 옵션들을 정해주었었다. 라이브러리를 열어보니 더 명확하게 무슨 일이 일어났는지 보인다.
이제 왜 특정 이미지는 압축 시 다 깨져보였는지 자세히 생각할 수 있다. 체험뷰에서 허용하는 jpg와 png만 생각해보자.

- jpg는 width 줄인 후에 quality라는 canvas.toDataURL()이라는 함수를 사용함.
- png는 UPNG로 색 범위를 줄임.

<span class="text-skyblue">가설: png의 경우 복잡한 사진이라면 압축이 많이 안 예쁘게 나올 수 있음. jpg의 경우에는 대부분 괜찮을 것이라고 생각됨.</span>

직접 실험해보자.

실험하면서 많은 것들을 발견해냈다.

1. jpg는 압축 속도도 빠르고 이미지 퀄리티도 크게 떨어지지 않음.
2. 모든 이미지가 maxIteration 디폴트로 10회 제한이 있어서 내가 예전에 체험뷰 개발할 때 용량 큰 이미지들은 왜 내가 정한 maxSizeMB 보다 압축이 작게 안되는지 이제야 깨달았다.
3. 용량 큰 png는 원하는 만큼 압축하려고 maxIteration 100회로 해야하고 압축 속도가 많이 느림. (2MB => 200KB까지 수십회 걸리고 15초 정도 걸림.)
4. png는 같은 용량 대비 jpg 보다 사진이 월등하게 흐리게 보여짐. 매우 심각함. 체험뷰에서 쓰는 대부분의 이미지가 복잡한 사진이라 그럼.

<span class="text-orange">결론 1: 흐린 이미지들의 정체는 png였으며, png가 만악의 근원이었음. 체험뷰는 png를 금지하고 jpg만 허가한 후 압축 maxSizeMB를 2mb가 아닌 300kb로 정했어야함. </span>

<span class="text-orange">결론 2: 어떤 문제가 생길 때 라이브러리 내부를 모르고 해결하는 것과 내부를 읽어보고 이해하는 것은 천지 이상의 차이임.</span>

<span class="text-orange">결론 3: webp으로의 변환도 좋은 옵션이었을 것임. 사용시 jpg 보다 훨씬 더 많이 용량이 줄어듦. 다시 체험뷰 같은 사이트를 만든다면 jpg에서 webp로 변환 후 추가적인 압축이 필요하다면 browser-image-compression으로 추가 압축을 진행할 것이다.</span>

<br/>

아래 보다시피 png가 같은 용량대비 jpg 보다 퀄리티가 낮다. 그래픽 같은 사진은 png도 괜찮은데 실사 사진이 많이 쓰이는 체험뷰는 jpg/webp만으로 제한했어야했다.

<br/>

<div class="image-container">
  <img class="md-image" src="/images/rock.jpg" alt="jpg rock"/>
  <sub class>그림 1. 돌멩이 사진의 jpg버전 174kb</sub>
</div>

<br/>

<div class="image-container">
  <img class="md-image" src="/images/rock.png" alt="png rock"/>
  <sub class>그림 2. 돌멩이 사진의 png버전 198kb</sub>
</div>

<br/>

<div class="image-container">
  <img class="md-image" src="/images/rock.webp" alt="webp rock"/>
  <sub class>그림 3. 돌멩이 사진의 webp버전 84kb</sub>
</div>
