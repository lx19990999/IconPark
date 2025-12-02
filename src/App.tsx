import { IconProvider } from '@icon-park/react/runtime'
import IconBrowser from './components/IconBrowser'
import './App.css'

function App() {
  return (
    <div className="app">
    <IconProvider value={{
      size: '1em',
      strokeWidth: 4,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      rtl: false,
      theme: 'outline',
      colors: {
        outline: {
          fill: '#333',
          background: 'transparent'
        },
        filled: {
          fill: '#333',
          background: '#FFF'
        },
        twoTone: {
          fill: '#333',
          twoTone: '#2F88FF'
        },
        multiColor: {
          outStrokeColor: '#333',
          outFillColor: '#2F88FF',
          innerStrokeColor: '#FFF',
          innerFillColor: '#43CCF8'
        }
      },
      prefix: 'i'
    }}>
      <IconBrowser />
    </IconProvider>
    </div>
  )
}

export default App

