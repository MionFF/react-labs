import { useLocale } from './context/locale/LocaleContext'
import { useTheme } from './context/theme/ThemeContext'

export default function Toolbar() {
  const { toggleTheme } = useTheme()
  const { toggleLocale } = useLocale()

  const btnClasses = 'p-1 mt-2 border cursor-pointer transition duration-300 hover:-translate-y-1'

  console.count('<Toolbar>')

  return (
    <div>
      <h3 className='font-semibold'>Toolbar</h3>
      <button onClick={toggleTheme} className={btnClasses}>
        Toggle theme
      </button>{' '}
      <button onClick={toggleLocale} className={btnClasses}>
        Toggle locale
      </button>
    </div>
  )
}
