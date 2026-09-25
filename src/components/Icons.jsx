// Bộ icon SVG nội tuyến, dùng currentColor để hợp cả light/dark.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const svg = (size, children, extra = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...S} {...extra}>{children}</svg>
)

export const IconCheck = ({ size = 12 }) => svg(size, <polyline points="20 6 9 17 4 12" />, { stroke: 'var(--on-accent)' })
export const IconCopy = ({ size = 14 }) => svg(size, <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>)
export const IconReset = ({ size = 14 }) => svg(size, <><path d="M3 2v6h6" /><path d="M3 8a9 9 0 1 0 2.6-4.9L3 8" /></>)
export const IconSearch = ({ size = 15 }) => svg(size, <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>)
export const IconSun = ({ size = 16 }) => svg(size, <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)
export const IconMoon = ({ size = 16 }) => svg(size, <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />)

export const IconStar = ({ size = 15, filled = false }) =>
  svg(size, <polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.3 21 12 17.3 5.7 21 7.2 14 2 9.3 8.9 8.6 12 2" />, filled ? { fill: 'var(--accent)', stroke: 'var(--accent)' } : {})
export const IconPlus = ({ size = 14 }) => svg(size, <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>)
export const IconTrash = ({ size = 14 }) => svg(size, <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>)
export const IconUp = ({ size = 14 }) => svg(size, <polyline points="18 15 12 9 6 15" />)
export const IconDown = ({ size = 14 }) => svg(size, <polyline points="6 9 12 15 18 9" />)
export const IconDownload = ({ size = 14 }) => svg(size, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>)
export const IconUpload = ({ size = 14 }) => svg(size, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>)

export const IconHome = ({ size = 16 }) => svg(size, <><path d="M3 9.5L12 3l9 6.5" /><path d="M5 10v10h14V10" /></>)
export const IconGrid = ({ size = 16 }) => svg(size, <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>)
export const IconList = ({ size = 16 }) => svg(size, <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>)
export const IconBook = ({ size = 16 }) => svg(size, <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>)
export const IconTarget = ({ size = 16 }) => svg(size, <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>)
export const IconRoute = ({ size = 16 }) => svg(size, <><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h6a3 3 0 0 0 3-3V8" /></>)
export const IconNote = ({ size = 16 }) => svg(size, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></>)
export const IconBrain = ({ size = 16 }) => svg(size, <><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5a3 3 0 0 0-2 5.7A3 3 0 0 0 6 16a2.5 2.5 0 0 0 3.5 2.3V2z" /><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v.5a3 3 0 0 1 2 5.7A3 3 0 0 1 18 16a2.5 2.5 0 0 1-3.5 2.3V2z" /></>)
export const IconGear = ({ size = 16 }) => svg(size, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 5.6h.09A1.65 1.65 0 0 0 10 4.09V4a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 5.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 9v.09A1.65 1.65 0 0 0 21.91 10H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>)
export const IconInfo = ({ size = 16 }) => svg(size, <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><line x1="12" y1="8" x2="12.01" y2="8" /></>)
export const IconExternal = ({ size = 13 }) => svg(size, <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>)
export const IconMenu = ({ size = 20 }) => svg(size, <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)
export const IconClose = ({ size = 20 }) => svg(size, <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>)
