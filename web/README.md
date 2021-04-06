# 移动端网站

## 1. 初始化

### "工具样式"和SCSS

工作样式表示的是页面中许多的class类都是可以重复定义的，所以可以使用工具进行复用。

使用scss进行css代码的编写。

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

### 网站色彩和字体定义(colors, text)

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

### 通用flex布局样式定义(flex)



### 常用边距定义(margin, padding)

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

## 6. 首页顶部轮播图片(vue swiper)



## 7. 使用字体图标(iconfont)

## 8. 使用精灵图片(sprite)

## 9. 卡片组件(card)

## 10. 列表卡片组件(list-card, nav, swiper)

## 11. 首页新闻资讯

## 12. 首页英雄列表

## 13. 新闻详情页

## 14. 英雄详情页