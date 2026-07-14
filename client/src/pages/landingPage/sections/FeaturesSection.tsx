import { useState } from 'react'
import { INTEGRATIONS, MOCK_LK_TABS, PLATFORM_FEATURES } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(MOCK_LK_TABS[0].id)
  const activeContent = MOCK_LK_TABS.find((tab) => tab.id === activeTab) ?? MOCK_LK_TABS[0]

  return (
    <section className="section">
      <div className="container">
        <SectionTitle title="Возможности платформы" />
        <div className={style.features__grid}>
          {PLATFORM_FEATURES.map((item) => (
            <div key={item.title} className={style.features__card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className={style.features__mockLk}>
          <h3>Mock личного кабинета администратора</h3>
          <div className={style.features__mockTabs} role="tablist" aria-label="Вкладки личного кабинета">
            {MOCK_LK_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`${style.features__mockTab} ${activeTab === tab.id ? style['features__mockTab--active'] : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={style.features__mockPanel} role="tabpanel">
            <p>{activeContent.content}</p>
            <div className={style.features__mockBars}>
              <span style={{ height: '55%' }} />
              <span style={{ height: '80%' }} />
              <span style={{ height: '40%' }} />
              <span style={{ height: '68%' }} />
            </div>
          </div>
        </div>

        <div className={style.features__integrations}>
          {INTEGRATIONS.map((item) => (
            <span key={item} className={style.features__chip}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
