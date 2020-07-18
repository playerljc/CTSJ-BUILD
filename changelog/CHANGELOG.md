# 1.0.36

---

2020/07/18

- 细节上优化

# 1.0.35

---

2020/07/18

- 加入@corejs3
- 加入 postcss
- 细节上优化

# 1.0.34

---

2020/07/12

- 修复 output 中 has 的问题(HotModuleReplacementPlugin 插件引起的问题)

# 1.0.33

---

2020/07/09

- dev 加入 HMR 功能

# 1.0.32

---

2020/07/04

- 修复 linux 找不到命令错误(工作空间切换引起的)

# 1.0.31

---

2020/07/04

- 修复 linux 找不到命令错误(工作空间切换引起的)

# 1.0.30

---

2020/07/04

- 修复 linux 找不到命令错误(工作空间切换引起的)

# 1.0.29

---

2020/07/04

- 修复 linux 找不到命令错误(工作空间切换引起的)

# 1.0.28

---

2020/06/21

- 加入一些 babel 的插件

# 1.0.27

---

2020/06/18

- bug 的修改

# 1.0.26

---

2020/06/18

- 去掉 spawn 执行命令时候引用 node_modules 下的.bin 目录下的命令，加入 env 环境变量

# 1.0.25

---

2020/06/16

- 去掉 spawn 执行命令时候引用 node_modules 下的.bin 目录下的命令，自动向上寻址

# 1.0.24

---

2020/04/29

- 解决 mac 和 Linux 上找不到文件的 bug

# 1.0.23

---

2020/03/01

- 修复 linux 找不到命令错误

# 1.0.22

---

2020/02/29

- 取消 typescript 解析在 1.x 中生产及改为在 2.0.0 中升级

# 1.0.21

---

2020/02/29

- 加入 typescript 解析

# 1.0.20

---

2020/01/21

- buildapp 中去掉 profile

# 1.0.19

---

2019/12/20

- 加入 json 和 yml 的 loader

# 1.0.18

---

2019/12/04

- 修复使用 happypack 的 css-loader3.2.1 包 Cannot read property 'split' of undefined 的错误，css-loader 回滚到 3.2.0

# 1.0.17

---

2019/11/15

- 修复 bug

# 1.0.16

---

2019/11/15

- --json 加入输出到 stats.json

# 1.0.15

---

2019/11/15

- url-loader 加入 limit 大于 1K 使用 file-loader
- 加入 '--profile','--json'查看依赖包的分析结果

# 1.0.14

---

2019/11/14

- url-loader 中加入 ico 图标的解析

# 1.0.13

---

2019/10/24

- gulpfile 中加入 gif

# 1.0.12

---

2019/10/18

- startapp 加入--define 自定义参数
- buildapp 加入--define 自定义参数
- buildumd 加入--define 自定义参数
- buildpackage 加入 css 文件的拷贝

# 1.0.11

---

2019/09/17

- less-loader 加入 javascriptEnabled: true
- ctbuild.config.js 文件修改为直接修改 curModule 对象，不用在返回

# 1.0.10

---

2019/09/17

- webpack.common.js 的 less 的 include 中加入/antd/

# 1.0.9

---

2019/09/17

- build.js 漏写了#!/usr/bin/env node

# 1.0.8

---

2019/09/12

- 加入命令行的-v,-h,commands 的 help 等操作
- 整理修改 startapp 的 command 参数
- 整理修改 buildapp 的 command 参数
- 整理修改 buildumd 的 command 参数
- 整理修改 buildpackage 的 command 参数
- 去掉了--type 参数
- 更新了 clean-webpack-plugin 插件为最新版本

# 1.0.7

---

2019/09/06

- webpack 配置文件中多个一个"."引起的错误

# 1.0.6

---

2019/08/30

- 加入 cache-loader
- 加入 url-loader
- 加入 happypack 多核编译
- webpack 加入--progress 和--colors 输出
- 加入 WebpackBar
- 去掉 package.json 中无用的依赖项

# 1.0.5

---

2019/08/18

- extract-text-webpack-plugin 修改为 mini-css-extract-plugin
- less 降级为 3.9.0 适配 FileManager 的错误

# 1.0.4

---

2019/08/18

- package.json 加入 css-loader 依赖
- package.json 加入 style-loader 依赖

# 1.0.3

---

2019/07/30

- webpack 加入 extensions 文件的扩展名自动补全

# 1.0.2

---

2019/07/30

- 配置拆分为 config,plugin,webpack 三个对象
- 若干 bug 的修改

# 1.0.1

---

2019/07/18

- 若干 bug 的修改

# 1.0.0

---

2019-01-07

- 加入代码
