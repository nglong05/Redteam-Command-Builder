import { useState } from 'react'
import SwitchItem from './SwitchItem.jsx'
import CommandOutput from './CommandOutput.jsx'
import { IconReset, IconStar, IconPlus } from './Icons.jsx'
import { buildCommand, countOn } from '../utils/buildCommand.js'
import { useApp } from '../context/AppContext.jsx'

export default function CommandCard({ cmd, index, state, globalTarget, phaseName, onToggle, onValue, onTarget, onReset }) {
  const { tokens, text } = buildCommand(cmd, state, globalTarget)
  const n = countOn(state)
  const { isFavorite, toggleFavorite, addToPlaybook } = useApp()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToPlaybook({ cmdId: cmd.id, name: cmd.name, tool: cmd.tool, phase: phaseName || '', text })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="cmd">
      <div className="cmd-top">
        <span className="cmd-id tnum">{String(index + 1).padStart(2, '0')}</span>

        <div className="cmd-main">
          <div className="cmd-title">
            <span className="tool">{cmd.tool}</span>
            <h3>{cmd.name}</h3>
          </div>
          <p className="cmd-desc">{cmd.desc}</p>

          {cmd.target && (
            <div className="sw-value" style={{ marginTop: 14, maxWidth: 420 }}>
              <label className="lab" style={{ display: 'block', marginBottom: 6 }}>Mục tiêu</label>
              <input
                type="text"
                value={state?.target ?? ''}
                placeholder={globalTarget ? `${cmd.target.placeholder}  (mặc định: ${globalTarget})` : cmd.target.placeholder}
                onChange={(e) => onTarget(e.target.value)}
                aria-label={`Mục tiêu cho ${cmd.tool}`}
              />
            </div>
          )}

          <div className="switches">
            {cmd.switches.map((sw) => (
              <SwitchItem
                key={sw.id}
                sw={sw}
                state={state?.switches?.[sw.id]}
                onToggle={() => onToggle(sw.id)}
                onValue={(v) => onValue(sw.id, v)}
              />
            ))}
          </div>

          <CommandOutput tokens={tokens} text={text} />

          <div className="gap-btns" style={{ marginTop: 12 }}>
            <button className="btn sm pri" onClick={handleAdd}>
              <IconPlus /> {added ? 'Đã thêm ✓' : 'Thêm vào kịch bản'}
            </button>
          </div>
        </div>

        <div className="cmd-actions" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <button
            className="btn sm ghost"
            onClick={() => toggleFavorite(cmd.id)}
            aria-pressed={isFavorite(cmd.id)}
            title={isFavorite(cmd.id) ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
          >
            <IconStar filled={isFavorite(cmd.id)} />
          </button>
          <span className="badge tnum" title="Số switch đang bật">{n} on</span>
          <button className="btn sm ghost" onClick={onReset} title="Đặt lại command này">
            <IconReset /> Reset
          </button>
        </div>
      </div>
    </article>
  )
}
