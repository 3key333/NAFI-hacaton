import { useState } from 'react'
import { COMPETENCIES } from '@/data/landingData'
import { SampleTestModal } from '@/components/modal/SampleTestModal'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const CompetenciesSection = () => {
  const [sampleOpen, setSampleOpen] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  const showReport = (title: string) => {
    setFlippedCards((prev) => new Set(prev).add(title))
  }

  const hideReport = (title: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev)
      next.delete(title)
      return next
    })
  }

  return (
    <section className={`section section--alt ${style.competencies}`}>
      <div className="container">
        <SectionTitle
          title="5 сфер компетенций"
          subtitle="Нажмите «Посмотреть отчёт» — увидите, что попадёт в отчёт"
        />
        <div className={style.competencies__grid}>
          {COMPETENCIES.map((item) => {
            const isFlipped = flippedCards.has(item.title)

            return (
            <div
              key={item.title}
              className={`${style.competencies__card} ${isFlipped ? style['competencies__card--flipped'] : ''}`}
            >
              <div className={style.competencies__front}>
                <div className={style.competencies__iconWrap}>
                  <img
                    src={item.icon}
                    alt=""
                    className={style.competencies__icon}
                    aria-hidden="true"
                  />
                </div>
                <div className={style.competencies__frontText}>
                  <h3>{item.title}</h3>
                  <ul>{item.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
                <button
                  type="button"
                  className={style.competencies__reportBtn}
                  onClick={() => showReport(item.title)}
                >
                  Посмотреть отчёт
                </button>
              </div>
              <div className={style.competencies__back}>
                <div className={style.competencies__iconWrap}>
                  <img
                    src={item.icon}
                    alt=""
                    className={style.competencies__icon}
                    aria-hidden="true"
                  />
                </div>
                <div className={style.competencies__frontText}>
                  <h3>В отчёте и обучении</h3>
                  <ul>
                    {item.report.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className={style.competencies__backBtn}
                  onClick={() => hideReport(item.title)}
                >
                  Назад
                </button>
              </div>
            </div>
            )
          })}
        </div>

        <div className={style.competencies__cta}>
          <Button variant="secondary" onClick={() => setSampleOpen(true)}>
            Посмотреть примеры вопросов
          </Button>
        </div>
      </div>

      <SampleTestModal isOpen={sampleOpen} onClose={() => setSampleOpen(false)} />
    </section>
  )
}
