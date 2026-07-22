import { useState } from 'react'
import { COMPANY_PLACEHOLDERS, PAYER_TYPE_OPTIONS } from '@/config/connectionConfig'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { sanitizeNameInput } from '@/helpers/phoneFormat'
import type { ConnectionForm, PayerType } from '@/types'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep2Props {
  payerType: PayerType
  form: ConnectionForm
  errors: Record<string, string>
  onPayerTypeChange: (type: PayerType) => void
  onUpdateField: (field: keyof ConnectionForm, value: string | boolean) => void
  onSetField: (field: keyof ConnectionForm, value: string | boolean) => void
}

export const WizardStep2 = ({
  payerType,
  form,
  errors,
  onPayerTypeChange,
  onUpdateField,
  onSetField,
}: WizardStep2Props) => {
  const [isPayerOpen, setIsPayerOpen] = useState(false)

  return (
    <div className={style.step}>
      <h3>Шаг 2 — Плательщик и данные</h3>

      <div className={style.formField}>
        <label>Тип плательщика</label>
        <select
          value={payerType}
          className={isPayerOpen ? style['formField__select--open'] : undefined}
          onClick={() => setIsPayerOpen((open) => !open)}
          onBlur={() => setIsPayerOpen(false)}
          onChange={(e) => {
            onPayerTypeChange(e.target.value as PayerType)
            setIsPayerOpen(false)
          }}
        >
          {PAYER_TYPE_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className={style.stepSectionTitle}>Контактные данные</p>
      <div className={style.formGrid}>
        <div className={style.formField}>
          <label>Имя *</label>
          <input
            value={form.firstName}
            onChange={(e) => onUpdateField('firstName', sanitizeNameInput(e.target.value))}
            className={errors.firstName ? style.error : ''}
            autoComplete="given-name"
          />
          {errors.firstName && <span className={style.errorText}>{errors.firstName}</span>}
        </div>
        <div className={style.formField}>
          <label>Фамилия *</label>
          <input
            value={form.lastName}
            onChange={(e) => onUpdateField('lastName', sanitizeNameInput(e.target.value))}
            className={errors.lastName ? style.error : ''}
            autoComplete="family-name"
          />
          {errors.lastName && <span className={style.errorText}>{errors.lastName}</span>}
        </div>
        <div className={style.formField}>
          <label>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            className={errors.email ? style.error : ''}
            autoComplete="email"
          />
          {errors.email && <span className={style.errorText}>{errors.email}</span>}
        </div>
        <div className={style.formField}>
          <label>Компания</label>
          <input
            value={form.company}
            onChange={(e) => onSetField('company', e.target.value)}
            placeholder={COMPANY_PLACEHOLDERS[payerType]}
          />
        </div>
        <div className={`${style.formField} ${style.formFieldFull}`}>
          <label>Телефон *</label>
          <PhoneInput
            value={form.phone}
            onChange={(value) => onUpdateField('phone', value)}
            error={Boolean(errors.phone)}
          />
          {errors.phone && <span className={style.errorText}>{errors.phone}</span>}
        </div>
        <div className={`${style.formField} ${style.formFieldFull}`}>
          <label>Комментарий</label>
          <textarea rows={3} value={form.comment} onChange={(e) => onSetField('comment', e.target.value)} />
        </div>
      </div>
      <label className={style.checkbox}>
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => onUpdateField('consent', e.target.checked)}
        />
        <span>Согласие на обработку персональных данных *</span>
      </label>
      {errors.consent && <span className={style.errorText}>{errors.consent}</span>}
    </div>
  )
}
