# IconPark Tauri 快速开始

## 前置要求

1. **Node.js** (v18 或更高版本，推荐 v20+)
2. **Rust** (最新稳定版)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. **系统依赖** (根据你的操作系统):

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev \
     build-essential \
     curl \
     wget \
     file \
     libxdo-dev \
     libssl-dev \
     libgtk-3-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev
   ```

   **Linux (Fedora):**
   ```bash
   sudo dnf install webkit2gtk-4.1-devel \
     openssl-devel \
     curl \
     wget \
     file \
     libxdo-devel \
     libappindicator-gtk3 \
     librsvg2-devel
   ```

   **Linux (Arch):**
   ```bash
   sudo pacman -S webkit2gtk-4.1 \
     base-devel \
     curl \
     wget \
     file \
     libxdo \
     openssl \
     appmenu-gtk-module \
     gtk3 \
     libappindicator-gtk3 \
     librsvg \
     libvips
   ```

   **macOS:**
   ```bash
   # 需要 Xcode Command Line Tools
   xcode-select --install
   ```

   **Windows:**
   - 安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - 安装 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

## 安装步骤

1. **安装依赖:**
   ```bash
   npm install
   ```

2. **生成应用图标** (可选，但推荐):
   ```bash
   # 使用 ImageMagick
   ./scripts/generate-icons.sh
   
   # 或者手动创建图标文件并放置到 src-tauri/icons/ 目录
   ```

3. **开发模式运行:**
   ```bash
   npm run tauri:dev
   ```

4. **构建应用:**
   ```bash
   # 构建当前平台
   npm run tauri:build
   
   # 构建特定架构 (例如 ARM64)
   npm run tauri build -- --target aarch64-apple-darwin  # macOS ARM64
   npm run tauri build -- --target aarch64-unknown-linux-gnu  # Linux ARM64
   npm run tauri build -- --target aarch64-pc-windows-msvc  # Windows ARM64
   ```

## 项目结构说明

- `src/` - React 前端应用
- `src-tauri/` - Tauri Rust 后端
- `packages/react/` - IconPark React 图标组件
- `packages/react/icons.json` - 图标元数据

## 常见问题

### 图标文件缺失
如果构建时提示图标文件缺失，请运行 `./scripts/generate-icons.sh` 或手动创建图标文件。

### 构建失败
确保已安装所有系统依赖，特别是 Rust 工具链和平台特定的开发库。

### ARM64 构建
Tauri 1.5 完全支持 ARM64。只需使用正确的目标平台参数即可。

