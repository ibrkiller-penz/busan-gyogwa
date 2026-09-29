import { NavLink, Link } from 'react-router-dom'

const cls = ({ isActive }) => (isActive ? 'active' : '')

const icons = {
  home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  calc: <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></>,
  table: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M9.5 9.5v10" /></>,
  book: <path d="M5 4.5h5.5A2.5 2.5 0 0 1 13 7v13a2 2 0 0 0-2-2H5zM19 4.5h-3.5A2.5 2.5 0 0 0 13 7v13a2 2 0 0 1 2-2h4z" />,
  bars: <path d="M4 20h16M7 16V10M12 16V5M17 16v-4" />,
}

const items = [
  { to: '/', label: '홈', icon: 'home', end: true },
  { to: '/simulator', label: '계산기', icon: 'calc' },
  { to: '/compare', label: '비교표', icon: 'table' },
  { to: '/subjects', label: '과목 선택', icon: 'book' },
  { to: '/ratio', label: '선발 비율', icon: 'bars' },
]

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

export default function Header() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">부산 교과전형 <small>2028</small></Link>
          <nav className="topnav" aria-label="주 메뉴">
            {items.map(it => (
              <NavLink key={it.to} to={it.to} end={it.end} className={cls}>{it.label}</NavLink>
            ))}
            <NavLink to="/documents" className={cls}>원문</NavLink>
            <NavLink to="/about" className={cls}>안내</NavLink>
          </nav>
          <span className="top-about">
            <Link to="/documents">원문</Link>
            <Link to="/about">안내</Link>
          </span>
        </div>
      </header>
      <nav className="tabbar" aria-label="주 메뉴">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} end={it.end} className={cls}>
            <Icon name={it.icon} />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
