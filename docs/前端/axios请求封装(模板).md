---
description: "在项目中我们通常不会直接使用axios，而是要在axios的基础上进行一层封装来处理各种异常，比如超时、网络异常等，下面是一个模板： import axios from \"axios\"; import qs from \"qs\"; import { MessageBox } from \"elem..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ehh09k"
updated: "2024-02-07T07:18:02.000Z"
---

# axios请求封装(模板)

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ehh09k)

## 背景与思路

在项目中我们通常不会直接使用axios，而是要在axios的基础上进行一层封装来处理各种异常，比如超时、网络异常等，下面是一个模板：

## 代码示例

```js

import axios from "axios";
import qs from "qs";
import { MessageBox } from "element-ui";
import { nvrMediaUrl1, nvrMediaUrl2 } from "@/common/js/const";
import Router from "@/router";
import { handleRequestIntercept, handleResponseIntercept, pendingRequest } from "./repeat";
import { handleExport } from "./public.js";
axios.defaults.timeout = 500000;
// axios.defaults.headers["Session-Id"] = sessionStorage.token;
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
// axios.defaults.baseURL = '/bigdata';
//  POST传参序列化
axios.defaults.routeChangeCancel = true;
axios.interceptors.request.use(
  config => {
    // console.log(config)
    // config = handleRequestIntercept(config);
    config.headers["Session-Id"] = sessionStorage.token || "";
    if (config.method !== "get") {
      // console.log(config.data)
      if (config.url == nvrMediaUrl2) {
        return config;
      }
      config.url = config.url + (config.url.indexOf("?") !== -1 ? "&" : "?") + 'timestamp=' + Date.now()
      if (config.data) {
        if (config.headers["Content-Type"].indexOf("application/json") === -1) {
          if (config.headers["Content-Type"].indexOf("multipart/form-data") !== -1) {
            delete config.headers["Content-Type"];
            config.data = config.data.data;
          } else {
            config.data = qs.stringify(config.data.data, {
              arrayFormat: "repeat"
            });
          }
        } else {
          config.data = config.data.data;
        }
      }
    } else {
      config.url = config.url + (config.url.indexOf("?") !== -1 ? "&" : "?") + 'timestamp=' + Date.now()
      config.params = config.data;
    }
    return config;
  },
  error => {
    //   Indicator.close();
    //   Toast("错误的传参");
    return Promise.reject(error);
  }
);

function timeoutCb() {
  MessageBox.alert("登录超时，请重新登录！", "提示", {
    confirmButtonText: "确定"
  })
    .then(() => {
      Router.push("/");
    })
    .catch(() => {
      Router.push("/");
    });
}
//  code状态码200判断
axios.interceptors.response.use(
  // 200
  res => {
    // handleResponseIntercept(res.config);
    if (res.config.responseType == "blob") {
      handleExport(res);
      return;
    }
    if (res.data.state == 2) {
      if (sessionStorage.toLogin !== "haveToLogin") {
        sessionStorage.toLogin = "haveToLogin";
        timeoutCb();
      }
    } else if (res.data.state != 2 && res.config.responseType != "blob") {
      if (res.config.url == nvrMediaUrl2) {
        return new Promise(resolve => {
          resolve(res.data);
        });
      } else {
        return new Promise((resolve, reject) => {
          // resolve(res.data);
          if (res.data.state == 0) {
            resolve(res.data);
          } else {
            MessageBox.alert(res.data.desc||'服务异常', "提示", {
              confirmButtonText: "确定"
            });
            reject(res.data);
          }
        });
      }
    }
  },
  error => {
    // console.log(error);
    MessageBox.alert(
      error.response.data.desc || error.response.statusText || "服务器响应失败！",
      "提示",
      {
        confirmButtonText: "确定"
      }
    ).then(() => {});
    // Indicator.close();
    return Promise.reject(error);
  }
);

export default axios;

```

 

```js

// 郑州专线
export const nvrMediaUrl2 =
  process.env.VUE_APP_BUILD_MODE === "pre" ?
  "http://47.92.212.222:10039/steam/getNvrMediaUrl2" :
  "http://121.89.203.100:10039/steam/getNvrMediaUrl2";

// 视频监控用户名
export const username = process.env.VUE_APP_BUILD_MODE === "pre" ? "test" : "zz_prd";

// 视频监控密钥
export const secretKey =
  process.env.VUE_APP_BUILD_MODE === "pre" ?
  "JNbDrcEN0lylP8ojAJmTDPAZq3ctLw" :
  "vAMsb3qRMLv6HyQUNcy5fs4SIht2dy";
console.log(process.env.VUE_APP_BUILD_MODE);

```

 

```js
/* eslint-disable */
import axios from "axios";
import qs from "qs";

let pendingRequest = [];

/**
 * 请求的拦截处理
 * @param config - 请求的配置项
 */
const handleRequestIntercept = config => {
  const url = [config.method, config.url, qs.stringify(config.params), qs.stringify(config.data)];
  const requestMark = url.join("&");
  const markIndex = pendingRequest.findIndex(item => {
    return item.name === requestMark;
  });
  // 存在，即重复了
  if (markIndex > -1) {
    pendingRequest[markIndex].cancel();
    pendingRequest.splice(markIndex, 1);
  }
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  config.cancelToken = source.token;
  config.requestMark = requestMark;
  pendingRequest.push({
    name: requestMark,
    cancel: source.cancel,
    routeChangeCancel: config.routeChangeCancel
  });

  return config;
};

/**
 * 响应的拦截处理
 * @param config - 请求的配置项
 */
const handleResponseIntercept = config => {
  const markIndex = pendingRequest.findIndex(item => {
    return item.name === config.requestMark;
  });
  markIndex > -1 && pendingRequest.splice(markIndex, 1);
};

export { pendingRequest, handleRequestIntercept, handleResponseIntercept };

```

 

```js
import qs from 'qs';
import Md5Handle from 'js-md5';
import axios from './http';
import {
  MessageBox
} from 'element-ui';
import Vue from "vue";
// 全局导出
export function handleExport(res) {
  console.log(res)
  let b = res.data;
  let reader = new FileReader();
  reader.addEventListener("loadend", () => {
    let data = {};
    try {
      data = JSON.parse(reader.result);
      if (data.state == 2) {
        sessionStorage.toLogin = 0;
        MessageBox
          .alert("登录超时，请重新登录！", "提示", {
            confirmButtonText: "确定"
          })
          .then(() => {
            Router.push("/");
          });
      } else {
        MessageBox.alert(data.desc || "请求失败！", "提示", {
          confirmButtonText: "确定"
        });
      }
    } catch (e) {
      if (res.headers["content-disposition"]) {
        sessionStorage.setItem(
          "filename",
          decodeURI(res.headers["content-disposition"].split("=")[1])
        );
        let blob = res.data;
        let filename = sessionStorage.getItem("filename") || "download.xls";
        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(a);
        a.click();
        body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    }
  });
  reader.readAsText(b);
}
// md5 加密
export function jsMd5(account, pwd) {
  return Md5Handle(account + pwd);
}

export function exportExcelNew(url, opt, method) {
  method = method || 'post';
  let downLoad = axios[method](url, {
    data: opt
  }, {
    responseType: 'blob'
  });
  return downLoad
}
// 导出
export function exportExcel(url, opt) {
  // opt.sessionId = sessionStorage.token;
  axios.headers.common['Session-Id'] = sessionStorage.token;
  axios.get(
    url + '?' + qs.stringify(opt)
  ).then((res) => {
    if (res.body && res.body.state) {
      if (res.body.state <mark> '2' || res.body.state </mark> '5') {
        if (sessionStorage.toLogin == '1') {
          MessageBox.confirm('登录失效，请重新登录', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false
          }).then(() => {
            sessionStorage.toLogin = 0;
            Router.push('/');
          }).catch(() => {
            Router.push('/');
          });
        }
      } else {
        MessageBox.alert(res.body.desc, '提示', {
          confirmButtonText: '确定'
        });
      }
    } else {
      // 正常下载
      let form = document.createElement("form"); // 定义一个form表单
      form.style.display = 'none'; // 在form表单中添加查询参数
      form.target = '';
      form.method = 'get';
      form.action = url;
      for (let i in opt) {
        let input = document.createElement("input");
        input.type = 'hidden';
        input.name = i;
        input.value = opt[i];
        form.append(input);
      }
      let input4 = document.createElement("input");
      input4.type = 'hidden';
      input4.name = 'sessionId';
      input4.value = sessionStorage.token;
      document.getElementsByTagName('body')[0].append(form); // 将表单放置在web中
      form.append(input4);
      form.submit(); // 表单提交
      form.remove();
    }
  }).catch((err) => {
    if (err.toString().indexOf('911') != -1) {
      if (sessionStorage.toLogin == '1') {
        MessageBox.confirm('登录失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false
        }).then(() => {
          sessionStorage.toLogin = 0;
          Router.push('/');
        }).catch(() => {
          Router.push('/');
        });
      }
    } else if (err.toString().indexOf('timeout') != -1) {
      MessageBox.confirm('当前网络不稳定，请稍候重试', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false
      }).then(() => {
        Router.push('/');
      }).catch(() => {
        Router.push('/');
      });
    }
  });
}
```
