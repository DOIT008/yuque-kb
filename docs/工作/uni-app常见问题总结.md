---
description: "一、uni-app扫普通二维码获取参数1.1、微信小程序微信小程序获取普通二维码链接参数，可以在App.vue中，也可以在某个页面内，如果在App.vue中，是在onLaunch()方法：// 假如二维码的链接是：https://zzcgj-app.z.digitalcnzz.com/izhe..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/leocac809kixinev"
updated: "2024-10-20T08:57:23.000Z"
---

# uni-app常见问题总结

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/leocac809kixinev)

<details class="toc-details">
<summary>本页结构（13 个小节）</summary>

- 一、uni-app扫普通二维码获取参数
- 1.1、微信小程序
- 代码示例
- 1.2、支付宝小程序
- 1.3、H5
- 1.4、总结
- 二、uni-app上拉加载和下拉刷新常用做法
- 三、uni-app图片上传总结
- 四、扫码跳转小程序某个页面
- 4.1、H5页面

</details>

## 一、uni-app扫普通二维码获取参数

## 1.1、微信小程序

微信小程序获取普通二维码链接参数，可以在`App.vue`中，也可以在某个页面内，如果在`App.vue`中，是在`onLaunch()`方法：

## 代码示例

```js
// 假如二维码的链接是：https://zzcgj-app.z.digitalcnzz.com/izhengz/codePay/pages/scan-bridge/scan-bridge?parkLotId=88&gateType=2&gateCode=17157
var link = decodeURIComponent(option.query.q)

// 获取链接中的参数，以对象的形式返回 http://www.baidu.com?name=elephant&age=25&sex=male&num=100
function queryURLParams(url) {
    let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
    let parames = {}; // 定义参数对象
    url.replace(pattern, ($, $1, $2) => {
      parames[$1] = $2;
    });
    return parames;
  }
queryURLParams(link) // 键值对参数
// 
```

如果在某个页面内，上述链接在`onLoad`钩子中，也可以访问到链接：

```js
onLoad(option){
  console.log(decodeURIComponent(option.q)) //上述链接
}
```

## 1.2、支付宝小程序

获取二维码码值请在小程序 app.js 文件的 `app()` 的 `onLaunch()` 方法中使用 `options.query.qrCode` 获取（其实还是一个链接，跟微信一样）

也就是这样：

```js
onLaunch(option){
  var link = decodeURIComponent(option.query.qrCode)
}
```

 

::: tip
https://opendocs.alipay.com/support/01rb2a#%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%B3%E8%81%94%E6%99%AE%E9%80%9A%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8F%82%E6%95%B0
:::

> 在`App.vue`中，无论是支付宝还是微信小程序，我们可以通过`option.path`，表示将要跳转到的页面路径，比如：`codePay/pages/scan-bridge/scan-bridge`

辅助函数：

```js
// 获取链接中的参数，以对象的形式返回 http://www.baidu.com?name=elephant&age=25&sex=male&num=100
function queryURLParams(url) {
    let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
    let parames = {}; // 定义参数对象
    url.replace(pattern, ($, $1, $2) => {
      parames[$1] = $2;
    });
    return parames;
  }
queryURLParams(link) // 键值对参数
// 
```

## 1.3、H5

直接就可以在页面内的`onLoad(option)`钩子，`option`就是键值对参数

## 1.4、总结

如果一个页面在三端都能用到，又想再该页面内访问到链接携带的参数，可以`App.vue`中，将拿到的链接赋值给一个全局参数，以便在业务页面内使用

```js
onLaunch(option){
  if(option){
    // option.path是扫码要跳转的小程序页面
			if(option.path.indexOf('codePay')!==-1){
				// #ifdef MP-WEIXIN
					this.globalData.oneCodeLink = decodeURIComponent(option.query.q)
				// #endif
				// #ifdef MP-ALIPAY
					this.globalData.oneCodeLink = decodeURIComponent(option.query.qrCode)
				// #endif
			}
		}
},
globalData:{
  oneCodeLink:''
}
```

业务页面

```vue
onLoad(option){
  let paramsObj = {}
			// #ifdef MP-ALIPAY
      let url = getApp().globalData.oneCodeLink;
      // 如果option是空的，说明是支付宝扫码进来的，此时取扫码链接参数，否则取option参数
      if(JSON.stringify(option)==='{}'){
        paramsObj = queryURLParams(url)
      }else{
        paramsObj = option
      }
    // #endif
    // #ifdef MP-WEIXIN
    // 说明是扫码进来的
      if(option.q){
        let url = getApp().globalData.oneCodeLink;
        paramsObj = queryURLParams(url)
      }else{
        paramsObj = option
      }
    // #endif
    // #ifdef H5 
      paramsObj = option 
    // #endif
}
```

## 二、uni-app上拉加载和下拉刷新常用做法

在项目中经常会有上拉加载和下拉刷新的需求，下面总结一下通用的做法，直接上代码：

```vue
<template>
  <!-- 一定要有外层的view，并设置高度，当然也可以给百分比，否则不好触发刷新 -->
	<view class="main-content" :style="{'height':contentHeight+'px'}" >
			<scroll-view style="height:100%" 
			scroll-y="true"
			lower-threshold="10" 
			:refresher-enabled="true"
			refresher-threshold="50"
			refresher-default-style='black'
			refresher-background='#ccc'
			:refresher-triggered="isTriggered"
			@refresherrefresh="refresh"
			@scrolltolower="handleScrollToLower"
			>
				<view class="item" v-for="(item,index) in dataList" :key="index">
					{{index+1}}
				</view>
				<view v-if="showLoadMore" class="bottom-text">
					拼命加载中...
				</view>
				<view class="no-data" v-if="isNoMore" >
					<text class="line"></text>
					<text class="no-data-desc" >我是有底线的</text>
					<text class="line"></text>
				</view>
			</scroll-view>
		</view>
</template>

<script>
	export default {
		name:'interview',
		data() {
			return {
				dataList:[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
				contentHeight:0,
				isTriggered:false, // 下拉刷新是否被触发，初始化未被触发
				isNoMore:false, // 是否没有更多数据了
				showLoadMore:false, // 是否显示加载更多
				page:0,
			};
		},
		async onLoad() {
			this.height = this.getPageHeight();
			this.contentHeight = this.height - await this.getElementHeight('.head')
		},
		methods:{
			// 滚动到底部，上拉加载更多
			handleScrollToLower(e){
				console.log('加载更多')
				if(this.page>10){
					this.isNoMore = true;
					this.showLoadMore = false
					return
				}
				this.page++;
				this.isNoMore = false;
				this.showLoadMore = true
				// 请求下一页数据
				this.dataList = this.dataList.concat([{},{},{}]);
			},
			// 刷新
			refresh(e){
        console.log('开始刷新');
				this.page = 1;
				this.isNoMore = false;
				this.showLoadMore = false;
				this.isTriggered = true;
				this.dataList = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
				// 请求第一页数据，请求完isTriggered为false
				setTimeout(()=>{
					this.isTriggered = false
				},5000)
			}
		}
	}
</script>

<style lang="scss" scoped >
.main-content{
			overflow: auto;
			.item{
				padding: 20rpx 0;
				border: 1px solid #ccc;
			}
			.bottom-text{
				text-align: center;
				padding: 10rpx;
				font-size: 24rpx;
				color: #ccc;
			}
			.no-data{
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ccc;
				padding: 20rpx 0;
				.line{
					width: 20%;
					display: inline-block;
					border-bottom: 1rpx solid #999;
				}
				.no-data-desc{
					text-align: center;
					margin: 0 20rpx;
					font-size: 24rpx;
				}
			}
		}
</style>

```

参考[scroll-view | uni-app官网](https://uniapp.dcloud.net.cn/component/scroll-view.html#scroll-view)

## 三、uni-app图片上传总结

```js
// 选择图片
imgClickFront() {
    let self = this;
    uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],

        success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            console.log('imgClickFront', res);
            self.setData({
              srcimgfrontFlag: true,
              srcimgfront: res.tempFilePaths[0]
            });
        }
    });
},
```

 

```js
uploadImg(str, file, data, callBack, failCb) {
    return new Promise((resolve, reject) => {
        let _data = {}
        if(data){
            _data.carauthId = data
        }
        uni.uploadFile({
            url: app.globalData.globalImg + '/car/authentication/image',
            filePath: file,
            fileType:'image', // 文件格式
            fileName: str,
            name: str,
            header: {
                'Session-Id': uni.getStorageSync('sessionId'),
                'Content-Type': 'multipart/form-data' // 特别注意！！！微信/支付宝小程序必须加这个,H5没有！！！
            },
            formData: _data, // 其他参数在这里传
            success: function (res) {
                if(res.statusCode == 200){
                    try {
                        let data = JSON.parse(res.data)
                        if(data.state == 0){
                            resolve(data);
                        }else{
                            reject(res);
                        }
                    } catch (error) {
                        reject(res);
                    }
                }else{
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
},
```

 

```js
const result = await this.uploadImg('driveLicenseImg1', this.srcimgfront)
```

## 四、扫码跳转小程序某个页面

使用uni-app开发小程序，过程中有一个很常见的场景就是用户扫码（H5页面）跳转到小程序的某个页面，其中的**关键是怎么获取二维码的参数。**

## 4.1、H5页面

就是类似这种`https://applet-pre.sxycjtjt.com/3L.html?pC=PA22092210053&cC=9cf11c6a184c483c9ce155208339fc73&sT=0&eT=1`

支付宝参考这篇文章：[小程序scheme链接介绍](https://opendocs.alipay.com/support/01rb18#H5%20%E8%B7%B3%E8%BD%AC%E5%B0%8F%E7%A8%8B%E5%BA%8F)

微信参考这篇文章：[二维码内容获取](https://developers.weixin.qq.com/miniprogram/introduction/qrcode.html#%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%B7%B3%E8%BD%AC%E8%A7%84%E5%88%99)

具体的例子：

```html
<!--
 * @Author: your name
 * @Date: 2020-07-24 19:04:49
 * @LastEditTime: 2022-10-08 17:33:20
 * @LastEditors: shuaifeng zhang
 * @Description: In User Settings Edit
 * @FilePath: \trunk\code_loading.html
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>扫码出场</title>
</head>
<script src="https://res.wx.qq.com/open/js/jweixin-1.3.0.js"></script>

<body>
</body>
<script>
  // 获取地址栏parkId
  var urlGet = getRequest();
  let origin = window.location.origin
  function getRequest() {
    var urlRequest = new Object();
    var url = location.search;
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        urlRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1]);
      }
    }
    return urlRequest;
  }

  var parkId = urlGet.p || urlGet.pC || '';
  if (parkId) {
    sessionStorage.setItem("parkId", parkId)
  }
  var parkDoorId = urlGet.c || "";
  if (parkDoorId) {
    sessionStorage.setItem("parkDoorId", parkDoorId)
  }
  var recordCode = urlGet.rC // 入场小票
  if (recordCode) {
    sessionStorage.setItem("recordCode", recordCode)
  }
  var parkRecordId = urlGet.pI || "" // 本地扫码后支付的二维码携带参数
  if (parkRecordId) {
    sessionStorage.setItem("parkRecordId", parkRecordId)
  }
  var p = sessionStorage.getItem("parkId");
  var channelCode = urlGet.cC || "";
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    // 微信
    if (recordCode && recordCode != '') {
      window.location.href = `${origin}/pages/login/login?r=` + recordCode + '&p=' + parkRecordId + '&scanType=exit&exitType=third'
    } else {
      window.location.href = `${origin}/pages/login/login?channelCode=` + channelCode + '&parkCode=' + parkId + '&scanType=exit&exitType=third'
    }
  }else if(ua.match(/AliApp/i) == 'aliapp'){
    // 支付宝
    let {cC,eT,pC,pI,rC,sT} = urlGet;
    let queryParams = `pC=${pC}&cC=${cC}&sT=${sT}&eT=${eT}&rC=${rC}&pI=${pI}`
    window.location.href = `https://ds.alipay.com/?scheme=`+ encodeURIComponent(`alipays://platformapi/startapp?appId=2021003145683079&page=pages/login/login&query=${encodeURIComponent(queryParams)}`)
  }
</script>

```

跳转的页面

```js
  onLoad(options) {
    let option;
	  // #ifdef MP-WEIXIN
		  option = this.getParams(options.q);
	  // #endif
	  // #ifdef MP-ALIPAY
		let linkUrl = uni.getLaunchOptionsSync().query.qrCode;
		let paramsUrl = linkUrl.slice(linkUrl.indexOf('?')+1)
		option = this.getParams(paramsUrl);
  },
methods:{
  getParams(url) {
      let pattern = /(\w+)=(\w+)/gi;
      let parames = {};
      decodeURIComponent(url).replace(pattern, ($, $1, $2) => {
        parames[$1] = $2;
      });
      return parames;
    },
}

```

## 4.2、其他链接

比如`https://applet-pre.sxycjtjt.com/receiveCoupon?activityId=1788270108055864442&distributeUserId=1785881921412955486&qrId=1788272050882227699111530`，并不是某个`.html`界面，这种情况对于微信小程序，还是参考上面的方法，但是支付宝小程序可以通过在`App.vue`中使用`onShow`钩子，例如：

```vue
	globalData: {
    listIndexStr: null,
    scanCodeLink:'' 
  },
  onShow(options) {
			console.log('App.vue-----onShow',options)
			// #ifdef MP-ALIPAY
				if(options.query&&options.query.qrCode){
					getApp().globalData.scanCodeLink = options.query.qrCode，// 拿到的是上述完整的链接
				}
			// #endif
  }
```

在对应的跳转页面，比如这里的`pages-my/add-car-coupon`：

```vue
onLoad(options){
			// #ifdef MP-WEIXIN
				const q = decodeURIComponent(options.q)//拿到的是链接本身
				this.linkParamStr = this.getLinkParamStr(q);
				this.linkParamObj = this.getParams(q);
			// #endif
			// #ifdef MP-ALIPAY
				let linkUrl = getApp().globalData.scanCodeLink;// 拿到扫描到的链接
				this.linkParamObj = this.getParams(linkUrl);
			// #endif
		},
```

接着就可以进行下部的操作了

## 五、token

接口一般都会有校验，一般校验会用到token

token就像一个身份证，用于识别你，登录之后从后台获取，然后用sessionStroage进行存储：

```js

router.beforeEach(async function (to, from, next) {
  // pendingRequest.forEach(item => {
  //   item.routeChangeCancel && item.cancel();
  // });
  if (to.path != "login" && to.path != "/" && to.path != "/findPsd") {
    // 没有token，跳转到登录
    if (!sessionStorage.token) {
      next("/");
      return;
    }
```

小程序也是一样的

```js
this.$store.dispatch('auth/smsLogin',data).then((res) => {
                if (res.state == 0) {
                    uni.setStorageSync('sessionId', res.value.sessionId);
                    uni.setStorageSync('mobile', this.phoneNum);
                }
```

请求拦截

```js

export function $http(opt) {
	var app = getApp();
	let globalUrl = app.globalData.globalUrl;
    //  对于 GET 方法的数据，会将数据转换成 query string
    //  对于 POST 方法且 header['content-type'] 为 application / x - www - form - urlencoded 的数据，会将数据转换成 query string
    let contentTy = opt.type == 'get' ? 'application/json' : 'application/x-www-form-urlencoded';
	console.log(opt,url)
    let url = globalUrl + opt.url; // mock
    // url = 'http://yapi.smart-xwork.cn/mock/89596/apc'+ opt.url
	console.log(opt,url)
    uni.request({
        method: opt.type,
        url,
        data: opt.data,
        header: {
            'content-type': contentTy,
            // 默认值
            // 'Session-Id': '455d235f8bdcd19a0a927caa04a0ee8b'
          // 设置token
            'Session-Id': uni.getStorageSync('sessionId')
        },

        success:(res) => {
            // console.log('net-res' + url, res);
            if (res.data.state == 0 || res.data.state == 1 || res.data.state == 42) {
                opt.suc(res.data);
            } else if (res.data.state == 2 || res.data.state == 3) {
                console.log('res.data.state == 2')
                uni.setStorageSync('sessionId', '');
                let toAuthor = uni.getStorageSync('toAuthor');
                if(toAuthor == 0){
                    console.log('url+++++++',url)
                    uni.setStorageSync('loginBackUrl', url);
                    uni.setStorageSync('toAuthor', 1);
                    uni.navigateTo({
                        url: '/pages/author/author'
                    });
                }
            } else {
                opt.fail && opt.fail(res.data.desc); // opt.fail(res)
            }
        },

        fail: function (res) {
            console.log('net-fail' + url, res);
            opt.fail && opt.fail(res)
            uni.showToast({
                title: '网络异常',
                icon: 'none',
                mask: true
            });
        }
    });
} // 根据坐标计算距离

```

## 其他问题

**uni-app的页面内部的模板结构是啥样的？**

参考[组件概述 - uni-app官网 (dcloud.io)](https://uniapp.dcloud.io/component/README?id=%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6)

2.  **怎么使用uni-ui组件？**

uni ui支持 HBuilderX直接新建项目模板、**npm安装**和单独导入个别组件等多种使用方式，可以参考[组件概述 - uni-app官网 (dcloud.io)](https://uniapp.dcloud.io/component/README?id=uniui)，uni-ui的每个组件的详细描述：[Badge 数字角标 (dcloud.net.cn)](https://uniui.dcloud.net.cn/components/badge.html)，**可能需要重新运行项目**

3.  **css一般使用什么单位**  
    一般使用`rpx`
4.  **怎么使用Vuex？**  
    参考这篇文章[如何在uni-app使用vuex - 简书 (jianshu.com)](https://www.jianshu.com/p/c288b8e6067c)
5.  **怎么使用自定义组件？**  
    参考[uni-app自定义组件的使用\_tyoubinn的博客-CSDN博客](https://blog.csdn.net/tyoubinn/article/details/109056204)
6.  怎么使用路由？  
    参考[uni-app路由](https://uniapp.dcloud.io/frame?id=%E8%B7%AF%E7%94%B1)
