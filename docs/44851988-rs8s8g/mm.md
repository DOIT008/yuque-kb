---
description: "基础知识defineProperty 于 Proxy 的区别，响应式系统的实现介绍Vue的响应式是通过Object.defineProperty()实现的，我们知道对于data中的每一个数据都会有对应的一个watcher，一旦这个数据发生改变watcher就会驱动render函数将Vue组件咋..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uce0ghx40g9yhtia"
updated: "2025-07-07T09:24:34.000Z"
---

# mm

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uce0ghx40g9yhtia)

<details class="toc-details">
<summary>本页结构（5 个小节）</summary>

- 基础知识
- 代码示例
- 场景题
- 重点场景
- 软技能

</details>

## 基础知识

defineProperty 于 Proxy 的区别，响应式系统的实现介绍

> Vue的响应式是通过Object.defineProperty()实现的，我们知道对于data中的每一个数据都会有对应的一个watcher，一旦这个数据发生改变watcher就会驱动**render函数**将Vue组件咋转化为更新后的虚拟DOM，然后会调用**patch算法将更新后的虚拟DOM转化为真正的DOM**，当然，针对不同的数据Vue的处理方式也是不一样的，比如我们常见的数组和对象，对于数组Vue内部其实是重写了数组的七个方法，使其除了能够实现原有的功能以外，还能通知更新，对于对象，Vue首先会判断当前这个对象的key是本来就有，如果是就直接进行赋值，如果不是，就会调用defineReactive()方法进行将其变成响应式，当然这一切都是需vm.$set的实现原理，其实这也就是我即将要说的一些对Vue2.0响应式的一些缺点：
> 
> 1.API不够同意，第二，性能相对来说不够强大，你可以想想一下，如果一个疏忽对象的层级比较深该咋办，是不是要进行递归，这会浪费很多的性能。但是有点是兼容性比较好
> 
>   
> 
> 说起来Vue3的响应式，其主要是利用了ES6的proxy（代理）实现的，这样就决定了它的兼容性可能不太好，其原理就像是给每一个数据套上了一层壳，无论你访问还是修改都必须经过这层壳，但是也是有优点的呀：
> 
> 1\. 首先它是原生支持的，语言级别的支持，无论是数组还是对象
> 
> 2\. 效率比较高，如果一个对象层级很深，但是我们在使用该数据的时候使用到 那个层级才再该层级的数据套壳，不适用就不套，很智能，也很优雅

webpack 打包优化方案

> -   **使用** `**image-webpack-loader**`：对图片进行压缩和优化，减少图片体积。
> -   **Tree Shaking**：Webpack 支持 Tree Shaking 来去除未使用的代码，前提是使用 ES6 模块语法。
> -   `**terser-webpack-plugin**` **并行压缩**：使用 `terser-webpack-plugin` 并开启并行压缩功能，加快代码压缩速度。
> -   **使用** `**thread-loader**`：`thread-loader` 可以将耗时的 loader 放在一个单独的 worker 池里运行，以利**用多核 CPU 来加速打包**。
> -   除此之外还有mini-css-extract-plugin(压缩css)
> -   html-webpack-plugin可以自动将 Webpack 打包生成的文件（如 JS 文件、CSS 文件）嵌入到 HTML 文件中。

Vue2和Vue3区别

> 1.  Vue3 **新增**`**setup**`**函数**，作为组合式 API 入口，在组件创建前执行，接收`props`和`context`参数。Vue2 没有此概念。
> 2.  响应式系统，参考第一题
> 
> -   **Teleport（Vue3）**：可将组件内容渲染到 DOM 中任意位置，如模态框、提示框等。Vue2 没有此功能。to属性，可以是选择器字符串也可是某个dom对象
> -   **Suspense（Vue3）**：用于处理异步组件加载状态，可显示加载中提示，加载完成后显示组件内容。Vue2 需手动处理。

css元素隐藏

> 1.  opacity：0：只是将透明度设置为0了，其实质真正的DOM还在，还能交互
> 2.  visibility：hidden：占据着空间，不可以交互了
> 3.  display：none：彻底的删除了元素，也不占空间了
> 4.  z-index：-999：将层级放到了页面底部，彻底看不见了

垂直居中

> 水平居中：  
> display：flex，margin：0 auto，display：table  
> 垂直居中：  
> flex布局，定位+高度－50%，display：table+vertical-align：middle

数据Symbol和Bigint的区别

> `Symbol` 是一种原始数据类型，**表示独一无二的值**，通常用于作为对象的属性名，以避免属性名冲突，实现对象的私有属性和方法
> 
> `BigInt` 是一种内置对象，**用于表示大于** `**2^53 - 1**` **的整数**，可以进行加减乘除运算，可以用Number进行类型转换，但数据精度会丢失

\== 和 === & 对于两个对象比较的区别

> 1.  前者会进行类型转换后进行比较，后者不会进行类型转换
> 2.  无论是使用 `==` 还是 `===` 来比较两个对象，主要比较的都是**对象的引用是否相同**，**而不是对象的具体内容。**

箭头函数和普通函数的区别

> 1.  **本身没有this**,this 绑定的就是最近一层非箭头函数的 this，所以不能new
> 2.  箭头函数**没有自己的 arguments 对象**，但可以访问外围函数的 arguments 对象，跟this性质差不多
> 3.  因为我们不能使用new来调用箭头函数，所以就**没有原型**存在的必要性，更没有super，因为super师继承的意思，箭头函数连原型都没有更别说继承了

闭包和使用场景

> 能访问其他函数内部变量的函数就是闭包，其**典型特征**是内部的变量在函数执行完之后没有销毁（因为内部一直保持着对该变量的引用），一直保存在内存中，所以闭包用多了会造成内存泄漏
> 
> 应用场景：
> 
> 1.  实现私有变量
> 
> 在 JavaScript 中没有真正的私有变量和方法，但可以使用闭包来模拟。通过将变量和方法封装在一个函数内部，只对外暴露必要的接口，从而实现数据的封装和隐藏。

## 代码示例

```js
function createCounter() {
    let count = 0;
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.getCount()); 
console.log(counter.increment()); 
console.log(counter.decrement());
```

> 2.  函数柯里化
> 
> 函数柯里化是指将一个**多参数函数**转换为一系列**单参数函数**的技术

```js
function add(a, b) {
    return a + b;
}

const curriedAdd = function(a) {
    return function(b) {
        return add(a, b);
    };
};

const addFive = curriedAdd(5);
console.log(addFive(3));
```

 前端跨域

> #### a、跨域资源共享CORS
> 
> 就是使用**服务端自定义的 HTTP 头部** 让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败。
> 
> #### b、反向代理NGINX
> 
> **nginx，这是一个反向代理服务器**（反向代理代理服务器，正向代理代理用户）。我们可以使用它来代理**转发请求**。例如当前页面为[https://39.107.104.52:80](https://39.107.104.52:80)，但我们请求的服务器使用http协议并监听3000端口，很明显存在跨域问题，可在nginx配置文件中进行如下配置，**当nginx匹配到/user和/goods开头的请求时，会将请求转发到**[**http://39.107.104.52:3000**](http://39.107.104.52:3000)**。**在浏览器中我们可以发现我们请求的地址仍然是同源的，请求成功。
> 
> #### c、JSONP
> 
> 原理是**动态创建script标签，然后其src属性设置为请求的“url?callback=回调函数名”**的形式，当**数据返回来的时候就会立即执行“回调函数”**，函数的参数就是服务器返回的数据
> 
> -   **不安全**，JSONP 是从其他域中加载代码执行。如果其他域不安全，很可能会在响应中夹带一些恶意代码

对ESM打包过程的了解

> 1.  **确定入口**：指定打包起始的入口文件。
> 2.  **解析模块**：从入口开始，递归解析 `import` 语句，明确模块依赖。
> 3.  **收集依赖**：构建依赖图，记录模块依赖关系和加载顺序。
> 4.  **转换优化**：用加载器转换代码，如 Babel 转 ESNext 代码；实施 Tree - Shaking 等优化。
> 5.  **合并打包**：按依赖图合并模块，选 ESM、CommonJS 等输出格式。
> 6.  **输出文件**：将合并优化后的代码写入指定文件。

布局的时候为什么用translate来改变位置，而不用position呢？

> 因为后position是改变位置，会引发浏览器的重排操作，比较消耗计算资源，**但前者是在合成层不会触发，因为translate是调用gpu进行计算的，性能强大**

重绘和重排

> 重排：一般意味着元素的**内容、结构、位置或尺寸**发生了变化，需要重新计算样式和渲染树。（元素增删/移动/改变大小等）
> 
> 重绘：意味着元素发生的改变只是影响了元素的一些**外观之类的时候（例如，背景色，边框颜色，文字颜色等）**

H5的存储有哪些？

> cookie服务端返回给客户端的，
> 
> -   服务端通过`Set-cookie`返回给客户端，
> -   客户端再次请求会自动携带`cookie`内容
> -   键值对，可以设置多个， `max-age`（秒）和`expire`（时间戳）设置过期时间
> -   **用户身份识别**：当用户登录网站时，服务器可以生成一个包含用户唯一标识的 Cookie 并发送给浏览器。之后，浏览器在每次向该网站发送请求时都会携带这个 Cookie，服务器通过解析 **Cookie 中的信息就能识别出是哪个用户在访问，**从而为用户提供个性化的服务，如显示用户的用户名、购物车信息等。例如，在电商网站中，用户登录后，服务器会将用户 ID 存储在 Cookie 中，后续用户浏览商品、下单等操作时，服务器都能根据这个 Cookie 确认用户身份。
> 
> localstorage和sessionStorage就是纯客户端的

Vue中的父子组件声明周期的执行顺序？

> 1.  加载渲染过程：父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
> 2.  销毁过程：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

接口访问是放在Mounted还是Created里面？什么情况需要放到Created里面？

> 首先**created时已经完成实例的创建**，并完成了数据的观测和方法的初始化等，**只是还没完成挂载**，而mounted时已经完成了挂载，此时已经可以访问dom了，也就是说如果页面渲染需要请求的数据此时可以放到created里面，如果依赖dom操作，则可以放到mounted里面

vue2和vue3的render时区别

> **vue2：**render是createdElement呀创建一个Vnode，最常见的说就是h函数
> 
> **vue3：**是把虚拟DOM渲染成真DOM

说说基本数据类型和引用数据类型在内存存储的差异

> 基本类型：直接存储在**栈内存中。访问速度快，复制时复制的值**
> 
> 引用类型：对象本身存于**堆内存**，**栈内存存储**指向堆内存中对象的引用（**地址**），复制的是地址，访问速度慢

代码如何实现深拷贝？

> 1.  递归(实现)
> 2.  JSON.parse(JSON.stringify())，**缺点：REG对象序列化后是空对象{}，函数会丢失**

```js
function recurObj(obj) {
    let obj2 = {};
    for (const key in obj) {
        if(Array.isArray(obj[key])){
            // 判断是否是数组
            let arr = [...obj[key]];
            obj2[key] = arr
        }else if(typeof obj[key]==='object'){
             // 如果是对象的话
            obj2[key] = recurObj(obj[key]);
        }else{
            // 基本值
            obj2[key] = obj[key]
        }
    }
    return obj2
}

```

 说一下JS的事件循环

> 同步代码-->清空微任务（promise.then）-->页面渲染-->取出宏任务(settimeOut,setinterval，事件触发等)队列中的一个

async...await 如何捕获异常？

> try...catch

Map和object的区别

> 键名：前者可以是任何类型，后者只能是字符串（即便不是也会转化为字符串）
> 
> 大小：前者有size属性，返回有几个属性，后者只能便利
> 
> 迭代：map可用forEach迭代，object使用for...in或者Object.keys(),Object.values()迭代

3.flex布局，flex属性有哪些，还了解别的布局吗？详细说说

> ### `align-self`
> 
> **作用**：允许单个项目有与其他项目不一样的对齐方式，可覆盖 `align-items` 属性。
> 
> flex-direction:确定主轴方向，row：起点再左端（默认），column（起点再上端）
> 
> order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

还有定位布局、正常流布局、浮动布局

盒模型

> 6.  一个元素所占据的空间是由margin-left+border-left+paddind-left+width+padding-right+border-right+margin-right组成的，这里的width是真正能装东西的区域  
>     怪异盒模型  
>     width：border-left+padding-left+内容区+padding-right+border-right  
>     其元素所占据的空间是margin-left+width+margin-right，**也就是说对width的定义不一样**
> 
> 可以通过box-sizing来控制当前使用哪种模式：content-box(标准)，border-box（怪异）

JS数据类型，typeOf判断，还有别的数据类型判断方法吗？

> typeof只能用来判断基础类型和函数function，对于对象不管是对象还是其他都返回Object,
> 
> 数组：Array.isArray()
> 
> 数字：Number.isNaN(a):只有a是NAN时才是true，isNaN()：不能转化为数字的都为true

如何判断一个对象为空？

> 1.  Object.keys()：缺点是不能检测原型链上的属性
> 2.  JSON.stringify（）:有局限性
> 3.  Reflect.ownKeys()：返会一个数组，兼容性

this 指向问题

> **函数内this的指向是在函数调用的时候确定的，this的指向于当前函数的最直接的调用者！**
> 
> 1.  foo函数前面啥也没有，this指向window
> 2.  类似obj.foo()，this指向obj，如果是obj1.obj2.foo()，this是指向obj2，因为obj2更近
> 3.  bind,call,apply则指向其第一个参数
> 4.  new出来的构造函数实例，this指向该实例
> 5.  **箭头函数的 this 始终指向箭头函数定义时所处环境的 this，而非执行时**，箭头函数需要记着这句话：“箭头函数中没有 this 绑定，必须通过**查找作用域链来决定其值（既然是作用域链嘛，那就是词法作用域咯，跟函数声明的位置有关）**，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 window”

nextTick

> 我们知道Vue再更新DOM的时候是**异步的，也就意味着当数据发生改变的时候，并不是立即更新，而是开启一个队列**，并缓冲在同一个事件循环中所发生的所有的数据的变更，这个策略就会导致上述我们数据的变更并不会立即更新到DOM上，这也就是我们为啥要使用`nextTick`**，nextTick会在队列加入一个函数callback（就是nextTick的回调，Promise），遍历循环，由于是在最后，所以肯定是DOM已经更新完了**。

var、const、let 对比

> 1.  let const 没有变量提升
> 2.  不会成为全局属性window.xxx，访问不到
> 3.  块级作用域，只能在{}内部访问let const定义的变量，否则访问不到
> 4.  **const 声明不允许修改绑定（指针指向），但允许修改值**

0.1+0.2!=0.3

> Javascript底层数字的存储知识，js中的数字都只有一种类型就是`Number`，使用64位固定长度来表示，是**double双精度浮点数，在二进制科学表示法中，双精度浮点的****小数部分****最多只能保留52位（**比如`1.xxx...*2^n`,这里`x`最多保留52位）加上前面的1，其实就是保留53位有效数字，剩余的舍去，遵从“0舍1入”**精度丢失**

样式兼容性问题怎么解决

> `-webkit-`（Chrome、Safari）、`-moz-`（Firefox）、`-ms-`（IE）等。可以使用自动添加浏览器前缀的工具，或者使用webpack插件autoprefixer

三次握手和四次挥手

> ## 三次握手原因
> 
> 三次握手是为了在客户端和服务器之间安全可靠地建立 TCP 连接，好比两个人打电话建立沟通：
> 
> -   客户端先说 “我要和你通话，这是我的起始话题编号”，表明想建立连接并告知自己的起始信息。
> -   服务器回应 “我同意通话，这是我的起始话题编号，我收到你的编号了”，表示同意连接并同步自己的起始信息。
> -   客户端再回 “我收到你同意的消息和你的编号了”，双方都确认彼此能正常收发信息，就可以正式交流数据了。要是只交流两次，服务器不知道客户端是否收到自己的同意信息，连接就可能不稳定。
> 
> ## 四次挥手原因
> 
> 四次挥手用于安全关闭 TCP 连接，类似两人结束通话：
> 
> -   客户端说 “我说完了，但还能听你说”，表示自己没数据要发了，但还能接收。
> -   服务器回复 “我知道你说完了”，确认收到客户端的关闭意愿，但可能自己还有话说。
> -   服务器接着说 “我也说完了”，表明自己也没数据要发了。
> -   客户端最后回应 “我知道你也说完了”，双方都确认可以结束连接，就正式挂掉电话。因为 TCP 连接双方能同时收发数据，所以分四次来确保双方都能正确终止数据传输。

react生命周期

> -   `**render()**`：须实现的纯函数，用于返回需要渲染的 JSX 元素，不会修改组件的状态
> -   `**componentDidMount()**`：组件已经挂载到 DOM 之后调用，适合进行网络请求、订阅事件等副作用操作。
> -   `**componentDidUpdate(prevProps, prevState)**`：组件更新完成后调用，可以在这里操作更新后的 DOM。
> -   `**componentWillUnmount()**`：在组件即将卸载和销毁之前调用，用于清理定时器、取消网络请求、解除事件监听等操作。

react Hooks

> 它可以让你在不编写 `class` 的情况下使用 `state` 以及其他 React 特性

http和https的区别

> -   **安全性**：HTTP 是超文本传输协议，它以**明文形式传输数据**，容易被中间人窃取和篡改。**HTTPS 是在 HTTP 的基础上加入了 SSL/TLS 协议进行加密**，数据在传输过程中会被加密，保证了数据的安全性和完整性。
> -   **端口号**：HTTP 默认使用 **80** 端口，HTTPS 默认使用 **443** 端口。
> -   **证书**：**HTTPS 需要使用 SSL/TLS 证书，**该证书由受信任的第三方机构颁发，**用于验证网站的身份。**

观察者模式和发布者订阅模式的区别

1.  ‌**通信方式**‌：

-   ‌**观察者模式**‌：观察者直接订阅主题对象，当主题对象状态变化时，直接通知观察者。**观察者和主题对象之间是直接通信的‌****12****。**
-   ‌**发布者-订阅者模式**‌：**发布者和订阅者之间通过消息代理（或事件中心）进行通信**。发布者发布消息到消息代理，消息代理再将消息传递给订阅者，实现了发布者和订阅者的解耦‌12。

2.  ‌**灵活性**‌：

-   ‌**观察者模式**‌：**观察者和主题对象之间相互依赖**，主题对象需要维护观察者列表，并在状态变化时主动通知观察者。这种模式的灵活性相对较低，因为发布者和订阅者之间存在直接的依赖关系‌13。
-   ‌**发布者-订阅者模式**‌：**更为灵活，发布者和订阅者之间解耦。发布者不需要知道具体的订阅者，订阅者也不需要知道具体的发布者，它们只与消息代理进行交互****。**这种设计使得发布者和订阅者能够独立工作，提高了系统的灵活性和可扩展性‌12。

webpack5对比webpack4有什么优化

1.  内置持久化缓存，4可以通过插件实现，但效果不一定好
2.  并行构建，显著提升打包速度
3.  增强了 Tree Shaking 功能

-   数组不改变自身：map
-   css不会继承其父元素样式：border

## 场景题

为什么要有异步的action？

> **处理异步任务：**实际开发常有和后端交互等异步操作，如发 HTTP 请求获取数据，**完成时间不确定，异步 action 可处理这类请求，等结果出来再更新状态。**
> 
> ## 分离业务逻辑
> 
> 异步操作逻辑复杂，像请求参数处理、错误处理等。将这些封装在 action，能让组件代码简洁，专注视图渲染和交互。

为什么要状态管理工具而不是直接存到localstorage里？

> 响应式（方便更新视图），方便追踪（方便定位问题），跨组件通信

两种打包方式感觉有什么差异？

> vite：快，生态不太成熟，开箱即用，基于原生 ES 模块，开发时**按需编译，利用浏览器缓存。Rollup打包**
> 
> webpack：慢，生态成熟，配置相对复杂，**打包式构建，先解析处理所有模块再打包。**

vite的按需加载怎么实现的？

> 1.  **动态导入语法**：动态导入是 ES2020 引入的特性，它允许你在运行时动态加载模块。Vite 充分利用此特性达成按需加载 await import（模块）
> 2.  **路由动态：**component:()=>import(路由)
> 3.  **自身支持**：Vite 会利用 Rollup 进行打包，Rollup 会把动态导入的模块拆分成**独立的文件**，**浏览器在需要时再去加载这些文件**

webpack也可以热更新，增量patch怎么实现的？

> 1.  **监听**：Webpack 编译器监听文件变化。
> 2.  **编译**：变化发生，重新编译受影响模块，生成更新后的代码和补丁。
> 3.  **发送**：HMR 服务器把补丁通过 WebSocket 发给浏览器。
> 4.  **应用**：浏览器 HMR 运行时接收、解析补丁，替换旧模块完成更新。

sass是怎么穿换成css的？

> 解析-->**token(词法单元)**\-**\-词法解析器**\--->抽象语法树（**AST**）--->css文本

图片压缩

> **前端：**将图片绘制到 Canvas 上，然后使用 `toBlob` 或 `toDataURL` 方法以指定的质量重新导出图片，从而实现压缩。
> 
> **三方库：**Compressor.js

Vue 文件是如何被转换并渲染到页面的？

> template：render函数生成虚拟DOM
> 
> script：使用 Babel 等工具对 JavaScript 代码进行转译，
> 
> style：用 CSS 加载器（如 `css-loader`、`style-loader`）处理样式代码
> 
> diff算法->虚拟dom--真实dom

new 的过程

> 1.  创建了一个空对象(因为我们得到的本身就是一个对象)
> 2.  新创建的对象原型指向构造函数的原型
> 3.  执行构造函数并将构造函数内部的this指向新创建的对象( call, apply)
> 4.  返回新创建的对象

```js
// 模拟实现new --create(Car,params)
function create () {
    // 创建一个新对象
    var obj = new Object();

    var Con = [].shift.call(arguments);// 是create的第一个参数，也就是构造函数本身（Con）
    // 将对象的原型指向构造函数Con的原型
    obj.__proto__ = Con.prototype
    // 执行构造函数Con，并将其内部的this指向obj---call,这里的arguments已经是从第二个参数开始了
    Con.apply(obj,arguments)
    // 返回新的对象
    return obj
}

var car1 = create(Car,'black');
console.log(car1);
car1.startEngine()//black
```

 防抖节流

> 事件多次触发，我们只在最后一次触发后n秒内执行，在n秒内如果依然触发，则清空定时器，从新的定时器开始。

```js
/**
 * @param {*} fn
 * @param {*} time
 * @returns
 */
function debounce(fn,time) {
    // fn是要执行的函数,每次
    var timeout;
    return function(){
        let args = arguments
        clearTimeout(timeout);// 关键，清空上一次的计时器，开启新的计时器
        timeout = setTimeout(()=>{
            fn.call(this,...args)
        },time)
    }
}
```

> 每隔一定时间执行一次

```js
/**
 * @param {*} fn
 * @param {*} time
 * @returns
 */
function debounce(fn,time) {
    var previous = 0;//第一次默认时间是0
    return function(){
        var now = Date.now()// 获取当前时间戳
        let args = arguments;
        if(now-previous>time){
            fn.call(this,...args)
            previous = now// 将当前的时间戳赋值给previous，重新开始计算新的时间间隔
        }
    }
}
```

 讲一下你最常用的排序方法（冒泡和快排） 

```js
/**
       * 冒泡排序
       * 复杂度:O(n²)
       * 外层每一次循环都会将当次循环的第n小元素排列好（第一次n=1，第二次n=2...）
       * 内层没必要从0开始，因为没必要自己跟自己比较
       */
function popSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 没必要自己跟自己比较啦，所以只需要跟当前元素所在位置开始即可
    for (let j = i; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        let arr_j = arr[j]; // 先把当前值存起来
        arr[j] = arr[i];
        arr[i] = arr_j;
      }
    }
  }
  return arr;
}
console.log("---------冒泡排序--------");
console.log(popSort([3, 5, 7, 2, 1, 100, 23, 999, -1]));

```

 

```js
 /**
       * 选择排序
       * 复杂度:O(n²)
       * 第一次选择最小的拍到前面，第二次选择第二小的排到前面,以此类推
       * 是不是有一种四层相识的感觉———没错，就是最后一步不一样
       */
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min_index = i; // 假设最小的下标是当前下标
    for (let j = i; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换位置嘛
      }
    }
  }
  return arr;
}
console.log("---------选择排序--------");
console.log(selectSort([3, 5, 7, 2, 1, 100, 23, 999, -1]));
```

 

```js
/**
       * 快排,还是递归
       * 它的复杂度为 O(nlog(n))
       * 1. 选择一个基准元素，把数组分为两个子数组。可以随机选择一个元素作为基准元素。
         2. 重排数组以实现小于基准元素的元素被放置在基准的左侧，大于基准元素的元素被放置在右侧。
         3. 对于左侧和右侧的元素重复步骤1和步骤2。也就是递归运行如上步骤，把更大的值和更小的值分割开来。
        */
function quickSort(arr){
  let base = arr[0];
  let left = [];
  let right = []
  if(arr.length<2){
    return arr
  }else{
    for(let i = 1;i < arr.length;i++){
      if(arr[i] > base){
        right.push(arr[i])
      }else{
        left.push(arr[i])
      }
    }
  }
  return [...quickSort(left),base, ...quickSort(right)]
}
```

 call apply bind

> call：第一个参数是this，其他参数按顺序列出
> 
> apply：第一个参数是this，参数数组/类数组
> 
> bind：func.bind(this)(参数)
> 
> 实现：
> 
> ​  

```js
// 实现 call
Function.prototype.myCall = function (context,...args){
  // 拿到函数本身
  context.foo = this
  // 执行函数
  let result = context.foo(...args)
  delete context.foo
  return result;
}

const person1 = {
  name:'李白',
  age:10
}

function sayPerson1(sex){
  console.log(this.name,this.age,sex)
}

sayPerson1.myCall(person1,'男') // 李白，10 ，男
```

 实现 把{a:1,b:{c:2,d:{e:3}}} 拉平为{a:1,c:2,e:3} 

```js
 let baseObj = {a:1,b:{c:2,d:{e:3}}}
function flatObj(baseObj){
  let obj = {}
  for(let key in baseObj){
    if(typeof baseObj[key] === 'object'){
      obj = {...obj, ...flatObj(baseObj[key])}
    }else{
      obj[key] = baseObj[key]
    }
  }
  return obj
}

 
 console.log(flatObj(baseObj))
```

 实现将字符串“\[\[\[2\],5,6,7\],6,7,3\]”转成数组 

```js
  function stringToArr(str){
    let arr = JSON.parse(str)
    let str1 = arr.toString()
    arr = str1.split(',').map(item=>Number(item))
    // 去重
    arr = Array.from(new Set(arr))
    return arr
  }

  console.log(stringToArr("[[[2],5,6,7],6,7,3]"))
```

 判断字符串是否符合XXX-XXX-XXXX的格式，其中X为number类型 

```js
function isValidFormat(str) {
    // 定义正则表达式，匹配 XXX-XXX-XXXX 格式，其中 X 为数字
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(str);
}
```

 实现一个 curry 函数，将一个普通函数转换为柯里化函数。 

```js
// 函数柯里化
function currying(fn) {
  const requiredArgs = fn.length; // 获取原函数需要的参数数量
  return function curry(...args) {
    // 如果收集的参数足够，直接执行原函数
    if (args.length >= requiredArgs) {
      return fn(...args);
    } else {
      // 否则返回新函数继续收集参数
      return function(...nextArgs) {
        return curry(...args, ...nextArgs);
      };
    }
  };
}

// 函数柯里化的应用
function add(a, b, c){
  return a + b + c
}

let addCurrying = currying(add)
console.log(addCurrying(1)(2)(3))
console.log(addCurrying(1, 2)(3))
console.log(addCurrying(1)(2, 3))
console.log(addCurrying(1, 2, 3))
```

 返回开平方根 

```js
let negativeNumber = -25;
let result = Math.sqrt(negativeNumber);
console.log(result);
```

 

```js
function mySqrt(num) {
    if (num < 0) {
        return NaN;
    }
    if (num === 0 || num === 1) {
        return num;
    }
    let x = num;
    // 设定一个精度值，用于控制结果的误差范围
    const precision = 1e-7; 
    while (Math.abs(x * x - num) > precision) {
        x = (x + num / x) / 2;
    }
    return x;
}

// 测试
console.log(mySqrt(25)); 
console.log(mySqrt(3));
```

 

```js
function mySqrt(num) {
    if (num < 0) {
        return NaN;
    }
    if (num === 0 || num === 1) {
        return num;
    }
    let left = 0;
    let right = num;
    let mid;
    // 设定一个精度值，用于控制结果的误差范围
    const precision = 1e-7; 
    while (right - left > precision) {
        mid = (left + right) / 2;
        if (mid * mid > num) {
            right = mid;
        } else {
            left = mid;
        }
    }
    return left;
}
```

 数组转树

将数组（Array）转换为树（Tree）结构是一个常见的编程需求，通常数组中的每个元素代表树中的一个节点，节点之间通过特定的关联字段（如 `id` 和 `parentId`）来确定父子关系。

```js
function arrayToTree(arr) {
    // 首先创建一个空对象，用于存储每个节点的引用，方便快速查找
    const nodeMap = {};
    const tree = [];

    // 第一步：将数组中的每个节点存储到 nodeMap 中
    arr.forEach(node => {
        node.children = [];
        nodeMap[node.id] = node;
    });

    // 第二步：遍历数组，根据 parentId 建立节点之间的父子关系
    arr.forEach(node => {
        if (node.parentId === null || node.parentId === undefined) {
            // 如果节点没有父节点，将其添加到树的根节点列表中
            tree.push(node);
        } else {
            const parent = nodeMap[node.parentId];
            if (parent) {
                // 如果父节点存在，将当前节点添加到父节点的 children 数组中
                parent.children.push(node);
            }
        }
    });

    return tree;
}

// 示例数据
const data = [
    { id: 1, parentId: null },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 1 },
    { id: 4, parentId: 2 },
    { id: 5, parentId: 2 }
];

const tree = arrayToTree(data);
console.log(tree);
```

 箭头函数中的this

箭头函数的 `this` 指向取决于**其定义时**的上下文

```js
// 定义 A 对象
const A = {
    arrowMethod: () => {
        console.log(this);
    }
};

// 定义 B 对象
const B = {
    callAMethod: function() {
        A.arrowMethod();
    }
};

// 在全局作用域下定义，this 指向全局对象（在浏览器环境中是 window）
B.callAMethod();
```

虽然是通过 `B` 对象来触发 `A.arrowMethod` 的调用，但 `A.arrowMethod` 内的 `this` 不会指向 `B`。因为箭头函数 `A.arrowMethod` 定义在全局作用域中，它的 `this` 会继承全局作用域的 `this`。在浏览器环境里，全局作用域的 `this` 指向 `window` 对象。

findFibonacciIndex 给一个数，判断该数是否是斐波那契数列里的一项，若是则返回第几项，若不是则返回-1 

```js
 function findFibonacciIndex(n){
  if(n===1){
    return 1
  }
  let a =1,b = 1,sum = 0,index = 1;
  while(sum<n){
    sum = a+b;
    a = b
    b = sum
    index++
  }
  return sum===n ? index : -1
 }

console.log(findFibonacciIndex(5))
console.log(findFibonacciIndex(1))
```

 给一个字符串，循环输出每一个字符，当输出到最后一个字符时再从头开始 

```js
function loopString(str){
  let index = 0;
  return function(){
    if(index===str.length) index = 0;
    let res = str[index]
    index++
    return res
  }
}

const loop =  loopString('abcde')
console.log(loop(),loop(),loop(),loop(),loop(),loop())
```

 实现链式的加减乘除（myCalculator(1).add(12).minus(3).multi(10).div(5).getValue() === 25） 

```js
function myCalculator(m){
  class Cal {
    constructor(val){
      this.value = val
    }
    getValue(){
      return this.value
    }
    add(newValue){
      this.value += newValue
      return this
    }
    minus(newValue){
      this.value -= newValue
      return this
    }
    multi(newValue){
      this.value *= newValue
      return this
    }
    div(newValue){
      this.value /= newValue
      return this
    }
  }
  let cal = new Cal(m)
  return cal
}

console.log(myCalculator(1).add(12).minus(3).multi(10).div(5).getValue())
```

 若a\*a+b\*b=c\*c，则称a,b,c为勾股数，找出比 n 小的所有勾股数 

```js
function findPythagoreanTriples(n) {
  // 首先最大的可能取值是 [n-2,n-1,n] 且 b > a 
    const result = [];
    // 遍历 a 的可能取值，范围从 1 到 n - 2 
    for (let a = 1; a < n - 1; a++) {
        // 遍历 b 的可能取值，范围从 a + 1 到 n - 1
        for (let b = a + 1; b < n; b++) {
            // 计算 a 的平方加 b 的平方
            const sumOfSquares = a * a + b * b;
            // 计算 c 的值，这里 c 取 sumOfSquares 的平方根
            const c = Math.sqrt(sumOfSquares);
            // 判断 c 是否为整数且小于 n
            if (Number.isInteger(c) && c < n) {
                // 如果满足条件，将这组勾股数添加到结果数组中
                result.push([a, b, c]);
            }
        }
    }
    return result;
}

// 示例调用，找出比 20 小的所有勾股数
const n = 20;
const triples = findPythagoreanTriples(n);
console.log(triples);
```

 给定一个字符串，判断是否对称数，如果是对称数则返回true，否则返回false； 

```js
function isSymmetricNumber(s) {
    return s === s.split('').reverse().join('');
}
```

 一串字符串，当字符\[a-zA-Z\]重复，输出true，否则输出false。  
例1：dssfsfsf–>true  
例2：21333ghksd–>false 

```js
function ss(str) {
  str = str.match(/[a-zA-Z]/g); //[ 'h', 't', 'h' ]
  console.log(str);
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] == str[i + 1]) return true;
  }
  return false;
}
console.log(ss("dssfsfsf"));
```

## 重点场景

浏览器缓存

> **强制缓存**是指浏览器直接从本地磁盘或内存中读取资源，无需向服务器发送请求。当浏览器请求资源时，会先检查本地缓存是否存在该资源，并且该资源是否在有效期内。如果满足条件，则直接使用本地缓存，否则向服务器发送请求。
> 
> -   `**Expires**`：这是 HTTP/1.0 协议中用于控制缓存的字段，它的值是一个具体的时间（GMT 格式），表示资源的过期时间。例如：`Expires: Thu, 31 Dec 2025 23:59:59 GMT`，意味着在这个时间之前，浏览器可以直接使用本地缓存。不过，由于它依赖于客户端和服务器的时钟同步，若两者时钟不一致，可能导致缓存判断出错。
> -   `**Cache-Control**`：是 HTTP/1.1 协议中用于控制缓存的字段，优先级高于 `Expires`。它可以设置多种指令，常见的指令如下：
> 
> -   `max-age`：指定资源的最大有效时间，单位为秒。例如 `Cache-Control: max-age=3600` 表示资源在 1 小时内有效。
> -   `no-cache`：表示需要进行协商缓存，即每次请求都要与服务器进行验证。
> -   `no-store`：禁止使用任何缓存，每次请求都要从服务器获取最新资源。
> -   `public`：表示该资源可以被所有用户（包括代理服务器）缓存。
> -   `private`：表示该资源只能被客户端缓存。
> 
> **协商缓存**是指浏览器在请求资源时，**先向服务器发送请求**，验证资源是否有更新。若资源未更新，服务器返回 304 状态码，浏览器使用本地缓存；若有更新，则返回新的资源。
> 
> -   `**Last-Modified**` **和** `**If-Modified-Since**`：
> 
> -   `Last-Modified` 是服务器返回资源时，在响应头中添加的字段，表示该资源的最后修改时间。
> -   浏览器下次请求该资源时，会在请求头中添加 `If-Modified-Since` 字段，其值为上次响应中的 `Last-Modified` 值。服务器接收到请求后，会将 `If-Modified-Since` 的值与资源的当前最后修改时间进行比较，若相同则返回 304 状态码，否则返回新的资源。

性能优化

> 1.  压缩（html,css,js压缩，图片压缩）
> 2.  精灵图，减少请求次数
> 3.  字体
> 4.  组件/图片懒加载

```js
= () => import('./MyComponent.vue');
```

> 4.  使用cdn，将静态资源（如 CSS、JavaScript、图片等）托管到 CDN（内容分发网络）上，利用 CDN 的全球节点加速资源的下载速度。
> 5.  keep-alive缓存
> 6.  按需加载 框架组件

首页白屏如何解决？

> 原因：网络不佳，请求时间过长等
> 
> **优化网络请求**：采用 CDN（内容分发网络）加速
> 
> **骨架屏：**给用户一个等待提示

点击一个按钮，想要阻塞几秒钟业务逻辑如何实现

> `async/await` 结合 `setTimeout` ,**sleep函数**

项目中懒加载怎么实现的？

> 1.  路由懒加载：()=>import(组件)，其实底层就是利用了 JavaScript 的动态导入特性。`import()` 是 ES2020（ES11）引入的语法糖
> 2.  图片懒加载：属性loading="lazy"，图片懒加载是指当图片进入浏览器**可视区域时**再进行加载， new IntersectionObserver（callback）：异步观察目标元素与其祖先元素

实现图片懒加载还有哪些思路？

> ## 基于滚动事件和偏移量计算，三方库**LazyLoad.js**

  

浏览器从输入URL到结束整个过程

> ## 1\. DNS 解析
> 
> 浏览器先查看本地 DNS 缓存，若没有则向 DNS 服务器发起查询，将域名解析为对应的 IP 地址。
> 
> ## 2\. TCP 连接
> 
> 基于解析得到的 IP 地址和端口号（默认 80 或 443），通过 TCP 协议与服务器建立连接，进行三次握手。
> 
> ## 3\. HTTP 请求
> 
> 连接建立后，浏览器根据 URL 构造 HTTP 请求报文，包含请求方法、请求头、请求体等信息，发送给服务器。
> 
> ## 4\. 服务器处理请求
> 
> 服务器接收到请求后，根据请求信息处理业务逻辑，如查询数据库、调用接口等。
> 
> ## 5\. HTTP 响应​
> 
> 服务器处理完请求后，生成 HTTP 响应报文，包含状态码、响应头、响应体（如 HTML、CSS、JS 等资源），返回给浏览器。
> 
> ## 6\. TCP 断开连接
> 
> 数据传输完成后，浏览器与服务器通过 TCP 四次挥手断开连接。
> 
> ## 7\. 浏览器解析渲染页面
> 
> -   解析 HTML 构建 DOM 树。
> -   解析 CSS 构建 CSSOM 树。
> -   合并 DOM 树和 CSSOM 树生成渲染树。
> -   布局阶段计算元素位置和大小。
> -   绘制阶段将元素绘制到屏幕上。
> -   若有 JS 脚本，执行脚本可能会修改 DOM 和 CSSOM 树，触发重排和重绘。

使用catch捕获异常以后，再在后面使用then，会发生什么？

> 1.  如果 `catch` 块中正常返回一个值（无论是普通值还是新的 `Promise` 对象），后续的 `then` 方法会正常执行，并且 `then` 方法的回调函数会接收到 `catch` 块返回的值。
> 2.  如果 `catch` 块中抛出一个新的异常，后续的 `then` 方法不会执行，而是会触发下一个 `catch` 块（如果存在的话）来处理这个新的异常。
> 3.  如果 `catch` 块中返回一个被拒绝的 `Promise`，后续的 `then` 方法同样不会执行，而是会触发下一个 `catch` 块来处理这个被拒绝的 `Promise`。
> 
>   

项目中的难点

> 可以引导面试官往超时重试功能的实现引导

如果让你实现一个脚手架你会咋办(最近准备把模板项目封装成cli的形式，引导面试官往这方面想)

> 我目前还没这个想法，不过如果我可以说一下我的思路：
> 
> 1.  **明确用途**：想好脚手架用途，比如提供不同前端框架模板、自动装依赖、初始化配置等
> 2.  **初始化项目**：建文件夹，初始化package.json(npm init)
> 3.  **装依赖**：包括commander（创建命令行接口）、inquirer(交互式一步步引导用户，比如模板选择，各种参数选择vuex，vue2还是vue3等)，download-git-repo（从远程下载仓库）
> 4.  写代码

axios封装中，对请求超时怎么处理？ 

```js
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000
});

const MAX_RETRIES = 3; // 最大重试次数

// 响应拦截器
service.interceptors.response.use(
    response => {
        return response.data;
    },
    async error => {
        const config = error.config;
        if (axios.isCancel(error)) {
            console.log('请求被取消:', error.message);
        } else if (error.code === 'ECONNABORTED' && config && config.retries < MAX_RETRIES) {
            // 增加重试次数
            config.retries = (config.retries || 0) + 1;
            // 重新发送请求
            return service(config);
        } else {
            console.log('请求错误:', error.message);
        }
        return Promise.reject(error);
    }
);
```

  

页面多请求并发，如何保证每次都是n个请求在并发 

```js
const axios = require('axios');

// 请求函数
function request(url) {
    return axios.get(url)
        .then(response => ({data: response.data}))
        .catch(error => ({error: error.toString()}));
}

/**
 * 控制并发请求数量
 * @param urls 请求URL数组
 * @param concurrency 并发数
 */
async function controlConcurrency(urls, concurrency) {
    const executing = []; // 正在执行的任务列表
    const results = []; // 存储所有请求的结果

    for (const url of urls) {
        // 创建异步任务
        const task = () => request(url).then(result => {
            results.push(result); // 处理结果
            executing.splice(executing.indexOf(task), 1); // 从正在执行列表中移除当前任务
        });

        // 将任务推入正在执行列表并立即执行
        executing.push(task());

        // 如果正在执行的任务数量达到了并发限制，则等待任意一个任务完成
        if (executing.length >= concurrency) {
            await Promise.race(executing);
        }
    }

    // 等待所有已经发起的任务完成
    await Promise.all(executing);

    return results;
}

(async () => {
    const urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        // 添加更多请求URL...
    ];

    try {
        const results = await controlConcurrency(urls, 5); // 控制并发数为5
        console.log(results);
    } catch (error) {
        console.error('Error:', error);
    }
})();
```

> 在这个实现中，我们通过维护一个`executing`数组来跟踪当前正在执行的所有任务。每当有新的请求被添加到`executing`数组中时，都会检查是否达到了设定的最大并发数。如果达到了最大并发数，那么代码会使用`Promise.race(executing)`来等待当前正在进行的任务中最先完成的那个。一旦有一个任务完成，就可以立即启动下一个请求，而无需等待整个批次的任务全部完成。这样就能保证同时最多只有n个请求在进行，并且请求完成一个就补充一个进入执行队列，提高了整体效率和资源利用率。

七天内自动登录实现方案

> ## 基于 Cookie 的实现方案
> 
> -   **原理**：Cookie 是存储在用户浏览器中的小文件，可在用户访问网站时由服务器设置，并在后续请求中发送回服务器。利用 Cookie 的过期时间设置，可实现一定期限内的自动登录功能。
> -   **实现步骤**
> 
> -   **登录时**：用户成功登录后，服务器在响应中设置一个带有特定标识（如用户 ID、加密的身份令牌等）的 Cookie，同时设置 Cookie 的过期时间为七天。
> -   **后续访问**：在七天内，用户再次访问网站时，浏览器会自动将该 Cookie 发送给服务器。服务器接收到 Cookie 后，从中获取用户标识等信息，验证其有效性。若有效，则自动登录用户，无需用户再次输入用户名和密码。
> 
> -   **优缺点**
> 
> -   **优点**：实现相对简单，兼容性好，大多数浏览器都支持 Cookie。
> -   **缺点**：存在一定的安全风险，如可能被窃取或篡改。
> 
> ## 基于 Local Storage 的实现方案
> 
> -   **原理**：Local Storage 是 HTML5 提供的一种在浏览器端存储数据的机制，它可以在本地存储大量的数据，并且数据不会随着每次 HTTP 请求发送到服务器，只有在脚本中通过 JavaScript 才能访问。
> -   **实现步骤**
> 
> -   **登录时**：用户登录成功后，前端 JavaScript 代码将用户的登录信息（如用户 ID、加密的令牌等）存储到 Local Storage 中，并记录当前时间。
> -   **后续访问**：用户再次访问网站时，前端代码首先检查 Local Storage 中是否存在有效的登录信息，并且判断当前时间与记录的登录时间间隔是否在七天内。如果是，则将登录信息发送给服务器进行验证。服务器验证通过后，实现自动登录。
> 
> -   **优缺点**
> 
> -   **优点**：可以存储较大的数据量，且不会像 Cookie 那样自动随请求发送，减少了网络传输量，安全性相对较高。
> -   **缺点**：不支持 IE8 及以下浏览器，需要进行兼容性处理。
> 
> ## 基于 Token 的实现方案
> 
> -   **原理**：Token 是一种用于身份验证和授权的字符串，通常由服务器生成并发送给客户端。客户端在后续请求中携带 Token，服务器通过验证 Token 的有效性来确定用户身份。
> -   **实现步骤**
> 
> -   **登录时**：用户登录成功后，服务器生成一个包含用户信息和过期时间等内容的 Token，通常使用 JWT（JSON Web Token）等技术进行生成和签名。服务器将 Token 返回给客户端。
> -   **后续访问**：客户端收到 Token 后，将其存储在本地（如 Cookie 或 Local Storage）。在七天内，客户端每次向服务器发送请求时，都在请求头或请求参数中携带该 Token。服务器接收到请求后，验证 Token 的有效性和过期时间。若 Token 有效且未过期，则自动登录用户。
> 
> -   **优缺点**
> 
> -   **优点**：无状态，服务器无需存储用户的登录状态，易于扩展和维护。可以在不同的客户端和服务器之间进行安全的身份验证。
> -   **缺点**：需要严格管理 Token 的生成、存储和验证过程，确保安全性。如果 Token 泄露，可能导致用户账户被非法访问。

虚拟列表实现思路

> 1.  **监听滚动事件**：通过监听容器的滚动事件，获取当前滚动的位置。
> 2.  **计算可见区域**：根据滚动位置和视口大小，计算出当前可见区域对应的列表项**索引范围。**
> 3.  **渲染可见项**：只渲染可见区域内的数据项，而不是渲染整个列表。
> 4.  **占位空间处理**：为了保证列表的滚动体验，需要在可见区域上下预留一定的占位空间，避免滚动时出现闪烁。

大文件上传

> **分块上传：**将大文件分割成多个小块，分别上传这些小块，服务器端接收并记录这些小块，最后将它们合并成完整的文件。
> 
> **断点续传：**在分块上传的基础上，记录每个分块的上传状态。当上传中断后，下次上传时先检查哪些分块已经上传，只上传未上传的分块，从而实现断点续传。（在前端，需要记录每个分块的上传状态。可以使用 `localStorage` 来存储这些信息。）

前端常见的网络攻击有了解吗？

> ### CSRF攻击（跨站请求伪造）：
> 
> 攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求（图片链接，超链接等）。利用受害者在**被攻击网站已经获取的注册凭证如cookie**，绕过后台的用户验证，然后进行恶意操作。
> 
> **防范**：
> 
> 1.  **使用 csrf token（主流）**，后端生成csrf token--前端请求头携带--服务器验证令牌的有效性，只有令牌合法才处理请求。
> 
> ​  

```html
<meta name="csrf-token" content="your_generated_csrf_token">
<!-- 这里的your_generated_csrf_token是后端生成的，前端通过document.querySelector('meta[name="csrf-token"]').content拿到 -->
```

> 2.  **弹出警告：**前端可查看**响应的** `**Referer**` **和** `**Origin**` **请求头**，若与预期源站不符，。
> 
> ### XSS攻击（跨站脚本攻击）
> 
> 攻击者在目标网站上注入恶意代码，当被攻击者登陆网站时就会执行这些恶意代码，
> 
> 防范：
> 
> **输出编码**：在将用户输入的数据输出到页面时，对特殊字符进行编码，如将 `<` 编码为 `&lt;`，`>` 编码为 `&gt;`
> 
> **设置 CSP（内容安全策略）**：通过设置 HTTP 头信息中的 `Content - Security - Policy`，限制页面可以加载的资源来源
> 
> ### 点击劫持
> 
> 点击劫持是指在一个Web页面中隐藏了一个透明的iframe（比如非常有有吸引力的图片），用外层假页面诱导用户点击，**限制iframe页面中的JavaScript脚本执行**

## 软技能

遇到线上 bug 时，如何进行排查、定位和解决。

确定问题性质（css，js还是...）--复现场景和步骤--紧急情况（影响范围比较大就优先解决），一时半会解决不了就先回滚

在团队项目中，如何与后端开发人员、设计人员等进行有效的沟通和协作。

后端：定字段、定接口、定数据结构

UI：定交互，定切图，协商时间
