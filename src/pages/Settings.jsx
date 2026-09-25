import { useRef, useState } from 'react'
import { useApp, ACCENTS } from '../context/AppContext.jsx'
import { exportAll, importAll, clearAll } from '../utils/storage.js'
import { IconDownload, IconUpload, IconTrash, IconSun, IconMoon } from '../components/Icons.jsx'

export default function Settings() {
  const { theme, setTheme, accent, setAccent, defaultTarget, setDefaultTarget } = useApp()
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')

  function flash(t) { setMsg(t); setTimeout(() => setMsg(''), 2500) }

  // XUẤT: gom toàn bộ dữ liệu app thành file JSON tải về
  function doExport() {
    const data = JSON.stringify(exportAll(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'rtcb-backup.json'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    flash('Đã tải file sao lưu (rtcb-backup.json).')
  }

  // NHẬP: đọc file JSON và ghi lại vào localStorage
  function doImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result)
        importAll(obj)
        flash('Khôi phục xong — đang tải lại...')
        setTimeout(() => window.location.reload(), 800)
      } catch {
        flash('File không hợp lệ.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function doReset() {
    clearAll()
    flash('Đã xóa toàn bộ — đang tải lại...')
    setTimeout(() => window.location.reload(), 800)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="lab acc eyebrow">Tùy chỉnh</div>
        <h1>Cài <em>đặt</em></h1>
      </div>

      {msg && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'var(--accent)' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 600, margin: 0 }}>{msg}</p>
        </div>
      )}

      <div className="set-block">
        <h3>Giao diện</h3>
        <p>Chọn nền sáng hoặc tối.</p>
        <div className="gap-btns">
          <button className={'btn' + (theme === 'light' ? ' pri' : '')} onClick={() => setTheme('light')}><IconSun /> Sáng</button>
          <button className={'btn' + (theme === 'dark' ? ' pri' : '')} onClick={() => setTheme('dark')}><IconMoon /> Tối</button>
        </div>
      </div>

      <div className="set-block">
        <h3>Màu nhấn</h3>
        <p>Màu dùng cho điểm nhấn, liên kết và nút chính.</p>
        <div className="swatches">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              className="swatch"
              aria-pressed={accent === a.id}
              title={a.label}
              onClick={() => setAccent(a.id)}
              style={{ background: theme === 'dark' ? a.dark : a.light }}
            />
          ))}
        </div>
      </div>

      <div className="set-block">
        <h3>Mục tiêu mặc định</h3>
        <p>Giá trị điền sẵn cho ô "mục tiêu chung" ở trang Dựng lệnh.</p>
        <input value={defaultTarget} onChange={(e) => setDefaultTarget(e.target.value)} placeholder="vd: 10.10.10.5" style={{ maxWidth: 360 }} />
      </div>

      <div className="set-block">
        <h3>Sao lưu &amp; khôi phục dữ liệu</h3>
        <p>Xuất toàn bộ lựa chọn (yêu thích, kịch bản, cài đặt) ra file JSON để mang sang máy khác, khôi phục lại từ file, hoặc xóa sạch.</p>
        <div className="gap-btns">
          <button className="btn pri" onClick={doExport}><IconDownload /> Export (JSON)</button>
          <button className="btn" onClick={() => fileRef.current?.click()}><IconUpload /> Import</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={doImport} style={{ display: 'none' }} />
          <button className="btn ghost" onClick={doReset}><IconTrash /> Xóa toàn bộ dữ liệu</button>
        </div>
      </div>
    </div>
  )
}
