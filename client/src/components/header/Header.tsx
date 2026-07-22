import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/data/landingData'
import { scrollToSection } from '@/helpers/scrollToSection'
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
    scrollToSection(href.replace('#', ''))
  }

  return (
    <header className={style.header}>
      <div className={`container ${style.header__inner}`}>
        <a href="#" className={style.header__logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <img src="/city.svg" alt="Цифровой гражданин" className={style.header__logoImg} />
          <span>Цифровой гражданин</span>
        </a>

        <nav className={style.header__nav}>
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
          <Button
            variant="secondary"
            className={style.header__mobileBtn}
            onClick={() => { setMenuOpen(false); onConsultation() }}
          >
            Получить консультацию
          </Button>
        </div>
      )}
    </header>
  )
}
