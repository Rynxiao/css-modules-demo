## 为什么引入CSS Modules

或者可以这么说，CSS Modules为我们解决了什么痛点。针对以往我写网页样式的经验，具体来说可以归纳为以下几点：

### 全局样式冲突

过程是这样的：你现在有两个模块，分别为A、B,你可能会单独针对这两个模块编写自己的样式，例如a.css、b.css，看一下代码

```javascript
// A.js
import './a.css'
const html = '<h1 class="text">module A</h1>'

// B.js
import './b.css'
const html = '<h1 class="text">module B</h1>'
```

下面是样式：

```css
/* a.css */
.text {
    color: red;
}

/* b.css */
.text {
    color: blue;
}
```

导入到入口APP中

```javascript
// App.js
import A from './A.js'
import B from './B.js'

element.innerTHML = 'xxx'
```

由于样式是统一加载到入口中，因此实际上的样式合在一起（这里暂定为mix.css）显示顺序为：

```css
/* mix.css */

/* a.css */
.text {
    color: red;
}

/* b.css */
.text {
    color: blue;
}
```

根据CSS的Layout规则，因此后面的样式会覆盖掉前面的样式声明，最终有效的就是`text`的颜色为`blue`的那条规则，这就是全局样式覆盖，同理，这在`js`中也同样存在，因此就引入了模块化，在js中可以用立即执行函数表达式来隔离出不同的模块

```javascript
var moduleA = (function(document, undefined){
    // your module code
})(document)

var moduleB = (function(document, undefined){
    // your module code
})(document)
```

而在css中要想引入模块化，那么就只能通过`namespace`来实现，而这个又会带来新的问题，这个下面会讲到

## 嵌套层次过深的选择器

为了解决全局样式的冲突问题，就不得不引入一些特地命名`namespace`来区分`scope`，但是往往有些`namespace`命名得不够清晰，就会造成要想下一个样式不会覆盖，就要再加一个新的`namespace`来进行区分，最终可能一个元素最终的显示样式类似如以下：

```css
.widget .table .row .cell .content .header .title {
  padding: 10px 20px;
  font-weight: bold;
  font-size: 2rem;
}
```

在上一个元素的显示上使用了7个选择器，总结起来会有以下问题：

- 根据CSS选择器的解析规则可以知道，层级越深，比较的次数也就越多。当然在更多的情况下，可能嵌套的层次还会更深，另外，这里单单用了类选择器，而采用类选择器的时候，可能对整个网页的渲染影响更重。
- 增加了不必要的字节开销
- 语义混乱，当文档中出现过多的`content`、`title`以及`item`这些通用的类名时，你可能要花上老半天才知道它们到底是用在哪个元素上
- 可扩展性不好，约束越多，扩展性越差

【注】CSS的渲染规则可以参看这篇文章[探究 CSS 解析原理](https://juejin.im/entry/5a123c55f265da432240cc90)

## 会带来代码的冗余

由于CSS不能使用类似于js的模块化的功能，可能你在一个css文件中写了一个公共的样式类，而你在另外一个css也需要这样一个样式，这时候，你可能会多写一次，类似于这样的

```css
/* a.css */

.modal {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
}
.text {
    color: red;
}

/* b.css */
.modal {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
}
.text {
    color: blue;
}
```
那么在合并成app.css的时候，就会被编写两遍，虽然样式不会被影响，但是这样实际上也是一种字节浪费，当然，上述的这种情况完全是可以通过公用全局样式来达到目的，但是，这种代码重复通常是在不知情的情况下发生的。

## 一些解决方案

针对上述的一些问题，也有一些解决方案，具体如下：
### CSS预处理器(Sass/Less等)

Sass,Less的用法这里不再赘述，如果不清楚，可以自己查阅相关资料去了解一下。

CSS预处理器最大的好处就是可以支持模块引入，用js的方式来编写CSS，解决了部分`scope`混乱以及代码冗余的问题，但是也不能完全避免。同时，也没有解决全局样式的冲突问题

一个`SASS`的的文件是这样的：

```css
/* app.sass */

@import './reset'
@import './color'
@import './font'
```

可以实际上编译之后，终究还是一个文件，因此不可避免的会出现冲突样式

### BEM（Block Element Modifier）

> There are only two hard problems in Computer Science: cache invalidation and naming things — Phil Karlton

`BEM`就是为了解决命名冲突以及更好的语义化而生的。

#### BEM名词解释

- Block：逻辑和页面功能都独立的页面组件，是一个可复用单元，特点如下：

  -  可以随意嵌套组合
  -  可以放在任意页面的任何位置，不影响功能和外观
  -  可复用，界面可以有任意多个相同Block的实例
-  Element：Block的组成部分，依赖Block存在（出了Block就不能用）
- [可选]定义Block和Element的外观及行为，就像HTML属性一样，能让同一种Block看起来不一样

#### 命名规则

`Block`作为最小的可复用单元，任意嵌套不会影响功能和外观，命名可以为`header`、`menu`等等

```html
<style>
    .header { color: #042; }
</style>

<div class="header">...</div>
```

`Element`依附Block存在，没有单独的含义，命名上语义尽量接近于Block，比如`title`、`item`之类

```html
<style>
    .header { color: #042; }
    .header__title { color: #042; }
</style>

<div class="header">
    <h1 class="header__title">Header</h1>
</div>
```

`Modifier`是一个元素的状态显示，例如`active`、`current`、`selected`

```html
<style>
    .header--color-black { color: #000; }
    .header__title--color-red { color: #f00; }
</style>

<div class="header header--color-black">
    <h1 class="header__title">
        <span class="header__title--color-red">Header</span>
    </h1>
</div>
```

【说明】

- Block完全独立，可以嵌套，一个header是一个Block，header下的搜索框也可以是一个Block
- 不可能出现`Block__Element-father__Element-son_Modifer`这种类名的写法，BEM只有三级
- Modifier可以加在Block和Element上面
- Modifier作为一个额外的类名加载Block和Element上面，只是为了改变状态，需要保留原本的class

#### 一个完整的示例

```html
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```
```css
.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```

参考链接：

- [get BEM](http://getbem.com/naming/)
- [BEM(Block-Element-Modifier)](http://www.ayqy.net/blog/bem-block-element-modifier/)
- [如何看待 CSS 中 BEM 的命名方式？](https://www.zhihu.com/question/21935157)


BEM解决了模块复用、全局命名冲突等问题，配合预处理CSS使用时，也能得到一定程度的扩展，但是它依然有它的问题：

- 对于嵌套过深的层次在命名上会给需要语义化体现的元素造成很大的困难
- 对于多人协作上，需要统一命名规范，这同样也会造成额外的effort

## CSS Modules

说了这么多，终于要到正文了

### 什么是CSS Modules

根据CSS Modules的[repo](https://github.com/css-modules/css-modules)上的话来说是这样的：

> CSS files in which all class names and animation names are scoped locally by default.

所以CSS Modules并不是一个正式的声明或者是浏览器的一个实现，而是通过构建工具（webpack or  Browserify）来使所有的class达到scope的一个过程。

### CSS Modules 解决了什么问题

- 全局命名冲突，因为CSS Modules只关心组件本身，只要保证组件本身命名不冲突，就不会有这样的问题，一个组件被编译之后的类名可能是这样的：

```css
/* App.css */
.text {
    color: red;
}

/* 编译之后可能是这样的 */
.App__text___3lRY_ {
    color: red;
}
```
命名唯一，因此保证了全局不会冲突。

- 模块化

可以使用`composes`来引入自身模块中的样式以及另一个模块的样式：

```css
.serif-font {
  font-family: Georgia, serif;
}

.display {
  composes: serif-font;
  font-size: 30px;
  line-height: 35px;
}
```

应用到元素上可以这样使用：

```js
import type from "./type.css";

element.innerHTML = 
  `<h1 class="${type.display}">
    This is a heading
  </h1>`;
```

之后编译出来的模板可能是这样的：

```html
<h1 class="Type__display__0980340 Type__serif__404840">
  Heading title
</h1>
```

从另一个模块中引入，可以这样写：

```css
.element {
  composes: dark-red from "./colors.css";
  font-size: 30px;
  line-height: 1.2;
}
```

- 解决嵌套层次过深的问题

因为CSS Modules只关注与组件本身，组件本身基本都可以使用扁平的类名来写，类似于这样的：

```css
.root {
  composes: box from "shared/styles/layout.css";
  border-style: dotted;
  border-color: green;
}

.text {
  composes: heading from "shared/styles/typography.css";
  font-weight: 200;
  color: green;
}
```

### CSS Modules 怎么用

CSS Modules不局限于你使用哪个前端库，无论是React、Vue还是Angular，只要你能使用构建工具进行编译打包就可以使用。

下面我使用`webpack`为例，一步一步引入CSS Modules.

#### 构建最初始的应用

```
.
├── build
│   └── bundle.js
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── src
│   ├── index.js
│   └── styles
└── webpack.config.js
```

index.js作为程序入口，styles文件夹存放样式文件，配合webpack.config.js作为webpack配置文件。

```javascript
// index.js
var html = `<div class="header">
	<h2 class="title">CSS Modules</h2>
</div>`

document.getElementById('container').innerHTML = html;
```

样式文件：

```css
/* global.css */
* {
	margin: 0;
	padding: 0;
}

.container {
	padding: 20px;
}

/* index.css */
.header {
	font-size: 32px;
}

.title {
	border-bottom: 1px solid #ccc;
	padding-bottom: 20px;
}
```

模板文件：

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>css modules</title>
</head>
<body>
	<div id="container" class="container"></div>
	<script src="./build/bundle.js"></script>
</body>
</html>
```

全局安装依赖，配置执行脚本：

```cmd
npm install webpack webpack-cli --save-dev
```

package.json

```json
"scripts": {
    "build": "npx webpack && open index.html"
}
```

在控制台执行`npm run build`， 得到的结果为：

```
> css-modules-demo@1.0.0 build /Users/yhhu/Documents/coding/css-modules-demo
> npx webpack && open index.html

Hash: 5810d2ecd760c08cc078
Version: webpack 4.17.1
Time: 78ms
Built at: 2018-08-26 15:09:31
    Asset      Size  Chunks             Chunk Names
bundle.js  3.97 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/index.js] 196 bytes {main} [built]
```

#### 加入样式以及loaders

package.json中加入能够处理css的loader

```json
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        include: __dirname + '/src',
        exclude: __dirname + '/src/styles'
     	},
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {         
            }
          }
        ]
      }
    ]
  }
```
index.js中引入两个CSS文件

```javascript
// index.js
import './styles/global.css'
import './styles/index.css'

const html = `<div class="header">
	<h2 class="title">CSS Modules</h2>
</div>`

document.getElementById('container').innerHTML = html;
```

编译之后的执行结果为：

![build](http://oyo3prim6.bkt.clouddn.com/cssmodules/css-loader-build.png)

在浏览器中显示为：

![css-loader](http://oyo3prim6.bkt.clouddn.com/cssmodules/css-loader.png)

#### 提取公有样式

可以看到打包之后的`build`目录下只有一个`bundle.js`，我们现在要把样式文件提取出来

```
./build/
└── bundle.js
```

- 安装依赖

```shell
npm install --save-dev mini-css-extract-plugin
```

- 修改`webpack.config.js`

```javascript
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

modules: {
    rules: [
        // {
        //   test: /\.css$/,
        //   use: [
        //   	{ loader: "style-loader" },
        //     {
        //     	loader: "css-loader",
        //     	options: {
        
        //     	}
        //     }
        //   ]
        // },
        {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: './build/styles'
                }
              },
              { 
                loader: "css-loader",
                options: {
                    
                }
              }
            ]
        }        
    ]
},
plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
],
```
- 在模板中引入样式文件

```html
<!-- index.html -->

<!DOCTYPE html>
<head>
	<link rel="stylesheet" href="./build/main.css">
</head>
<body>
	<div id="container" class="container"></div>
	<script src="./build/bundle.js"></script>
</body>
```
- 编译打包

![extract](http://oyo3prim6.bkt.clouddn.com/cssmodules/extract.png)

可以看到有`main.css`生成

#### 开启css modules功能

默认在`css-loader`中是不开启`css modules`功能的，要开启可以设置`modules: true`即可，更多可以参看官方[`css-loader`使用方法](https://webpack.js.org/loaders/css-loader/#modules)修改`webpack.config.js`，如下：

```javascript
{
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: './build/styles'
        }
      },
      { 
        loader: "css-loader",
        options: {
            modules: true
        }
      }
    ]
}        
```

修改`index.js`文件中的引用方式：

```javascript
import './styles/global.css'
import Index from './styles/index.css'

const html = `<div class=${Index.header}>
	<h2 class=${Index.title}>CSS Modules</h2>
</div>`

document.getElementById('container').innerHTML = html;
```

可以看到，之前都是直接`import`一个`css`文件，而现在改成了导出一个对象的形式，我们可以把`Index`对象打印出来，看看具体是些什么东西：

![object](http://oyo3prim6.bkt.clouddn.com/cssmodules/module-object.png)

直接对应我们引用的方式，然后我们再看看生成出来的`main.css`中具体有哪些东西：

```css
* {
	margin: 0;
	padding: 0;
}

._2BQ9qrIFipNbLIGEytIz5Q {
	padding: 20px;
}
._3Ukt9LHwDhphmidalfey-S {
	font-size: 32px;
}

._3XpLkKvmw0hNfJyl8yU3i4 {
	border-bottom: 1px solid #ccc;
	padding-bottom: 20px;
}
```

合成一个文件之后，所有的类名都经过了哈希转换，因此确保了类名的唯一性，我们再看看浏览器中`inspector`中的样式应用，如下：

![no-transform](http://oyo3prim6.bkt.clouddn.com/cssmodules/no-transform.png)

事实上，`container`样式我们是不需要转换的，因为我是把它固定写死在了容器上，那我们应该怎么做呢？

#### 全局作用域

要想一个类名不需要被装换，那么可以使用`:global(className)`来进行包装，这样的类不会被转换，会被原样输出，下面我们修改`global.css`

```css
/* global.css */
* {
	margin: 0;
	padding: 0;
}

:global(.container) {
	padding: 20px;
}
```

我们再来看看`main.css`

![global](http://oyo3prim6.bkt.clouddn.com/cssmodules/global.png)

就可以发现`.container`类没有被转换

#### 定义哈希类名

CSS Modules默认是以[hash:base64]来进行类名转换的，可辨识度不高，因此我们需要自定义

开启自定义，可以使用一个配置参数`localIdentName`，具体配置如下：

```javascript
{ 
  loader: "css-loader",
  options: {
  	modules: true,
  	localIdentName: '[path][name]__[local]--[hash:base64:5]'
  }
}
```

![localIdentName](http://oyo3prim6.bkt.clouddn.com/cssmodules/local-ident-name.png)

#### 类名组合

如果我们实现类似于`Sass`的继承功能，我们需要怎么做呢？CSS Modules中提供了`composes`关键字让我们来继承另外一个类，修改`index.css`如下：

```css
.red {
	color: red;
}

.header {
	font-size: 32px;
}

.title {
	composes: red;
	border-bottom: 1px solid #ccc;
	padding-bottom: 20px;
}
```
我们增加了一个`red`的类名，在`title`中实现继承，编译之后的结果为：

![composes-inner](http://oyo3prim6.bkt.clouddn.com/cssmodules/composes-inner.png)

发现多了一个`src-styles-index__red--1ihPk`的类名，正是我们上面继承的那个类

除了在自身模块中继承，我们还可以继承其他文件中的CSS规则，具体如下：

我们再`styles`文件夹下新建一个`color.css`

```css
/* color.css */
.red {
	color: red;
}

.blue {
	color: blue;
}
```

然后在`index.css`文件中导入

```css
/* index.css */
.red {
	color: red;
}

.header {
	font-size: 32px;
}

.title {
	color: green;
	composes: blue from './color.css';
	composes: red;
	border-bottom: 1px solid #ccc;
	padding-bottom: 20px;
}
```
最终我们会发现文字的颜色为绿色，可见自身模块声明优先级最高，如果把自身申明的`color`去掉，那么自身引入和从其他文件引入的相同申明又该如何显示呢？

答案是自身引入的声明的优先级会比较高。

![override](http://oyo3prim6.bkt.clouddn.com/cssmodules/override.png)

## 总结

至此，所有的CSS Modules用法就已经介绍完毕了，至于后续的还有如何应用于`React`、`Vue`以及`Angular`中，相信掌握了上面的内容之后就可以知道怎么写了，如何与预处理器一起使用相信问题也不大。

## 参考链接

- [CSS Modules — Solving the challenges of CSS at scale](https://medium.com/front-end-developers/css-modules-solving-the-challenges-of-css-at-scale-85789980b04f)
- [github repo](https://github.com/css-modules/css-modules)
- [What are CSS Modules and why do we need them?](https://css-tricks.com/css-modules-part-1-need/)
- [Getting Started with CSS Modules](https://css-tricks.com/css-modules-part-2-getting-started/)
- [Get BEM](http://getbem.com/naming/)
- [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
- [CSS Modules使用详解](http://imweb.io/topic/586519b1b3ce6d8e3f9f99aa)
- [探究 CSS 解析原理](https://juejin.im/entry/5a123c55f265da432240cc90)