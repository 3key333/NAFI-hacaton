import { AUDIENCE_TABS } from '@/data/landingData'
import { CONNECTION_OPTIONS } from '@/config/connectionConfig'
import { useConnection } from '@/redux/hooks/useConnection'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { AudienceType, ConnectionOptions } from '@/types'
import style from '@/pages/landingPage/landingPage.module.scss'

interface AudienceSectionProps {
  onConsultation: () => void
}

const optionLabel = (key: keyof ConnectionOptions) =>
  CONNECTION_OPTIONS.find((opt) => opt.key === key)?.label ?? key

export const AudienceSection = ({ onConsultation }: AudienceSectionProps) => {
  const { openWizard, config, setAudienceWithRecommendations, toggleOption } = useConnection()

  const activeAudienceIndex = AUDIENCE_TABS.findIndex((tab) => tab.id === config.audience)
  const audience = AUDIENCE_TABS[activeAudienceIndex >= 0 ? activeAudienceIndex : 0]

  const handleAudienceChange = (id: AudienceType) => {
    setAudienceWithRecommendations(id)
  }

  return (
    <section className={`section section--alt ${style.audience}`}>
      <div className="container">
        <SectionTitle title="Для кого" subtitle="Решение для разных типов организаций" />

        <div className={style.audience__tabs}>
          {AUDIENCE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${style.audience__tab} ${tab.id === config.audience ? style['audience__tab--active'] : ''}`}
              onClick={() => handleAudienceChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={style.audience__content}>
          <div>
            <h4>Боли</h4>
            <ul>{audience.pains.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>

          <div>
            <h4>Что получите</h4>
            <ul>{audience.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>

          <div>
            <h4>Кейс</h4>
            <p>{audience.caseText}</p>
          </div>
        </div>

        <div className={style.audience__recommended}>
          <h4>Рекомендуемые опции конфигуратора</h4>
          <div className={style.audience__recommendedList}>
            {audience.recommendedOptions.map((key) => (
              <label key={key} className={style.audience__recommendedItem}>
                <input
                  type="checkbox"
                  checked={config.options[key]}
                  onChange={() => toggleOption(key)}
                />
                <span>{optionLabel(key)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={style.section__cta}>
          <Button onClick={openWizard}>Подключить платформу</Button>
          <Button variant="secondary" onClick={onConsultation}>Получить консультацию</Button>
        </div>
      </div>
    </section>
  )
}
