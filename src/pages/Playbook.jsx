import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { IconUp, IconDown, IconTrash, IconCopy, IconDownload } from '../components/Icons.jsx'

export default function Playbook() {
  const { playbook, updatePlaybookItem, removePlaybookItem, movePlaybookItem, clearPlaybook, defaultTarget } = useApp()
  const [copied, setCopied] = useState(false)

  function buildScript() {
    const lines = [
      '#!/usr/bin/env bash',
      '# ============================================================',
      '# Kịch bản tấn công — xuất từ redteam::cmd-builder',
      '# ⚠ Chỉ chạy trên hệ thống được phép kiểm thử!',
      defaultTarget ? `# Mục tiêu: ${defaultTarget}` : '# Mục tiêu: (chưa đặt)',
      `# Số bước: ${playbook.length}`,
      '# ============================================================',
      '',
      'set -e',
      '',
    ]
    playbook.forEach((it, i) => {
      lines.push(`# [${String(i + 1).padStart(2, '0')}] ${it.phase} — ${it.name}`)
      if (it.note) lines.push(`#      ghi chú: ${it.note.replace(/\n/g, ' ')}`)
      lines.push(it.text)
      lines.push('')
    })
    return lines.join('\n')
  }

  async function copyAll() {
    const txt = playbook.map((it) => it.text).join('\n')
    try { await navigator.clipboard.writeText(txt) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function download() {
    const blob = new Blob([buildScript()], { type: 'text/x-shellscript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attack-playbook.sh'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="lab acc eyebrow">Quy trình</div>
        <h1>Kịch <em>bản</em> tấn công</h1>
        <p>Các lệnh bạn đã thêm từ trang Dựng lệnh. Sắp xếp thứ tự, ghi chú, rồi xuất thành script <code>.sh</code> hoặc copy toàn bộ.</p>
      </div>

      {playbook.length === 0 ? (
        <div className="card">
          <p>Kịch bản trống. Sang trang <Link to="/" className="acc">Dựng lệnh</Link>, cấu hình một command rồi bấm <b>"Thêm vào kịch bản"</b>.</p>
        </div>
      ) : (
        <>
          <div className="gap-btns" style={{ marginBottom: 22 }}>
            <button className="btn pri" onClick={download}><IconDownload /> Xuất script .sh</button>
            <button className="btn" onClick={copyAll}><IconCopy /> {copied ? 'Đã copy ✓' : 'Copy tất cả'}</button>
            <button className="btn ghost" onClick={clearPlaybook}><IconTrash /> Xóa hết</button>
          </div>

          {playbook.map((it, i) => (
            <div className="pb-item" key={it.uid}>
              <div className="pb-top">
                <span className="idx tnum">{String(i + 1).padStart(2, '0')}</span>
                <div className="meta">
                  <div className="nm">{it.name}</div>
                  <div className="ph">{it.tool} · {it.phase}</div>
                </div>
                <div className="ctl">
                  <button className="btn sm ghost" onClick={() => movePlaybookItem(it.uid, 'up')} disabled={i === 0} aria-label="Lên"><IconUp /></button>
                  <button className="btn sm ghost" onClick={() => movePlaybookItem(it.uid, 'down')} disabled={i === playbook.length - 1} aria-label="Xuống"><IconDown /></button>
                  <button className="btn sm ghost" onClick={() => removePlaybookItem(it.uid)} aria-label="Xóa"><IconTrash /></button>
                </div>
              </div>
              <pre>{it.text}</pre>
              <textarea
                value={it.note}
                placeholder="Ghi chú cho bước này (tùy chọn)..."
                onChange={(e) => updatePlaybookItem(it.uid, { note: e.target.value })}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
