import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import {
  IconGrid, IconList, IconTarget, IconBook, IconGear,
  IconSun, IconMoon, IconMenu, IconClose,
} from './Icons.jsx'

const NAV = [
  { to: '/', label: 'Dựng lệnh', icon: IconTarget, end: true },
  { to: '/cheatsheet', label: 'Tra cứu nhanh', icon: IconList },
  { to: '/playbook', label: 'Kịch bản', icon: IconGrid, count: true },
  { to: '/tools', label: 'Kho công cụ', icon: IconBook },
  { to: '/settings', label: 'Cài đặt', icon: IconGear },
]

function Brand() {
  return (
    <div className="side-brand">
      <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="var(--ink)" />
        <path d="M8 11l5 5-5 5" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="22" x2="24" y2="22" stroke="var(--bg)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <b>redteam<span className="acc">::</span>cmd</b>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme, playbook } = useApp()
  const loc = useLocation()

  // đóng drawer khi đổi trang (mobile)
  const close = () => setOpen(false)

  return (
    <div className="shell" data-open={open}>
      <div className="scrim" onClick={close} />

      <aside className="sidebar">
        <Brand />
        <nav>
          {NAV.map(({ to, label, icon: Icon, end, count }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}
              onClick={close}
            >
              <Icon />
              <span>{label}</span>
              {count && playbook.length > 0 && <span className="badge">{playbook.length}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="iconbtn" onClick={() => setOpen((o) => !o)} aria-label="Mở menu">
            {open ? <IconClose /> : <IconMenu />}
          </button>
          <div className="brand">
            <b>redteam<span className="acc">::</span>cmd</b>
          </div>
          <button className="iconbtn" onClick={toggleTheme} aria-label="Đổi giao diện">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
        </div>

        {/* nút theme cho desktop (góc phải trên nội dung) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px var(--edge) 0' }} className="desktop-theme">
          <button className="btn sm ghost" onClick={toggleTheme} aria-label="Đổi giao diện">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            {theme === 'dark' ? 'Sáng' : 'Tối'}
          </button>
        </div>

        <Outlet key={loc.pathname} />
      </div>
    </div>
  )
}
