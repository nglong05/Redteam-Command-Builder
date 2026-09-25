import { useMemo, useState } from 'react'
import { PHASES } from '../data/phases.js'
import { useApp } from '../context/AppContext.jsx'
import { IconSearch, IconStar } from '../components/Icons.jsx'

// làm phẳng: mỗi command là một dòng, kèm tên giai đoạn
const ROWS = PHASES.flatMap((p) => p.commands.map((c) => ({ ...c, phase: p.name, phaseId: p.id })))

export default function Cheatsheet() {
  const { isFavorite, toggleFavorite } = useApp()
  const [q, setQ] = useState('')
  const [phase, setPhase] = useState('all')
  const [favOnly, setFavOnly] = useState(false)

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return ROWS.filter((r) => {
      if (phase !== 'all' && r.phaseId !== phase) return false
      if (favOnly && !isFavorite(r.id)) return false
      if (!t) return true
      const hay = [r.tool, r.name, r.desc, ...r.switches.flatMap((s) => [s.flag, s.label])].join(' ').toLowerCase()
      return hay.includes(t)
    })
  }, [q, phase, favOnly, isFavorite])

  return (
    <div className="page">
      <div className="page-head">
        <div className="lab acc eyebrow">Tổng hợp</div>
        <h1>Tra cứu <em>nhanh</em></h1>
        <p>Toàn bộ command và switch quan trọng trong một bảng. Lọc theo giai đoạn, tìm theo từ khóa, đánh dấu yêu thích.</p>
      </div>

      <div className="filter-row">
        <div className="search" style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}>
            <IconSearch />
          </span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tool, lệnh, switch..." style={{ paddingLeft: 36 }} />
        </div>
        <button className="chip" aria-pressed={favOnly} onClick={() => setFavOnly((v) => !v)}>★ Chỉ yêu thích</button>
      </div>

      <div className="filter-row">
        <button className="chip" aria-pressed={phase === 'all'} onClick={() => setPhase('all')}>Tất cả</button>
        {PHASES.map((p) => (
          <button key={p.id} className="chip" aria-pressed={phase === p.id} onClick={() => setPhase(p.id)}>{p.name}</button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="cheat">
          <thead>
            <tr>
              <th style={{ width: 40 }}>★</th>
              <th style={{ width: 130 }}>Tool</th>
              <th>Command</th>
              <th>Switch tiêu biểu</th>
              <th style={{ width: 150 }}>Giai đoạn</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 36, color: 'var(--muted)' }}>Không có kết quả phù hợp.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button className="btn sm ghost" style={{ padding: 4, border: 0 }} onClick={() => toggleFavorite(r.id)} aria-pressed={isFavorite(r.id)} aria-label="Yêu thích">
                      <IconStar filled={isFavorite(r.id)} />
                    </button>
                  </td>
                  <td><code>{r.tool}</code></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div className="mut" style={{ fontSize: 12, marginTop: 3 }}>{r.desc}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {r.switches.slice(0, 6).map((s) => (
                        <code key={s.id} title={s.label} style={{ fontSize: 11.5, padding: '2px 7px', border: '1px solid var(--line)', borderRadius: 5, color: 'var(--ink)' }}>{s.flag}</code>
                      ))}
                      {r.switches.length > 6 && <span className="faint" style={{ fontSize: 11 }}>+{r.switches.length - 6}</span>}
                    </div>
                  </td>
                  <td><span className="badge">{r.phase}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mut" style={{ fontSize: 12.5, marginTop: 14 }}>{rows.length} / {ROWS.length} command</p>
    </div>
  )
}
