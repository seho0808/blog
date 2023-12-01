---
slug: "/blog/prototype-vs-proto"
date: "2023-12-01"
title: "prototype vs __proto__"
subtitle: "__proto__는 상속느낌이고 prototype은 전수의 느낌이다."
---

## **prototype vs \_\_proto\_\_**

<p class="text-time">최초 업로드 2023-12-01 / 마지막 수정 2023-12-01</p>

JS는 모든 객체에서 `__proto__` 혹은 `Object.getPrototypeOf`로 `[[Prototype]]`내부 슬롯을 볼 수 있다.
`__proto__`와는 사뭇 다른 `prototype`은 함수 객체에만 존재한다.

- <span class="text-orange">함수의 `.prototype`는 본인이 `new`로 생성할 객체의 프로토타입을 반환</span>하고
- <span class="text-orange">함수의 `.__proto__`는 언제나 `Function.prototype`을 반환</span>한다.

고로, 어떤 함수 객체가 생성할 객체의 프로토타입 체인을 보고싶으면 `__proto__`가 아닌 `prototype`을 호출해야한다.

자세히 생각해보면 자연스러운 흐름이다. 보통 프로토타입 객체는 `constructor`를 가지고 있는 객체이다. `constructor`필드는 해당 프로토타입을
기반으로 객체를 만들면 만들어지는 것을 보여주는 공장 라인과도 같다. 그렇다면 함수 객체의 프로토타입은 반드시 <span class="text-orange">함수를 만드는</span> `constructor`를 가지고 있어야하며,
함수 객체의 `__proto__`가 `Function.prototype`이 되는 것이 매우 자연스럽다는 것을 보여준다. 함수에 `__proto__`만 있고 `prototype`이 없다면 함수 객체가 만들어내는 객체의 프로토타입 체인을
확인할 길이 없으니, `prototype`이 존재하는 것 또한 자연스러워진다.

아래 예시는 두 개의 차이점을 직접 보기 위해 만들어보았다.

<br/>

```javascript
// create Animal
function Animal(hp) {
  this.alive = true;
  this.hp = hp;
}

Animal.prototype.eat = (food) => {
  // arrow 함수는 [[Contructor]]가 없기에 메서드로 사용된다는 것을 강조한다.
  this.hp += food;
};

// create Dog
function Dog(hp, breed) {
  Animal.call(this, hp);
  this.abilities = ["bark", "sniff"];
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// create GermanShepherd
function GermanShepherd(hp, strength) {
  Dog.call(this, hp, "German Shepherd");
  this.strength = strength;
}
GermanShepherd.prototype = Object.create(Dog.prototype);
GermanShepherd.prototype.constructor = GermanShepherd;

// test objects
const dog1 = new Dog(100, "a");
const gs1 = new GermanShepherd(100, 100);

// structure check
console.log(GermanShepherd.__proto__ === Function.prototype); // Function.prototype
console.log(GermanShepherd.__proto__.__proto__ === Object.prototype); // Object.prototype
console.log(
  gs1.__proto__, // Dog { constructor: [Function: GermanShepherd] }
  gs1.__proto__.__proto__, // Animal { constructor: [Function: Dog] }
  gs1.__proto__.__proto__.__proto__, // { eat: [Function (anonymous)] }
  gs1.__proto__.__proto__.__proto__.__proto__ // [Object: null prototype] {}
);
console.log(
  GermanShepherd.prototype, // Dog { constructor: [Function: GermanShepherd] }
  GermanShepherd.prototype.__proto__, // Animal { constructor: [Function: Dog] }
  GermanShepherd.prototype.__proto__.__proto__, // { eat: [Function (anonymous)] }
  GermanShepherd.prototype.__proto__.__proto__.__proto__ // [Object: null prototype] {}
);
```

<br/>

<div class="image-container">
  <img class="md-image" src="/images/prototype.png" alt="next_js_caching_flow"/>
  <sub class>그림 1. 코드를 정리한 그래프</sub>
</div>

<br/>

함수 객체의 `__proto__`는 언제나 `Function.prototype`을 가리키고 있다는 사실을 명심하자.
