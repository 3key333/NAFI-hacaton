import { useState } from 'react'
import {
  getPaymentMethodsForPayer,
  PAYER_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/config/connectionConfig'
import type { PayerType, PaymentMethod, PriceBreakdown } from '@/types'
import { formatPrice } from '@/helpers/priceCalculator'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep4Props {
  payerType: PayerType
  paymentMethod: PaymentMethod
  price: PriceBreakdown
  onPayerTypeChange: (type: PayerType) => void
  onPaymentMethodChange: (method: PaymentMethod) => void
}

export const WizardStep4 = ({
  payerType,
  paymentMethod,
  price,
  onPayerTypeChange,
  onPaymentMethodChange,
}: WizardStep4Props) => {
  const [isPayerOpen, setIsPayerOpen] = useState(false)
  const allowedMethods = getPaymentMethodsForPayer(payerType)
  const availableOptions = PAYMENT_METHOD_OPTIONS.filter((item) => allowedMethods.includes(item.id))

  return (
    <div className={style.step}>
      <h3>Шаг 4 — Оплата</h3>
      <div className={style.paymentTotal}>
        <span>К оплате</span>
        <strong>{formatPrice(price.total)}</strong>
      </div>

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

      <p className={style.paymentHint}>
        {payerType === 'individual'
          ? 'Для физлиц доступна оплата банковской картой'
          : 'Для ИП и юрлиц доступен счёт на оплату'}
      </p>
      <div className={style.payerOptions}>
        {availableOptions.map((item) => (
          <label
            key={item.id}
            className={`${style.payerOption} ${paymentMethod === item.id ? style['payerOption--active'] : ''}`}
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === item.id}
              onChange={() => onPaymentMethodChange(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
      {paymentMethod === 'card' && (
        <div className={style.cardMock}>
          <input placeholder="Номер карты" readOnly aria-label="Номер карты (mock)" />
          <div className={style.cardRow}>
            <input placeholder="MM/YY" readOnly aria-label="Срок действия (mock)" />
            <input placeholder="CVC" readOnly aria-label="CVC (mock)" />
          </div>
        </div>
      )}
    </div>
  )
}
