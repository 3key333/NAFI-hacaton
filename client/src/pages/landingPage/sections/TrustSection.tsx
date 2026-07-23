import { useEffect, useState } from 'react'
import { TRUST_LOGOS, TRUST_STATS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

const SLIDE_INTERVAL_MS = 3000
const REAL_COUNT = TRUST_LOGOS.length

/** [clone last, ...real, clone first] — для бесшовного цикла */
const LOOP_SLIDES = [
  TRUST_LOGOS[REAL_COUNT - 1],
  ...TRUST_LOGOS,
  TRUST_LOGOS[0],
]

export const TrustSection = () => {
  const [index, setIndex] = useState(1)
  const [withTransition, setWithTransition] = useState(true)
  const [autoKey, setAutoKey] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setWithTransition(true)
      setIndex((prev) => prev + 1)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [autoKey])

  const handleTransitionEnd = () => {
    if (index === REAL_COUNT + 1) {
      setWithTransition(false)
      setIndex(1)
      return
    }

    if (index === 0) {
      setWithTransition(false)
      setIndex(REAL_COUNT)
    }
  }

  useEffect(() => {
    if (withTransition) return
    const id = window.requestAnimationFrame(() => setWithTransition(true))
    return () => window.cancelAnimationFrame(id)
  }, [withTransition, index])

  const realIndex = (index - 1 + REAL_COUNT) % REAL_COUNT

  const restartAuto = () => setAutoKey((key) => key + 1)

  const goTo = (dotIndex: number) => {
    setWithTransition(true)
    setIndex(dotIndex + 1)
    restartAuto()
  }

  const goPrev = () => {
    setWithTransition(true)
    setIndex((prev) => prev - 1)
    restartAuto()
  }

  const goNext = () => {
    setWithTransition(true)
    setIndex((prev) => prev + 1)
    restartAuto()
  }

  return (
    <section className={`section section--alt ${style.trust}`}>
      <div className="container">
        <SectionTitle title="Нам доверяют" subtitle="Крупные компании и государственные организации" />

        <div className={style.trust__slider}>
          <div className={style.trust__sliderRow}>
            <button
              type="button"
              className={`${style.trust__arrow} ${style['trust__arrow--prev']}`}
              onClick={goPrev}
              aria-label="Предыдущий логотип"
            >
              <img src="/bottom-arrow-svgrepo-com.svg" alt="" aria-hidden="true" />
            </button>

            <div className={style.trust__viewport}>
              <div
                className={`${style.trust__track} ${withTransition ? style['trust__track--animate'] : ''}`}
                style={{ transform: `translateX(-${index * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {LOOP_SLIDES.map((logo, slideIndex) => (
                  <div key={`${logo.name}-${slideIndex}`} className={style.trust__slide}>
                    <div
                      className={`${style.trust__logo} ${logo.large ? style['trust__logo--large'] : ''}`}
                    >
                      {logo.src ? (
                        <img src={logo.src} alt={logo.name} loading="lazy" />
                      ) : (
                        <span>{logo.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`${style.trust__arrow} ${style['trust__arrow--next']}`}
              onClick={goNext}
              aria-label="Следующий логотип"
            >
              <img src="/bottom-arrow-svgrepo-com.svg" alt="" aria-hidden="true" />
            </button>
          </div>

          <div className={style.trust__dots} role="tablist" aria-label="Логотипы компаний">
            {TRUST_LOGOS.map((logo, dotIndex) => (
              <button
                key={logo.name}
                type="button"
                role="tab"
                aria-selected={realIndex === dotIndex}
                aria-label={logo.name}
                className={`${style.trust__dot} ${realIndex === dotIndex ? style['trust__dot--active'] : ''}`}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
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
}
