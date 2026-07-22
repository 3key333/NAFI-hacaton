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
            <div className={style.cases__content}>
              <a href={item.src} target="_blank" rel="noreferrer">
                {item.org}
              </a>
              <p>{item.count}</p>
              <ul>
                {item.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <strong>{item.result}</strong>
            </div>
            <div
              className={`${style.cases__logo} ${item.logo.includes('SECH') ? style['cases__logo--large'] : ''}`}
            >
              <img src={item.logo} alt={item.org} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
