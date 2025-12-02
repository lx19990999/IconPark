#!/bin/bash
# 生成 Tauri 应用图标
# 需要 ImageMagick 或类似工具

ICON_DIR="src-tauri/icons"
mkdir -p "$ICON_DIR"

# 如果安装了 ImageMagick，使用它生成图标
if command -v convert &> /dev/null; then
    # 生成 PNG 图标 (RGBA 格式，使用 PNG32 确保 RGBA)
    convert -size 32x32 xc:none -fill "#4F88FF" -draw "rectangle 0,0 32,32" -fill white -draw "rectangle 8,8 24,24" PNG32:"$ICON_DIR/32x32.png"
    convert -size 128x128 xc:none -fill "#4F88FF" -draw "rectangle 0,0 128,128" -fill white -draw "rectangle 32,32 96,96" PNG32:"$ICON_DIR/128x128.png"
    convert -size 256x256 xc:none -fill "#4F88FF" -draw "rectangle 0,0 256,256" -fill white -draw "rectangle 64,64 192,192" PNG32:"$ICON_DIR/128x128@2x.png"
    convert -size 1024x1024 xc:none -fill "#4F88FF" -draw "rectangle 0,0 1024,1024" -fill white -draw "rectangle 256,256 768,768" PNG32:"$ICON_DIR/1024x1024.png"
    
    # 生成 macOS .icns (需要 iconutil)
    if command -v iconutil &> /dev/null; then
        mkdir -p "$ICON_DIR/icon.iconset"
        convert -size 512x512 xc:"#4F88FF" -fill white -draw "rectangle 128,128 384,384" "$ICON_DIR/icon.iconset/icon_512x512.png"
        iconutil -c icns "$ICON_DIR/icon.iconset" -o "$ICON_DIR/icon.icns"
        rm -rf "$ICON_DIR/icon.iconset"
    fi
    
    # 生成 Windows .ico (需要 convert)
    convert "$ICON_DIR/128x128.png" "$ICON_DIR/32x32.png" "$ICON_DIR/icon.ico"
    
    echo "图标已生成到 $ICON_DIR"
else
    echo "错误: 未找到 ImageMagick。请安装:"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Fedora: sudo dnf install ImageMagick"
    exit 1
fi

