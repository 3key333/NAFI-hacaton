import { useConnection } from '@/redux/hooks/useConnection'
import { Button } from '@/components/ui/Button'
import style from '@/pages/landingPage/landingPage.module.scss'

interface CtaBannerSectionProps {
  onConsultation: () => void
}

export const CtaBannerSection = ({ onConsultation }: CtaBannerSectionProps) => {
  const { openWizard } = useConnection()

  return (
    <section className={`section ${style.ctaBanner}`}>
      <div className={`container ${style.ctaBanner__inner}`}>
        <h2>Готовы подключить платформу?</h2>
        <p>Готовое решение · Быстрый запуск · Понятный путь покупки</p>
        <div className={style.section__cta}>
          <Button onClick={openWizard}>Подключить платформу</Button>
          <Button variant="secondary" onClick={onConsultation}>Получить консультацию</Button>
        </div>
      </div>
    </section>
  )
}
