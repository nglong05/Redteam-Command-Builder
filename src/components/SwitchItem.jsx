import { IconCheck } from './Icons.jsx'

/**
 * Một switch (cờ) của command: có thể bật/tắt, một số cờ kèm ô nhập giá trị.
 */
export default function SwitchItem({ sw, state, onToggle, onValue }) {
  const on = !!state?.on

  return (
    <div className="sw" data-on={on} onClick={onToggle} role="button" tabIndex={0}
      onKeyDown={(e) => {
        // chỉ toggle khi phím phát ra từ chính ô này, không phải nổi bọt từ input bên trong
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
      }}
    >
      <span className="sw-box" aria-hidden="true"><IconCheck /></span>

      <div className="sw-body">
        <div className="sw-flag">
          <code>{sw.flag}</code>
          {sw.required && <span className="req">NÊN CÓ</span>}
        </div>
        <div className="sw-label">{sw.label}</div>

        {sw.takesValue && on && (
          <div className="sw-value" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={state?.value ?? ''}
              placeholder={sw.valuePlaceholder || 'giá trị...'}
              onChange={(e) => onValue(e.target.value)}
              aria-label={`Giá trị cho ${sw.flag}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
