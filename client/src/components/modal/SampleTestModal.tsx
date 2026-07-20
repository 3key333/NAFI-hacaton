import { useCallback, useEffect, useState } from 'react'
import { DEMO_QUESTIONS } from '@/data/landingData'
import { Button } from '@/components/ui/Button'
import { useConnection } from '@/redux/hooks/useConnection'
import style from './sampleTestModal.module.scss'

interface SampleTestModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SampleTestModal = ({ isOpen, onClose }: SampleTestModalProps) => {
  const { openWizard } = useConnection()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const reset = useCallback(() => {
    setStep(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const current = DEMO_QUESTIONS[step]
  const total = DEMO_QUESTIONS.length
  const answered = selected !== null

  const handleNext = () => {
    if (selected === null) return

    const nextCorrect = correctCount + (selected === current.correctIndex ? 1 : 0)
    setCorrectCount(nextCorrect)

    if (step + 1 >= total) {
      setFinished(true)
      return
    }

    setStep((prev) => prev + 1)
    setSelected(null)
  }

  const handleConnect = () => {
    handleClose()
    openWizard()
  }

  return (
    <div className={style.overlay} onClick={handleClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="sample-test-title">
        <div className={style.modal__header}>
          <span className={style.modal__demo}>демо</span>
          <button className={style.modal__close} onClick={handleClose} aria-label="Закрыть">×</button>
        </div>

        {finished ? (
          <div className={style.modal__result}>
            <h3 id="sample-test-title">Фрагмент теста пройден</h3>
            <p>
              Верных ответов: {correctCount} из {total}. Полный тест содержит 64 вопроса
              по пяти сферам цифровых компетенций.
            </p>
            <div className={`${style.modal__actions} ${style['modal__actions--center']}`}>
              <Button onClick={handleConnect}>Подключить платформу</Button>
              <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
            </div>
          </div>
        ) : (
          <div className={style.modal__body}>
            <p className={style.modal__badge}>
              {current.sphere} · {step + 1} из {total}
            </p>
            <h3 id="sample-test-title" className={style.modal__title}>{current.question}</h3>
            <p className={style.modal__subtitle}>Выберите один вариант ответа</p>

            <div className={style.modal__options} role="radiogroup" aria-label={current.question}>
              {current.options.map((option, index) => {
                const isSelected = selected === index
                const showCorrect = answered && index === current.correctIndex
                const showWrong = answered && isSelected && index !== current.correctIndex

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={[
                      style.modal__option,
                      isSelected ? style['modal__option--selected'] : '',
                      showCorrect ? style['modal__option--correct'] : '',
                      showWrong ? style['modal__option--wrong'] : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => !answered && setSelected(index)}
                    disabled={answered}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            <div className={style.modal__actions}>
              <Button onClick={handleNext} disabled={!answered}>
                {step + 1 >= total ? 'Завершить' : 'Далее'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
