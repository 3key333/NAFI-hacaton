import { WIZARD_STEPS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const StepsSection = () => {
  return (
    <section id="steps" className={`section section--alt ${style.steps}`}>
      <div className="container">
        <SectionTitle title="Этапы подключения" subtitle="Понятный путь от выбора параметров до запуска платформы" />
        <div className={style.steps__list}>
          {WIZARD_STEPS.map((step, i) => (
            <div key={step} className={style.steps__group}>
              {i > 0 && (
                <img
                  src="/arrow-narrow-right-svgrepo-com.svg"
                  alt=""
                  className={style.steps__arrow}
                  aria-hidden="true"
                />
              )}
              <div className={style.steps__item}>
                <span className={style.steps__num}>{i + 1}</span>
                <span>{step}</span>
              </div>
            </div>
          ))}
        </div>
        <p className={style.steps__note}>Подключение — моментальное · Внедрение — за 1–2 дня</p>
      </div>
    </section>
  )
}
