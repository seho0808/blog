---
slug: "/blog/manifest"
date: "2024-05-10"
title: "Manifest"
subtitle: "Manifest"
---

## **Manifest**

<p class="text-time">최초 업로드 2024-05-10 / 마지막 수정 2023-05-10</p>

크롬 익스텐션을 만들다가 문득 Manifest.json에 대해 깊게 알고 싶어졌다. mdn에서는 주로 PWA 설치용 앱정보를 manifest에서 사용하는 데에 사용된다고 한다. 하지만 스펙을 보니 평상시 데스크탑용 웹앱을 만들 때에도 사용가능해보이는 필드들이 많이 있었다.

흥미로운 점은, PWA를 위한 Manifest.json과 크롬 익스텐션을 위한 Manifest.json은 다르다는 점이다.

### **모든 웹앱용 Manifest.json**

공식 스펙을 보니 가능한 것들이 여러가지 있다.

필드 기준 설명:

- background_color: 설정하면 CSS 배경이 로드되기 전에 브라우저에서 표시할 배경색을 정할 수가 있다!
- dir: 아마 국가별 언어 설정 같은것들 관련해서 다양한 언어로 앱 이름 같은 것들을 적을 수 있는 란인 것 같다.
- display
- icons
- identity
- lang
- name
- orientation
- prefer_related_applications:
- related_applications:
- scope: manifest를 어떤 url 그룹에게 적용시킬지 정할 수 있는 옵션.
- short_name
- shortcuts
- start_url:
- theme_color:

<br/>

### **크롬 익스텐션 Manifest.json**

크롬 익스텐션의 Manifest.json 양식은 [공식문서](https://developer.chrome.com/docs/extensions/reference/manifest#minimal-manifest)에서 모두 열람할 수 있다. `manifest_version`, `name`, `version`, `description`, `icons`는 기본적으로 크롬에서 앱을 구분하기 위해 필요로하는 필수 필드들이다. 그 외에도 JS 스크립트 entry 포인트 제공 등 여러 기능들을 제공한다.

<br/>

## 참고 자료

- [Wep Application Manifest](https://w3c.github.io/manifest/)
- [mdn Web Application Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
