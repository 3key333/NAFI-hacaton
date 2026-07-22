/** Коды СНГ: код страны → длина национального номера (без кода). */
export const CIS_PHONE_OPTIONS = [
  { code: '7', label: '+7 (RU)', maxNational: 10, hint: 'Россия / Казахстан' },
  { code: '375', label: '+375 (BY)', maxNational: 9, hint: 'Беларусь' },
  { code: '380', label: '+380 (UA)', maxNational: 9, hint: 'Украина' },
  { code: '374', label: '+374 (AM)', maxNational: 8, hint: 'Армения' },
  { code: '373', label: '+373 (MD)', maxNational: 8, hint: 'Молдова' },
  { code: '994', label: '+994 (AZ)', maxNational: 9, hint: 'Азербайджан' },
  { code: '998', label: '+998 (UZ)', maxNational: 9, hint: 'Узбекистан' },
  { code: '996', label: '+996 (KG)', maxNational: 9, hint: 'Кыргызстан' },
  { code: '995', label: '+995 (GE)', maxNational: 9, hint: 'Грузия' },
  { code: '993', label: '+993 (TM)', maxNational: 8, hint: 'Туркменистан' },
  { code: '992', label: '+992 (TJ)', maxNational: 9, hint: 'Таджикистан' },
] as const

export type CisPhoneCode = (typeof CIS_PHONE_OPTIONS)[number]['code']

const DEFAULT_CODE: CisPhoneCode = '7'

const getDigits = (value: string) => value.replace(/\D/g, '')

const getOption = (code: string) =>
  CIS_PHONE_OPTIONS.find((item) => item.code === code) ?? CIS_PHONE_OPTIONS[0]

/** Форматирование только национального номера: цифры и тире. */
export const formatNationalNumber = (raw: string, code: string): string => {
  const { maxNational } = getOption(code)
  const digits = getDigits(raw).slice(0, maxNational)
  if (!digits) return ''

  if (maxNational === 10) {
    // 999-999-99-99
    const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
    return parts.filter(Boolean).join('-')
  }

  if (maxNational === 9) {
    // 99-999-99-99
    const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    return parts.filter(Boolean).join('-')
  }

  // 99-99-99-99 (8 цифр)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6), digits.slice(6, 8)]
  return parts.filter(Boolean).join('-')
}

export const composePhone = (code: string, national: string): string => {
  const nationalDigits = getDigits(national)
  if (!nationalDigits) return `+${code}`
  return `+${code} ${formatNationalNumber(nationalDigits, code)}`
}

export const parsePhone = (phone: string): { code: CisPhoneCode; national: string } => {
  const digits = getDigits(phone)
  if (!digits) return { code: DEFAULT_CODE, national: '' }

  const matched = [...CIS_PHONE_OPTIONS]
    .sort((a, b) => b.code.length - a.code.length)
    .find((item) => digits.startsWith(item.code))

  const code = matched?.code ?? DEFAULT_CODE
  const nationalDigits = matched ? digits.slice(matched.code.length) : digits

  return {
    code,
    national: formatNationalNumber(nationalDigits, code),
  }
}

export const getNationalPlaceholder = (code: string): string => {
  const { maxNational } = getOption(code)
  if (maxNational === 10) return '999-999-99-99'
  if (maxNational === 9) return '99-999-99-99'
  return '99-99-99-99'
}

export const isValidCisPhone = (phone: string): boolean => {
  const { code, national } = parsePhone(phone)
  const option = getOption(code)
  return getDigits(national).length === option.maxNational
}

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 40

/** Буквы (кириллица/латиница), дефис, апостроф, пробел. */
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґӘәӨөҮүҚқҢң\-'\s]+$/u

export const sanitizeNameInput = (value: string): string =>
  value.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґӘәӨөҮүҚқҢң\-'\s]/gu, '').slice(0, NAME_MAX_LENGTH)

export const validatePersonName = (value: string, label: string): string | undefined => {
  const trimmed = value.trim()

  if (!trimmed) return `Введите ${label.toLowerCase()}`
  if (trimmed.length < NAME_MIN_LENGTH) {
    return `${label} — минимум ${NAME_MIN_LENGTH} символа`
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `${label} — максимум ${NAME_MAX_LENGTH} символов`
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return `${label} не должно содержать спецсимволы`
  }

  return undefined
}
