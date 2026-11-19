---
description: "wrk2 是一个轻量支持高并发（可达到百万级，跟电脑配置有关）的一个开源压测工具，但是其只能在 linux 环境下使用，那么如何也能在 window 环境下使用呢？一、Windows 11环境下安装wrk1. 通过WSL 2安装（推荐方法）Windows 11原生环境下无法直接运行wrk，需要..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/zy00oi2lo1vb63nk"
updated: "2025-08-21T07:05:55.000Z"
---

# wrk2压测

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/zy00oi2lo1vb63nk)

<details class="toc-details">
<summary>本页结构（16 个小节）</summary>

- 一、Windows 11环境下安装wrk
- 1\. 通过WSL 2安装（推荐方法）
- 代码示例
- 2\. 通过Docker安装（备选方案）
- 二、wrk压测参数详解
- 三、Windows环境下压测的特殊注意事项
- 四、wrk测试结果解读
- 一、WRK2压测报告字段解析
- 1\. 压测请求配置（命令行参数）
- 2\. 线程校准（Thread Calibration）

</details>

wrk2 是一个轻量支持高并发（可达到百万级，跟电脑配置有关）的一个开源压测工具，但是其只能在 linux 环境下使用，那么如何也能在 window 环境下使用呢？

## 一、Windows 11环境下安装wrk

## 1\. 通过WSL 2安装（推荐方法）

Windows 11原生环境下无法直接运行wrk，需要通过WSL 2（Windows Subsystem for Linux）安装Linux子系统来运行wrk：

powershell 管理员身份运行：

## 代码示例

```powershell
# 1. 启用WSL功能（管理员权限运行）
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 2. 启用虚拟机平台
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 3. 设置WSL 2为默认版本 一定要重启电脑
wsl --set-default-version 2

# 4. 安装Ubuntu发行版（从Microsoft Store）
wsl --install -d Ubuntu
```

安装完成后，在Ubuntu子系统中安装wrk：

```bash
# 更新软件包列表
sudo apt-get update

# 安装unzip软件
sudo apt install unzip

# 安装编译工具
sudo apt-get install build-essential git -y

# 克隆wrk源码（github下载很慢，可以把包下载下来上传到gitee仓库，地址替换为gitee仓库地址即可）
# git clone https://github.com/wg/wrk.git 
git clone https://gitee.com/DOIT007/wrk2.git

# 编译安装
cd wrk2
make

# 将wrk添加到PATH
sudo cp wrk /usr/local/bin
```

> 安装成功后在电脑上就会有 ubuntu 的图标了，可以在“开始”菜单搜索 “ubuntu”，**以后用的时候点这个图标就进入了 linux 环境，也可是直接使用 wrk 了**
> 
> 

![image.png](/images/1082e84fb171eecf.png)

## 2\. 通过Docker安装（备选方案）

如果您已经按照之前的方法在Windows 11上安装了Docker，可以直接使用Docker容器运行wrk：

```powershell
docker run --rm williamyeh/wrk -t4 -c100 -d30s http://your-api-endpoint
```

## 二、wrk压测参数详解

wrk的基本参数与Docker环境下相同：

参数 | 说明 | 示例值
--- | --- | ---
-t | 线程数（建议CPU核数的2-4倍） | 4
-c | 并发连接数 | 100
-d | 测试持续时间 | 30s
-s | Lua脚本路径 | post.lua
--latency | 打印延迟统计 | 
--timeout | 超时时间 | 5s

常用压测命令示例：

```bash
# 基本测试（4线程，100连接，持续30秒）
wrk -t4 -c100 -d30s http://example.com/api

# 带延迟统计和超时设置
wrk -t4 -c200 -d1m --latency --timeout 5s http://example.com/api

# 使用Lua脚本定制POST请求
wrk -t4 -c100 -d30s -s post.lua http://example.com/api
```

 

::: tip
https://zhuanlan.zhihu.com/p/552756287
:::

## 三、Windows环境下压测的特殊注意事项

1.  **网络配置**：

-   测试本地服务时，使用`localhost`或`127.0.0.1`
-   跨机器测试需确保网络连通性和防火墙设置

2.  **性能优化**：

-   关闭不必要的后台程序释放系统资源
-   在电源设置中选择"高性能"模式
-   建议分配至少4GB内存给WSL 2子系统

3.  **结果稳定性**：

-   Windows环境下可能有轻微性能波动
-   建议多次测试取平均值
-   监控系统资源使用情况（CPU、内存、网络）

4.  **与Docker环境的差异**：

-   WSL 2环境下性能接近原生Linux，损耗约1-3%
-   Docker环境下性能损耗通常<5%
-   原生Windows环境无法直接运行wrk，必须通过WSL或Docker

## 四、wrk测试结果解读

![image.png](/images/e03ae24b8011c494.png)

## 一、WRK2压测报告字段解析

### 1\. 压测请求配置（命令行参数）

-   `-t${nproc}`：线程数（`nproc` 为系统 CPU 核心数，此处为 12 线程）。
-   `-d30s`：压测时长 30 秒。
-   `-c100`：并发连接数 100。
-   `-s /mnt/c/Users/administrator/desktop/test.lua`：指定 Lua 脚本（自定义请求逻辑）。
-   `--latency`：启用延迟统计（默认开启）。
-   `-R 1000`：每秒请求速率限制为 1000。
-   `http://192.168.0.149:9086`：目标接口地址。

  

### 2\. 线程校准（Thread Calibration）

WRK2 启动时会校准线程性能，输出每条线程的**平均延迟（mean lat.）****和****速率采样间隔（rate sampling interval）**，用于后续请求速率的动态调整。

-   `mean lat.`：线程处理请求的平均延迟（单位：毫秒，如 `697.678ms` 表示该线程平均延迟 697.678 毫秒）。
-   `rate sampling interval`：速率采样间隔（单位：毫秒，如 `3201ms` 表示每 3201 毫秒采样一次请求速率）。

  

### 3\. 统计指标（Thread Stats）

统计\*\*延迟（Latency）**和**每秒请求数（Req/Sec）\*\*的平均值（Avg）、标准差（Stdev）、最大值（Max）及波动范围（+/– Stdev）。

-   **Latency（延迟）**：

-   `Avg`：平均延迟（如 `3.04s` 表示平均延迟 3.04 秒）。
-   `Stdev`：延迟的标准差（如 `1.53s` 表示延迟波动程度）。
-   `Max`：最大延迟（如 `8.46s` 表示最长延迟 8.46 秒）。
-   `+/– Stdev`：平均延迟 ± 标准差的波动范围（如 `67.54%` 表示延迟波动占平均值的比例）。

-   **Req/Sec（每秒请求数）**：

-   `Avg`：平均每秒请求数（如 `68.16` 表示平均每秒处理 68.16 个请求）。
-   `Stdev`：每秒请求数的标准差（如 `12.46` 表示每秒请求数波动程度）。
-   `Max`：最大每秒请求数（如 `94.00` 表示峰值每秒处理 94 个请求）。
-   `+/– Stdev`：平均每秒请求数 ± 标准差的波动范围（如 `67.21%` 表示每秒请求数波动占平均值的比例）。

  

### 4\. 延迟分布（Latency Distribution）

使用 `HdrHistogram` 统计**记录延迟**的百分位数（如 50%、75%、99% 等），反映不同延迟区间内的请求占比。

-   `50.000% 2.77s`：50% 的请求延迟 ≤ 2.77 秒（中位数延迟）。
-   `75.000% 4.00s`：75% 的请求延迟 ≤ 4.00 秒（四分位延迟）。
-   `99.000% 7.20s`：99% 的请求延迟 ≤ 7.20 秒（高延迟占比）。
-   `99.990% 8.44s`：99.99% 的请求延迟 ≤ 8.44 秒（极端高延迟占比）。
-   `99.999% 8.47s`：99.999% 的请求延迟 ≤ 8.47 秒（接近最大延迟）。

  

### 5\. 详细百分位谱（Detailed Percentile spectrum）

`HdrHistogram` 的**百分位谱**，用于分析延迟的分布细节。

-   `Value`：延迟值（单位：毫秒）。
-   `Percentile`：对应延迟值的百分位（如 `0.000000` 表示 0% 的请求延迟 ≤ 该值）。
-   `TotalCount`：延迟 ≤ 该值的请求总数（如 `1` 表示仅 1 个请求延迟 ≤ 该值）。
-   `1/(1-Percentile)`：延迟分布的**尾部权重**（反映高延迟对整体分布的影响，值越大表示高延迟占比越高）。

  

### 6\. 总结统计

-   `24382 requests in 30.03s, 21.35MB read`：30.03 秒内完成 24382 次请求，传输 21.35MB 数据。
-   `Non-2xx or 3xx responses: 24382`：非 2xx/3xx 响应数（如 4xx/5xx 错误，此处为 24382，需结合上下文判断是否异常）。
-   `Requests/sec: 811.90`：平均每秒请求数（与 `Thread Stats` 中 `Req/Sec Avg` 一致）。
-   `Transfer/sec: 727.86KB`：平均每秒传输速率（21.35MB / 30.03s ≈ 727.86KB/s）。

  

## 二、重点关注字段及原因

性能分析需聚焦**核心指标**，判断系统稳定性、瓶颈与优化方向：

1.  **延迟指标（Latency）**

-   `Avg`：**平均延迟是系统响应速度的核心参考**，需结合业务 SLA 判断是否达标。
-   `Max`：最大延迟反映系统在高并发下的“最差表现”，需排查是否因资源瓶颈（如 CPU、内存、网络）导致。
-   `99%+ 百分位延迟`：高延迟占比反映系统“长尾延迟”问题，需关注 99%、99.9% 等高百分位延迟，避免用户体验被少数慢请求拖累。

2.  **每秒请求数（Req/Sec）**

-   `Avg`：平均吞吐量反映系统处理能力，需结合并发数、硬件资源判断是否达到预期。
-   `Max`：峰值吞吐量反映系统在短时间内的爆发处理能力，需验证硬件是否支持峰值负载。

3.  **延迟分布（Latency Distribution）**

-   50%、75%、90% 等中低百分位延迟：反映“普通请求”的响应速度，需确保满足业务需求。
-   99%、99.9% 等高百分位延迟：反映“慢请求”的占比，需排查是否因代码逻辑、数据库、网络等环节导致延迟堆积。

4.  **非 2xx/3xx 响应数**  
    非正常响应（如 4xx 客户端错误、5xx 服务端错误）需优先排查，避免因错误请求掩盖性能问题。

  

通过以上字段的分析，可全面评估接口的**响应速度、吞吐能力、稳定性**，为性能优化提供数据支撑。

## windows 环境下的压测（举例）

1.  在电脑桌面新建一个 `test.lua` 文件

```lua
-- 设置请求参数
wrk.method = "GET"
wrk.path = "/old-house-rebuild/app/coupon/showList"  -- 修改为您的API路径，这里是旧房改造下的领券接口
wrk.headers = {
    ["Content-Type"] = "application/json",
    ["Authorization"] = "Bearer Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJhMTQ5ZDk1LTZmODMtNGQzMC1iNWFmLWJlZGFiMzg3NjQ5ZSJ9.nbFO_3BHq0zr57KgmqW7_RAUA8bL6FPmKWN4Ha4IEhkkmkqqUoIecSmP3ul9jTubFryKYmZ2tioxw6NKYK_GPQ"  -- 替换为实际token
}
```

 

```lua
-- 设置请求参数
wrk.method = "POST"
wrk.path = "请求路径"  -- 修改为您的API路径，这里是旧房改造下的领券接口
wrk.headers = {
    ["Content-Type"] = "application/json",
    ["Authorization"] = "Bearer Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJhMTQ5ZDk1LTZmODMtNGQzMC1iNWFmLWJlZGFiMzg3NjQ5ZSJ9.nbFO_3BHq0zr57KgmqW7_RAUA8bL6FPmKWN4Ha4IEhkkmkqqUoIecSmP3ul9jTubFryKYmZ2tioxw6NKYK_GPQ"  -- 替换为实际token
}
wrk.body = '{"key1":"value1", "key2":123}'
```

 

```lua
counter = 0
request = function()
   counter = counter + 1
   local id = math.random(1000,9999)
   local path = "/api/users/"..id
   local body = string.format(
      '{"order_id":%d,"amount":%.2f}',
      counter,
      math.random(100,999)
   )
    wrk.headers = {
      ["Content-Type"] = "application/json",
      ["Authorization"] = "Bearer Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJhMTQ5ZDk1LTZmODMtNGQzMC1iNWFmLWJlZGFiMzg3NjQ5ZSJ9.nbFO_3BHq0zr57KgmqW7_RAUA8bL6FPmKWN4Ha4IEhkkmkqqUoIecSmP3ul9jTubFryKYmZ2tioxw6NKYK_GPQ"  -- 替换为实际token
  }
   return wrk.format("POST", path, wrk.headers, body)
end

```

因为文件是在 window 桌面，其 windows 地址是：

```bash
"C:\Users\Administrator\Desktop\test.lua"
```

在WSL中需要通过`/mnt`访问：打开 ubuntu 环境，执行

```bash
wrk2 -t$(nproc) -c100 -d30s -s /mnt/c/Users/administrator/desktop/test.lua --latency -R 1000 http://192.168.0.149:9086
```

-   `-R 1000`：表示目标吞吐量为 **1000 QPS**（每秒 1000 次请求）。
-   其他参数含义与原始 `wrk` 相同：

-   `-t$(nproc)`：使用 CPU 核心数的线程数。
-   `-c100`：每个线程保持 100 个并发连接。
-   `-d30s`：测试持续 30 秒。
-   `-s test.lua`：加载自定义 Lua 脚本。
-   `--latency`：启用延迟统计。

**本电脑 wsl 下的linux账号密码： administrator 、qwer123456**

  

​
