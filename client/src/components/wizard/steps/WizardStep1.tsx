import { useState } from 'react'
import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel'
import { formatPrice, formatUsersCountLabel } from '@/helpers/priceCalculator'
import type { ConnectionConfig, PriceBreakdown } from '@/types'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep1Props {
  config: ConnectionConfig
  price: PriceBreakdown
}

export const WizardStep1 = ({ config, price }: WizardStep1Props) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)

  return (
    <div className={style.step}>
      <h3>Шаг 1 — Параметры и стоимость</h3>
      <ConfiguratorPanel showBase />
      <div className={style.stepCost}>
        <button
          type="button"
          className={style.priceBreakdownToggle}
          onClick={() => setIsBreakdownOpen((open) => !open)}
          aria-expanded={isBreakdownOpen}
        >
          <span className={style.priceBreakdownToggle__title}>Детализация стоимости</span>
          <img
            src={isBreakdownOpen ? '/top-arrow-svgrepo-com.svg' : '/bottom-arrow-svgrepo-com.svg'}
            alt=""
            className={style.priceBreakdownToggle__arrow}
            aria-hidden="true"
          />
        </button>

        {isBreakdownOpen && (
          <div className={style.priceBreakdown}>
            <div className={style.priceRow}>
              <span>
                Доступ к платформе ({formatUsersCountLabel(config.count)} × {formatPrice(price.pricePerUser)})
              </span>
              <span>{formatPrice(price.licenseTotal)}</span>
            </div>
            {price.options.map((opt) => (
              <div key={opt.id} className={style.priceRow}>
                <span>{opt.label}</span>
                <span>{formatPrice(opt.price)}</span>
              </div>
            ))}
            <div className={style.priceRow}>
              <span>НДС, 5%</span>
              <span>{formatPrice(price.vatAmount)}</span>
            </div>
            <div className={`${style.priceRow} ${style['priceRow--total']}`}>
              <span>Итого · с НДС</span>
              <strong>{formatPrice(price.total)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
