import { useState, useMemo, useRef, useEffect } from 'react'
import * as IconMap from '@icon-park/react/map'
// @ts-ignore - JSON import
import iconsData from '../../packages/react/icons.json'
import './IconBrowser.css'

interface IconInfo {
  id: number
  title: string
  name: string
  category: string
  categoryCN: string
  author: string
  tag: string[]
  rtl: boolean
}

function IconBrowser() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTheme, setSelectedTheme] = useState<'outline' | 'filled' | 'two-tone' | 'multi-color'>('outline')
  const [selectedIcon, setSelectedIcon] = useState<IconInfo | null>(null)
  
  // 自定义配置状态
  const [iconSize, setIconSize] = useState(36)
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [strokeColor, setStrokeColor] = useState('#333')
  const [strokeLinecap, setStrokeLinecap] = useState<'butt' | 'round' | 'square'>('round')
  const [strokeLinejoin, setStrokeLinejoin] = useState<'miter' | 'round' | 'bevel'>('round')
  
  // 用于存储当前显示的 SVG 元素引用
  const svgRef = useRef<SVGElement | null>(null)
  
  // 当选中图标或配置变化时，更新 SVG 引用
  useEffect(() => {
    if (selectedIcon) {
      // 延迟一下，确保 DOM 已更新
      const updateSvgRef = () => {
        const modalIcon = document.querySelector('.detail-icon')
        if (modalIcon) {
          const span = modalIcon.querySelector('span')
          if (span) {
            const svg = span.querySelector('svg') as SVGElement
            if (svg) {
              svgRef.current = svg
              return true
            }
          }
        }
        return false
      }
      
      // 立即尝试
      if (!updateSvgRef()) {
        // 如果失败，延迟再试
        setTimeout(() => {
          updateSvgRef()
        }, 100)
      }
    } else {
      svgRef.current = null
    }
  }, [selectedIcon, selectedTheme, iconSize, strokeWidth, strokeColor, strokeLinecap, strokeLinejoin])

  const icons: IconInfo[] = iconsData as IconInfo[]

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = new Set<string>()
    icons.forEach(icon => {
      cats.add(icon.category)
    })
    return Array.from(cats).sort()
  }, [icons])

  // 过滤图标
  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      const matchesSearch = 
        icon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.tag.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [icons, searchTerm, selectedCategory])

  // 将图标名称转换为组件名称（PascalCase）
  const toPascalCase = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const componentName = toPascalCase(iconName)
    const IconComponent = (IconMap as any)[componentName]
    return IconComponent || null
  }

  // 从 DOM 获取 SVG 元素
  const getSVGElement = (): SVGElement | null => {
    // 优先使用 ref
    if (svgRef.current) {
      return svgRef.current
    }
    
    // 从详情弹窗获取（图标被包裹在 span 中）
    const modalIcon = document.querySelector('.detail-icon')
    if (modalIcon) {
      // 查找 span 内的 SVG
      const span = modalIcon.querySelector('span')
      if (span) {
        const svg = span.querySelector('svg') as SVGElement
        if (svg) {
          svgRef.current = svg
          return svg
        }
      }
      // 如果没有 span，直接查找 SVG
      const svg = modalIcon.querySelector('svg') as SVGElement
      if (svg) {
        svgRef.current = svg
        return svg
      }
    }
    
    return null
  }

  // 获取 SVG 字符串
  const getSVGString = (_icon: IconInfo, size?: number): string | null => {
    const svgElement = getSVGElement()
    if (!svgElement) {
      console.warn('无法找到 SVG 元素')
      return null
    }
    
    try {
      const svgClone = svgElement.cloneNode(true) as SVGElement
      const finalSize = size || iconSize
      
      // 设置尺寸
      svgClone.setAttribute('width', finalSize.toString())
      svgClone.setAttribute('height', finalSize.toString())
      
      // 移除可能存在的样式类和内联样式
      svgClone.removeAttribute('class')
      svgClone.removeAttribute('style')
      
      // 确保有 xmlns 属性
      if (!svgClone.getAttribute('xmlns')) {
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      }
      
      // 确保 viewBox 存在
      if (!svgClone.getAttribute('viewBox')) {
        svgClone.setAttribute('viewBox', '0 0 48 48')
      }
      
      // 清理所有子元素的样式和类
      const allElements = svgClone.querySelectorAll('*')
      allElements.forEach(el => {
        el.removeAttribute('class')
        el.removeAttribute('style')
      })
      
      const svgString = new XMLSerializer().serializeToString(svgClone)
      
      // 验证 SVG 字符串是否有效
      if (!svgString || svgString.length < 50 || !svgString.includes('<svg')) {
        console.warn('SVG 字符串无效:', svgString.substring(0, 100))
        return null
      }
      
      return svgString
    } catch (err) {
      console.error('获取 SVG 字符串失败:', err)
      return null
    }
  }

  // 复制 SVG 到剪贴板
  const copySVG = async (icon: IconInfo) => {
    try {
      if (!selectedIcon) {
        alert('请先选择一个图标')
        return
      }
      
      const svgString = getSVGString(icon)
      if (!svgString) {
        alert('无法获取图标 SVG，请稍候再试')
        return
      }
      
      await navigator.clipboard.writeText(svgString)
      alert('SVG 已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      alert(`复制失败: ${errorMessage}`)
    }
  }

  // 复制 Vue 代码
  const copyVueCode = async (icon: IconInfo) => {
    const componentName = toPascalCase(icon.name)
    const fillProp = selectedTheme === 'two-tone' 
      ? `:fill="['${strokeColor}', '#2F88FF']"` 
      : selectedTheme === 'multi-color'
      ? `:fill="['${strokeColor}', '#2F88FF', '#FFF', '#43CCF8']"`
      : `fill="${strokeColor}"`
    
    const code = `<template>
  <${componentName} 
    theme="${selectedTheme}" 
    :size="${iconSize}" 
    :strokeWidth="${strokeWidth}"
    strokeLinecap="${strokeLinecap}"
    strokeLinejoin="${strokeLinejoin}"
    ${fillProp}
  />
</template>

<script>
import { ${componentName} } from '@icon-park/vue-next'

export default {
  components: {
    ${componentName}
  }
}
</script>`
    
    try {
      await navigator.clipboard.writeText(code)
      alert('Vue 代码已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请重试')
    }
  }

  // SVG 转 PNG
  const svgToPng = async (svgString: string, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!svgString || svgString.length < 50) {
        reject(new Error('SVG 字符串无效'))
        return
      }
      
      // 确保 SVG 有正确的格式
      let processedSvg = svgString.trim()
      
      // 如果没有 XML 声明，添加它
      if (!processedSvg.startsWith('<?xml')) {
        processedSvg = `<?xml version="1.0" encoding="UTF-8"?>\n${processedSvg}`
      }
      
      // 确保 SVG 标签存在
      if (!processedSvg.includes('<svg')) {
        reject(new Error('无效的 SVG 格式'))
        return
      }
      
      const img = new Image()
      const svgBlob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      
      img.onload = () => {
        if (timeoutId) clearTimeout(timeoutId)
        
        try {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            URL.revokeObjectURL(url)
            reject(new Error('无法创建 canvas 上下文'))
            return
          }
          
          // 设置白色背景
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, size, size)
          
          // 绘制 SVG
          ctx.drawImage(img, 0, 0, size, size)
          
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url)
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('无法生成 PNG blob'))
            }
          }, 'image/png', 1.0)
        } catch (err) {
          URL.revokeObjectURL(url)
          reject(err)
        }
      }
      
      img.onerror = (err) => {
        if (timeoutId) clearTimeout(timeoutId)
        URL.revokeObjectURL(url)
        console.error('图片加载失败:', err, 'SVG 长度:', processedSvg.length)
        reject(new Error('图片加载失败，请检查 SVG 格式'))
      }
      
      // 设置超时
      timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url)
        reject(new Error('图片加载超时（5秒）'))
      }, 5000)
      
      img.src = url
    })
  }

  // 复制 PNG 到剪贴板
  const copyPNG = async (icon: IconInfo) => {
    try {
      if (!selectedIcon) {
        alert('请先选择一个图标')
        return
      }
      
      const svgString = getSVGString(icon)
      if (!svgString) {
        alert('无法获取图标 SVG，请稍候再试')
        return
      }
      
      const pngBlob = await svgToPng(svgString, iconSize)
      
      // 检查 ClipboardItem 是否支持
      if (!navigator.clipboard || !window.ClipboardItem) {
        alert('浏览器不支持复制图片功能，请使用下载功能')
        return
      }
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ])
      alert('PNG 已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      if (errorMessage.includes('ClipboardItem') || errorMessage.includes('clipboard')) {
        alert('浏览器不支持复制图片，请使用下载功能')
      } else {
        alert(`复制失败: ${errorMessage}`)
      }
    }
  }

  // 下载 SVG
  const downloadSVG = async (icon: IconInfo) => {
    try {
      if (!selectedIcon) {
        alert('请先选择一个图标')
        return
      }
      
      const svgString = getSVGString(icon)
      if (!svgString) {
        alert('无法获取图标 SVG，请稍候再试')
        return
      }
      
      // 添加 XML 声明
      const svgWithXml = `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`
      
      const blob = new Blob([svgWithXml], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${icon.name}.svg`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      
      // 延迟清理，确保下载开始
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (err) {
      console.error('下载失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      alert(`下载失败: ${errorMessage}`)
    }
  }

  // 下载 PNG
  const downloadPNG = async (icon: IconInfo) => {
    try {
      if (!selectedIcon) {
        alert('请先选择一个图标')
        return
      }
      
      const svgString = getSVGString(icon)
      if (!svgString) {
        alert('无法获取图标 SVG，请稍候再试')
        return
      }
      
      const pngBlob = await svgToPng(svgString, iconSize)
      const url = URL.createObjectURL(pngBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${icon.name}.png`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      
      // 延迟清理，确保下载开始
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (err) {
      console.error('下载失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      alert(`下载失败: ${errorMessage}`)
    }
  }

  // 复制 React 组件代码
  const copyReactCode = async (icon: IconInfo) => {
    const componentName = toPascalCase(icon.name)
    const fillProp = selectedTheme === 'two-tone' 
      ? `fill={['${strokeColor}', '#2F88FF']}` 
      : selectedTheme === 'multi-color'
      ? `fill={['${strokeColor}', '#2F88FF', '#FFF', '#43CCF8']}`
      : `fill="${strokeColor}"`
    
    const code = `import { ${componentName} } from '@icon-park/react'

<${componentName} 
  theme="${selectedTheme}" 
  size="${iconSize}" 
  strokeWidth={${strokeWidth}}
  strokeLinecap="${strokeLinecap}"
  strokeLinejoin="${strokeLinejoin}"
  ${fillProp}
/>`
    
    try {
      await navigator.clipboard.writeText(code)
      alert('React 代码已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 清空配置
  const resetConfig = () => {
    setIconSize(36)
    setStrokeWidth(4)
    setStrokeColor('#333')
    setStrokeLinecap('round')
    setStrokeLinejoin('round')
    setSelectedTheme('outline')
  }

  return (
    <div className="icon-browser">
      <header className="browser-header">
        <h1>IconPark - 离线图标浏览器</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="搜索图标..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="browser-content">
        <aside className="category-sidebar">
          <h2>分类</h2>
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            全部 ({icons.length})
          </button>
          {categories.map(category => {
            const count = icons.filter(i => i.category === category).length
            return (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({count})
              </button>
            )
          })}
        </aside>

        <main className="main-content">
          <div className="icons-grid-wrapper">
            <div className="icons-grid">
              {filteredIcons.length === 0 ? (
                <div className="no-results">未找到匹配的图标</div>
              ) : (
                filteredIcons.map(icon => {
                  const IconComponent = getIconComponent(icon.name)
                  if (!IconComponent) return null

                  return (
                    <div
                      key={icon.id}
                      className="icon-card"
                      onClick={() => setSelectedIcon(icon)}
                    >
                      <div className="icon-preview">
                        <IconComponent 
                          theme={selectedTheme} 
                          size={iconSize.toString()} 
                          strokeWidth={strokeWidth}
                          strokeLinecap={strokeLinecap}
                          strokeLinejoin={strokeLinejoin}
                          fill={selectedTheme === 'two-tone' ? [strokeColor, '#2F88FF'] : selectedTheme === 'multi-color' ? [strokeColor, '#2F88FF', '#FFF', '#43CCF8'] : strokeColor}
                        />
                      </div>
                      <div className="icon-name">{icon.name}</div>
                      <div className="icon-title">{icon.title}</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          <div className="config-sidebar">
            <h3>图标自定义</h3>
            
            <div className="config-section">
              <label>图标大小: {iconSize}px</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-controls">
                  <button onClick={() => setIconSize(Math.max(16, iconSize - 1))}>−</button>
                  <span>{iconSize}</span>
                  <button onClick={() => setIconSize(Math.min(128, iconSize + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className="config-section">
              <label>线段粗细: {strokeWidth}</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-controls">
                  <button onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}>−</button>
                  <span>{strokeWidth}</span>
                  <button onClick={() => setStrokeWidth(Math.min(10, strokeWidth + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className="config-section">
              <label>图标风格</label>
              <div className="style-buttons">
                <button
                  className={selectedTheme === 'outline' ? 'active' : ''}
                  onClick={() => setSelectedTheme('outline')}
                >
                  线性
                </button>
                <button
                  className={selectedTheme === 'filled' ? 'active' : ''}
                  onClick={() => setSelectedTheme('filled')}
                >
                  填充
                </button>
                <button
                  className={selectedTheme === 'two-tone' ? 'active' : ''}
                  onClick={() => setSelectedTheme('two-tone')}
                >
                  双色
                </button>
                <button
                  className={selectedTheme === 'multi-color' ? 'active' : ''}
                  onClick={() => setSelectedTheme('multi-color')}
                >
                  多色
                </button>
              </div>
            </div>

            <div className="config-section">
              <label>描边颜色</label>
              <div className="color-picker-container">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="color-input"
                  placeholder="#333"
                />
              </div>
            </div>

            <div className="config-section">
              <label>端点类型</label>
              <div className="endpoint-buttons">
                <button
                  className={strokeLinecap === 'butt' ? 'active' : ''}
                  onClick={() => setStrokeLinecap('butt')}
                  title="Butt"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <line x1="5" y1="10" x2="35" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="butt"/>
                  </svg>
                </button>
                <button
                  className={strokeLinecap === 'round' ? 'active' : ''}
                  onClick={() => setStrokeLinecap('round')}
                  title="Round"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <line x1="5" y1="10" x2="35" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  className={strokeLinecap === 'square' ? 'active' : ''}
                  onClick={() => setStrokeLinecap('square')}
                  title="Square"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <line x1="5" y1="10" x2="35" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="config-section">
              <label>拐点类型</label>
              <div className="join-buttons">
                <button
                  className={strokeLinejoin === 'miter' ? 'active' : ''}
                  onClick={() => setStrokeLinejoin('miter')}
                  title="Miter"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <path d="M 10 15 L 20 5 L 30 15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="miter"/>
                  </svg>
                </button>
                <button
                  className={strokeLinejoin === 'round' ? 'active' : ''}
                  onClick={() => setStrokeLinejoin('round')}
                  title="Round"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <path d="M 10 15 L 20 5 L 30 15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className={strokeLinejoin === 'bevel' ? 'active' : ''}
                  onClick={() => setStrokeLinejoin('bevel')}
                  title="Bevel"
                >
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <path d="M 10 15 L 20 5 L 30 15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="bevel"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="config-section">
              <button className="reset-button" onClick={resetConfig}>
                清空配置
              </button>
            </div>
          </div>
        </main>
      </div>

      {selectedIcon && (
        <div className="icon-detail-modal" onClick={() => setSelectedIcon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedIcon(null)}>×</button>
            <h2>{selectedIcon.title}</h2>
            <div 
              className="detail-icon"
              ref={(el) => {
                if (el) {
                  // 当元素挂载后，查找 SVG
                  const findSvg = () => {
                    const span = el.querySelector('span')
                    if (span) {
                      const svg = span.querySelector('svg') as SVGElement
                      if (svg) {
                        svgRef.current = svg
                        return
                      }
                    }
                    // 如果没找到，延迟再试
                    setTimeout(findSvg, 50)
                  }
                  findSvg()
                } else {
                  svgRef.current = null
                }
              }}
            >
              {(() => {
                const IconComponent = getIconComponent(selectedIcon.name)
                return IconComponent ? (
                  <IconComponent 
                    theme={selectedTheme} 
                    size={iconSize.toString()} 
                    strokeWidth={strokeWidth}
                    strokeLinecap={strokeLinecap}
                    strokeLinejoin={strokeLinejoin}
                    fill={selectedTheme === 'two-tone' ? [strokeColor, '#2F88FF'] : selectedTheme === 'multi-color' ? [strokeColor, '#2F88FF', '#FFF', '#43CCF8'] : strokeColor}
                  />
                ) : null
              })()}
            </div>
            <div className="detail-info">
              <p><strong>名称:</strong> {selectedIcon.name}</p>
              <p><strong>分类:</strong> {selectedIcon.category} ({selectedIcon.categoryCN})</p>
              <p><strong>作者:</strong> {selectedIcon.author}</p>
              <p><strong>标签:</strong> {selectedIcon.tag.join(', ')}</p>
            </div>
            <div className="detail-actions">
              <button onClick={() => copyReactCode(selectedIcon)}>复制 React 代码</button>
              <button onClick={() => copyVueCode(selectedIcon)}>复制 Vue 代码</button>
              <button onClick={() => copySVG(selectedIcon)}>复制 SVG</button>
              <button onClick={() => copyPNG(selectedIcon)}>复制 PNG</button>
              <button onClick={() => downloadSVG(selectedIcon)}>下载 SVG</button>
              <button onClick={() => downloadPNG(selectedIcon)}>下载 PNG</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IconBrowser

