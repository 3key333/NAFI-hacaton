import type { ConnectionForm, FormErrors } from '@/types'
import { isValidCisPhone, validatePersonName } from '@/helpers/phoneFormat'

export const validateConnectionForm = (form: ConnectionForm): FormErrors => {
  const errors: FormErrors = {}

  const firstNameError = validatePersonName(form.firstName, 'Имя')
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validatePersonName(form.lastName, 'Фамилия')
  if (lastNameError) errors.lastName = lastNameError

  if (!form.email.trim()) {
    errors.email = 'Введите email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Некорректный email'
  }

  if (!form.phone.trim()) {
    errors.phone = 'Введите телефон'
  } else if (!isValidCisPhone(form.phone)) {
    errors.phone = 'Введите полный номер (+7, +375, +380 и др. СНГ)'
  }

  if (!form.consent) errors.consent = 'Необходимо согласие на обработку ПДн'

  return errors
}

export const validateConsultationForm = (form: ConnectionForm): FormErrors => {
  return validateConnectionForm(form)
}

export const validateContactForm = (form: ConnectionForm): FormErrors => {
  const errors: FormErrors = {}

  if (!form.email.trim()) {
    errors.email = 'Введите email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Некорректный email'
  }
  if (!form.comment.trim()) {
    errors.comment = 'Введите сообщение'
  }
  if (!form.consent) errors.consent = 'Необходимо согласие на обработку ПДн'

  return errors
}
