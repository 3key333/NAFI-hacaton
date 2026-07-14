import { useState } from 'react'
import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import { ConsultationModal } from '@/components/modal/ConsultationModal'
import { StickyMobileCta } from '@/components/stickyBar/StickyMobileCta'
import { LandingPage } from '@/pages/landingPage/LandingPage'
import style from './layout.module.scss'

export const Layout = () => {
  const [consultationOpen, setConsultationOpen] = useState(false)

  return (
    <div className={style.layout}>
      <Header onConsultation={() => setConsultationOpen(true)} />
      <main className={style.layout__main}>
        <LandingPage onConsultation={() => setConsultationOpen(true)} />
      </main>
      <Footer />
      <StickyMobileCta />
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  )
}
