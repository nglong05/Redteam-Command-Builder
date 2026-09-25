/**
 * Dựng dòng lệnh từ một command + trạng thái switch người dùng chọn.
 *
 * @param {object} cmd    - một command trong dữ liệu phases.js
 * @param {object} state  - { switches: { [swId]: { on, value } }, target: string }
 * @param {string} globalTarget - target mặc định dùng chung nếu command chưa nhập riêng
 * @returns {{ tokens: Array<{type:string,text:string}>, text: string }}
 *          tokens: để tô màu khi hiển thị · text: chuỗi thuần để copy
 */
export function buildCommand(cmd, state, globalTarget = '') {
  const tokens = [{ type: 'tool', text: cmd.tool }]
  const sw = state?.switches || {}

  for (const s of cmd.switches) {
    const st = sw[s.id]
    if (!st || !st.on) continue

    if (s.takesValue) {
      const typed = (st.value ?? '').trim()
      const fallback = s.defaultValue || s.valuePlaceholder || ''
      const value = typed !== '' ? typed : fallback
      const glue = s.glue ?? ' '

      if (glue === '') {
        // nối liền: LHOST=10.10.14.1 , /u:admin
        tokens.push({ type: 'flag', text: s.flag + value })
      } else {
        tokens.push({ type: 'flag', text: s.flag })
        if (value) tokens.push({ type: 'val', text: value })
      }
    } else {
      tokens.push({ type: 'flag', text: s.flag })
    }
  }

  // target (host / URL / ...) — luôn đặt cuối
  if (cmd.target) {
    const effective = (state?.target || '').trim() || (globalTarget || '').trim()
    if (effective) {
      const prefix = cmd.target.prefix || ''
      if (prefix.endsWith(' ') && prefix.trim() !== '') {
        // dạng "-u <url>" -> flag + value
        tokens.push({ type: 'flag', text: prefix.trim() })
        tokens.push({ type: 'val', text: effective })
      } else {
        // dạng "/v:host" hoặc target trần
        tokens.push({ type: 'val', text: prefix + effective })
      }
    }
  }

  const text = tokens.map((t) => t.text).join(' ')
  return { tokens, text }
}

/** Tạo trạng thái mặc định cho một command (switch nào bật sẵn, giá trị điền sẵn). */
export function initCommandState(cmd) {
  const switches = {}
  for (const s of cmd.switches) {
    switches[s.id] = {
      on: !!s.defaultOn,
      value: s.defaultValue ?? '',
    }
  }
  return { switches, target: '' }
}

/** Đếm số switch đang bật của một command. */
export function countOn(state) {
  if (!state?.switches) return 0
  return Object.values(state.switches).filter((s) => s.on).length
}
