import { useEffect, useState } from 'react'
import {
  AUDIENCE_LABELS,
  CONNECTION_OPTIONS,
  COUNT_PRESETS,
  MAX_USER_COUNT,
  MIN_USER_COUNT,
} from '@/config/connectionConfig'
import { Button } from '@/components/ui/Button'
import { BASE_FEATURES } from '@/data/landingData'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
import { useConnection } from '@/redux/hooks/useConnection'
import style from './configuratorPanel.module.scss'

interface ConfiguratorPanelProps {
  compact?: boolean
  showBase?: boolean
}

const clampCount = (value: number) => Math.min(MAX_USER_COUNT, Math.max(MIN_USER_COUNT, value))

export const ConfiguratorPanel = ({ compact = false, showBase = false }: ConfiguratorPanelProps) => {
  const { config, setCount, setAudienceWithRecommendations, toggleOption, openWizard } = useConnection()
  const [countInput, setCountInput] = useState(String(config.count))
  const [isCountFocused, setIsCountFocused] = useState(false)
  const [isAudienceOpen, setIsAudienceOpen] = useState(false)
  const price = calculatePrice(config)

  useEffect(() => {
    if (!isCountFocused) {
      setCountInput(String(config.count))
    }
  }, [config.count, isCountFocused])

  const displayValue = isCountFocused ? countInput : String(config.count)

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

  const handlePresetClick = (preset: number) => {
    setCount(preset)
    setCountInput(String(preset))
    setIsCountFocused(false)
  }

  return (
    <div className={style.panel}>
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
        <p className={style.panel__countHint}>Выберите число или напишите свой вариант</p>
        <div className={style.panel__presets} role="group" aria-label="Быстрый выбор количества">
          {COUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`${style.panel__preset} ${config.count === preset ? style['panel__preset--active'] : ''}`}
              onClick={() => handlePresetClick(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className={style.panel__field}>
        <label>Тип организации</label>
        <select
          value={config.audience}
          className={isAudienceOpen ? style['panel__select--open'] : undefined}
          onClick={() => setIsAudienceOpen((open) => !open)}
          onBlur={() => setIsAudienceOpen(false)}
          onChange={(e) => {
            setAudienceWithRecommendations(e.target.value as typeof config.audience)
            setIsAudienceOpen(false)
          }}
        >
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

      {compact && (
        <>
          <div className={style.panel__total}>
            <span>Итого · без НДС</span>
            <strong>{formatPrice(price.total)}</strong>
          </div>
          <Button className={style.panel__cta} onClick={openWizard}>
            Рассчитать стоимость
          </Button>
        </>
      )}
    </div>
  )
}
