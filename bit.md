# bit 文档总结

bit 中一切都是组件，不限于项目中用到的 react 组件，如：一个组件模板也是以组件的概念出现，可以复用创建组件。还有一个 react 组件的打包编译的环境也可以概念化为一个组件，用来复用。
在 bit.cloud 中，注册一个用户之后，可以新建 scope，可以多个，每个 scope 都是用来 host your components 的。不同的 scope 之间相互独立。一个 scope 中可以 host 多个组件，其中的组件分类，每个组件可以存在这些分类中，也可以单独出来不属于任何一个分类。

## bit 中出现频繁的单词意思

aspect： 特性 比如 env aspect、compile aspect 等
artifacts： build 产出的产物

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

## envs

envs 可复用的组件开发环境。用来简化和标准化工作流，不同类型的组件可以有不同的 env。这也说明 同样一个 bit 命令，比如`bit build`，可以运行所有组件的 build 任务，只是这些组件的 build 具体任务执行不同，但是都向外暴露了 build 方法。同样类型的组件也可以更细粒度的定制某个组件的 envs。

envs 也是组件。envs 组件将不同的工作流或配置组合起来，构成了一个新的 env 组件，如把 test、lint、format 等流程集成到一起。所以 envs 可以被看做一个工具或任务的集合。不同的 env 也可能聚合了同样的工作流，只是这些工作流的配置不同。

env 可以提供接口扩展或者组合成其他 env。一般来说我们不需要从零配置一个 env，只需要从 bit 默认提供的 env 扩展我们想要的 env 就可以。扩展可以很简单（比如增加一个 lint 规则），也可以很复杂（比如改变他的 build pipeline 或增加一个新的工作流任务）

因为 env 集成了很多任务或配置，所以让我们可以更专注于我们的组件开发，设置好 envs 后"一劳永逸"。

env service 就是一个 env 提供/包含的所有服务。teambit 定义的服务有：`compiler`、`tester`、`linter`、`formatter`、`builder`、`generator`、`docs`、`compositions`、`preview`，除了这些，也可以定义自己的 env service。使用`bit env get componentId`获取一个组件使用的 env 的配置项。

上述的 env service 都可以自定义，比如自定义 compiler 任务的详情。

TODO:

- compiler 与 builder 的区别。

build/snap/tag 分别对应三种类型的 pipeline，分别是`build pipeline`、`snap pipeline`、`tag pipeline`。每种 pipeline 又是由各种 task 组成的。比如 build pipeline 中有 compile task、lint task。 只是 snap pipeline 和 tag pipeline 的运行也运行了 build pipeline。

因此，运行`bit build`，是执行 build pipeline 下的 task，compile 是其中的一个 task，自然要运行，这个 task 执行会编译所有组件。编译输出的代码被写到 node_modules 中的对应 scope 下，如`company.scope/ui/text => ./node_modules/@company/scope.ui.text/dist`。

而 compile task 具体的行为是怎么定义的？teambit 又内置了`@teambit/compiler`组件，只需要实现该组件提供的接口即可自定义 compiler。

---------------env
----------------⬇
-----------build pipeline
----------------⬇
-----------some build tasks
------------⬇-----------⬇
---------compiler----bundler

可以通过`builder.getBuildPipe()` 或 `builder.registerBuildTask()`新增 build task，

可以将 builder 看作构建这些 task 的抽象概念。teambit 官方提供了`@teambit/builder`，对外提供了自定义 task 的 API，可利用这些 API 产生新任务、扩展现有任务等以介入影响 build 进程。

- 自定义 compiler 的处理，参考[teambit 官方 babel-compiler 的处理](https://bit.cloud/teambit/compilation/examples/aspects/babel-compiler)
- 自定义 builder 的处理

### 如何扩展/自定义 env

执行 bit templates，输出一个 react-env，react-env 其实就是一个提供了 react 基础开发环境的内置的 env，以 react-env 为模板创建组件其实就是新建一个 env，这个 env 的模板是 react-env。很方便，不需要我们从 0 开始新建。

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

- 最终目标。写一个自己的 env，这个 env 的 build pipeline 中有一个 task 可以生成组件的 umd 包。

在 workspace.jsonc 中，除'$schema'字段外，所有 key 其实都是某 scope 中的组件，值中所有的 key 都是参考对应组件的 api。
