import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save, uid } from '../utils/storage.js'

const AppContext = createContext(null)

/** Hook truy cập state toàn cục. */
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp phải nằm trong <AppProvider>')
  return ctx
}

function initTheme() {
  const saved = load('theme', null)
  if (saved === 'light' || saved === 'dark') return saved
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

/** Các màu nhấn có thể chọn trong phần Cài đặt. */
export const ACCENTS = [
  { id: 'coral', label: 'Coral', light: '#d0673f', dark: '#e08a63' },
  { id: 'green', label: 'Terminal', light: '#3f8f5c', dark: '#5fbf82' },
  { id: 'blue', label: 'Ice', light: '#3f6fd0', dark: '#6f9be8' },
  { id: 'purple', label: 'Neon', light: '#8a4fd0', dark: '#b083e8' },
  { id: 'red', label: 'Alert', light: '#c0392b', dark: '#e06055' },
]

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initTheme)
  const [accent, setAccent] = useState(() => load('accent', 'coral'))
  const [defaultTarget, setDefaultTarget] = useState(() => load('defaultTarget', ''))
  const [favorites, setFavorites] = useState(() => load('favorites', []))
  const [playbook, setPlaybook] = useState(() => load('playbook', []))

  /* ---- đồng bộ localStorage ---- */
  useEffect(() => { save('theme', theme) }, [theme])
  useEffect(() => { save('accent', accent) }, [accent])
  useEffect(() => { save('defaultTarget', defaultTarget) }, [defaultTarget])
  useEffect(() => { save('favorites', favorites) }, [favorites])
  useEffect(() => { save('playbook', playbook) }, [playbook])

  /* ---- áp dụng theme + accent lên <html> ---- */
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    const a = ACCENTS.find((x) => x.id === accent) || ACCENTS[0]
    root.style.setProperty('--accent', theme === 'dark' ? a.dark : a.light)
  }, [theme, accent])

  /* ---- actions ---- */
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const toggleFavorite = (cmdId) =>
    setFavorites((f) => (f.includes(cmdId) ? f.filter((x) => x !== cmdId) : [...f, cmdId]))
  const isFavorite = (cmdId) => favorites.includes(cmdId)

  const addToPlaybook = (item) =>
    setPlaybook((p) => [...p, { uid: uid(), note: '', ...item }])
  const updatePlaybookItem = (id, patch) =>
    setPlaybook((p) => p.map((it) => (it.uid === id ? { ...it, ...patch } : it)))
  const removePlaybookItem = (id) => setPlaybook((p) => p.filter((it) => it.uid !== id))
  const movePlaybookItem = (id, dir) =>
    setPlaybook((p) => {
      const i = p.findIndex((it) => it.uid === id)
      if (i < 0) return p
      const j = dir === 'up' ? i - 1 : i + 1
      if (j < 0 || j >= p.length) return p
      const copy = [...p]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  const clearPlaybook = () => setPlaybook([])

  const value = useMemo(
    () => ({
      theme, setTheme, toggleTheme,
      accent, setAccent,
      defaultTarget, setDefaultTarget,
      favorites, toggleFavorite, isFavorite,
      playbook, addToPlaybook, updatePlaybookItem, removePlaybookItem, movePlaybookItem, clearPlaybook,
    }),
    [theme, accent, defaultTarget, favorites, playbook]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
