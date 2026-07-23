import { CONNECTION_OPTIONS } from '@/config/connectionConfig'
import { USER_PRICE_TIERS, VAT_RATE } from '@/config/pricingConfig'
import type { ConnectionConfig, PriceBreakdown } from '@/types'

/** Фиксированные надбавки за опции (упрощённый прототип, не из официального прайса). */
const OPTION_PRICES = Object.fromEntries(
  CONNECTION_OPTIONS.map(({ key, price }) => [key, price]),
) as Record<(typeof CONNECTION_OPTIONS)[number]['key'], number>

const OPTION_LABELS = Object.fromEntries(
  CONNECTION_OPTIONS.map(({ key, label }) => [key, label]),
) as Record<(typeof CONNECTION_OPTIONS)[number]['key'], string>

const getPricePerUser = (count: number): number => {
  const tier = USER_PRICE_TIERS.find((item) => count >= item.min)
  return tier?.price ?? USER_PRICE_TIERS[USER_PRICE_TIERS.length - 1].price
}

export const formatUsersCountLabel = (count: number): string => `${count} чел.`

export const calculatePrice = (config: ConnectionConfig): PriceBreakdown => {
  const pricePerUser = getPricePerUser(config.count)
  const licenseTotal = config.count * pricePerUser

  const options = (Object.keys(config.options) as (keyof typeof OPTION_PRICES)[])
    .filter((key) => config.options[key])
    .map((key) => ({
      id: key,
      label: OPTION_LABELS[key],
      price: OPTION_PRICES[key],
    }))

  const optionsTotal = options.reduce((sum, item) => sum + item.price, 0)
  const subtotalExVat = licenseTotal + optionsTotal
  const vatAmount = Math.round(subtotalExVat * VAT_RATE)
  const total = subtotalExVat + vatAmount

  return {
    pricePerUser,
    licenseTotal,
    options,
    subtotalExVat,
    vatAmount,
    total,
  }
}

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}
