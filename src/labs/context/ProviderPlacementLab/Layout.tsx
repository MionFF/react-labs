import Main from './Main'
import Sidebar from './Sidebar'
import { useTheme } from './context/theme/ThemeContext'

export default function Layout() {
  const { theme } = useTheme()
  const themeClass = theme === 'dark' ? 'bg-[#333] text-white border-[#777]' : ''

  return (
    <div className={`${themeClass} min-h-screen p-2 transition duration-200 ease`}>
      <Sidebar />
      <Main />
    </div>
  )
}
