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
  tabLabel: string
  recommendedOptions: (keyof ConnectionOptions)[]
}[] = [
  {
    id: 'enterprise',
    tabLabel: 'Крупный бизнес (1000+)',
    recommendedOptions: ['api', 'certificates', 'recommendations'],
  },
  {
    id: 'medium',
    tabLabel: 'Средний бизнес (150–1000)',
    recommendedOptions: ['recommendations', 'hints'],
  },
  {
    id: 'gov',
    tabLabel: 'Госорганы',
    recommendedOptions: ['certificates', 'recommendations'],
  },
  {
    id: 'education',
    tabLabel: 'Образование (вузы)',
    recommendedOptions: ['certificates', 'hints', 'recommendations'],
  },
]

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
  consent: false,
}

export const createEmptyConnectionForm = (): ConnectionForm => ({ ...DEFAULT_CONNECTION_FORM })

export const DEFAULT_CONNECTION_CONFIG: ConnectionConfig = {
  count: 100,
  audience: 'medium',
  options: {
    certificates: false,
    hints: false,
    recommendations: false,
    api: false,
  },
}

export const MIN_USER_COUNT = 3
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

export const getDefaultPaymentMethodForPayer = (payerType: PayerType): PaymentMethod =>
  getPaymentMethodsForPayer(payerType)[0]

export const PAYMENT_METHOD_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: 'Банковская карта' },
  { id: 'invoice', label: 'Счёт для юрлиц / ИП' },
]
