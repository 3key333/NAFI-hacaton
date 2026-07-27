import { HERO_BADGES, HERO_SCENARIOS } from '@/data/landingData'
import { useConnection } from '@/redux/hooks/useConnection'
import { Button } from '@/components/ui/Button'
import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel'
import style from '@/pages/landingPage/landingPage.module.scss'

interface HeroSectionProps {
  onConsultation: () => void
}

export const HeroSection = ({ onConsultation }: HeroSectionProps) => {
  const { openWizard } = useConnection()

  return (
    <section className={style.hero}>
      <div className={`container ${style.hero__grid}`}>
        <div className={style.hero__content}>
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
        </div>
      </div>
    </section>
  )
}
