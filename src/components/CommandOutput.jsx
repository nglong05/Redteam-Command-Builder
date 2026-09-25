import { useState } from 'react'
import { IconCopy } from './Icons.jsx'

/** Khối hiển thị dòng lệnh đã dựng + nút copy. */
export default function CommandOutput({ tokens, text }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback khi không có quyền clipboard (vd http)
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="output">
      <div className="output-head">
        <span className="lab">Lệnh sẽ chạy</span>
        <button className="btn sm" onClick={copy} aria-label="Sao chép lệnh">
          {copied ? <span className="copied">✓ ĐÃ COPY</span> : (<><IconCopy /> Copy</>)}
        </button>
      </div>
      <pre>
        <span className="prompt">$ </span>
        {tokens.map((t, i) => (
          <span key={i} className={`tok-${t.type}`}>{t.text}{i < tokens.length - 1 ? ' ' : ''}</span>
        ))}
      </pre>
    </div>
  )
}
