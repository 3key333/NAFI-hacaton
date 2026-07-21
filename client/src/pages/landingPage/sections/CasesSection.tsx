import { CASES } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const CasesSection = () => (
  <section id="cases" className="section">
    <div className="container">
      <SectionTitle title="Наши кейсы" />
      <div className={style.cases__grid}>
        {CASES.map((item) => (
          <div key={item.org} className={style.cases__card}>
            <a href={`${item.src}`} target='_blank'>{item.org}</a>
            <p>{item.count}</p>
            <ul>
              {item.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
            <strong>{item.result}</strong>
          </div>
        ))}
      </div>
    </div>
  </section>
)
