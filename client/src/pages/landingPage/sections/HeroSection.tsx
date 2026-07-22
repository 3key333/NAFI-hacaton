import { AUDIENCE_TABS, HERO_BADGES, HERO_SCENARIOS } from '@/data/landingData'
import { useConnection } from '@/redux/hooks/useConnection'
import { Button } from '@/components/ui/Button'
import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel'
import type { AudienceType } from '@/types'
import style from '@/pages/landingPage/landingPage.module.scss'

interface HeroSectionProps {
  onConsultation: () => void
}

export const HeroSection = ({ onConsultation }: HeroSectionProps) => {
  const { openWizard, config, setAudienceWithRecommendations } = useConnection()

  const handleAudienceChange = (id: AudienceType) => {
    setAudienceWithRecommendations(id)
  }

  return (
    <section className={style.hero}>
      <div className={`container ${style.hero__grid}`}>
        <div className={style.hero__content}>
          <div className={style.hero__chips}>
            {AUDIENCE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${style.hero__chip} ${tab.id === config.audience ? style['hero__chip--active'] : ''}`}
                onClick={() => handleAudienceChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h1>Платформа для оценки <br /> и развития цифровых компетенций ваших сотрудников</h1>
          <p className={style.hero__subtitle}>
            Готовое решение · Тестирование онлайн · Аналитика · Персональные рекомендации · База знаний
          </p>

          <div className={style.hero__badges}>
            {HERO_BADGES.map((badge) => (
              <span key={badge} className={style.hero__badge}>{badge}</span>
            ))}
          </div>

          <ul className={style.hero__scenarios}>
            {HERO_SCENARIOS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className={style.hero__actions}>
            <Button onClick={openWizard}>Подключить платформу</Button>
            <Button variant="secondary" className={style.hero__btnSecondary} onClick={onConsultation}>
              Получить консультацию
            </Button>
          </div>
        </div>

        <div className={style.hero__aside}>
          <ConfiguratorPanel compact />
          <div className={style.hero__mock}>
            <p>Так будет выглядеть ваша панель управления и аналитики</p>
            <div className={style.hero__mockBars}>
              <span style={{ height: '60%' }} />
              <span style={{ height: '85%' }} />
              <span style={{ height: '45%' }} />
              <span style={{ height: '72%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
