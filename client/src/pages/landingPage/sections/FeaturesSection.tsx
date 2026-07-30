import { PLATFORM_FEATURES } from '@/data/landingData'
import { fixHangingParticles } from '@/helpers/typograph'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { DashboardPreview } from '@/pages/dashboardPreview/DashboardPreview'
import style from '@/pages/landingPage/landingPage.module.scss'

export const FeaturesSection = () => {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle title="Возможности платформы" />
        <div className={style.features__grid}>
          {PLATFORM_FEATURES.map((item) => (
            <div key={item.title} className={style.features__card}>
              <h3>{item.title}</h3>
              <p>{fixHangingParticles(item.text)}</p>
            </div>
          ))}
        </div>

        <div className={style.features__mockLk}>
          <h3>Панель управления и аналитики</h3>
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
