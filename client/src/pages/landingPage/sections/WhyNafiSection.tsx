import { WHY_NAFI } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const WhyNafiSection = () => (
  <section className="section">
    <div className="container">
      <SectionTitle title="Почему выбирают нас" />
      <div className={style.why__grid}>
        {WHY_NAFI.map((item) => (
          <div key={item.title} className={style.why__card}>

            <div className={style.why__card_text}>
              <h3>{item.title}</h3>
            </div>

            <div className={style.why__card_image}>
              <p>{item.text}</p>
              <img src={item.src} alt="" />
            </div>

          </div>
        ))}
      </div>
    </div>
  </section>
)
