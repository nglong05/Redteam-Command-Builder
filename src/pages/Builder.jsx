import { useMemo, useState } from 'react'
import { PHASES } from '../data/phases.js'
import { initCommandState } from '../utils/buildCommand.js'
import { useApp } from '../context/AppContext.jsx'
import PhaseTabs from '../components/PhaseTabs.jsx'
import CommandCard from '../components/CommandCard.jsx'
import { IconSearch } from '../components/Icons.jsx'

function buildInitialStates() {
  const map = {}
  for (const phase of PHASES) for (const cmd of phase.commands) map[cmd.id] = initCommandState(cmd)
  return map
}

export default function Builder() {
  const { defaultTarget, setDefaultTarget } = useApp()
  const [activePhaseId, setActivePhaseId] = useState(PHASES[0].id)
  const [search, setSearch] = useState('')
  const [states, setStates] = useState(buildInitialStates)

  const activePhase = useMemo(
    () => PHASES.find((p) => p.id === activePhaseId) ?? PHASES[0],
    [activePhaseId]
  )
  const activeIndex = PHASES.findIndex((p) => p.id === activePhase.id)

  const visibleCommands = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return activePhase.commands
    return activePhase.commands.filter((cmd) => {
      const hay = [cmd.tool, cmd.name, cmd.desc, ...cmd.switches.flatMap((s) => [s.flag, s.label])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [activePhase, search])

  function toggleSwitch(cmdId, swId) {
    setStates((prev) => {
      const cur = prev[cmdId], s = cur.switches[swId]
      return { ...prev, [cmdId]: { ...cur, switches: { ...cur.switches, [swId]: { ...s, on: !s.on } } } }
    })
  }
  function setValue(cmdId, swId, value) {
    setStates((prev) => {
      const cur = prev[cmdId], s = cur.switches[swId]
      return { ...prev, [cmdId]: { ...cur, switches: { ...cur.switches, [swId]: { ...s, value } } } }
    })
  }
  function setTarget(cmdId, value) {
    setStates((prev) => ({ ...prev, [cmdId]: { ...prev[cmdId], target: value } }))
  }
  function resetCommand(cmdId) {
    const cmd = activePhase.commands.find((c) => c.id === cmdId)
    if (cmd) setStates((prev) => ({ ...prev, [cmdId]: initCommandState(cmd) }))
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="lab acc eyebrow">Công cụ chính</div>
        <h1>Dựng <em>lệnh</em> tấn công</h1>
      </div>

      {/* target dùng chung (lưu vào localStorage) */}
      <section className="targetbar" style={{ borderTop: '1px solid var(--line)' }}>
        <span className="lab">Mục tiêu chung</span>
        <input
          type="text"
          value={defaultTarget}
          placeholder="vd: 10.10.10.5  hoặc  https://example.com"
          onChange={(e) => setDefaultTarget(e.target.value)}
        />
      </section>

      <PhaseTabs phases={PHASES} activeId={activePhaseId} onSelect={(id) => { setActivePhaseId(id); setSearch('') }} />

      <div className="phase-head">
        <div className="lab acc">Giai đoạn {String(activeIndex + 1).padStart(2, '0')} / {String(PHASES.length).padStart(2, '0')}</div>
        <h2 className="h-serif" style={{ marginTop: 10 }}>
          <span className="idx">{activePhase.name}</span>
        </h2>
      </div>

      <div className="toolbar">
        <div className="search">
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}>
            <IconSearch />
          </span>
          <input
            type="text"
            value={search}
            placeholder="Tìm command hoặc switch..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <span className="count tnum">{visibleCommands.length} / {activePhase.commands.length} command</span>
      </div>

      <div className="cmd-list">
        {visibleCommands.length === 0 ? (
          <div className="empty">Không có command nào khớp "{search}".</div>
        ) : (
          visibleCommands.map((cmd, i) => (
            <CommandCard
              key={cmd.id}
              cmd={cmd}
              index={i}
              state={states[cmd.id]}
              globalTarget={defaultTarget}
              phaseName={activePhase.name}
              onToggle={(swId) => toggleSwitch(cmd.id, swId)}
              onValue={(swId, v) => setValue(cmd.id, swId, v)}
              onTarget={(v) => setTarget(cmd.id, v)}
              onReset={() => resetCommand(cmd.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
