# dsh-notify-card

Standalone approval cards for **DeepSeek Harness** on Windows.
An independent, heavily reworked fork of [dsh-notify-zeta](https://github.com/zeta987/dsh-notify-zeta) by zeta987 (MIT).

Windows 上给 **DeepSeek Harness** 用的独立审批浮窗。

---

## 它解决什么问题

DSH 的审批（黄卡）只在会话界面里出现。当你切去别的软件——尤其是全屏的浏览器——你不会知道它正在等你。

这个插件在你**离开 DSH 时**弹出一个独立的小窗，显示审批内容并允许你拍板；当**你把 DSH 切回前台**时，浮窗自动消失，把请求交回 DSH 自己的黄色卡片。

## 行为一览

| 场景 | 表现 |
|---|---|
| 你在别的软件里，DSH 需要审批 | 弹出**独立浮窗**，含允许 / 拒绝 |
| 你把 DSH 切回前台 | 浮窗**自动消失**，黄色卡片接管 |
| 你一直看着 DSH | **不弹浮窗**，直接出黄色卡片（不打扰） |
| 任务完成 | 照常弹提示（长内容收进独立框，按钮始终可见） |
| 记忆反思等后台任务 | 静默，不打扰 |

## 外观

- 无系统标题栏，圆角卡片 + 阴影，始终置顶，任务栏不出现多余图标
- **主题跟随 DSH 自己的设定**（读 `cordis.patch.yml` 的 `preference`），读不到才退回 Windows 应用主题
- 全简体中文
- 允许 = 黑底白字，拒绝 = 白底描边，圆角大按钮，悬停无系统蓝底
- 可能变长的内容收进带描边的独立小框（7px 细滑块），**按钮永远不需要滚动就能点到**

## 环境要求

- Windows（浮窗使用 WPF，经 PowerShell 拉起）
- DSH `>= 0.1.5-rc.1`
- Node `>= 22.19.0`

## 安装

```powershell
dsh plugin --profile desktop add dsh-notify-card
```

或从本地目录安装：

```powershell
dsh plugin --profile desktop add link:C:\path\to\dsh-notify-card
```

安装后**重启 DSH**。

## 设置

设置存在 profile 目录下的 `notify-card.settings.json`。

**主题不需要在这里设置**——它自动跟随 DSH 的外观设置（DSH 的设置界面里选的那个）。

> **当前版本没有设置界面。** 上游原本带一个设置页，但它的实现用相对路径直接请求宿主的 HTTP 路由，在桌面壳（`dsh-app://`）下打不到宿主，只会显示"连接中断"。与其发布一个坏掉的页面，这一版先不挂载它（`package.json` 里没有 `dsh.client` 字段即为此意），代码保留在 `lib/client.js`，待改造成官方客户端接口后再启用。


## 与上游的关系

本项目是 [dsh-notify-zeta](https://github.com/zeta987/dsh-notify-zeta)（作者 zeta987）的独立分支，遵循 MIT 许可。感谢原作者提供了可用的 Windows 原生卡片基础。

本分支相对上游的主要改动：

- 审批在"用户看着 DSH"时主动让回原生卡片，离开时才接管，并在切回时交回
- 主题改为跟随 DSH 设定（上游跟随 Windows）
- 全面的外观重做：去掉系统标题栏、圆角按钮、阴影置顶、极简滚动条、长内容独立分区
- 繁转简，并把按钮文案对齐 DSH 原版
- 修复了上游一个会导致**所有卡片渲染失败**的缺陷（按钮模板引用了未声明的 XAML 命名空间）

## 许可

MIT。原始版权归 zeta987 所有，见 [LICENSE](./LICENSE)。
