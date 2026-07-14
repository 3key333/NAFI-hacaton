import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel'
import style from '@/components/wizard/wizard.module.scss'

export const WizardStep1 = () => (
  <div className={style.step}>
    <h3>Шаг 1 — Параметры подключения</h3>
    <ConfiguratorPanel showBase />
  </div>
)
