import type {
  AudienceType,
  ConnectionConfig,
  ConnectionForm,
  ConnectionOptions,
  PayerType,
  PaymentMethod,
} from '@/types'

/** Единый источник данных по сегментам ЦА: короткие/длинные названия и рекомендуемые опции. */
export const AUDIENCE_SEGMENTS: {
  id: AudienceType
  label: string
  tabLabel: string
  recommendedOptions: (keyof ConnectionOptions)[]
}[] = [
  {
    id: 'enterprise',
    label: 'Крупный бизнес',
    tabLabel: 'Крупный бизнес (1000+)',
    recommendedOptions: ['api', 'certificates', 'recommendations'],
  },
  {
    id: 'medium',
    label: 'Средний бизнес',
    tabLabel: 'Средний бизнес (150–1000)',
    recommendedOptions: ['recommendations', 'hints'],
  },
  {
    id: 'gov',
    label: 'Госорганы',
    tabLabel: 'Госорганы',
    recommendedOptions: ['certificates', 'recommendations'],
  },
  {
    id: 'education',
    label: 'Образование',
    tabLabel: 'Образование (вузы)',
    recommendedOptions: ['certificates', 'hints', 'recommendations'],
  },
]

/** Короткие названия — для select и конфигуратора. */
export const AUDIENCE_OPTIONS = AUDIENCE_SEGMENTS.map(({ id, label }) => ({ id, label }))

export const AUDIENCE_LABELS: Record<AudienceType, string> = Object.fromEntries(
  AUDIENCE_SEGMENTS.map(({ id, label }) => [id, label]),
) as Record<AudienceType, string>

export const AUDIENCE_RECOMMENDED_OPTIONS: Record<AudienceType, (keyof ConnectionOptions)[]> =
  Object.fromEntries(
    AUDIENCE_SEGMENTS.map(({ id, recommendedOptions }) => [id, recommendedOptions]),
  ) as Record<AudienceType, (keyof ConnectionOptions)[]>

/** Доп. опции конфигуратора: единый источник label + price. */
export const CONNECTION_OPTIONS = [
  { key: 'certificates' as const, label: 'Сертификаты о прохождении теста', price: 15_000 },
  { key: 'hints' as const, label: 'Подсказки после неверных ответов', price: 8_000 },
  { key: 'recommendations' as const, label: 'Рекомендации по развитию', price: 12_000 },
  { key: 'api' as const, label: 'Интеграция по API', price: 25_000 },
]

export const DEFAULT_CONNECTION_FORM: ConnectionForm = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  phone: '',
  comment: '',
  orgType: 'medium',
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

export const COMPANY_PLACEHOLDERS: Record<PayerType, string> = {
  legal: 'ООО "Ромашка"',
  individual: 'Иванов Иван Иванович',
  ip: 'ИП Иванов И.И',
}

export const getPaymentMethodsForPayer = (payerType: PayerType): PaymentMethod[] =>
  payerType === 'individual' ? ['card'] : ['invoice']

export const getDefaultPaymentMethodForPayer = (payerType: PayerType): PaymentMethod =>
  getPaymentMethodsForPayer(payerType)[0]

export const PAYMENT_METHOD_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: 'Банковская карта' },
  { id: 'invoice', label: 'Счёт для юрлиц / ИП' },
]
