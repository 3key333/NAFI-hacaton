import { useState } from 'react'
import {
  CIS_PHONE_OPTIONS,
  composePhone,
  formatNationalNumber,
  getNationalPlaceholder,
  parsePhone,
  type CisPhoneCode,
} from '@/helpers/phoneFormat'
import style from './phoneInput.module.scss'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  id?: string
  hidePlaceholderOnFocus?: boolean
}

export const PhoneInput = ({ value, onChange, error = false, id, hidePlaceholderOnFocus = false }: PhoneInputProps) => {
  const parsed = parsePhone(value)
  const [isCodeOpen, setIsCodeOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleCodeChange = (code: CisPhoneCode) => {
    const national = formatNationalNumber(parsed.national, code)
    onChange(composePhone(code, national))
    setIsCodeOpen(false)
  }

  const handleNationalChange = (raw: string) => {
    const national = formatNationalNumber(raw, parsed.code)
    onChange(composePhone(parsed.code, national))
  }

  return (
    <div className={`${style.phone} ${error ? style['phone--error'] : ''}`}>
      <select
        className={`${style.phone__code} ${isCodeOpen ? style['phone__code--open'] : ''}`}
        value={parsed.code}
        aria-label="Код страны"
        onClick={() => setIsCodeOpen((open) => !open)}
        onBlur={() => setIsCodeOpen(false)}
        onChange={(e) => handleCodeChange(e.target.value as CisPhoneCode)}
      >
        {CIS_PHONE_OPTIONS.map((item) => (
          <option key={item.code} value={item.code} title={item.hint}>
            {item.label}
          </option>
        ))}
      </select>

      <span className={style.phone__divider} aria-hidden="true">
        |
      </span>

      <input
        id={id}
        type="tel"
        inputMode="tel"
        className={style.phone__number}
        placeholder={hidePlaceholderOnFocus && isFocused ? '' : getNationalPlaceholder(parsed.code)}
        value={parsed.national}
        onChange={(e) => handleNationalChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="tel-national"
        aria-label="Номер телефона"
      />
    </div>
  )
}
