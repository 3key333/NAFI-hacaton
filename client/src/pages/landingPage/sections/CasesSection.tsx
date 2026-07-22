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
              <a href={item.src} target="_blank" rel="noreferrer" className={style.cases__title}>
                {item.org}
              </a>

              <div className={style.cases__company}>
                <div
                  className={`${style.cases__logo} ${style['cases__logo--mobile']} ${item.logo.includes('SECH') ? style['cases__logo--large'] : ''}`}
                >
                  <img src={item.logo} alt={item.org} loading="lazy" />
                </div>
                <p className={style.cases__about}>{item.about}</p>
              </div>

              <p className={style.cases__count}>{item.count}</p>
              <ul className={style.cases__tasks}>
                {item.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <strong className={style.cases__result}>{item.result}</strong>
            </div>

            <div
              className={`${style.cases__logo} ${style['cases__logo--desktop']} ${item.logo.includes('SECH') ? style['cases__logo--large'] : ''}`}
            >
              <img src={item.logo} alt={item.org} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
