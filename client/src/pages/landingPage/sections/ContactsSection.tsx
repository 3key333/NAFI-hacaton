import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { createEmptyConnectionForm } from '@/config/connectionConfig'
import { Button } from '@/components/ui/Button'
import { validateContactForm } from '@/helpers/validateForm'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { ConnectionForm } from '@/types'
import style from '@/pages/landingPage/landingPage.module.scss'

export const ContactsSection = () => {
  const [form, setForm] = useState<ConnectionForm>(createEmptyConnectionForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSubmitTimer = useCallback(() => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current)
      submitTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearSubmitTimer(), [clearSubmitTimer])

  const setField = (field: keyof ConnectionForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validation = validateContactForm(form)
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

  const handleReset = () => {
    clearSubmitTimer()
    setForm(createEmptyConnectionForm())
    setErrors({})
    setSuccess(false)
    setLoading(false)
  }

  return (
    <section id="contacts" className={`section section--alt ${style.contacts}`}>
      <div className="container">
        <SectionTitle title="Контакты" subtitle="Оператор проекта — Аналитический центр НАФИ" />
        <div className={style.contacts__grid}>
          <div className={style.contacts__info}>
            <p>Россия, г. Москва, ул. 1-я Брестская, д. 29</p>
            <p>+7 (495) 152-08-87</p>
            <p>welcome@it-gramota.ru</p>
          </div>

          {success ? (
            <div className={style.contacts__success}>
              <h3>Сообщение отправлено</h3>
              <p>Мы свяжемся с вами в ближайшее время.</p>
              <Button onClick={handleReset}>Написать ещё</Button>
            </div>
          ) : (
            <form className={style.contacts__form} onSubmit={handleSubmit} noValidate>
              <div className={style.contacts__row}>
                <div className={style.contacts__field}>
                  <input
                    placeholder="Имя *"
                    value={form.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                    className={errors.firstName ? style['contacts__input--error'] : ''}
                  />
                  {errors.firstName && <span className={style.contacts__error}>{errors.firstName}</span>}
                </div>
                <div className={style.contacts__field}>
                  <input
                    placeholder="Фамилия *"
                    value={form.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                    className={errors.lastName ? style['contacts__input--error'] : ''}
                  />
                  {errors.lastName && <span className={style.contacts__error}>{errors.lastName}</span>}
                </div>
              </div>
              <div className={style.contacts__field}>
                <input
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className={errors.email ? style['contacts__input--error'] : ''}
                />
                {errors.email && <span className={style.contacts__error}>{errors.email}</span>}
              </div>
              <textarea
                placeholder="Сообщение"
                rows={3}
                value={form.comment}
                onChange={(e) => setField('comment', e.target.value)}
              />
              <label className={style.contacts__consent}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setField('consent', e.target.checked)}
                />
                <span>Согласие на обработку ПДн *</span>
              </label>
              {errors.consent && <span className={style.contacts__error}>{errors.consent}</span>}
              <Button type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Написать нам'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
