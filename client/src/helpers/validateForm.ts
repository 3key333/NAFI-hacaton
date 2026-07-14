import type { ConnectionForm, FormErrors } from '@/types'

export const validateConnectionForm = (form: ConnectionForm): FormErrors => {
  const errors: FormErrors = {}

  if (!form.firstName.trim()) errors.firstName = 'Введите имя'
  if (!form.lastName.trim()) errors.lastName = 'Введите фамилию'
  if (!form.email.trim()) {
    errors.email = 'Введите email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Некорректный email'
  }
  if (!form.consent) errors.consent = 'Необходимо согласие на обработку ПДн'

  return errors
}

export const validateConsultationForm = (form: ConnectionForm): FormErrors => {
  return validateConnectionForm(form)
}

export const validateContactForm = (form: ConnectionForm): FormErrors => {
  const errors = validateConnectionForm(form)
  if (!form.comment.trim()) {
    errors.comment = 'Введите сообщение'
  }
  return errors
}
