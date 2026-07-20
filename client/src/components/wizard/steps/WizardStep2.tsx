import { AUDIENCE_OPTIONS, PAYER_TYPE_OPTIONS } from '@/config/connectionConfig'
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
}: WizardStep2Props) => (
  <div className={style.step}>
    <h3>Шаг 2 — Плательщик и данные</h3>

    <p className={style.stepSectionTitle}>Тип плательщика</p>
    <div className={style.payerOptions}>
      {PAYER_TYPE_OPTIONS.map((item) => (
        <label
          key={item.id}
          className={`${style.payerOption} ${payerType === item.id ? style['payerOption--active'] : ''}`}
        >
          <input
            type="radio"
            name="payer"
            checked={payerType === item.id}
            onChange={() => onPayerTypeChange(item.id)}
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>

    <p className={style.stepSectionTitle}>Контактные данные</p>
    <div className={style.formGrid}>
      <div className={style.formField}>
        <label>Имя *</label>
        <input
          value={form.firstName}
          onChange={(e) => onUpdateField('firstName', e.target.value)}
          className={errors.firstName ? style.error : ''}
        />
        {errors.firstName && <span className={style.errorText}>{errors.firstName}</span>}
      </div>
      <div className={style.formField}>
        <label>Фамилия *</label>
        <input
          value={form.lastName}
          onChange={(e) => onUpdateField('lastName', e.target.value)}
          className={errors.lastName ? style.error : ''}
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
        />
        {errors.email && <span className={style.errorText}>{errors.email}</span>}
      </div>
      <div className={style.formField}>
        <label>Компания</label>
        <input value={form.company} onChange={(e) => onSetField('company', e.target.value)} />
      </div>
      <div className={style.formField}>
        <label>Телефон</label>
        <input value={form.phone} onChange={(e) => onSetField('phone', e.target.value)} />
      </div>
      <div className={style.formField}>
        <label>Тип организации</label>
        <select value={form.orgType} onChange={(e) => onSetField('orgType', e.target.value)}>
          <option value="">Выберите</option>
          {AUDIENCE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
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
