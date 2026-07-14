import { useState } from 'react'
import { FAQ_ITEMS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

export const FaqSection = () => {
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
              {openFaq === i && <p className={style.faq__answer}>{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
