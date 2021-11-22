
浏览器安全大致分为三大块：web页面安全，浏览器网络安全，浏览器系统安全。

# web页面安全

## 同源政策

- 两个URL协议，域名，端口都相同，则两个URL同源。主要作用于不同源之间想要访问资源或者DOM操作。主要有以下限制：
  - DOM层面。
  - 数据层面。
  - 网络层面。限制了通过XMLHttpRequest等方式的数据发送给不同的站点。
- 但安全性和遍历性是互相对立的，所以浏览器让出了同源策略的一些安全性：
  - 页面中可以嵌入「第三方的资源」。但恶意脚本仍旧可以通过各种途径插入并威胁到网页内容。就是「XSS」攻击。因此引入了「CSP」。
  - 「CSP」。核心思想是让服务器能决定浏览器能加载那些资源，让服务器决定是否执行内联JS代码。

- 跨域资源共享「CORS」和跨文档消息机制。
  - 可以进行跨域访问控制资源。
  - 跨文档消息机制可以使用window.postMessage来对不同源进行通讯。

# XSS跨域资源共享

- Cross site scripting。是指黑客往HTTP文件或者DOM中注入脚本，在用户浏览页面时利用注入的脚本对用户进行攻击的手段。

### 攻击方式
- 窃取Cookie信息。例如：通过document.cookie，或者XMLHttpRequest或者Fetch添加CORS功能将数据发给「恶意服务器」，拿到Cookie相关信息。
- 添加事件。监听用户行为。
- 修改DOM。伪造登陆窗口。
- 页面生成浮窗广告。

### 注入方式
- 存储型XSS攻击。
    - 利用站点漏洞将恶意JS提交到网站数据库中。
    - 普通用户向网站请求包含恶意JS脚本的代码。
    - 浏览时就可以将用户Cookie上传到服务器。
  ![](https://static001.geekbang.org/resource/image/54/49/5479e94a06d9a7cdf3920c60bf834249.png)
- 反射型XSS攻击。恶意JS属于网站请求中的一部分，随后网站又把恶意JS返回给用户。从而执行JS脚本。「web服务器不会存储xss攻击的恶意脚本」。
![](/image/反射型XSS.png)
- DOM型的XSS攻击。在「web资源传输的过程中」或者在「用户操作页面」过程中修改web页面中的数据。

### 如何防止
- 存储型和反射型都需要经过web服务器处理。但DOM的XSS是浏览器端的漏洞。
- XSS攻击都需要给浏览器「注入恶意脚本」，然后通过恶意脚本将用户信息「发送至恶意服务器」。

- 策略:
  1. 服务器对输入脚本进行「过滤」或者「转码」。对关键字符进行转换，例如：转换或者过滤`<script>`里的内容。
  2. 充分利用CSP。（重要）
    - 限制加载其他域下的资源文件。JS文件
    - 禁止第三方域提交信息。
    - 禁止执行内联脚本和未授权脚本。
    - 提供上报功能。
  3. 比较重要的数据设置`HttpOnly`属性。很多脚本都是盗用用户的登录凭证。设置了`HttpOnly`，标志Cookie只能使用在Http请求过程。无法通过JS拿到。
  ```
  set-cookie: NID=189=M8q2FtWbsR8RlcldPVt7qkrqR38LmFY9jUxkKo3-4Bi6Qu_ocNOat7nkYZUTzolHjFnwBw0izgsATSI7TZyiiiaV94qGh-BzEYsNVa7TZmjAYTxYTOM9L_-0CN9ipL6cXi8l6-z41asXtm2uEwcOC5oh9djkffOMhWqQrlnCtOI; expires=Sat, 18-Apr-2020 06:52:22 GMT; path=/; domain=.google.com; HttpOnly
  ```
  4. 添加验证码。限制输入长度等。

# CSRF攻击 - 跨站请求伪造
- 定义：黑客利用了用户的登录状态，通过第三方恶意网站来做恶意操作。
- 三个必要条件：目标站点有「CSRF漏洞」；用户有「登录信息」在站点上；需要打开一个「第三方网站」。

- 发起CSRF攻击的方式：
  - 自动发起get请求。转账的请求隐藏在「IMG或者类似的资源」标签中。
  ```HTML
  <!DOCTYPE html>
  <html>
    <body>
      <h1>黑客的站点：CSRF攻击演示</h1>
      <img src="https://time.geekbang.org/sendcoin?user=hacker&number=100">
    </body>
  </html>
  ```
  - 自动发起post请求。构建一个隐藏的「表单」，然后自动提交
  ```HTML  
  <!DOCTYPE html>
  <html>
  <body>
    <h1>黑客的站点：CSRF攻击演示</h1>
    <form id='hacker-form' action="https://time.geekbang.org/sendcoin" method=POST>
      <input type="hidden" name="user" value="hacker" />
      <input type="hidden" name="number" value="100" />
    </form>
    <script> document.getElementById('hacker-form').submit(); </script>
  </body>
  </html>
  ```
  - 引诱用户「点击链接」。上面有a标签的mask```<a>```。
  ```HTML
  <div>
    <img width=150 src=http://images.xuejuzi.cn/1612/1_161230185104_1.jpg> </img> </div> <div>
    <a href="https://time.geekbang.org/sendcoin?user=hacker&number=100" taget="_blank">
      点击下载美女照片
    </a>
  </div>
  ```

## 策略：
1. Cookie的`sameSite`属性。利用Cookie做用户登录凭证的站点。
  - strict。浏览器完全禁止第三方的Cookie。
  - Lax。跨站点下，第三方站点打开get请求，都会携带Cookie。post或者img，iframe都不会带上。
  - none。都带上
```
set-cookie: 1P_JAR=2019-10-20-06; expires=Tue, 19-Nov-2019 06:36:21 GMT; path=/; domain=.google.com; SameSite=none
```
2. 验证请求的来源站点。服务端通过`Referer`或者`Origin`验证请求来源站点。
  - Referer记录HTTP请求的来源地址，包括整个pathname。
  - Origin。包含域名信息。
3. CSRF token。
  - 浏览器向服务器发送请求时，服务器生成一个「CSRF token。植入到返回的页面中」。
  - 浏览器如果「发起较为关键的请求」时，需要带上token。然后服务器判断是否正确。
  - 不同的tab页生成的token也不同。