import type { ConnectionConfig, PriceBreakdown } from '@/types'
import { formatPrice } from '@/helpers/priceCalculator'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep3Props {
  config: ConnectionConfig
  price: PriceBreakdown
  company: string
  contractAccepted: boolean
  errors: Record<string, string>
  onContractChange: (accepted: boolean) => void
}

export const WizardStep3 = ({
  config,
  price,
  company,
  contractAccepted,
  errors,
  onContractChange,
}: WizardStep3Props) => {
  const licensee = company.trim() || '________________'

  return (
    <div className={style.step}>
      <h3>Шаг 3 — Лицензионный договор</h3>
      <div className={style.contract}>
        <p><strong>ЛИЦЕНЗИОННЫЙ ДОГОВОР (mock)</strong></p>
        <p>
          Настоящий договор заключается между ООО «НАФИ» (Лицензиар) и {licensee} (Лицензиат) на
          предоставление неисключительной лицензии на использование платформы «Цифровой гражданин».
        </p>
        <p>
          1. Предмет договора — доступ к платформе для оценки цифровых компетенций в количестве{' '}
          {config.count} пользователей.
        </p>
        <p>2. Срок действия лицензии — 12 месяцев с момента оплаты.</p>
        <p>3. Стоимость лицензии — {formatPrice(price.total)} (с учётом НДС).</p>
        <p>4. Лицензиат обязуется использовать платформу в соответствии с пользовательским соглашением.</p>
        <p>5. Обработка персональных данных осуществляется в соответствии с ФЗ-152.</p>
      </div>
      <label className={style.checkbox}>
        <input
          type="checkbox"
          checked={contractAccepted}
          onChange={(e) => onContractChange(e.target.checked)}
        />
        <span>Ознакомлен и принимаю условия договора</span>
      </label>
      {errors.contract && <span className={style.errorText}>{errors.contract}</span>}
    </div>
  )
}
