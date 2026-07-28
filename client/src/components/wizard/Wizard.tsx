import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { WizardStep1 } from '@/components/wizard/steps/WizardStep1'
import { WizardStep2 } from '@/components/wizard/steps/WizardStep2'
import { WizardStep3 } from '@/components/wizard/steps/WizardStep3'
import { WizardStep4 } from '@/components/wizard/steps/WizardStep4'
import { WizardStep5 } from '@/components/wizard/steps/WizardStep5'
import { CONNECTION_OPTIONS } from '@/config/connectionConfig'
import { BASE_FEATURES, WIZARD_STEPS } from '@/data/landingData'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
import { scrollToSection } from '@/helpers/scrollToSection'
import { validateConnectionForm } from '@/helpers/validateForm'
import { useConnection } from '@/redux/hooks/useConnection'
import type { WizardStep } from '@/types'
import style from './wizard.module.scss'

interface WizardProps {
  onConsultation: () => void
}

const TOTAL_STEPS = 5

export const Wizard = ({ onConsultation }: WizardProps) => {
  const {
    config,
    form,
    payerType,
    paymentMethod,
    wizardStep,
    contractAccepted,
    setFormField,
    setPayerType,
    setPaymentMethod,
    setWizardStep,
    setContractAccepted,
    resetWizard,
  } = useConnection()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const price = calculatePrice(config)
  const selectedOptions = CONNECTION_OPTIONS.filter((opt) => config.options[opt.key])

  const changeStep = (step: WizardStep) => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    setWizardStep(step)
    requestAnimationFrame(() => scrollToSection('wizard'))
  }

  const handleWizardReset = () => {
    setErrors({})
    resetWizard()
  }

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const updateFormField = (field: keyof typeof form, value: string | boolean) => {
    setFormField(field, value)
    clearError(field)
  }

  const handleContractChange = (accepted: boolean) => {
    setContractAccepted(accepted)
    clearError('contract')
  }

  const nextStep = () => {
    if (wizardStep === 2) {
      const validation = validateConnectionForm(form)
      if (Object.keys(validation).length) {
        setErrors(validation)
        return
      }
      setErrors({})
    }
    if (wizardStep === 3 && !contractAccepted) {
      setErrors({ contract: 'Необходимо принять условия договора' })
      return
    }
    setErrors({})
    if (wizardStep < TOTAL_STEPS) changeStep((wizardStep + 1) as WizardStep)
  }

  const prevStep = () => {
    if (wizardStep > 1) {
      changeStep((wizardStep - 1) as WizardStep)
      setErrors({})
    }
  }

  const goToStep = (step: number) => {
    if (step < 1 || step > wizardStep) return
    changeStep(step as WizardStep)
    setErrors({})
  }

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <WizardStep1 config={config} price={price} />
      case 2:
        return (
          <WizardStep2
            form={form}
            errors={errors}
            onUpdateField={updateFormField}
            onSetField={setFormField}
          />
        )
      case 3:
        return (
          <WizardStep3
            config={config}
            price={price}
            company={form.company}
            contractAccepted={contractAccepted}
            errors={errors}
            onContractChange={handleContractChange}
          />
        )
      case 4:
        return (
          <WizardStep4
            payerType={payerType}
            paymentMethod={paymentMethod}
            price={price}
            onPayerTypeChange={setPayerType}
            onPaymentMethodChange={setPaymentMethod}
          />
        )
      case 5:
        return <WizardStep5 email={form.email} onReset={handleWizardReset} />
      default:
        return null
    }
  }

  const renderSummary = () => (
    <div className={style.sidebarSummary}>
      <ul className={style.sidebarSummary__cards}>
        <li className={style.sidebarSummary__section}>
          <p className={style.sidebarSummary__label}>Параметры</p>
          <ul className={style.sidebarSummary__list}>
            <li>{config.count} тестируемых</li>
          </ul>
        </li>

        {selectedOptions.length > 0 && (
          <li className={style.sidebarSummary__section}>
            <p className={style.sidebarSummary__label}>Опции</p>
            <ul className={style.sidebarSummary__list}>
              {selectedOptions.map((opt) => (
                <li key={opt.key}>{opt.label}</li>
              ))}
            </ul>
          </li>
        )}

        {wizardStep > 1 && (
          <li className={style.sidebarSummary__section}>
            <p className={style.sidebarSummary__label}>Базовый функционал</p>
            <ul className={style.sidebarSummary__list}>
              {BASE_FEATURES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        )}
      </ul>

      <div className={style.sidebarPrice}>
        <p className={style.sidebarPrice__title}>ВАШ РАСЧЕТ</p>
        <ul className={style.sidebarPrice__breakdown}>
          <li>
            <span>Базовый тариф · {config.count} чел.</span>
            <span>{formatPrice(price.licenseTotal)}</span>
          </li>
          {price.options.length > 0 && (
            <li>
              <span>Дополнительные опции</span>
              <span>{formatPrice(price.subtotalExVat - price.licenseTotal)}</span>
            </li>
          )}
          <li>
            <span>НДС, 5%</span>
            <span>{formatPrice(price.vatAmount)}</span>
          </li>
          <li className={style.sidebarPrice__total}>
            <span>Итого с НДС</span>
            <strong>{formatPrice(price.total)}</strong>
          </li>
        </ul>
      </div>
    </div>
  )

  const renderNav = (variant: 'side' | 'mobile') => (
    <nav
      className={variant === 'side' ? style.wizard__nav : style.wizard__navMobile}
      aria-label="Шаги подключения"
    >
      {WIZARD_STEPS.map((step, i) => {
        const stepNum = i + 1
        const isReached = stepNum <= wizardStep
        const isCurrent = stepNum === wizardStep

        return (
          <button
            key={step}
            type="button"
            disabled={!isReached}
            onClick={() => goToStep(stepNum)}
            className={`${style.progressStep} ${isReached ? style['progressStep--active'] : ''} ${isCurrent ? style['progressStep--current'] : ''} ${isReached ? style['progressStep--clickable'] : ''}`}
          >
            <span>{stepNum}</span>
            <p>{step}</p>
          </button>
        )
      })}
    </nav>
  )

  return (
    <section id="wizard" className={style.wizard}>
      <div className="container">
        <div className={style.wizard__header}>
          <h2>Конфигуратор подключения</h2>
          <p>Выберите параметры, оформите подключение и получите доступ к платформе</p>
        </div>

        {wizardStep < TOTAL_STEPS && renderNav('mobile')}

        <div className={`${style.wizard__body} ${wizardStep === TOTAL_STEPS ? style['wizard__body--success'] : ''}`}>
          {wizardStep < TOTAL_STEPS && renderNav('side')}

          <div className={style.wizard__content}>
            {renderStep()}

            {wizardStep < TOTAL_STEPS && (
              <div className={style.wizard__actions}>
                {wizardStep > 1 && <Button variant="secondary" onClick={prevStep}>Назад</Button>}
                {wizardStep === 1 && (
                  <button className={style.consultLink} onClick={onConsultation}>
                    Параметры не подходят? Получить консультацию
                  </button>
                )}
                <Button onClick={nextStep}>{wizardStep === 4 ? 'Оплатить' : 'Далее'}</Button>
                {wizardStep > 1 && (
                  <button className={style.consultLink} onClick={onConsultation}>
                    Параметры не подходят? Получить консультацию
                  </button>
                )}
              </div>
            )}
          </div>

          {wizardStep < TOTAL_STEPS && (
            <aside className={style.wizard__sidebar}>{renderSummary()}</aside>
          )}
        </div>
      </div>
    </section>
  )
}
