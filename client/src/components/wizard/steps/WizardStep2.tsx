import type { ConnectionConfig, PriceBreakdown } from '@/types'
import { formatPrice, getPriceTierLabel } from '@/helpers/priceCalculator'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep2Props {
  config: ConnectionConfig
  price: PriceBreakdown
}

export const WizardStep2 = ({ config, price }: WizardStep2Props) => (
  <div className={style.step}>
    <h3>Шаг 2 — Стоимость и условия</h3>
    <div className={style.priceBreakdown}>
      <div className={style.priceRow}>
        <span>
          Доступ к платформе ({getPriceTierLabel(config.count)} × {formatPrice(price.pricePerUser)})
        </span>
        <span>{formatPrice(price.licenseTotal)}</span>
      </div>
      {price.options.map((opt) => (
        <div key={opt.id} className={style.priceRow}>
          <span>{opt.label}</span>
          <span>{formatPrice(opt.price)}</span>
        </div>
      ))}
      <div className={`${style.priceRow} ${style['priceRow--total']}`}>
        <span>Итого (ориентировочно, без НДС)</span>
        <strong>{formatPrice(price.total)}</strong>
      </div>
    </div>
    <p className={style.conditions}>
      Тариф за пользователя — по презентации НАФИ. Доп. опции и менеджмент проекта обсуждаются индивидуально.
      Подключение — моментальное. Полное внедрение — 1–2 рабочих дня.
    </p>
  </div>
)
