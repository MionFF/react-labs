import { useTheme } from './context/theme/ThemeContext'
import Toolbar from './Toolbar'

export default function Sidebar() {
  const { theme } = useTheme()
  console.count('<Sidebar>')

  return (
    <div className='flex flex-col p-6 border'>
      <h2 className='font-bold'>Sidebar ({theme})</h2>
      <Toolbar />
    </div>
  )
}
