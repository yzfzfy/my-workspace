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

  - workspace 该组件负责处理 bit workspace 的功能。配置 workspace 的一些特征，如 name、icon、defaultDirectory、defaultScope 等。
  - variants 通过设置匹配模式 key，将 value 中的所有 key（这些 key 都是组件名称）作用在匹配到的文件上。 configuration variants allow to configure a selected group of components.

  ```json
  // 比如以下配置是将design文件夹内所有的组件配置使用 React env
  "teambit.workspace/variants": {
    "design": {
        "teambit.react/react": {}
    },
  }
  ```

  - ui ui 下有一系列的组件用在本地启动的 workspace 服务上显示页面。如`@teambit/workspace.ui.empty-workspace`用来在本 workspace 中无组件时显示空状态 ui。
  - 其他的在[workspace scope](https://github.com/teambit/bit/tree/master/scopes/workspace)中查看。

- dependencies

  - dependency-resolver 负责组件依赖解析的配置。比如 `packageManager`设置使用的包管理工具。`policy`列出 workspace 中用到的依赖。
  - pnpm
  - yarn

- generator 用来据组件模板快速根生成组件。模板生成器。

  - generator A simple interface for generating component templates.生成新组件模板的工具。 支持配置`aspects`和`hideCoreTemplates`属性。`aspects`是一个 string[]，一个组件模板 id 的列表。

- react

  - react 这是 teambit 的 react 组件开发环境。`不是一个组件模板`，可以使用 react 组件开发环境的最佳实践来开发组件。也可以 extend 这个 env 来自定义自己的开发环境。
    其他 scope 可在[teambit 下的 scope](https://bit.cloud/teambit/~scopes)查看。
  - react-env

- envs

  - envs A composable engine for creating and maintaining development environments.创建和维护开发环境的可组合的引擎。A Bit environment is a development environment encapsulated in a Bit component. 一个 bit 组件其实内部自带封装了一套开发环境。同一个 workspace 中的不同组件可以配置不同的开发环境（只需要一行配置）。那么这个开发环境都包括什么内容呢？包括了定义不同命令的动作行为，如`bit start` `bit test` `bit build` `bit compile` `bit lint`。为组件配置 env 只能通过`teambit.workspace/variants`设置，一个组件只能用一个 env

- builder

- 最终目标。写一个自己的 env，这个 env 的 buildpipeline 包括了生成 umd 包。

在 workspace.jsonc 中，除'$schema'字段外，所有 key 其实都是某 scope 中的组件，值中所有的 key 都是参考对应组件的 api。
