import { Button } from '@/components/ui/Button'
import style from '@/components/wizard/wizard.module.scss'

interface WizardStep7Props {
  email: string
  onReset: () => void
}

export const WizardStep7 = ({ email, onReset }: WizardStep7Props) => (
  <div className={`${style.step} ${style.success}`}>
    <div className={style.successIcon}>✓</div>
    <h3>Платформа успешно подключена!</h3>
    <p>Доступ к платформе будет отправлен на {email}</p>
    <ul>
      <li>Проверьте почту — письмо с инструкциями</li>
      <li>Войдите в личный кабинет администратора</li>
      <li>Настройте тестирование для сотрудников</li>
    </ul>
    <div className={style.successDocs}>
      <span>📄 Лицензионный договор.pdf</span>
      <span>📄 Счёт на оплату.pdf</span>
    </div>
    <Button onClick={onReset}>Подключить ещё</Button>
  </div>
)
