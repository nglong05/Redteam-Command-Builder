/**
 * Lớp bọc localStorage an toàn (không vỡ khi ở chế độ riêng tư / bị chặn).
 * Mọi trạng thái cần lưu lâu dài đều đi qua đây.
 */
const PREFIX = 'rtcb:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}

/** Lấy toàn bộ dữ liệu app (để xuất/backup). */
export function exportAll() {
  const out = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(PREFIX)) {
        out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k))
      }
    }
  } catch {}
  return out
}

/** Nạp lại dữ liệu từ một object (khi import backup). */
export function importAll(obj) {
  try {
    Object.entries(obj || {}).forEach(([k, v]) => save(k, v))
    return true
  } catch {
    return false
  }
}

/** Xóa sạch dữ liệu app. */
export function clearAll() {
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(PREFIX)) keys.push(k)
    }
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {}
}

/** ID ngẫu nhiên ngắn gọn cho item trong danh sách. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
