import { useLocale } from './context/locale/LocaleContext'
import { useTheme } from './context/theme/ThemeContext'

export default function Content() {
  const { theme } = useTheme()
  const { locale } = useLocale()

  console.count('<Content>')

  return (
    <div>
      <h3 className='font-semibold'>Content</h3>
      <h3>Theme: {theme}</h3>
      <h3>Locale: {locale}</h3>
    </div>
  )
}
