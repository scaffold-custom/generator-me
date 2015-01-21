## <%=name%>

<%=name%>是。


### 目录结构：

    <%=name%>           // 工程名，也是库名
    |      |-----src    // 源码目录
    |      |     |---------index.js     // index页面入口脚本
    |      |     |---------mods     // 依赖的业务模块
    |      |     |---------index.scss|index.less     // index页面样式
    |      |-----build    // 发布目录
    |      |     |---------deps.js     // 模块依赖表
    |      |-----test    // 测试用例目录
    |      |-----template    // ejs 模板目录
    |      |-----view    // 视图目录 html
    |      |-----build    // 发布目录
    |      |-----README.md      // 库介绍
    |      |-----gruntfile.js   // grunt打包时使用的配置信息
    |      |-----totoro-config.js       // totoro回归工具配置文件
    |      |-----package.js     // 依赖包配置


打包运行：

    grunt

开发阶段开启文件实时编译：

    grunt dev
    
时时刷新页面: 
    grunt live