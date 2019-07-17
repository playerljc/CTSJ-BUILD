## CT-BUILD
&ensp;&ensp;一个基于webpack的打包工具
## 命令介绍
 1. ctbuild
    * --type [build的类型]
     * startapp [启动开发模式]
    ```bash
     ctbuild --type startapp
    ```
     * buildapp [对应用进行打包]
    ```bash
    ctbuild --type buildapp
    ```     
     * buildpackage [打包npmpackage]
    ```bash
    ctbuild --type buildpackage
    ``` 
     * buildumd [对应用进行umd打包]
    ```bash
    ctbuild --type buildumd --packagename packageName
    ```     
    
 2. ctcopy
     * srcDir
     * targetDir
     
   ```bash
   ctcopy src target
   ``` 
   
   将src中的内容拷贝到target中
 
##  ctbuild命令详解
 3. startapp，buildapp
  startapp和buildapp对应的是webpack中的dev和build
  
 * 目录结构
   .src
   &nbsp;&nbsp;.index.html
   &nbsp;&nbsp;.index.js
   &nbsp;&nbsp;.common.js
   .ctbuild.config.js
   .package.json

 * common.js
   可以将不变的第三方库放入commmon.js中，采用了webpack中的dll。

 * ctbuild.config.js
 
&nbsp;&nbsp;&nbsp;&nbsp;这个文件是对webpack配置文件进行合并的文件，用户的自定义功能可以在getConfig进行配置，如果getConfig返回空对象，则使用默认配置。
1.webpack - webpack对象
2.curModule - 默认配置
3.plugins - webpack的plugins，当前有如下插件
  HtmlWebpackPlugin,
  ExtractTextPlugin,
  CopyWebpackPlugin,
  HtmlWebpackIncludeAssetsPlugin,
  LessPluginCleanCSS,
  LessPluginAutoPrefix
可以对curModule进行重写来达到自定义的目的，如果自定的时候用到了webpack对象，如要使用参数中的webpack对象，如果自定义的时候需要用到插件，也应该用参数中plugins。

    ```js
    module.exports = {
      getConfig({webpack,curModule,plugins}) {
        return {};
      },
    };
    ```

 2. buildumd
 buildumd是把应用打包成node和browser都可以用的包
* 目录结构
   .src
   &nbsp;&nbsp;.index.js
   &nbsp;&nbsp;...其他文件
   .ctbuild.config.js
   .index.html
   .package.json
执行完命令之后会生成umd目录，在umd目录中会生成accordion.bundle.js和index.html文件。
    ```js
    ctbuild --type buildumd --packagename accordion
    ```
 3. buildpackage
 buildpackage是把代码打包成npm包。
* 目录结构
   .src
   &nbsp;&nbsp;...代码文件(jsx,js,less,css,图片等)
   .package.json

        命令将会把src目录中的文件编译到lib目录下，lib目录和src目录中的文件保持一致。

    ```js
    ctbuild --type buildpackage
    ```

##  安装

* 项目内安装
```bash
$ npm install @ct/build --save-dev
```

* 全局安装
```bash
$ npm install @ct/build -g
```

## 讨论群
![](https://github.com/playerljc/CTMobile/raw/master/outimages/qq.png "讨论群")

## 许可
[MIT](/LICENSE)
