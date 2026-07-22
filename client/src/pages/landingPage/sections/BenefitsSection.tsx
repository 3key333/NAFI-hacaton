import { BENEFITS } from '@/data/landingData'
import { useConnection } from '@/redux/hooks/useConnection'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const BenefitsSection = () => {
  const { openWizard } = useConnection()

  return (
    <section id="benefits" className="section">
      <div className="container">
        <SectionTitle title="Что вы получаете" subtitle="Готовое платформенное решение с быстрым внедрением" />
        <div className={style.benefits__grid}>
          {BENEFITS.map((item) => (
            <div key={item.title} className={style.benefits__card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={style.section__cta}>
          <Button onClick={openWizard}>Подключить платформу</Button>
        </div>
      </div>
    </section>
  )
}
