import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Builder from './pages/Builder.jsx'
import Cheatsheet from './pages/Cheatsheet.jsx'
import Playbook from './pages/Playbook.jsx'
import Tools from './pages/Tools.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Builder />} />
        <Route path="cheatsheet" element={<Cheatsheet />} />
        <Route path="playbook" element={<Playbook />} />
        <Route path="tools" element={<Tools />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
