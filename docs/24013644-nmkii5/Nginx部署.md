---
description: "Nginx是一款自由的、开源的、高性能的HTTP服务器和反向代理服务器。同时也是一个IMAP、POP3、SMTP代理服务器。Nginx可以作为一个HTTP服务器进行网站的发布处理，另外Nginx可以作为反向代理进行负载均衡的实现。使用Nginx进行部署，主要分为以下步骤：打包vue项目，比如n..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/wphgh1uof16aw50t"
updated: "2025-11-17T02:01:04.000Z"
---

# Nginx部署

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/wphgh1uof16aw50t)

<details class="toc-details">
<summary>本页结构（8 个小节）</summary>

- 一、上传代码到服务器
- 二、安装并配置Nginx
- 2.1、安装Nginx
- 2.2、修改配置文件
- 2.3、命令
- 三、在同一个域名（同一个端口）下映射不同的项目
- 一 、 重启
- 参考

</details>

Nginx是一款自由的、开源的、高性能的HTTP服务器和**反向代理**服务器。同时也是一个IMAP、POP3、SMTP代理服务器。Nginx可以作为一个HTTP服务器进行网站的发布处理，另外Nginx可以作为反向代理进行**负载均衡**的实现。

使用Nginx进行部署，主要分为以下步骤：

1.  打包vue项目，比如`npm run build`

```js
publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 公共路径，比如/admin，访问的时候会加上/admin
```

2.  上传打包出来的文件夹到服务器的某个文件夹
3.  在**服务器**上安装并配置Nginx
4.  启动Nginx

下面主要从第二步开始：

## 一、上传代码到服务器

打开Xftp , 点小窗口的新建

![image.png](/images/675278ecc086d3b5.png)

点完之后弹出这个框, 填写完信息之后点连接 , 服务器的相关信息问公司的人要

![image.png](/images/e181d6fa883219f0.png)

点完连接之后 , 弹出这个框 , 点接受并保存

![image.png](/images/fe19ec62434b886f.png)

## 二、安装并配置Nginx

### 2.1、安装Nginx

[Nginx官网](http://nginx.org/en/download.html)，一般服务器都是Linux，可以根据情况安装不同的版本

> 注意Nginx的安装路径不能有中文，否则可能启动不起来！

![image.png](/images/2b655a091d7b2398.png)

### 2.2、修改配置文件

实际上修改的是`conf/nginx.conf`文件，配置如下（待完善）

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
  worker_connections  1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;
  sendfile        on;
  #tcp_nopush     on;

  #keepalive_timeout  0;
  keepalive_timeout  65;

  #gzip  on;

  server {
    listen       80; # 服务器端口号
    server_name  localhost; # 服务器域名，不带http。。。

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
      root   /html/csh; # 打包好的文件上传到这个目录，这里是车生活
      index  index.html; # 默认访问文件
      # 此处的 @router 实际上是引用下面的转发，否则在 Vue 路由刷新时可能会抛出 404
      try_files $uri $uri/ /csh/index.html; # 跟上面对应csh文件夹
    }
    # 设置代理,接口相关，注意一定要有就后面的斜线/
    location /mall/ {
        proxy_pass http://172.16.8.9:8888/mall; # 服务器地址，后面不能有任何注释！记得去掉，不知道为啥要加mall，但是加上就好了
      	proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Cookie $http_cookie;
    }
    
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
  }

}

```

> 如果想配置多个项目，只需要复制多个server，改一下端口号和其他配置就行了

### 2.3、命令

```powershell
# 重启，但如果配置文件有错，不一定会抛出异常
nginx -s reload

#先停止 Nginx 服务，再使用 nginx 尝试启动 Nginx 服务，如果配置文件有异常，则会抛出异常告知启动失败
nginx -s stop

# cd来到nginx文件夹,查看nginx版本看看安装成功了没
nginx.exe -v
```

> 错误日志文件在/logs文件夹

## 三、在同一个域名（同一个端口）下映射不同的项目

在工作中我们有可能会遇到这样的需求，即在同一个域名下可能有多个项目，那这时如何配置nginx呢？

这时候需要配置`alias`了，就像下面的`辅助项目1： 一码通`中的那样——

```nginx
server {
  listen       80;
  server_name   acb.pre-zz.aipark.com;
	client_max_body_size 100m;
  # 主项目
	location / {
      root   /opt/html/aiparkcity_acb;
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;
  }
  # 辅助项目1： 一码通，前端配置，其实参考的是acc，acmp配置
  # 这里的paycode是域名path，也就是将来访问的时候是acb.pre-zz.aipark.com/paycode
	location /paycode {
	   alias   /opt/html/paycode/; # 这里的alias指的是打包出来的文件资源所在位置
	   index  index.html index.htm;
	   try_files $uri $uri/ /paycode/index.html; # 访问paycode下面的index.html
	}
	

  location /acb/2.0 {
    proxy_pass http://gatewayplatform;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
  }
  # 辅助项目2： acc
  location /acc {
    alias /opt/html/aiparkcity_acc/;
    index index.html index.htm;
    try_files $uri $uri/ /acc/index.html;
  }	
	# 辅助项目3： acmp
	location /acmp {
      alias   /opt/html/aiparkcity_acmp/;
     # index  login.html index.html index.htm;
      index  index.html index.htm;
      try_files $uri $uri/ /acmp/index.html;
  }
  # 一码通的后台服务，“/api/admin”是请求接口前缀，由后台配置
  location /api/admin {
      proxy_pass http://apigateway;
      proxy_connect_timeout 300s;
      proxy_send_timeout 300s;
  }

	location /acc/2.0 {
    proxy_pass http://gatewayplatform;
	}
	# 后台服务
  location /acmp/2.0 {
    proxy_pass http://gatewayplatform;
  }

	location /map {
		proxy_pass http://aipark_map;
	}

  location /api/zhengzhou {
    proxy_pass http://172.17.107.190:80;
  }

  location /ok.json {
    proxy_pass http://172.17.107.190;
	}
	location /steam{
    #proxy_pass http://172.17.107.194;
    proxy_pass http://172.17.98.16:10039;
	}
  location /live{
   # proxy_pass http://172.17.107.194:9000;
  	proxy_pass http://172.17.98.16:9000;
  }
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
      root   html;
  }
}

```

但上面的只是`nginx`的相关配置，

由于使用的`alias`而不是`root`，所以在打包的配置文件中的属性`publicPath`就需要从`/`改成`/paycode（第一个paycode）`，否则就会出现下面这种错误：

![image.png](/images/b54c3cc9c0b62edb.png)

接着就是重新打包，上传，然后重启`nginx`服务即可

如果有必要，需要在vue路由配置添加`base`

```vue
export default new Router({
  mode: 'history', // 去掉url中的#
  base: '/zzd_htm/pc', //
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

```

但这样的话，可能刷新页面后还是会出现404，或者是出现`welcome nginx` 的问题，这就是因为`nginx`配置的问题

```nginx
location /paycode {
	   alias   /opt/html/paycode/; 
	   index  index.html index.htm;
	   try_files $uri $uri/ /paycode/index.html; #需要这样配置
	}
```

可参考[【nginx】History模式的配置细节我们知道，vue 单页面应用打包出来是静态资源，一般需要 nginx 或者其他 - 掘金 (juejin.cn)](https://juejin.cn/post/6926785971287490573)

## 一 、 重启

```html
cd /usr/local/nginx/sbin/
./nginx -s reload

```

## 参考

1.  [使用Nginx部署Vue项目超详细图文教程！含踩坑步骤](https://blog.csdn.net/weixin_43314519/article/details/115151858)
2.  [vue 打包后访问接口报错404 解决方案 （前提是在vue里使用了代理）](https://www.cnblogs.com/gaoxiaoxuner/p/11887159.html)
3.  [前端vue，部署到nginx，请求接口404](https://blog.csdn.net/Lee_SmallNorth/article/details/109165185)
4.  [Linux下编辑并保存文件操作步骤](https://blog.csdn.net/qq_37908248/article/details/103961393)
5.  [部署vue项目到nginx报错Uncaught SyntaxError: Unexpected token ‘＜‘](https://blog.csdn.net/u014508939/article/details/122336940)
6.  [详解nginx的root与alias](https://blog.csdn.net/weixin_44387339/article/details/128114151)
7.  ​
