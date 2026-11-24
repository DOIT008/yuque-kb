---
description: "现在有这样的一个需求：一个二维码（H5页面），如果是微信扫码就支持微信支付，如果是支付宝扫码支持支付宝支付，如果是某个app内的扫码，同时支持微信和支付宝支付，这样具体如何实现呢？其实这里遇到三个问题：怎么判断到底是微信扫码还是支付宝扫码亦或是其他？怎么在H5内实现微信支付，支付宝支付怎么在三..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/vklv378nbqbpmscx"
updated: "2023-04-07T07:20:12.000Z"
---

# uni-app-H5实现微信和支付宝支付

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/vklv378nbqbpmscx)

<details class="toc-details">
<summary>本页结构（10 个小节）</summary>

- 一、怎么判断环境
- 代码示例
- 二、在H5内调用支付宝支付
- 2.1、方式一：AlipayJSBridge
- 2.2、方式二：提交表单(好像用这个的更多)
- 三、在H5内实现调用微信支付
- 3.1、微信浏览器
- 3.2、三方浏览器
- 四、总之
- 五、参考文章

</details>

现在有这样的一个需求：一个二维码（H5页面），如果是微信扫码就支持微信支付，如果是支付宝扫码支持支付宝支付，如果是某个app内的扫码，同时支持微信和支付宝支付，这样具体如何实现呢？

其实这里遇到三个问题：

1.  怎么判断到底是微信扫码还是支付宝扫码亦或是其他？
2.  怎么在H5内实现微信支付，支付宝支付
3.  怎么在三方浏览器内实现微信和支付宝支付

## 一、怎么判断环境

## 代码示例

```js
let ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == "micromessenger") {
  // 默认选择微信
　this.payType == 'wx'
}
if (ua.match(/AlipayClient/i) == "alipayclient") {
　　//默认选择支付宝
  this.payType == 'ali'
}else{
  // 三方浏览器默认微信
   this.payType == 'other'
}

```

## 二、在H5内调用支付宝支付

### 2.1、方式一：AlipayJSBridge

引入插件：

```js
<script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js"></script>
```

在支付页面：

```js
h5PayByAli() {
    // 获取订单信息
    let orderInfo = await this.getH5AliPayInfo()
    if(orderInfo){
        let that = this;
        this.btnflag = false;
        // eslint-disable-next-line no-undef
        AlipayJSBridge.call(
            "aliPay",
            {
            orderInfo
            },
            function(res) {
            if (res.resultStatus == 9000) {
                uni.switchTab({
                    url: '/pages/pay-list/pay-list'
                });
            } else {
                uni.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                });
            }
            }
        );
    }
},

// 获取订单信息
getH5AliPayInfo() {
    return new Promise((resolve, reject) => {
        let that = this;
        let opt = {
            url: "/izhengz/pay/agpay/aliAppPay",
            type: "post",
            data: {
            paymentId: this.payInfo.paymentId,
            money: this.payInfo.money,
            returnUrl: "http://zzcgj-app.z.digitalcnzz.com/izhengz/parkinfo"
            },
            suc: res => {
                if (res.value) {
                    resolve(res.value)
                } else {
                    reject('')
                }
            },
            fail: rej => {
                reject('')
                uni.showToast({
                    title: rej.desc,
                    icon: 'none',
                    duration: 2000
                });
            }
        };
        $http(opt);
    })
}
```

很好奇，上面的`AlipayJSBridge`是怎么来的，可以参考[官方文档](https://myjsapi.alipay.com/jsapi/index.html)，如下：

```js
function ready(callback) {
  // 如果jsbridge已经注入则直接调用
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    // 如果没有注入则监听注入的事件
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}
```

那么在uni-app中，可以定义到根组件：

```js
{
  methods:{
    ready(callback) {
        if (window.AlipayJSBridge) {
            callback && callback();
        } else {
            document.addEventListener("AlipayJSBridgeReady", callback, false);
        }
    },
  }
}
```

### 2.2、方式二：提交表单(好像用这个的更多)

```js
methods () {
  /**
   * 支付宝支付
   */
  goAlipay () {
    this.$loading.show()
    const data = {
      /* 自身接口所需的一些参数 */
      ...
      amount: this.price,
      /* 支付后支付宝return的url */
      // returnUrl: 'www.baidu.com'
      returnUrl: window.location.origin + window.location.pathname + '?userParams=' + this.userParams
    }
    this.$http(
      this.$apiSetting.alipay,
      data
    ).then(res => {
      this.$loading.hide()
      if (res.data.statusCode === '000000') {
        const div = document.createElement('div')
        div.style.display='none'
        /* 此处form就是后台返回接收到的数据 */
        div.innerHTML = res.data.data.alipayInfo
        document.body.appendChild(div)
        document.forms[0].submit()
      }
    }, error => {
      this.$loading.hide()
      console.log(error)
    })
  }
}

```

## 三、在H5内实现调用微信支付

### 3.1、微信浏览器

[官方文档](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6)，首先判断当前环境中有没有`WeixinJSBridge`，如果有则执行`callback`：

```js
{
  methods:{
    onWXBridgeReady(callback){
      if (typeof WeixinJSBridge == "undefined"){
         if( document.addEventListener ){
             document.addEventListener('WeixinJSBridgeReady', callback, false);
         }else if (document.attachEvent){
             document.attachEvent('WeixinJSBridgeReady', callback); 
             document.attachEvent('onWeixinJSBridgeReady', callback);
         }
      }else{
         callback();
      }
    }
  }
}
```

在业务页面封装微信支付函数：

```js
// 点击按钮
wxpay(){
  // 通过接口获取支付参数
  // 只有在微信浏览器中才有WeixinJSBridge
      if(typeof WeixinJSBridge !=='undefined' ){
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            // 都是从data->后台拿的
             "appId":"wx2421b1c4370ec43b",     //公众号ID，由商户传入     
             "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
             "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
             "package":"prepay_id=u802345jgfjsdfgsdg888",     
             "signType":"MD5",         //微信签名方式：     
             "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
          },
          // 
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
		      // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          //跳转支付成功展示页面
		    	  window.location.href = path +"/page/goPaymentSuccess";
		      }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
		    	  console.log("支付失败")
		      }else{
		    	  console.log("取消支付")
		    	  //修改上面生成的预支付订单状态
		    	  cancelPayMoney();
		      }
        ); 
      }
}
```

### 3.2、三方浏览器

思路：其他浏览器呼起微信支付，更多的是依靠后台接口返回数据。

**请求微信支付的接口 --> 接口返回一个链接 --> 跳转连接**

这种主要由后端去干，返回一个 url 前端去跳转，然后拉起微信支付，同时可以在url上拼接支付成功后回跳的地址（ **需要 encode 编码，有个点要注意，文档描述，当没有调起微信支付，或者超过5s，微信任然会跳转到拼接的地址上，关于这点文档有详细描述，同时 vue 哈希路由模式，微信回跳会把 # 后全部干掉，等于直回跳个域名，所以能不用哈希就不用哈希模式** ）

```js
 async submitOrder(){
   // 请求后台返回url
  // tips: 如果实在用了 哈希模式，可以自己拼接，把#省去，浏览器在访问时，会自动加上
  let redirect_url = `${this.w_origin}/xxx/?PayType=h5wx`
  window.location.replace(`${payRes.url}&redirect_url=${encodeURIComponent(redirect_url)}`)
  // 同时，尽量用 window.location.replace
}
```

## 四、总之

```js
if(process.env.VUE_APP_PLATFORM==='h5'){
  if(this.payType == 'wx'){
    // 1. 请求支付信息，拿到数据data
    // 2. 根据data调用微信支付
    this.onWXBridgeReady(this.wxpay)
  }else if(this.payType == 'ali'){
    this.ready(this.h5PayByAli)
  }else{
    // 判断当前radio选择的是啥
    if(radioVal==='weixin'){
      this.submitOrder()
    } else {
        this.ready(this.h5PayByAli)
    }
  }
}
```

## 五、参考文章

::: tip
https://blog.csdn.net/chen_ai_tao/article/details/123104836
:::

 

::: tip
https://juejin.cn/post/7094835152534110244#comment
:::

 

::: tip
https://www.cnblogs.com/darkerxi/p/10725243.html
:::

 

::: tip
https://juejin.cn/post/7089407373076332551
:::
