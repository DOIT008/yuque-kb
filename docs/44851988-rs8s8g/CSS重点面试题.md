---
description: "CSS重点面试题link和@import的区别link是在DOM树绘制的过程中被执行，权重高，而@import是在DOM树绘制完毕后执行，权重比较低隐藏元素的方式以及区别？opacity：0：只是将透明度设置为0了，其实质真正的DOM还在，还能交互visibility：hidden：占据着空间..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/yu3i6c"
updated: "2021-03-17T12:52:09.000Z"
---

# CSS重点面试题

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/yu3i6c)

1.  **link和@import的区别**  
    link是在DOM树绘制的过程中被执行，权重高，而@import是在DOM树绘制完毕后执行，权重比较低

2.  **隐藏元素的方式以及区别？**

1.  opacity：0：只是将透明度设置为0了，其实质真正的DOM还在，还能交互

2.  visibility：hidden：占据着空间，不可以交互了

3.  display：none：彻底的删除了元素，也不占空间了

4.  z-index：-999：将层级放到了页面底部，彻底看不见了

3.  **水平居中，垂直居中**  
    水平居中：  
    display：flex，margin：0 auto，display：table  
    垂直居中：  
    flex布局，定位+高度－50%，display：table+vertical-align：middle
4.  **不知宽高的居中问题**

-   display:flex；flex布局
-   translate：transform(-50%，-50%)；利用过渡
-   display：table-cell+vertical-align：middle ，table-cell布局

5.  **css定位，几种？**

1.  static：和没用定位差不多

2.  relative：相对于正常文档流的定位

3.  absolute：相对于最近的不是static的元素的定位

4.  fixed：相对于屏幕或窗口的定位，不会发生滚动

6.  **层叠上下文**  
    [https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
7.  **CSS盒模型？**  
    这个盒模型分为标准盒模型和怪异盒模型（IE8以下）  
    标准盒模型：  
    一个元素所占据的空间是由margin-left+border-left+paddind-left+width+padding-right+border-right+margin-right组成的，这里的width是真正能装东西的区域  
    怪异盒模型  
    width：border-left+padding-left+内容区+padding-right+border-right  
    其元素所占据的空间是margin-left+width+margin-right，**也就是说对width的定义不一样**

可以通过box-sizing来控制当前使用哪种模式：content-box(标准)，border-box（怪异）

8.  **渐进增强和优雅降级**

总的来说这是对页面样式处理的两种策略，尤其是css3：

**渐进增强**：就是首先满足最基本的功能，然后针对高版本的浏览器提高css的效果和交互体验。

**优雅降级**：首先确保高版本的浏览器的交互体验，然后对低版本的浏览器保证基本的功能。

是相反的一个过程，

9.  **伪类和伪元素**  
    伪类是当DOM处于某种状态的时候才有的一种CSS效果，比如：hover，：visited，  
    伪元素：是使用：：before或者：：after产生不不在文档树中的元素
10.  **BFC？**  
     块级格式化上下文  
     **主要解决的问题**：防止上下margin发生重叠，防止元素高度塌陷。  
     **怎么形成BFC：**

1.  根元素，HTML元素

2.  position：fied或者absolute

3.  float不是none

4.  display的值为table-cell，inline-block等

12.  **flex布局的理解**  
     抓哟是为了应对各种屏幕而产生的一种弹性盒布局，你只需要写相应的央视即可，怎么排交给浏览器即可

13.  **动画和过渡？**  
     动画就是使用@keyframes来逐帧进行定义，可以实现复杂的动画，而过度通常来通过定义初始状态盒结束状态来定义简单的动画

14.  **CSS 去掉inline-block元素间隙的几种方法**  
     产生的原因可能是由标签换行导致的，解决方式是给父元素设置font-size为0

15.  **超出显示省略号。**

1.  .view-text{

2.  \*/

3.  *思路：*

4.  *1.设置inline-block属相*

5.  *2.强制不换行*

6.  *3.固定高度*

7.  *4.隐藏超出部分*

8.  *5.显示“……”*

9.  \*\*/\*

10.  display: inline-block;

11.  white-space: nowrap;

12.  width: 100%;

13.  overflow: hidden;

14.  text-overflow:ellipsis;

16.  **清除浮动**

1.  clear：both：最后一个浮动元素的后面追加一个div，并追加该样式，缺点是会新增一个元素

2.  overflow：hidden：对父元素添加改样式，但是会隐藏其元素

3.  clearFix：给忘了，这个网上有很多，没记住

4.  给父元素设置浮动：会产生新的浮动问题

## HTML相关面试题

1.  **doctype的作用**  
    告知浏览器要以什么样的模式来解析当前文档，不同的解析模式对css和js的解析有影响。有三种模式：标准模式（默认），怪异模式（模拟更旧浏览器行为）

2.  **HTML5和HTML4的不同之处**  
    新增了一些标签，文档类型声明只有一种html

3.  **前端存储方式**  
    除了cookie,localstorage和sessionStorage之外，还有一个叫做webSQL（键值对，可以用JavaScript操作）

4.  **语义化的理解**  
    **就是让页面具有良好的结构和含义**，比如p标签就代表段落，article就代表内容等  
    **利于seo**：带语义化的文字汉语丰富信息，更加利于网络爬虫获取信息，对开发者友好，容易维护  
    **用途**：常用于内容为主的富文本的网站效果比较大

5.  **defer和async的区别**  
    defer：**脚本被加载后并不执行**，而是等到文档解析完成后才开始执行  
    async：**文档加载后立即执行**，阻断了DOM树的绘制，会导致async属性的脚本是乱序的（因为不知道哪个先执行完）

6.  **XML，HTML，XHTML的区别**  
    XML：通常用来存储数据  
    HTML：超文本标记语言  
    XHTML：可扩展的超文本标记语言，为了解决HTML的标准化 问题

7.  **行内块儿元素**  
    img|input|select|textarea|button就是各种表单元素

8.  **Symbol？**  
    是ES6新增的基本数据类型，可以作为对象的**唯一属性名**，记得加“【】”，因为它具有唯一性。里面的参数只负责描述作用。
