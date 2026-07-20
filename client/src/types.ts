export type AudienceType = 'enterprise' | 'medium' | 'gov' | 'education'

export type PayerType = 'individual' | 'ip' | 'legal'

export type PaymentMethod = 'card' | 'invoice'

export type WizardStep = 1 | 2 | 3 | 4 | 5

export interface ConnectionOptions {
  certificates: boolean
  hints: boolean
  recommendations: boolean
  api: boolean
}

export interface ConnectionConfig {
  count: number
  audience: AudienceType
  options: ConnectionOptions
}

export interface ConnectionForm {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  comment: string
  orgType: string
  consent: boolean
}

export interface PriceBreakdown {
  pricePerUser: number
  licenseTotal: number
  options: { id: keyof ConnectionOptions; label: string; price: number }[]
  total: number
}

export interface FormErrors {
  [key: string]: string
}
