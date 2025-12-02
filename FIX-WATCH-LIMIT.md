# 修复文件监视限制问题

如果遇到 "OS file watch limit reached" 错误，需要增加系统的文件监视限制。

## Linux 系统

### 临时解决方案（当前会话有效）
```bash
sudo sysctl fs.inotify.max_user_watches=524288
```

### 永久解决方案
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 或者使用环境变量

在运行 `npm run tauri:dev` 之前设置：
```bash
export WATCHMAN_MAX_FILES=524288
npm run tauri:dev
```

## 验证

运行以下命令检查当前限制：
```bash
cat /proc/sys/fs/inotify/max_user_watches
```

默认值通常是 8192，建议设置为 524288 或更高。

