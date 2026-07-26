import { useState, type ReactNode } from 'react'
import { FAQ_ITEMS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

interface FaqSectionProps {
  onConsultation: () => void
}

const CONSULTATION_LINK_LABEL = 'Получить консультацию'

const renderAnswer = (text: string, onConsultation: () => void): ReactNode => {
  const index = text.indexOf(CONSULTATION_LINK_LABEL)
  if (index === -1) return text

  const before = text.slice(0, index)
  const after = text.slice(index + CONSULTATION_LINK_LABEL.length)

  return (
    <>
      {before}
      <button type="button" className={style.faq__link} onClick={onConsultation}>
        {CONSULTATION_LINK_LABEL}
      </button>
      {after}
    </>
  )
}

export const FaqSection = ({ onConsultation }: FaqSectionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section id="faq" className={`section section--alt ${style.faq}`}>
      <div className="container">
        <SectionTitle title="Вопросы и ответы" />
        <div className={style.faq__list}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className={style.faq__item}>
              <button className={style.faq__question} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {item.q}
                <span>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p className={style.faq__answer}>{renderAnswer(item.a, onConsultation)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
