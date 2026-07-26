import { useEffect, useState } from 'react'
import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { ConsultationModal } from '@/components/modal/ConsultationModal'
import { StickyMobileCta } from '@/components/stickyBar/StickyMobileCta'
import { isPanelRoute } from '@/helpers/navigation'
import { DashboardPreviewPage } from '@/pages/dashboardPreview/DashboardPreviewPage'
import { LandingPage } from '@/pages/landingPage/LandingPage'
import style from './layout.module.scss'

export const Layout = () => {
  const [consultationOpen, setConsultationOpen] = useState(false)
  const [isPanel, setIsPanel] = useState(() => isPanelRoute())

  useEffect(() => {
    const syncRoute = () => {
      const panel = isPanelRoute()
      setIsPanel(panel)
      if (panel) {
        window.scrollTo(0, 0)
      }
    }

    syncRoute()
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  return (
    <div className={style.layout}>
      <Header onConsultation={() => setConsultationOpen(true)} />
      <main className={`${style.layout__main} ${isPanel ? style['layout__main--panel'] : ''}`}>
        {isPanel ? (
          <DashboardPreviewPage onConsultation={() => setConsultationOpen(true)} />
        ) : (
          <LandingPage onConsultation={() => setConsultationOpen(true)} />
        )}
      </main>
      <Footer />
      {!isPanel && <StickyMobileCta />}
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  )
}
