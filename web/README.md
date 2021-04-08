# 移动端网站

```shell
D:.
│  .gitignore
│  babel.config.js
│  data.txt
│  package-lock.json
│  package.json
│  README.md
├─public
│      favicon.ico
│      index.html
└─src
    │  App.vue
    │  main.js
    │  style.scss
    ├─components
    │      HelloWorld.vue
    │      ListCard.vue
    │      Card.vue
    ├─router
    │      index.js
    └─views
            About.vue
            Home.vue
            Main.vue
```



## 1. 初始化

### "工具样式"和SCSS

工作样式表示的是页面中许多的class类都是可以重复定义的，所以可以使用工具进行复用。

使用scss进行css代码的编写。

```shell
npm i -D sass@1.23.0 sass-loader@8.0.0
```

### 样式重置

在不同浏览器中样式是不一样的，所以需要统一重置一下样式。

```scss
* { 
  box-sizing: border-box;
  outline: none;
}
html {
  font-size: 13px;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.2em;
  background: #f1f1f1;
}
a {
  color: #999;
}
```

### 网站色彩和字体

网站整体颜色和整体字体应该是统一定义的。

我们需要使用到的这些属性很多都是相同的，所以可以使用工具类进行复用。

#### @规则

一个 **at-rule** 是一个CSS 语句，以at符号开头, '`@`' , 后跟一个标识符，并包括直到下一个分号的所有内容, '`;`' , 或下一CSS块，以先到者为准。

`@each` 指令的格式是 `$var in <list>`, `$var` 可以是任何变量名，比如 `$length` 或者 `$name`，而 `<list>` 是一连串的值，也就是列表。

`@each` 将变量 `$var` 作用于值列表中的每一个项目，然后输出结果，例如：

- 这里`$colorKey, $color`是一个键值对，前面为键后面为值。使用时自定义属性前为键，具体属性为值。

```scss
@each $colorKey, $color in $colors {
  .text-#{$colorKey} {
    color: $color;
  }
  .bg-#{$colorKey} {
    background-color: $color;
  }
}
```

编译为：

```scss
.text-primary { color: #db9e3f; }
.bg-primary { background-color: #db9e3f; }

.text-white { color: #fff; }
.bg-white { background-color: #fff; }

.text-light { color: #f9f9f9; }
.bg-light { background-color: #f9f9f9; }

.text-grey { color: #999; }
.bg-grey { background-color: #999; }

.text-dark-primary { color: #343440; }
.bg-dark-primary { background-color: #343440; }

.text-dark { color: #222; }
.bg-dark { background-color: #222; }

.text-black { color: #000; }
.bg-black { background-color: #000; }
```

### 通用flex布局



### 常用边距定义

在实际开发中，padding，margin的设置应该都是只有几种具体的值。

所以可以分为5个档次，`0: 0, 1: 0.25rem, 2: 0.5rem, 3: 1rem, 4: 1.5rem, 5: 3rem,`这样会让实际开发更加规整不至于杂乱。

并且`m-0，m-1`表示0级和1级的margin。

可以规定`mx-1,my-2`表示上下为1级和左右为2级的margin。

`mt-0`表示0级的margin顶部`margin-top:0`。`pb-1`表示1级的padding底部`padding-bottom:0.25rem`。

可以使用scss的工具类定义这些常规使用的margin和padding。

```scss
$spacing-types: ( m: margin, p: padding, );
$spacing-direction: ( t: top, r: right, b: bottom, l: left, );
$spacing-base-size: 1rem;
$spacing-sizes: ( 0: 0, 1: 0.25, 2: 0.5, 3: 1, 4: 1.5, 5: 3, );
@each $typeKey, $type in $spacing-types {
  @each $sizeKey, $size in $spacing-sizes {
    //m-1
    .#{$typeKey}-#{$sizeKey} {
      #{$type}: $size * $spacing-base-size;
    }
    //mx-1
    .#{$typeKey}x-#{$sizeKey} {
      #{$type}-left: $size * $spacing-base-size;
      #{$type}-right: $size * $spacing-base-size;
    }
    //my-1
    .#{$typeKey}y-#{$sizeKey} {
      #{$type}-top: $size * $spacing-base-size;
      #{$type}-bottom: $size * $spacing-base-size;
    }
    @each $directionKey, $direction in $spacing-direction {
      //mt-1,pt-1
      .#{$typeKey}#{$direction}-#{$sizeKey} {
        #{$type}-#{$direction}: $size * $spacing-base-size;
      }
    }
  }
}

```

## 导航

主界面中像导航栏等有些模块是不变的，改变的是内容，所以需要添加子路由。

```shell
vue add router
```

### 导航菜单

布局使用flex布局， 中间使用`flex-1`后即`flex:1`，这样这一项就撑大整行。

```html
		<div class="topbar bg-dark-1 py-2 px-4 d-flex ai-center">
      <img src="../assets/logo.png" height="30" />
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-grey-1 fs-xxs">团队成就更多</div>
      </div>
      <button href="" class="btn bg-primary" type="button">立即下载</button>
    </div>
```

导航条中有不同的内容，点击后进行子路由的切换。

- `tag`表示将`router-link`换成其他标签。
- `jc-round`，表示使用`justify-content:space-around`。

```vue
		<div class="bg-primary pt-3 pb-2">
      <div class="nav d-flex text-white jc-around">
        <div class="nav-item active">
          <router-link class="nav-link" to="/" tag="div">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">攻略中心</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">赛事中心</router-link>
        </div>
      </div>
    </div>
```

### 顶部轮播(swiper)

使用`vue swiper`进行轮播图播放。

安装`npm install swiper vue-awesome-swiper`。

在main.js中引入：

```js
import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper);
import "swiper/css/swiper.css";
```

在需要使用的页面使用：

`swiper-pagination-bullet`是swiper自带的点的样式名，我们更改其中的样式。

```vue
		<swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper1.jpeg" alt="" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper2.jpeg" alt="" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper3.jpeg" alt="" />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right px-3 pb-2"
        slot="pagination"
      ></div>
    </swiper>
<style lang="scss">
@import "../assets/scss/variables.scss";
.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: white;
    &.swiper-pagination-bullet-active {
      background: map-get($colors, "info");
    }
  }
}
</style>
```

设置`ref`，定义`options`其中有我们需要更改的配置。

`loop`表示循环播放，`autoplay`表示自动轮播。

```js
data() {
    return {
      // swiper
      swiperOptions: {
        loop: true,
        autoplay: true, // 自动轮播
        pagination: {
          el: ".pagination-home",
    		},
  		}
		}
	}
```

## 分类

### 精灵图片(sprite)

将许多小的图片放在一起，这样只用下载一次，请求一次接口即可。

通过背景定位的方式选择该使用哪张图片。可以使用`Sprite Cow`定位精灵图片中的位置。

```vue
		<div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="(items, i) in sprite" :key="i">
          <i class="sprite" :class="`sprite-${items.icons}`"></i>
          <div class="py-2">{{ items.name }}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm d-flex ai-center jc-center">
        <i class="sprite sprite-arrow mr-1"></i>
        收起
      </div>
    </div>
<style>
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>
```

- 使用flex布局，`.nav-item`定义了每项占用25%，一行只含有4个。

- 每项的右边框都有线条，第4项，第8项，第`4n项`等没有右边框。

- 单独的每项中在sprite图片中的位置都是不同的`height，width，background-position`，通过类名的定义来定位具体的位置，所以可以将数据动态绑定，这样如果需要添加分类等就会更加方便，```:class="`sprite-${items.icons}`"```

  sprite类名中每项都有宽高和位置，所以可以使用scss中的`@each`工具类来编写css。

  使用方法：`@each $var in <list>`，$var是之后使用的参数，可以为任何值，首部必须是**$**。`<list>`是文件中定义的变量，变量中的每个值的使用顺序和参数中的定义顺序相同。

  ```scss
  $news: (news, 1.7692rem, 1.5385rem, 63.546% 15.517%);
  //...
  $arrow: (arrow, 0.7692rem, 0.7692rem, 38.577% 52.076%);
  $icons: ( $news, $stories, $shop, $experience, $couple, $glory, $fan, $camp, $public, $arrow );
  @each $n, $w, $h, $p in $icons {
    .sprite-#{$n} {
      width: $w;
      height: $h;
      background-position: $p;
    }
  }
  //编译后
  .sprite-news {
    width:1.7692rem;
    height:1.5385rem;
    background-position:63.546% 15.517%;
  }
  ```

### 字体图标(iconfont)

字体图标iconfont是不同于`sprite`的另一种icon定义方式。

一般使用的是阿里巴巴矢量库。

第一步：引入项目下面生成的 fontclass 代码：

```html
<link rel="stylesheet" href="./iconfont.css">
```

 第二步：挑选相应图标并获取类名，应用于页面：

```html
<i class="iconfont icon-Artifact-yingxiong"></i>
```

开发中其实许多的样式都是类似的，例如导航条，消息列表等。只是其中的数据是不同的，所以可以封装成组件`component`。

这个项目中，每张''卡片''的头部都是iconfont，文字标题，menu图标。每张卡片的iconfont不同，标题也不同，所以可以给标题卡片封装成一个组件。

main.js中引入：

- 引入组件`Card.vue`并命名，`Vue.component("m-card", Card);`使用该组件，第一个参数表示该组件的标签名，第二个参数为组件名。

```js
import Card from "./components/Card.vue";
Vue.component("m-card", Card);
```

组件内封装的内容有：

标题卡片中包含了传递过来的icon和标题等信息。`card-body`还可以使用插槽`slot`，为页面中的其他内容占个位置。

```vue
<template> 
  <div>
    <div class="card bg-white mt-2 p-3">
      <div class="card-header d-flex pb-4">
        <i class="iconfont fs-xxs" :class="`icon-${icon}`"></i>
        <div class="fs-xl flex-1 px-2">{{ title }}</div>
        <i class="iconfont fs-xxs">&#xe623;</i>
      </div>
      <div class="card-body"> 
        <slot></slot>
      </div>
    </div>
  </div>
</template>
```

使用组件：

在需要使用的地方插入即可。如果需要传入参数，需要动态绑定图标icon和标题title，使用props定义接受的参数。

在标签内添加的代码会在定义插槽的位置被插槽替换。

```vue
<m-card :icon="icon" :title="title">
<!--其他代码-->
</m-card>
<script>
export default {
  props: {
    //Home.vue传来的数据
    icon: { type: String, required: true },
    title: { type: String, required: true }, 
  }, 
};
</script>
```

## 列表卡片组件 

在"卡片"中，标题组件之后就是每个部分具体的内容。这部分具体的内容就是组件中的`listCard`。

`card.vue`表示的是标题部分的组件，`LsitCard.vue`表示的就是类似新闻资讯下的导航组件。将其封装，就可以通过它对相同的组件进行调用。

**Home.vue：**

主页面是使用定义的列表卡片标签：`m-list-card`

传递的三个参数分别是：icon，标题，和内容数组categories。

newCats数组中包含了组件需要渲染的数据。是一个数组，数组中的项是对象，对象中就对应了不同的导航条的标题和内容。

```vue
		<m-list-card icon="Menu" title="新闻资讯" :categories="newsCats">
      <!-- 卡片轮播中的数据需要用插槽传递 -->
      <template #items="{ category1 }">
        <div class="py-2" v-for="(news, i) in category1.newsList" :key="i">
          <span>[{{ news.categoryName }}]</span>
          <span>|</span>
          <span>{{ news.title }}</span>
          <span>{{ news.data }}</span>
        </div>
      </template>
    </m-list-card>
```

**LsitCard.vue：**

- 这个组件中包含两部分，第一部分就是卡片中的导航条，通过主页面中的categories数组传来的数据渲染组件。

  使用v-for将数组中的每项取出。每项代表每个导航相关的内容。

  数组内每项有两个内容，第一个是导航的名字category.name。第二个是名字相关的具体内容，包含了资讯类型，资讯标题，资讯所属分类，资讯日期。

```vue
<!--这个组件表示的就是小标题导航下的列表组件-->
		<m-card :icon="icon" :title="title">
      <div class="nav jc-between pt-3">
        <div
          class="nav-item"
          :class="{ active: active1 === i }"
          v-for="(category, i) in categories"
          :key="i"
          @click="active1 = i"
        >
          <div class="nav-link">{{ category.name }}</div>
        </div>
      </div>
      <div class="pt-3">
        <swiper>
          <swiper-slide v-for="(category2, i) in categories" :key="i">
            <!-- 卡片轮播中的内容 -->
            <slot name="items" :category1="category2"></slot>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>
```

## 首页新闻资讯



## 首页英雄列表

## 新闻详情页

## 英雄详情页