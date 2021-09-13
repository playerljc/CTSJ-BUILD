# 3.0.10

***

2021/03/20

* 修改util.js中的getEntryIndex方法
* 加入disableStrict

# 3.0.9

***

2021/03/16

* 修改buildumd命令

# 3.0.8

***

2021/01/29

* 去掉cache-loader

# 3.0.7

***

2021/01/20

* resolve.modules中去掉path.join(runtimePath, 'node_modules')的路径寻找，修改为在文件所在目录的node_modules进行寻找
* --define curResolveModule 加入第三方包的引入是否从宿主工程的node_modules中进行查找

# 3.0.6

***

2021/01/09

* 去掉webpack.optimize.ModuleConcatenationPlugin()这个插件带来的dev模式下的副作用

# 3.0.5

***

2020/12/27

* css-loader中的getLocalIdent默认定义

# 3.0.4

***

2020/12/25

* loader中的cache-loader和thread-loader区分开发和生产环境
* css和js混淆区分生产和开发环境

# 3.0.3

***

2020/10/14

* umd修改

# 3.0.2

***

2020/10/10

* 修改postcss的配置文件引用bug

# 3.0.1

***

2020/09/28

* 加入了css的压缩

# 3.0.0

***

2020/09/25

* 加入了thread-loader
* 加入了alias@
* 加入了cssModules
* 加入了静态目录assets的赋值
* 加入了evn变量
* 加入了代码分析

# 1.0.36

***

2020/07/18

* 细节上优化

# 1.0.35

***

2020/07/18

* 加入@corejs3
* 加入postcss
* 细节上优化

# 1.0.34

***

2020/07/12

* 修复output中has的问题(HotModuleReplacementPlugin插件引起的问题)

# 1.0.33

***

2020/07/09

* dev加入HMR功能

# 1.0.32

***

2020/07/04

* 修复linux找不到命令错误(工作空间切换引起的)

# 1.0.31

***

2020/07/04

* 修复linux找不到命令错误(工作空间切换引起的)

# 1.0.30

***

2020/07/04

* 修复linux找不到命令错误(工作空间切换引起的)

# 1.0.29

***

2020/07/04

* 修复linux找不到命令错误(工作空间切换引起的)

# 1.0.28

***

2020/06/21

* 加入一些babel的插件

# 1.0.27

***

2020/06/18

* bug的修改

# 1.0.26

***

2020/06/18

* 去掉spawn执行命令时候引用node_modules下的.bin目录下的命令，加入env环境变量

# 1.0.25

***

2020/06/16

* 去掉spawn执行命令时候引用node_modules下的.bin目录下的命令，自动向上寻址

# 1.0.24

***

2020/04/29

* 解决mac和Linux上找不到文件的bug

# 1.0.23

***

2020/03/01

* 修复linux找不到命令错误

# 1.0.22

***

2020/02/29

* 取消typescript解析在1.x中生产及改为在2.0.0中升级

# 1.0.21

***

2020/02/29

* 加入typescript解析

# 1.0.20

***

2020/01/21

* buildapp中去掉profile

# 1.0.19

***

2019/12/20

* 加入json和yml的loader

# 1.0.18

***

2019/12/04

* 修复使用happypack的css-loader3.2.1包Cannot read property 'split' of undefined 的错误，css-loader回滚到3.2.0

# 1.0.17

***

2019/11/15

* 修复bug

# 1.0.16

***

2019/11/15

* --json加入输出到stats.json

# 1.0.15

***

2019/11/15

* url-loader加入limit大于1K使用file-loader
* 加入 '--profile','--json'查看依赖包的分析结果

# 1.0.14

***

2019/11/14

* url-loader中加入ico图标的解析

# 1.0.13

***

2019/10/24

* gulpfile中加入gif

# 1.0.12

***

2019/10/18

* startapp 加入--define自定义参数
* buildapp 加入--define自定义参数
* buildumd 加入--define自定义参数
* buildpackage加入css文件的拷贝

# 1.0.11

***

2019/09/17

* less-loader加入javascriptEnabled: true
* ctbuild.config.js文件修改为直接修改curModule对象，不用在返回

# 1.0.10

***

2019/09/17

* webpack.common.js的less的include中加入/antd/

# 1.0.9

***

2019/09/17

* build.js漏写了#!/usr/bin/env node

# 1.0.8

***

2019/09/12

* 加入命令行的-v,-h,commands的help等操作
* 整理修改startapp的command参数
* 整理修改buildapp的command参数
* 整理修改buildumd的command参数
* 整理修改buildpackage的command参数
* 去掉了--type参数
* 更新了clean-webpack-plugin插件为最新版本

# 1.0.7

***

2019/09/06

* webpack配置文件中多个一个"."引起的错误

# 1.0.6

***

2019/08/30

* 加入cache-loader
* 加入url-loader
* 加入happypack多核编译
* webpack加入--progress和--colors输出
* 加入WebpackBar
* 去掉package.json中无用的依赖项

# 1.0.5

***

2019/08/18

* extract-text-webpack-plugin修改为mini-css-extract-plugin
* less降级为3.9.0适配FileManager的错误

# 1.0.4

***

2019/08/18

* package.json加入css-loader依赖
* package.json加入style-loader依赖

# 1.0.3

***

2019/07/30

* webpack加入extensions文件的扩展名自动补全

# 1.0.2

***

2019/07/30

* 配置拆分为config,plugin,webpack三个对象
* 若干bug的修改

# 1.0.1

***

2019/07/18

* 若干bug的修改

# 1.0.0

***

2019-01-07

* 加入代码
