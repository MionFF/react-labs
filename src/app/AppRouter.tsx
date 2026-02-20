// import { useState } from 'react'
// import RenderExperiment from '../labs/render-models/RenderExperiment'
// import { RenderCommitLab } from '../labs/render-models/RenderCommitLab'

// import StopwatchAutoStart from '../mini-products/stopwatch/StopwatchAutoStart'

import DashboardTW from '../labs/layout-tw/DashboartTW'

// import { BadSideEffectLab } from '../labs/render-models/BadSideEffectLab'

export function AppRouter() {
  // const [view, setView] = useState('render')

  return (
    <div>
      {/* <nav>
        <button onClick={() => setView('render')}>Render Model</button>
      </nav>

      {view === 'render' && <RenderExperiment />} */}

      {/* <RenderCommitLab /> */}
      {/* <BadSideEffectLab /> */}
      {/* <StopwatchAutoStart /> */}
      <DashboardTW />
    </div>
  )
}
