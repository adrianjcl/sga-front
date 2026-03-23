'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

const navItems = [
  { href: '/dashboard',          icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/grupos',   icon: '👥', label: 'Grupos',   badge: '12' },
  { href: '/dashboard/alumnos',  icon: '🎓', label: 'Alumnos' },
  { href: '/dashboard/docentes', icon: '👩‍🏫', label: 'Docentes' },
  { href: '/dashboard/horarios', icon: '🕐', label: 'Horarios' },
]

const reportItems = [
  { href: '/dashboard/reportes', icon: '📄', label: 'Exportar datos' },
  { href: '/dashboard/bajas',    icon: '📉', label: 'Bajas' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <aside className={styles.sidebar}>
      {/* Header / Logo */}
      <div className={styles.header}>
        <div className={styles.logoRow}>
          <span className={styles.logoUt}>UT</span>
          <div className={styles.logoSep} />
          <span className={styles.logoBis}>BiS</span>
        </div>
        <span className={styles.logoSub}>División de Tecnología</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.section}>Principal</span>
        {navItems.slice(0, 1).map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <span className={styles.section}>Gestión</span>
        {navItems.slice(1).map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </Link>
        ))}

        <span className={styles.section}>Reportes</span>
        {reportItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>AD</div>
          <div>
            <p className={styles.userName}>Admin</p>
            <p className={styles.userRole}>Coordinador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
