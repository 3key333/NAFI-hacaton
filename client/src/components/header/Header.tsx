import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/data/landingData'
import { useConnection } from '@/redux/hooks/useConnection'
import style from './header.module.scss'

interface HeaderProps {
  onConsultation: () => void
}

export const Header = ({ onConsultation }: HeaderProps) => {
  const { openWizard } = useConnection()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={style.header}>
      <div className={`container ${style.header__inner}`}>
        <a href="#" className={style.header__logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <span className={style.header__logoMark}>ЦГ</span>
          <span>Цифровой гражданин</span>
        </a>

        <nav className={`${style.header__nav} ${menuOpen ? style['header__nav--open'] : ''}`}>
          {NAV_LINKS.map((link) => (
            <button key={link.href} className={style.header__link} onClick={() => handleNav(link.href)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className={style.header__actions}>
          <Button variant="primary" onClick={openWizard}>Подключить платформу</Button>
          <button className={style.header__burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={style.header__mobile}>
          {NAV_LINKS.map((link) => (
            <button key={link.href} onClick={() => handleNav(link.href)}>{link.label}</button>
          ))}
          <Button variant="secondary" onClick={() => { setMenuOpen(false); onConsultation() }}>
            Получить консультацию
          </Button>
        </div>
      )}
    </header>
  )
}
