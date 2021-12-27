# MVC

## 1. 是什么：人的心智模型和计算机模型，建立一个桥梁。

  ### 1.1 分离展示层 - Separated Presentation
  ![](https://raw.githubusercontent.com/Draveness/analyze/master/contents/architecture/images/mvx/Presentation-Domain.jpg)
  - 即是用户展示内容的展示层 - Presentation (VC)
  - 包含领域和数据逻辑的领域层 - Domain (M)

## 2. 类似标准的MVC（根据多个框架和书籍的结论 - 有主观性）：
  ![](https://raw.githubusercontent.com/Draveness/analyze/master/contents/architecture/images/mvx/Standard-MVC.jpg)
  - view: 管理作为位图展示到屏幕上的图形和文字输出，由视图产生的事件；（数据请求）
  - controller: 反映用户输入并依据输入去对模型、视图进行操作（更新状态的指令）
  - model：管理应用的行为和数据，响应数据请求（视图）和更新状态的指令（controller）

  ### 2.1 依赖关系
  - 模型层可以单独工作，而视图层和控制层都依赖模型层中的数据

  ## 2.2 观察者
  - 为什么：Model可以单独工作，同时对使用Model层的controller和view一无所知。
  - 是什么：当Model发生变化时，同时更新多个view和controller。「适用于需要同时更新多个视图和控制器的内容」。
  - 怎么做：需要将所有需要实时更新的组件注册成模型的观察者。

  - 优缺点：
    - 容易在视图不知情的情况下，创建一个依赖于同一模型的视图。
    - 隐式更新，很难找到问题的来源。

  ### 2.3 控制器为主导
  - 所有用户请求都会先交由controller，在分发给不同的处理逻辑。

# MVP

## 1. 是什么：和MVC的区别是，使用了Presenter对视图和模型进行解耦，model和view之间都通过presenter进行数据传输。

  ### 1.1 presenter
  - 可以理解成松散的控制器，其中包含了视图的UI业务逻辑，所有从视图发出的事件，都会代理到Presenter，同时P也通过视图暴露的接口与其通信。

## 1.2 两种变种
- 被动视图「Passive view」：

- 监督控制器「supervising controller」:







