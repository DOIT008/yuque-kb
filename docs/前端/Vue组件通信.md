---
description: "组件间的通信一、兄弟组件间通信1. 1 使用EventBus新建一个Vue实例作为事件总线，然后以此监听事件的订阅和派发(不再赘述)//main.js Vue.prototype.$bus = new Vue()  // child1.vue this.$bus.$emit('foo',pay..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/nfkgbw"
updated: "2022-12-09T04:51:04.000Z"
---

# Vue组件通信

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/nfkgbw)

<details class="toc-details">
<summary>本页结构（12 个小节）</summary>

- 组件间的通信
- 一、兄弟组件间通信
- 1\. 1 使用EventBus
- 代码示例
- 1.2 使用root
- 1.3 使用vuex
- 二、父子组件通信
- 2.1 子到父
- 2.2 父到子
- 三、边界知识

</details>

## 组件间的通信

  

## 一、兄弟组件间通信

  

### 1\. 1 使用EventBus

  

新建一个Vue实例作为事件总线，然后以此监听事件的订阅和派发(不再赘述)

  

## 代码示例

```js
//main.js
Vue.prototype.$bus = new Vue()

// child1.vue
this.$bus.$emit('foo',payload)

//child2.vue
this.$bus.$on('foo',callback(payload))
```

  

### 1.2 使用root

  

使用两个组件的**共同的父辈**作为中间的桥梁来实现事件的派发和订阅，上面说的是共同的父辈，并不意味着这是共同的直属父亲，只要是共同的父辈就行`$parent`,`$root`(根组件是任何自组件的父辈)

  

> **注意：事件的派发和订阅是同一个**，谁派发谁监听
> 
> 另外，在使用`$on`进行监听的时候，一般是放在`mounted`中的，但并不是说只有在`mounted`这一瞬间监听的，准确来说是从`mounted`开始监听的一直监听，无论何时触发都行

  

```vue
//child.vue
<template>
  <div>
    <h1>
      {{ message }}
    </h1>
    <button @click="onClick">点我</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "我是Child"
    };
  },
  methods: {
    onClick() {
      // 事件派发，派发者是该组件的父亲
      this.$parent.$emit("foo", "我是来自Child");
    }
  }
};
</script>
```

  

```vue
// child2.vue
<template>
  <div>
    <h1>
      {{ message }}
      {{ msgFromChild }}
    </h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "我是Child2",
      msgFromChild: ""
    };
  },
  mounted() {
    // 同理,事件的订阅（监听）也是父亲
    this.$parent.$on("foo", msg => {
      this.msgFromChild = msg;
    });
  }
};
</script>
```

  

两个子组件的关系：

  

```vue
<template>
  <div id="app">
    <div id="nav"></div>
    <child></child>
    <child2></child2>
  </div>
</template>
```

  

**缺点：**太耦合了，两者必须有共同的父亲才行...不灵活

  

### 1.3 使用vuex

  

略

  

## 二、父子组件通信

  

### 2.1 子到父

  

在子组件中使用`$emit`发布一个自定义事件,然后在父组件中的子组件标签监听该事件即可

  

```vue
// 父组件
<child @foo= "handle" ></child>

// 自组件
this.$emit('foo',payload)
```

  

### 2.2 父到子

  

#### 2.2.1 使用props

  

在子组件中使用`props`,不做赘述

  

#### 2.2.2 使用$children

  

在父组件中使用`$children`拿到自组件实例数组,....一般不用,因为太耦合了

  

#### 2.2.3 $refs

  

在父组件中访问对应的子组件实例,或者里面的数据

  

```html
// 父组件
<child2 ref="child2"></child2>
<button @click="getChild2Data">获取子组件2的数据</button>

<script>
import child2 from "./components/child2";
export default {
  components: {child2 },
  methods: {
    getChild2Data() {
      console.log(this.$refs.child2.message);
      this.$refs.child2.message = "nnnnnnnn";
    }
  }
};
</script>
```

  

## 三、边界知识

  

### 3.1  listeners（孙子组件通信）

  

#### 3.1.1$attrs（常用于爷爷向孙子，父像向子通信）

  

如果在父组件中传递给子组件的值在子组件中**没有使用**`**prop**`进行声明,可以使用`$attrs`来进行访问:

  

```vue
//父组件
<child2 greeting="hello,你好，我是Child2"></child2>

// 子组件
<h2>{{ $attrs.greeting }}</h2>

export default {
  data() {
    return {
      message: "我是Child2",
      msgFromChild: ""
    };
  },
  mounted() {
    this.$root.$on("foo", msg => {
      this.msgFromChild = msg;
    });
  }
};
```

  

如果有孙子组件,通过在孙子组件的标签上设置`v-bind = “$attrs”`就能让爷爷组件上的数据（给子组件传递的数据）传递到孙子组件，**通常用于封装高阶组件有用。**

  

```html
// 父组件 app.vue
<template>
  <div id="app">
      <!--传递数据msg--->
      <!--@yyde监听孙子组件的自定义事件--->
    <son-compo :msg="msg" @yyde="handleDiy" @xxde="handleXXde"></son-compo>
  </div>
</template>
<script>
import sonCompo from "./components/son.vue";
export default {
  data() {
    return {
      msg: "我是爷爷组件"
    };
  },
  components: {
    sonCompo
  },
  methods: {
    handleDiy(payload) {
      alert(payload);
    }
  }
};
</script>
```

  

```vue
// 子组件son.vue
<template>
  <div>
    <button>click Me</button>
    <h1>{{ $attrs.msg }}</h1>
    <!-- 孙子组件 通过v-bind:$attrs 将父组件的数据传递给子组件 -->
      <!-- 孙子组件 通过v-on:$listeners 监听所有来自孙子组件的自定义事件 -->
    <son-son v-bind="$attrs" v-on="$listeners"></son-son>
  </div>
</template>
```

  

```vue
//孙子组件son-son.vue
<template>
  <div>
    <button @click="handleClick">click Me</button>
    <!-- 拿到了爷爷组件的数据 -->
    <h2>{{ $attrs.msg }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "我来自孙子组件的内部数据",
      car: "吉利斌瑞"
    };
  },
  methods: {
      // 抛出自定义事件，并传递参数
    handleClick() {
      this.$emit("yyde", this.message);
    }
  }
};
</script>

<style lang="scss" scoped></style>
```

  

或者在封装组件的时候，将组件标签上绑定的数据在组件内部使用`v-bind = "$attrs"`，同步绑定到组件内部，比如：

  

```vue
<KInput :placeholder = "请输入内容" type = text ></KInput>

// KInput.vue
<input  :$attrs >
// 这样就可以将type和placeholder绑定到input上了
```

  

#### 3.1.2 $listeners（孙子to爷爷）

  

如果在子组件中触发父组件中定义的方法,可以使用该方法:还是上图

  

![图片](/images/source-missing.svg)

  

上面的代码，在孙子组件`son-son`抛出一个自定义事件`yyde`，（本来可以在孙子组件的标签上使用`@yyde`即可触发该自定义事件，因为谁触发谁监听嘛！），但如果现在父组件内的孙子标签上使用`v-on="$listeners"`，意思是监听父组件标签上`son-compo`所有事件并进行触发**(只负责触发)**，这样就可以在父组件标签上监听并触发事件`yyde`了。

  

> `$attrs`和`$listeners`就像一个中继站一样,负责将事件和数据进行中继

  

### 3.2 provide/inject

  

通常provide和inject是成对儿出现的,主要用于数据的隔代传递(也就是说无论哪一级的子组件,孙子组件都通过inject能访问到父组件通过provide传递过来的数据,无论中间隔了多少层)

  

**用法:**provide用法类似data,inject类似props

  

```vue
// 父组件
<script>
export default {
  components: { child, child2 },
    // provide 提供数据
  provide() {
    return {
      bar: "barrrrrrrrrrrr"
    };
  },
};
</script>
```

  

```vue
// 子组件
<script>
export default {
  inject: ["bar"],// 获取父组件的数据bar
  inject: {
      bar1:'bar',//bar1别名,如果子组件中有同名数据bar,用该方法比较合适,防止冲突
  },
  methods: {
    onClick() {
      this.$root.$emit("foo", "我是来自Child");
    }
  }
};
</script>
```

  

**缺点是:**一般数据不是响应式的,也就是说当provide中的数据发生变化的时候,inject获取到的数据不会发生改变

  

**当然也有特殊情况:**

  

如果你在`provide`传递的数据是响应式的,比如传递的是`this`(当前父组件),或者引用类型的对象(比如`Obiect`,`Array`),那么数据就变成响应式的了

  

**传递**`**this**`

  

```js
export default {
  components: { child, child2 },
    // provide 提供数据
  provide() {
    return {
      app:this// 当前组件实例,然后在子组件中访问该实例本身的数据
    };
  },
};
```

  

**传递引用类型的对象:**

  

```js
// 
export default {
  components: { child, child2 },
  provide() {
    return {
      person: this.person//因为对象是按引用传递的,此时的person和this.person指向同一个对象
    };
  },
  data() {
    return {
      person: { name: "董瀚麟", age: 999999 }
    };
  },
  methods: {
    getChild2Data() {
      console.log(this.$refs.child2.message);
      this.person.name = "董涵琳"; // 改变源数据
    }
  }
};
```

  

```html
<!---子组件----> 
<h1>{{ person.name }}</h1>
```

  

> 一般不常用,通常用于组件的封装
