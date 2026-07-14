import { useState } from 'react'
import { AUDIENCE_LABELS, CONNECTION_OPTIONS, MAX_USER_COUNT, MIN_USER_COUNT } from '@/config/connectionConfig'
import { BASE_FEATURES } from '@/data/landingData'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
import { useConnection } from '@/redux/hooks/useConnection'
import style from './configuratorPanel.module.scss'

interface ConfiguratorPanelProps {
  compact?: boolean
  showBase?: boolean
}

const clampCount = (value: number) => Math.min(MAX_USER_COUNT, Math.max(MIN_USER_COUNT, value))

const getDisplayCount = (countInput: string, configCount: number) => {
  const parsed = Number(countInput)
  if (countInput && !Number.isNaN(parsed) && parsed >= MIN_USER_COUNT) {
    return clampCount(parsed)
  }
  return configCount
}

export const ConfiguratorPanel = ({ compact = false, showBase = false }: ConfiguratorPanelProps) => {
  const { config, setCount, setAudience, toggleOption } = useConnection()
  const [countInput, setCountInput] = useState(String(config.count))
  const [isCountFocused, setIsCountFocused] = useState(false)

  const displayValue = isCountFocused ? countInput : String(config.count)
  const displayCount = getDisplayCount(isCountFocused ? countInput : String(config.count), config.count)
  const price = calculatePrice({ ...config, count: displayCount })

  const handleCountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '')
    setCountInput(digitsOnly)

    if (!digitsOnly) return

    const parsed = Number(digitsOnly)
    if (!Number.isNaN(parsed) && parsed >= MIN_USER_COUNT) {
      setCount(clampCount(parsed))
    }
  }

  const handleCountFocus = () => {
    setCountInput(String(config.count))
    setIsCountFocused(true)
  }

  const handleCountBlur = () => {
    const parsed = Number(countInput)

    if (!countInput || Number.isNaN(parsed) || parsed < MIN_USER_COUNT) {
      setCount(MIN_USER_COUNT)
      setCountInput(String(MIN_USER_COUNT))
    } else {
      const clamped = clampCount(parsed)
      setCount(clamped)
      setCountInput(String(clamped))
    }

    setIsCountFocused(false)
  }

  return (
    <div className={`${style.panel} ${compact ? style['panel--compact'] : ''}`}>
      <div className={style.panel__field}>
        <label>Количество тестируемых</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder={`от ${MIN_USER_COUNT}`}
          value={displayValue}
          onChange={(e) => handleCountChange(e.target.value)}
          onFocus={handleCountFocus}
          onBlur={handleCountBlur}
          className={style.panel__countInput}
        />
      </div>

      <div className={style.panel__field}>
        <label>Тип организации</label>
        <select value={config.audience} onChange={(e) => setAudience(e.target.value as typeof config.audience)}>
          {Object.entries(AUDIENCE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {!compact && (
        <div className={style.panel__options}>
          <p className={style.panel__optionsTitle}>Дополнительные опции</p>
          {CONNECTION_OPTIONS.map((opt) => (
            <label key={opt.key} className={style.panel__checkbox}>
              <input
                type="checkbox"
                checked={config.options[opt.key]}
                onChange={() => toggleOption(opt.key)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {showBase && (
        <div className={style.panel__base}>
          <p>Базовый функционал (включён):</p>
          <ul>
            {BASE_FEATURES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={style.panel__price}>
        <span>Ориентировочная стоимость</span>
        <strong>{formatPrice(price.total)}</strong>
        <p>{displayCount} × {formatPrice(price.pricePerUser)} · без НДС</p>
      </div>
    </div>
  )
}
