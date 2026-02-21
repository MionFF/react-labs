// import { useState } from 'react'
// import RenderExperiment from '../labs/render-models/RenderExperiment'
// import { RenderCommitLab } from '../labs/render-models/RenderCommitLab'

import { ModalLab } from '../mini-products/a11y/ModalLab'

// import { LoginForm } from '../mini-products/a11y/LoginForm'

// import DashboardTW from '../labs/layout-tw/DashboartTW'
// import LoginForm from '../mini-products/a11y/LoginForm'

export function AppRouter() {
  // const [view, setView] = useState('render')

  return (
    <div className='min-h-screen flex justify-center items-center'>
      {/* <DashboardTW /> */}
      {/* <LoginForm /> */}
      <ModalLab />
    </div>
  )
}
