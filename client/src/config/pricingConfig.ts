/**
 * Тарифы из презентации НАФИ (Бриф → Digiyal_Citizen.pdf):
 * https://nafi.ru/upload/presentations/Digiyal_Citizen.pdf
 *
 * «Стоимость доступа к платформе (указана за одного пользователя, без учёта НДС)»
 * - до 500 чел.     → 390 ₽
 * - 501–4000 чел.   → 370 ₽
 * - более 4000 чел. → 340 ₽
 */
export const USER_PRICE_TIERS = [
  { min: 4001, price: 340, label: 'более 4000 чел.' },
  { min: 501, price: 370, label: '501–4000 чел.' },
  { min: 1, price: 390, label: 'до 500 чел.' },
] as const

export const VAT_RATE = 0.05
