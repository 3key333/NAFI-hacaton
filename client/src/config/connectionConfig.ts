import type {
  AudienceType,
  ConnectionConfig,
  ConnectionForm,
  ConnectionOptions,
  PayerType,
  PaymentMethod,
} from '@/types'

/** Короткие названия типов организаций — для select и конфигуратора. */
export const AUDIENCE_OPTIONS: { id: AudienceType; label: string }[] = [
  { id: 'enterprise', label: 'Крупный бизнес' },
  { id: 'medium', label: 'Средний бизнес' },
  { id: 'gov', label: 'Госорганы' },
  { id: 'education', label: 'Образование' },
]

export const AUDIENCE_LABELS: Record<AudienceType, string> = Object.fromEntries(
  AUDIENCE_OPTIONS.map(({ id, label }) => [id, label]),
) as Record<AudienceType, string>

/** Рекомендуемые опции конфигуратора по сегменту ЦА (схема лендинга, блок «Для кого»). */
export const AUDIENCE_RECOMMENDED_OPTIONS: Record<AudienceType, (keyof ConnectionOptions)[]> = {
  enterprise: ['api', 'certificates', 'recommendations'],
  medium: ['recommendations', 'hints'],
  gov: ['certificates', 'recommendations'],
  education: ['certificates', 'hints', 'recommendations'],
}

/** Доп. опции конфигуратора: единый источник label + price. */
export const CONNECTION_OPTIONS = [
  { key: 'certificates' as const, label: 'Сертификаты', price: 15_000 },
  { key: 'hints' as const, label: 'Подсказки после неверных ответов', price: 8_000 },
  { key: 'recommendations' as const, label: 'Рекомендации по развитию', price: 12_000 },
  { key: 'api' as const, label: 'Интеграция по API', price: 25_000 },
]

export const DEFAULT_CONNECTION_OPTIONS: ConnectionOptions = {
  certificates: false,
  hints: false,
  recommendations: false,
  api: false,
}

export const DEFAULT_CONNECTION_FORM: ConnectionForm = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  phone: '',
  comment: '',
  orgType: '',
  consent: false,
}

export const createEmptyConnectionForm = (): ConnectionForm => ({ ...DEFAULT_CONNECTION_FORM })

export const DEFAULT_CONNECTION_CONFIG: ConnectionConfig = {
  count: 100,
  audience: 'medium',
  options: {
    certificates: false,
    hints: true,
    recommendations: true,
    api: false,
  },
}

export const MIN_USER_COUNT = 10
export const MAX_USER_COUNT = 100_000
export const COUNT_PRESETS = [50, 100, 500, 1000] as const

export const DEFAULT_PAYER_TYPE: PayerType = 'legal'
export const DEFAULT_PAYMENT_METHOD: PaymentMethod = 'invoice'

export const PAYER_TYPE_OPTIONS: { id: PayerType; label: string }[] = [
  { id: 'individual', label: 'Физлицо' },
  { id: 'ip', label: 'ИП' },
  { id: 'legal', label: 'Юрлицо' },
]

export const getPaymentMethodsForPayer = (payerType: PayerType): PaymentMethod[] =>
  payerType === 'individual' ? ['card'] : ['invoice']

export const PAYMENT_METHOD_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: 'Банковская карта' },
  { id: 'invoice', label: 'Счёт для юрлиц / ИП' },
]
