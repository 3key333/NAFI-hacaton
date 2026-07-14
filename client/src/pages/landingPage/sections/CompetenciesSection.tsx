import { COMPETENCIES } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const CompetenciesSection = () => (
  <section className={`section section--alt ${style.competencies}`}>
    <div className="container">
      <SectionTitle title="5 сфер компетенций" subtitle="Наведите на карточку — увидите, что попадёт в отчёт" />
      <div className={style.competencies__grid}>
        {COMPETENCIES.map((item) => (
          <div key={item.title} className={style.competencies__card}>
            <div className={style.competencies__front}>
              <h3>{item.title}</h3>
              <ul>{item.skills.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className={style.competencies__back}>
              <h3>В отчёте и обучении</h3>
              <p>{item.report}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
