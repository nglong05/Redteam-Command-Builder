import { useMemo, useState } from 'react'
import { TOOLS, TOOL_CATEGORIES } from '../data/tools.js'
import { IconExternal, IconSearch } from '../components/Icons.jsx'

export default function Tools() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return TOOLS.filter((tool) => {
      if (cat !== 'all' && tool.cat !== cat) return false
      if (!t) return true
      return (tool.name + ' ' + tool.desc + ' ' + tool.cat).toLowerCase().includes(t)
    })
  }, [cat, q])

  return (
    <div className="page">
      <div className="page-head">
        <div className="lab acc eyebrow">Tham khảo</div>
        <h1>Kho <em>công cụ</em></h1>
        <p>Các công cụ đứng sau những command trong ứng dụng — kèm mô tả ngắn và liên kết tới trang chính thức.</p>
      </div>

      <div className="filter-row">
        <div className="search" style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}>
            <IconSearch />
          </span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm công cụ..." style={{ paddingLeft: 36 }} />
        </div>
      </div>

      <div className="filter-row">
        <button className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>Tất cả</button>
        {TOOL_CATEGORIES.map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card"><p>Không tìm thấy công cụ nào khớp.</p></div>
      ) : (
        <div className="card-grid">
          {list.map((t) => (
            <a className="card link" key={t.name} href={t.url} target="_blank" rel="noreferrer noopener">
              <h3>{t.name} <IconExternal /></h3>
              <p>{t.desc}</p>
              <div className="foot-row"><span className="badge">{t.cat}</span></div>
            </a>
          ))}
        </div>
      )}
      <p className="mut" style={{ fontSize: 12.5, marginTop: 16 }}>{list.length} / {TOOLS.length} công cụ</p>
    </div>
  )
}
