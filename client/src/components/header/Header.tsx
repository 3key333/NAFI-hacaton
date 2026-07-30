import { useState, type MouseEvent } from 'react'
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

  const handleLogoClick = (e: MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={style.header}>
      <div className={`container ${style.header__inner}`}>
        <a href="#" className={style.header__logo} onClick={handleLogoClick}>
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
          <button
            className={`${style.header__burger} ${menuOpen ? style['header__burger--open'] : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`${style.header__mobile} ${menuOpen ? style['header__mobile--open'] : ''}`}
        inert={!menuOpen ? true : undefined}
      >
        <div className={style.header__mobileInner}>
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
      </div>
    </header>
  )
}
