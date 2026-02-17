import { useState } from 'react'
import RenderExperiment from '../labs/render-models/RenderExperiment'

export function AppRouter() {
  const [view, setView] = useState('render')

  return (
    <div style={{ padding: 20 }}>
      <nav>
        <button onClick={() => setView('render')}>Render Model</button>
      </nav>

      {view === 'render' && <RenderExperiment />}
    </div>
  )
}
