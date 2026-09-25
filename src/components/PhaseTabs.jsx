export default function PhaseTabs({ phases, activeId, onSelect }) {
  return (
    <nav className="phases edge" role="tablist" aria-label="Các giai đoạn tấn công">
      {phases.map((p, i) => (
        <button
          key={p.id}
          role="tab"
          aria-selected={p.id === activeId}
          className="phase-tab"
          onClick={() => onSelect(p.id)}
        >
          <span className="num">{String(i + 1).padStart(2, '0')}</span>
          <span className="nm">{p.name}</span>
          <span className="cnt">· {p.commands.length}</span>
        </button>
      ))}
    </nav>
  )
}
