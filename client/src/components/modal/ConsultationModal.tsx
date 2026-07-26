import { useCallback, useEffect, useRef, useState } from 'react'
import { createEmptyConnectionForm } from '@/config/connectionConfig'
import { Button } from '@/components/ui/Button'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { sanitizeNameInput } from '@/helpers/phoneFormat'
import { validateConnectionForm } from '@/helpers/validateForm'
import type { ConnectionForm } from '@/types'
import style from './consultationModal.module.scss'

const PERSONAL_DATA_CONSENT_URL = 'https://it-gramota.ru/personal-data-agreement'
const PERSONAL_DATA_POLICY_URL = 'https://it-gramota.ru/policy'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const [form, setForm] = useState<ConnectionForm>(createEmptyConnectionForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSubmitTimer = () => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current)
      submitTimerRef.current = null
    }
  }

  const handleClose = useCallback(() => {
    clearSubmitTimer()
    onClose()
    setForm(createEmptyConnectionForm())
    setErrors({})
    setSuccess(false)
    setLoading(false)
  }, [onClose])

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

  useEffect(() => () => clearSubmitTimer(), [])

  const setField = (field: keyof ConnectionForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateConnectionForm(form, { requireCompany: false })
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }

    setLoading(true)
    clearSubmitTimer()
    submitTimerRef.current = setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      submitTimerRef.current = null
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className={style.overlay} onClick={handleClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <button className={style.modal__close} onClick={handleClose} aria-label="Закрыть">×</button>

        {success ? (
          <div className={style.modal__success}>
            <h3>Заявка отправлена</h3>
            <p>Менеджер свяжется с вами в ближайшее время.</p>
            <Button onClick={handleClose}>Закрыть</Button>
          </div>
        ) : (
          <>
            <h3 className={style.modal__title}>Получить консультацию</h3>
            <p className={style.modal__subtitle}>Заполните форму — мы поможем подобрать решение</p>

            <form className={style.form} onSubmit={handleSubmit} noValidate>
              <div className={style.form__row}>
                <div className={style.form__field}>
                  <label>Имя *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setField('firstName', sanitizeNameInput(e.target.value))}
                    className={errors.firstName ? style['form__input--error'] : ''}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className={style.form__error}>{errors.firstName}</span>}
                </div>
                <div className={style.form__field}>
                  <label>Фамилия *</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setField('lastName', sanitizeNameInput(e.target.value))}
                    className={errors.lastName ? style['form__input--error'] : ''}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className={style.form__error}>{errors.lastName}</span>}
                </div>
              </div>

              <div className={style.form__field}>
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className={errors.email ? style['form__input--error'] : ''}
                  autoComplete="email"
                />
                {errors.email && <span className={style.form__error}>{errors.email}</span>}
              </div>

              <div className={style.form__field}>
                <label>Компания</label>
                <input
                  value={form.company}
                  onChange={(e) => setField('company', e.target.value)}
                  placeholder='ООО "Ромашка"'
                />
              </div>

              <div className={style.form__field}>
                <label>Телефон *</label>
                <PhoneInput
                  value={form.phone}
                  onChange={(value) => setField('phone', value)}
                  error={Boolean(errors.phone)}
                />
                {errors.phone && <span className={style.form__error}>{errors.phone}</span>}
              </div>

              <div className={style.form__field}>
                <label>Комментарий</label>
                <textarea rows={3} value={form.comment} onChange={(e) => setField('comment', e.target.value)} />
              </div>

              <label className={style.form__checkbox}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setField('consent', e.target.checked)}
                />
                <span>
                  Я даю{' '}
                  <a
                    href={PERSONAL_DATA_CONSENT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={style.form__consentLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    согласие
                  </a>{' '}
                  на обработку персональных данных, включая файлы cookie в соответствии с №152-ФЗ «О персональных данных» от
                  27.07.2006, на условиях и для целей, определенных в{' '}
                  <a
                    href={PERSONAL_DATA_POLICY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={style.form__consentLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Политике в отношении обработки персональных данных
                  </a>
                  .
                </span>
              </label>
              {errors.consent && <span className={style.form__error}>{errors.consent}</span>}

              <Button type="submit" disabled={loading}>{loading ? 'Отправка...' : 'Отправить'}</Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
