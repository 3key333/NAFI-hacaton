import { TRUST_LOGOS, TRUST_STATS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const TrustSection = () => (
  <section className={`section section--alt ${style.trust}`}>
    <div className="container">
      <SectionTitle title="Нам доверяют" subtitle="Крупные компании и государственные организации" />
      <div className={style.trust__logos}>
        {TRUST_LOGOS.map((logo) => (
          <span key={logo} className={style.trust__logo}>{logo}</span>
        ))}
      </div>
      <div className={style.trust__stats}>
        {TRUST_STATS.map((stat) => (
          <div key={stat.label} className={style.trust__stat}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)
