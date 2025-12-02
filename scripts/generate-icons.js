// 使用 Node.js 生成简单的占位图标
// 需要安装: npm install sharp

const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../src-tauri/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 简单的 SVG 图标
const svgIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4F88FF"/>
  <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="white"/>
</svg>`;

// 生成 SVG 文件（Tauri 可以使用 SVG）
const sizes = [32, 128, 256];
sizes.forEach(size => {
  const filename = size === 256 ? '128x128@2x.png' : `${size}x${size}.png`;
  // 注意：这里只是创建 SVG，实际需要转换为 PNG
  // 可以使用 sharp 或其他工具
  console.log(`需要生成 ${filename} (${size}x${size})`);
});

console.log(`
注意: 此脚本需要安装 sharp 来生成 PNG 图标。
或者使用 generate-icons.sh 脚本（需要 ImageMagick）。

快速解决方案:
1. 从 IconPark 网站下载一个图标
2. 使用在线工具转换为所需尺寸
3. 放置到 src-tauri/icons/ 目录
`);

