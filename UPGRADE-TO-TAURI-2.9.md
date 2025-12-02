# 升级到 Tauri 2.9.4

项目已成功升级到 Tauri 2.9.4 最新版本。

## 版本信息

根据 [Tauri 发布页面](https://tauri.app/release/)，已更新到以下版本：

- **tauri**: v2.9.4
- **@tauri-apps/api**: v2.9.1  
- **@tauri-apps/cli**: v2.9.5
- **tauri-build**: v2.9

## 已更新的文件

### 1. `src-tauri/Cargo.toml`
- 更新 `tauri` 从 2.0 到 2.9
- 更新 `tauri-build` 从 2.0 到 2.9

### 2. `package.json`
- 更新 `@tauri-apps/api` 从 2.0.0 到 2.9.1
- 更新 `@tauri-apps/cli` 从 2.0.0 到 2.9.5

### 3. `README-TAURI.md`
- 更新文档以反映 Tauri 2.9.4 版本
- 更新系统依赖要求（WebKitGTK 4.1）
- 添加版本信息部分

### 4. `QUICKSTART.md`
- 更新系统依赖安装命令
- 更新 Node.js 版本要求（v18+）
- 更新 Linux 依赖包名（webkit2gtk-4.1）

## Tauri 2.9.4 新特性

根据 [Tauri 2.9.4 发布说明](https://tauri.app/release/):

1. **性能优化**: 移除了不必要的集合和克隆操作
2. **SVG 图标修复**: 修复了 SVG 图标在调整大小时出现的灰色边缘问题
3. **稳定性改进**: 多个 bug 修复和稳定性提升

## 系统依赖更新

### Linux 系统依赖变化

Tauri 2.9 需要 **WebKitGTK 4.1** 或更高版本（之前是 4.0）：

**Ubuntu/Debian:**
```bash
sudo apt install libwebkit2gtk-4.1-dev  # 注意：4.1 而不是 4.0
```

**Fedora:**
```bash
sudo dnf install webkit2gtk-4.1-devel  # 注意：4.1 而不是 3
```

**Arch:**
```bash
sudo pacman -S webkit2gtk-4.1  # 注意：4.1
```

## 下一步

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **验证安装**:
   ```bash
   npm run tauri:dev
   ```

3. **构建应用**:
   ```bash
   npm run tauri:build
   ```

## 兼容性

- ✅ Windows 10+ (x86_64, ARM64)
- ✅ macOS 10.13+ (Intel, Apple Silicon)
- ✅ Linux (x86_64, ARM64) - 需要 WebKitGTK 4.1+

## 参考链接

- [Tauri 发布页面](https://tauri.app/release/)
- [Tauri 2.9.4 发布说明](https://tauri.app/release/tauri/v2.9.4/)
- [Tauri 官方文档](https://v2.tauri.app/)

