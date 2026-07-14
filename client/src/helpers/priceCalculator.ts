import { CONNECTION_OPTIONS } from '@/config/connectionConfig'
import { USER_PRICE_TIERS } from '@/config/pricingConfig'
import type { ConnectionConfig, PriceBreakdown } from '@/types'

/** Фиксированные надбавки за опции (упрощённый прототип, не из официального прайса). */
const OPTION_PRICES = Object.fromEntries(
  CONNECTION_OPTIONS.map(({ key, price }) => [key, price]),
) as Record<(typeof CONNECTION_OPTIONS)[number]['key'], number>

const OPTION_LABELS = Object.fromEntries(
  CONNECTION_OPTIONS.map(({ key, label }) => [key, label]),
) as Record<(typeof CONNECTION_OPTIONS)[number]['key'], string>

export const getPricePerUser = (count: number): number => {
  const tier = USER_PRICE_TIERS.find((item) => count >= item.min)
  return tier?.price ?? USER_PRICE_TIERS[USER_PRICE_TIERS.length - 1].price
}

export const getPriceTierLabel = (count: number): string => {
  if (count > 4000) return 'более 4000 чел.'
  if (count > 500) return '501–4000 чел.'
  return 'до 500 чел.'
}

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

  return {
    pricePerUser,
    licenseTotal,
    options,
    total: licenseTotal + optionsTotal,
  }
}

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}
