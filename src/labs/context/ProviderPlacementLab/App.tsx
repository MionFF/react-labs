import Layout from './Layout'
import LocaleProvider from './context/locale/LocaleProvider'
import ThemeProvider from './context/theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <Layout />
      </LocaleProvider>
    </ThemeProvider>
  )
}
