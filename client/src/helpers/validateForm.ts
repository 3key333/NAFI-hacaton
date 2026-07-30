import type { ConnectionForm, FormErrors } from '@/types'
import { isValidCisPhone, validatePersonName } from '@/helpers/phoneFormat'

/** Допустимые зоны (отсекает вымышленные вроде .qq, .aa). */
const ALLOWED_EMAIL_TLDS = new Set([
  // общие
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name', 'pro',
  'mobi', 'io', 'co', 'me', 'tv', 'cc', 'ws', 'app', 'dev', 'online', 'site',
  'store', 'tech', 'email', 'cloud', 'company', 'agency', 'studio', 'media',
  'world', 'space', 'xyz', 'club', 'shop', 'blog', 'news', 'today', 'life',
  'digital', 'solutions', 'group', 'ltd', 'llc', 'inc',
  // РФ / СНГ / частые страновые
  'ru', 'su', 'by', 'ua', 'kz', 'uz', 'am', 'ge', 'md', 'tj', 'tm', 'kg', 'az',
  'uk', 'us', 'de', 'fr', 'it', 'es', 'pl', 'cz', 'sk', 'nl', 'be', 'at', 'ch',
  'se', 'no', 'fi', 'dk', 'ie', 'pt', 'gr', 'tr', 'il', 'ae', 'cn', 'jp', 'kr',
  'in', 'au', 'nz', 'ca', 'br', 'mx', 'ar', 'sg', 'hk', 'tw',
])

/**
 * Проверка email: локальная часть + домен с корректными метками и известной зоной.
 * Отсекает user@a.b, user@.com, user@domain..com, user@mail.qq и т.п.
 */
const isValidEmail = (email: string): boolean => {
  const value = email.trim()
  if (!value || value.length > 254) return false

  const at = value.lastIndexOf('@')
  if (at <= 0 || at !== value.indexOf('@')) return false

  const local = value.slice(0, at)
  const domain = value.slice(at + 1).toLowerCase()

  if (!local || local.length > 64) return false
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false

  // Метки домена + TLD из минимум 2 латинских букв
  if (!/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/.test(domain)) {
    return false
  }

  const tld = domain.slice(domain.lastIndexOf('.') + 1)
  if (!ALLOWED_EMAIL_TLDS.has(tld)) return false

  return true
}

const validateEmailField = (email: string): string | undefined => {
  if (!email.trim()) return 'Введите email'
  if (!isValidEmail(email)) return 'Некорректный email'
  return undefined
}

export const validateConnectionForm = (
  form: ConnectionForm,
  options: { requireCompany?: boolean } = {},
): FormErrors => {
  const { requireCompany = true } = options
  const errors: FormErrors = {}

  const firstNameError = validatePersonName(form.firstName, 'Имя')
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validatePersonName(form.lastName, 'Фамилия')
  if (lastNameError) errors.lastName = lastNameError

  const emailError = validateEmailField(form.email)
  if (emailError) errors.email = emailError

  if (!form.phone.trim()) {
    errors.phone = 'Введите телефон'
  } else if (!isValidCisPhone(form.phone)) {
    errors.phone = 'Введите полный номер (+7, +375, +380 и др. СНГ)'
  }

  if (requireCompany) {
    if (!form.company.trim()) {
      errors.company = 'Введите название компании'
    } else if (form.company.trim().length < 3) {
      errors.company = 'Минимум 3 символа'
    }
  }

  if (!form.consent) errors.consent = 'Необходимо согласие на обработку персональных данных'

  return errors
}

export const validateContactForm = (form: ConnectionForm): FormErrors => {
  const errors: FormErrors = {}

  const emailError = validateEmailField(form.email)
  if (emailError) errors.email = emailError

  if (!form.comment.trim()) {
    errors.comment = 'Введите сообщение'
  }
  if (!form.consent) errors.consent = 'Необходимо согласие на обработку персональных данных'

  return errors
}
