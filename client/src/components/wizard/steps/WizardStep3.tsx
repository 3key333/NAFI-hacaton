import { PAYER_TYPE_OPTIONS } from '@/config/connectionConfig'
import type { PayerType } from '@/types'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep3Props {
  payerType: PayerType
  onPayerTypeChange: (type: PayerType) => void
}

export const WizardStep3 = ({ payerType, onPayerTypeChange }: WizardStep3Props) => (
  <div className={style.step}>
    <h3>Шаг 3 — Тип плательщика</h3>
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
  </div>
)
