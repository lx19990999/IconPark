# IconPark Tauri 应用

这是一个基于 Tauri 2.9.4 的离线图标浏览器应用，支持 Windows、macOS 和 Linux（包括 ARM64 架构）。

## 功能特性

- 🎨 浏览超过 2000 个高质量图标
- 🔍 搜索和过滤图标
- 📦 按分类浏览
- 🎭 多种主题（Outline、Filled、Two-tone、Multi-color）
- 📋 复制 React 组件代码
- 💾 完全离线运行

## 系统要求

### Windows
- Windows 10 或更高版本
- x86_64 或 ARM64 架构
- WebView2 运行时

### macOS
- macOS 10.13 或更高版本
- x86_64 (Intel) 或 ARM64 (Apple Silicon) 架构

### Linux
- 支持的系统：Ubuntu、Debian、Fedora、Arch 等
- x86_64 或 ARM64 架构
- WebKitGTK 4.1 或更高版本

## 技术栈

- **Tauri**: v2.9.4
- **@tauri-apps/api**: v2.9.1
- **@tauri-apps/cli**: v2.9.5
- **前端**: React 18 + TypeScript + Vite
- **后端**: Rust + Tauri 2.9

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
npm run tauri:dev
```

这将启动开发服务器并打开 Tauri 应用窗口。

## 构建应用

### 构建当前平台

```bash
npm run tauri:build
```

### 构建特定平台

#### Windows (x86_64)
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

#### Windows (ARM64)
```bash
npm run tauri build -- --target aarch64-pc-windows-msvc
```

#### macOS (Intel)
```bash
npm run tauri build -- --target x86_64-apple-darwin
```

#### macOS (Apple Silicon)
```bash
npm run tauri build -- --target aarch64-apple-darwin
```

#### Linux (x86_64)
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

#### Linux (ARM64)
```bash
npm run tauri build -- --target aarch64-unknown-linux-gnu
```

## 跨平台构建

要构建所有平台，你需要：

1. **Windows 构建**：在 Windows 系统上运行
2. **macOS 构建**：在 macOS 系统上运行
3. **Linux 构建**：在 Linux 系统上运行

或者使用 CI/CD 服务（如 GitHub Actions）进行自动化构建。

## 项目结构

```
IconPark/
├── src/                    # 前端 React 应用
│   ├── components/         # React 组件
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 入口文件
├── src-tauri/              # Tauri 后端
│   ├── src/
│   │   └── main.rs        # Rust 入口文件
│   ├── Cargo.toml         # Rust 依赖配置
│   └── tauri.conf.json    # Tauri 配置
├── packages/               # 图标包
│   └── react/             # React 图标组件
└── package.json           # Node.js 依赖和脚本
```

## 注意事项

1. **图标文件**：应用需要 `packages/react/icons.json` 文件来加载图标信息
2. **图标组件**：图标组件位于 `packages/react/src/icons/` 目录
3. **离线运行**：所有图标数据都打包在应用中，无需网络连接
4. **Tauri 版本**：使用 Tauri 2.9.4 最新稳定版

## 故障排除

### 构建失败

如果遇到构建问题，请确保：

1. 已安装 Rust 工具链：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. 已安装系统依赖（Linux）：
   - Ubuntu/Debian: `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`
   - Fedora: `sudo dnf install webkit2gtk-4.1-devel openssl-devel curl wget file libxdo-devel libappindicator-gtk3 librsvg2-devel`
   - Arch: `sudo pacman -S webkit2gtk-4.1 base-devel curl wget file libxdo openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libvips`

### ARM64 支持

Tauri 2.9 完全支持 ARM64 架构。确保使用正确的目标平台进行构建。

### WebView 问题

- **Windows**: 确保已安装 WebView2 运行时
- **Linux**: 确保已安装 WebKitGTK 4.1 或更高版本
- **macOS**: WebView 已内置在系统中

## 版本信息

- **Tauri**: 2.9.4
- **@tauri-apps/api**: 2.9.1
- **@tauri-apps/cli**: 2.9.5

## 许可证

Apache-2.0

## 参考链接

- [Tauri 官方文档](https://v2.tauri.app/)
- [Tauri 发布页面](https://tauri.app/release/)
- [IconPark 官网](http://iconpark.bytedance.com/)
