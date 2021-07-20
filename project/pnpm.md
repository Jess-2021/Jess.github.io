# 包管理器

- npm、yarn

  - 嵌套管理到扁平管理，避免了一个项目内包的重复安装问题。

- pnpm

  - 将包中的node_modules的依赖和本包放在了同个node_modules上，这时根目录上的node_module就会和package.json的依赖基本保持一致

  - 高效的磁盘利用。基于内容寻址，即使是包的不同版本，也会利用好没有改动的文件，去新增新添加的问题；

- install

  - 当执行install时，会通过包名去npm服务器下载相应的包。如果是本地的包，可以直接通过workspace.yaml指向相应的路径。
  - 包内的文件内，package.json里的export字段，会导出一系列的包，可以通过key值进行导出包内的内容。
