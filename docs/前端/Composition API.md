---
description: "说明又称“组合式API”，它式相对于选项API的，咱们用过Vue2.x的都知道，我们的数据，计算属性，方法等都是卸载一个个的选项中的，但是Vue3就不需要这样，这样能够提供更大的灵活性。几个函数setupsetup函数是 Composition API（组合API）的入口：在setup函数中定..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/sinfp3"
updated: "2023-01-13T11:02:34.000Z"
---

# Composition API

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/sinfp3)

<details class="toc-details">
<summary>本页结构（11 个小节）</summary>

- 说明
- 几个函数
- setup
- 代码示例
- ref
- reactive
- toRefs
- computed
- readonly
- toRaw和markRaw

</details>

## 说明

又称“组合式API”，它式相对于选项API的，咱们用过Vue2.x的都知道，我们的数据，计算属性，方法等都是卸载一个个的选项中的，但是Vue3就不需要这样，这样能够提供更大的灵活性。

## 几个函数

### setup

`setup`函数是 Composition API（组合API）的入口：

1.  在`setup`函数中定义的变量和方法最后都是需要 `return` 出去的 不然无法再模板中使用。
2.  由于在执行`setup`函数的时候，还没有执行 `Created` 生命周期方法，所以在 `setup` 函数中，无法使用 `data` 和 `methods` 的变量和方法，当然更不能访问`this`，毕竟实例还没创建呀！
3.  `setup`函数只能是同步的不能是异步的，因为返回值不再是一个对象，而是一个`Promise`，模板中看不到`return`对象中的数据。
4.  ​  
    

在Vue3中，所有的数据，无论是否是响应式的，都要在`setup`函数中进行定义，包括函数等，该函数需要有返回值(一般是一个对象)：

## 代码示例

```js

export default {
	setup() {
    const msg = ref("哈喽，你好！");
    const data = reactive({
      counter: 100,
      greetingText: "hello，Vue3！",
    });
    // 方法直接写在setup里面
    function changeMsg() {
      console.log(msg.value);
      msg.value = "哈喽，Vue3!!"; 
      data.counter = 800;
    }
    // 还是要返回，毕竟外部需要使用
    return { msg, data, changeMsg };
  },
}
```

#### setup函数的几个参数

1.  props：通过v-bind传递过来的数据对象
2.  context，是一个对象，里面有三个参数,可以进行解构

```js
export default {
  setup(props, context) {
    // Attribute (非响应式对象)，包含组件上非props的其他属性，包含style和class属性,相当于this.$attrs
    console.log(context.attrs)

    // 插槽 (非响应式对象),所有传入的插槽内容对象，相当于this.$slots
    console.log(context.slots)

    // 触发事件 (方法),相当于this.$emit
    console.log(context.emit)
  }
}
```

### ref

该函数一般对**基础类型**的数据进行响应式处理（当然也可以对对象进行响应式，不推荐），但是在函数内访问或修改该数据`msg`的时候需要通过属性`value`，例如：

> ref的原理：是通过给value属性添加getter和setter实现对数据的劫持
> 
> ref内部也可以放入对象，但会自动的将其进行reactive处理（即转化为proxy代理对象）

另外对应的还有`shallowRef`，跟`ref`的唯一区别是前者是浅劫持（只对一层数据进行劫持），后者是深劫持，也就是说`shallowRef`包裹的数据响应层数是一层，而`ref`是很多层。

```vue
<template>
  <div>
    // 直接使用即可
    <h1>{{ msg }}</h1>
    <input type="text" v-model="msg" />// 你会发现是响应式的
    <button @click="changeMsg">改变msg</button>// 改变msg的数据，发现h1处的视图也跟着改变了
  </div>
</template>
<script>
  
  import { ref } from "vue"
  export default {
    setup(){
      const msg = ref("哈喽，你好！");
      // 定义方法
			function changeMsg(){
        console.log(msg)// 一个带value属性的对象
      	msg.value = 'hello~'
      }
      return {
        msg,
        changeMsg
      }
    }
  }
</script>

```

ref的另一个用途——**获取页面中的元素**，我们经常在Vue2.x中使用`this.$refs.xx`来获取某个元素，但是在Vue3中没有`$refs`这个api,那么可以使用`ref`实现：

```vue
<template>
  <div>
    // 1. 给待获取的元素添加ref属性
    <img src="../assets/logo.png" alt="" srcset="" ref="image" />
  </div>
</template>
<script lang="ts">
import {ref, onMounted } from "vue";
export default {
  setup() {
    // 2.初始化该元素，因为setup函数是在beforeCreated之前执行的，此时还没有元素挂载，所以初始值是null
    // 这里的变量名一定要和模板中的名字保持一致image
    const image = ref<HTMLElement | null>(null);
    // 3. 在挂载的钩子函数中判断
    onMounted(() => {
      console.log("挂载啦", image.value);
      // 当元素创建的时候执行console，有value就说明元素创建了
      image.value && console.log(image.value);
    });
    return {
      image, // 要导出才行
    };
  },
};
</script>

<style lang="scss" scoped></style>

```

> 实在不行就给标签设置`id`，通过`id`拿元素

### reactive

该函数是对**复杂的数据类型**(一般是对象，数组等)进行响应式处理，在`template`中使用的时候需要访问属性（因为它是一个对象嘛）：

> reactive原理：将数据对象转化为 Proxy的代理数据对象，并通过Reflect实现对数据的操作

另外对应的还有`shallowReactive`，跟`reactive`的唯一区别是前者是浅劫持（只对一层数据进行劫持），后者是深劫持，也就是说`shallowReactive`包裹的数据响应层数是一层，而`reactive`是很多层

```vue
<template>
  <div>
    // 因为data是一个对象
    <h1>{{ data.counter }}</h1>
    <h1>{{ data.doubleCounter }}</h1>
    <input type="text" v-model="data.counter" />//一样是响应式的
  </div>
</template>
<script>
  import { reactive } from "vue";
  export default {
    setup(){
      // 修改数据的时候要data.couter= xx
      const changeCounter = ()=>{
      	data.couter = 1000
      }
      
      const data = reactive({
      	counter: 100,
      	greetingText: "hello，Vue3！"
      });
      return {
        data
      }
    }
  }
</script>
```

但是这样使用是不是很麻烦呢？我们可以通过另一个函数进行解构——`**toRefs**`**函数**；

### toRefs

使用该函数可以对reactive数据对象进行解构，这样就可以直接使用里面的数据了，使用方法如下：

```vue
<template>
  <div>
    // 直接访问
    <h1>{{ counter }}</h1>
    <h1>{{ doubleCounter }}</h1>
    <input type="text" v-model="counter" />//一样是响应式的
  </div>
</template>
<script>
  import { reactive,toRefs } from "vue";
  export default {
    setup(){
      const data = reactive({
      	counter: 100,
      	greetingText: "hello，Vue3！"
      });
      return {
        ...toRefs(data)
      }
    }
  }
</script>
```

### computed

计算属性函数，和之前的`Option Api`的写法有点差别，但是功能还是一样的：

```vue
<template>
  <div>
    <span>{{ firstName }} {{ lastName }}</span>
    <h1>{{ fullName }}</h1>
  </div>
</template>

<script>
import { reactive, computed, toRefs } from "vue";
export default {
  // 数据初始化
  setup() {
    const user = reactive({
      firstName: "John",
      lastName: "Smith",
    });
    // 计算属性
    const fullName = computed(() => {
      return user.firstName + " " + user.lastName;
    });
    
    
    // 另一使用方法，传入对象
     const fullName = computed({
       // 就相当于上面的第一种写法
     	get(){
      	return user.firstName + " " + user.lastName;
      },
      set(val){
				// 修改数据
      }
     });
    return {
      ...toRefs(user),
      fullName,
    };
  },
};
</script>
```

### readonly

传入一个对象(响应式或者普通对象)或ref，返回一个原始对象的只读代理，这种只读特性是“深只读”（也就是说对象内部任何嵌套的属性都是只读的）。不过一般不常用

```vue
<template>
  {{ readonlyUser.firstName }}
  <!-- 传入reactive不是响应式的 -->
  <input type="text" v-model="readonlyUser.firstName" />

  <h1>{{ ani }}</h1>
  <!-- 响应式 -->
  <input type="text" v-model="ani" />

  <h1>{{ readonlyAni }}</h1>
  <!-- 传入ref不是响应式 -->
  <input type="text" v-model="readonlyAni" />
</template>

<script>
// 因为我们要的是响应式的数据
import { reactive, computed, toRefs, ref, readonly } from "vue";
export default {
  // 数据初始化
  setup() {
    // 响应式的
    const user = reactive({
      firstName: "John",
      lastName: "Smith",
    });
    // 变成了非响应式的
    const readonlyUser = readonly(user);
    
    
    // 响应式的
    const ani = ref("嘿嘿");
    // 非响应式的
    const readonlyAni = readonly(ani);
    
    
    return {
      readonlyUser,
      ...toRefs(user),
      ani,
      readonlyAni,
    };
  },
};
</script>
```

### toRaw和markRaw

toRaw能够把`reactive`代理的对象转化为普通的对象（非响应式），例如：

```vue
<template>
// 
	<button @click="testToRaw">toRaw</button>
</template>
<script>
  import { reactive, toRefs, ref, onMounted, toRaw } from "vue";
	setup(){
    // 点击一下将reactive数据转化为普通数据
    const testToRaw = function () {
      const tInfo = toRaw(info);
      tInfo.age += 12;
    };
  	return {
      testToRaw
    }
  }
</script>

```

`markRaw`标记一个对象，使其永远不会转换为`proxy`。返回对象本身。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 嵌套在其他响应式对象中时也可以使用
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

### watchEffect和watch

#### watchEffect

和watch相比有以下特性：

1.  不需要手动传入依赖（就是无法监听具体的值，意味着只要数据变化就会触发，它不在乎哪个数据变化），自动获取依赖。
2.  每次数据初始化时会执行一次回调函数来自动获取依赖（数据在初始化的时候就会触发一次）。
3.  无法获取到原值，只能得到变化后的值。

我们无法知道当前改变的是谁，更不知道改变前后的值到底是啥，所以这方法**不常用：**

```vue
<template>
  <div>{{ age }}</div>
</template>

<script>
// 测试各种watch
import { reactive, toRefs, watch, ref, watchEffect, onMounted } from "vue";
export default {
  setup() {
    const userInfor = reactive({
      name: "张三",
      age: 14,
    });
    const counter = ref(1000);
    watchEffect(() => {
      console.log(`watchEffect---${counter.value},${userInfor.age}`);
    });

    setInterval(() => {
    	//不管是哪个数据发生变化，都会触发watchEffect
      userInfor.age++;
      counter.value++; //因为对于ref数据，在访问数据的时候，你要访问value属性
    }, 1000);

    return {
      ...toRefs(userInfor),
      counter,
    };
  },
};
</script>

```

停止侦听

```ts
const stop = watchEffect(()=>{})
//某个时候
stop()// 手动停止侦听
```

**watch**

能够知道具体是哪个值发生变化，当然我们知道响应式数据分为两种reactive和ref，下面分别对这两种数据进行说明：

**监听ref数据**

```vue
<template>
  <div>{{ age }}</div>
</template>

<script>
// 测试各种watch
import { reactive, toRefs, watch, ref, watchEffect, onMounted } from "vue";
export default {
  setup() {
    const counter = ref(1000);
    // 监听ref数据
    watch(counter, (value, oldValue) => {
      console.log(value, oldValue);
    });

    setInterval(() => {
      counter.value++; //因为对于ref数据，在访问数据的时候，你要访问value属性
    }, 1000);

    return {
      counter
    };
  },
};
</script>

```

#### 监听reactive数据

```vue
<template>
  <div>{{ age }}</div>
</template>

<script>
// 测试各种watch
import { reactive, toRefs, watch, ref, watchEffect, onMounted } from "vue";
export default {
  setup() {
    const userInfor = reactive({
      name: "张三",
      age: 14,
    });
    //监听reactive数据，监听userInfor的age属性
    watch(
      () => userInfor.age,
      (value, oldValue) => {
        console.log(value, oldValue);
      }
    );
    // 让数据变化
    setInterval(() => {
      userInfor.age++;
      counter.value++; //因为对于ref数据，在访问数据的时候，你要访问value属性
    }, 1000);

    return {
      ...toRefs(userInfor),
    };
  },
};
</script>
```

**深度监听**

watch可以传入第三个参数，是一个对象，还是以上面的为例：

```js
watch(
      () => userInfor.age,
      (value, oldValue) => {
        console.log(value, oldValue);
      },{
      	immediate:true // 表示立即执行监听，页面在初始化的时候你就会执行
        deep:true// 深度监听
      }
    );
```

**​**  

**​**  

​  

  

​
