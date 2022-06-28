# bit 文档总结

bit 中一切都是组件，不限于项目中用到的 react 组件，如：一个组件模板也是以组件的概念出现，可以复用创建组件。还有一个 react 组件的打包编译的环境也可以概念化为一个组件，用来复用。
在 bit.cloud 中，注册一个用户之后，可以新建 scope，可以多个，每个 scope 都是用来 host your components 的。不同的 scope 之间相互独立。一个 scope 中可以 host 多个组件，其中的组件分类，每个组件可以存在这些分类中，也可以单独出来不属于任何一个分类。

## workspace

workspace 是一个本地开发组件的仓库。使用 bit init 初始化一个 workspace
在 workspace 中的 teambit.workspace/workspace 中可以设置

```json
"teambit.workspace/workspace": {
    /**
     * the name of the component workspace. used for development purposes.
     **/
    "name": "my-workspace",
    /**
     * set the icon to be shown on the Bit server.
     **/
    "icon": "https://static.bit.dev/bit-logo.svg",
    /**
     * default directory to place a component during `bit import` and `bit create`.
     * the following placeholders are available:
     * name - component name includes namespace, e.g. 'ui/button'.
     * scopeId - full scope-id includes the owner, e.g. 'teambit.compilation'.
     * scope - scope name only, e.g. 'compilation'.
     * owner - owner name in bit.dev, e.g. 'teambit'.
     **/
    "defaultDirectory": "{scope}/{name}",
    /**
     * default scope for all components in workspace.
     **/
    "defaultScope": "yzfzfy.myfirstscope"
  },
```

name 就是 workspace 的名字，在本地通过`bit start`启动 workspace 开发服务器时，会展示该名字。icon 就是 log。

`defaultDirectory`：在通过 bit create 创建组件时，决定这个组件放在哪个目录中，其中有变量可以使用。

`defaultScope` 当创建组件时，如果没有通过--scope 指定所属的 scope，就是用默认。

workspace.json 的每一个 key 都叫做一个 aspect，如 teambit.workspace/workspace，因为它也是一个组件，所以他的名字也是 component-id 的形式。初始化生成的配置中的 key 列表，可以扩展添加。

## scope

scope 是一个组件集合展示的服务。

本地初始化一个 scope，并打开可视化页面

```sh
mkdir my-scope
cd my-scope
bit init --bare
```

init 完成后会生成一些目录文件。在 my-scope 目录下执行`bit start`，会启动一个开发服务器(`http://localhost:3001`)，展示该 scope 下的组件。

建立 scope 之后，workspace 需要将组件导出到该 scope 中，就需要让 workspace 与 scope 做关联，类似 git 的关联远程仓库

```sh
cd my-workspace
bit remote add http://localhost:3001
```

之后通过 bit create 的组件加--scope scopeName 后可向该 scope 中导出组件。

## 总结

workspace 是用来开发组件的一个代码仓，每个人都可以初始化自己的仓。但是为了共享源代码，需要共用同一个仓。scope 是包含组件的一个范围，一个 workspace 中的不同组件可以属于不同的 scope，创建组件时可以根据默认配置创建目录，同样导出时，组件被导出到各自所属的 scope 中.

> You can have multiple workspaces export components to a single scope, or a single workspace export components to multiple scopes

`bit export` 是把组件导出到了 scope 中。其实 workspace 只是一个辅助开发环境，bit 的组件 collaborate 的理念的核心是 scope 实现的，组件直接所属是 scope。

## teambit 下的组件

teambit 是在 bit.cloud 中的一个账户，在他的账户下有一些 scope，如

- workspace

  workspace 下的组件有

  - workspace
  - variants
  - ui
  - 其他的在[workspace scope](https://github.com/teambit/bit/tree/master/scopes/workspace)中查看。

- dependencies

  - dependency-resolver
  - pnpm
  - yarn

- generator
  - generator

其他 scope 可在[teambit 下的 scope](https://github.com/teambit/bit/tree/master/scopes)查看。

在 workspace.jsonc 中，除'$schema'字段外，所有 key 其实都是某 scope 中的组件，值中所有的 key 都是参考对应组件的 api。
