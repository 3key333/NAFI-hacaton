import { useEffect, useRef, useState, type TransitionEvent } from 'react'
import { TRUST_LOGOS, TRUST_STATS } from '@/data/landingData'
import { SectionTitle } from '@/components/ui/SectionTitle'
import style from '@/pages/landingPage/landingPage.module.scss'

const SLIDE_INTERVAL_MS = 3000
const REAL_COUNT = TRUST_LOGOS.length
const CLONE_FIRST_INDEX = 0
const FIRST_REAL_INDEX = 1
const LAST_REAL_INDEX = REAL_COUNT
const CLONE_LAST_INDEX = REAL_COUNT + 1

/** [clone last, ...real, clone first] — для бесшовного цикла */
const LOOP_SLIDES = [
  TRUST_LOGOS[REAL_COUNT - 1],
  ...TRUST_LOGOS,
  TRUST_LOGOS[0],
]

export const TrustSection = () => {
  const [index, setIndex] = useState(FIRST_REAL_INDEX)
  const [withTransition, setWithTransition] = useState(true)
  const [autoKey, setAutoKey] = useState(0)

  const indexRef = useRef(index)
  const jumpingRef = useRef(false)
  const animatingRef = useRef(false)

  indexRef.current = index

  useEffect(() => {
    const id = window.setInterval(() => {
      if (jumpingRef.current || animatingRef.current) return

      animatingRef.current = true
      setWithTransition(true)
      setIndex((prev) => Math.min(prev + 1, CLONE_LAST_INDEX))
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [autoKey])

  const finishJump = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setWithTransition(true)
        jumpingRef.current = false
        animatingRef.current = false
      })
    })
  }

  const jumpToReal = (realIndex: number) => {
    jumpingRef.current = true
    animatingRef.current = true
    setWithTransition(false)
    setIndex(realIndex)
    finishJump()
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'transform') return
    if (jumpingRef.current) return

    const current = indexRef.current

    if (current === CLONE_LAST_INDEX) {
      jumpToReal(FIRST_REAL_INDEX)
      return
    }

    if (current === CLONE_FIRST_INDEX) {
      jumpToReal(LAST_REAL_INDEX)
      return
    }

    animatingRef.current = false
  }

  const restartAuto = () => setAutoKey((key) => key + 1)

  const goTo = (dotIndex: number) => {
    if (jumpingRef.current) return

    const next = dotIndex + FIRST_REAL_INDEX
    if (next === indexRef.current) {
      restartAuto()
      return
    }

    animatingRef.current = true
    setWithTransition(true)
    setIndex(next)
    restartAuto()
  }

  const goPrev = () => {
    if (jumpingRef.current || animatingRef.current) return

    animatingRef.current = true
    setWithTransition(true)
    setIndex((prev) => Math.max(prev - 1, CLONE_FIRST_INDEX))
    restartAuto()
  }

  const goNext = () => {
    if (jumpingRef.current || animatingRef.current) return

    animatingRef.current = true
    setWithTransition(true)
    setIndex((prev) => Math.min(prev + 1, CLONE_LAST_INDEX))
    restartAuto()
  }

  const realIndex = (index - FIRST_REAL_INDEX + REAL_COUNT) % REAL_COUNT

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
                style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {LOOP_SLIDES.map((logo, slideIndex) => (
                  <div key={`${logo.name}-${slideIndex}`} className={style.trust__slide}>
                    <div
                      className={`${style.trust__logo} ${logo.large ? style['trust__logo--large'] : ''}`}
                    >
                      {logo.src ? (
                        <img src={logo.src} alt={logo.name} decoding="async" draggable={false} />
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
