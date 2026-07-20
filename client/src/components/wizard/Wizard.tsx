import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { WizardStep1 } from '@/components/wizard/steps/WizardStep1'
import { WizardStep2 } from '@/components/wizard/steps/WizardStep2'
import { WizardStep3 } from '@/components/wizard/steps/WizardStep3'
import { WizardStep4 } from '@/components/wizard/steps/WizardStep4'
import { WizardStep5 } from '@/components/wizard/steps/WizardStep5'
import { AUDIENCE_LABELS, CONNECTION_OPTIONS } from '@/config/connectionConfig'
import { WIZARD_STEPS } from '@/data/landingData'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
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
    if (wizardStep < TOTAL_STEPS) setWizardStep((wizardStep + 1) as WizardStep)
  }

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep((wizardStep - 1) as WizardStep)
      setErrors({})
    }
  }

  const goToStep = (step: number) => {
    if (step < 1 || step > wizardStep) return
    setWizardStep(step as WizardStep)
    setErrors({})
  }

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <WizardStep1 config={config} price={price} />
      case 2:
        return (
          <WizardStep2
            payerType={payerType}
            form={form}
            errors={errors}
            onPayerTypeChange={setPayerType}
            onUpdateField={updateFormField}
            onSetField={setFormField}
          />
        )
      case 3:
        return (
          <WizardStep3
            config={config}
            price={price}
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
            onPaymentMethodChange={setPaymentMethod}
          />
        )
      case 5:
        return <WizardStep5 email={form.email} onReset={handleWizardReset} />
      default:
        return null
    }
  }

  const renderSummary = (compact = false) => (
    <div className={`${style.sidebarSummary} ${compact ? style['sidebarSummary--compact'] : ''}`}>
      {!compact && (
        <>
          <div className={style.sidebarSummary__section}>
            <p className={style.sidebarSummary__label}>Параметры</p>
            <ul className={style.sidebarSummary__list}>
              <li>{config.count} тестируемых</li>
              <li>{AUDIENCE_LABELS[config.audience]}</li>
            </ul>
          </div>

          {selectedOptions.length > 0 && (
            <div className={style.sidebarSummary__section}>
              <p className={style.sidebarSummary__label}>Опции</p>
              <ul className={style.sidebarSummary__list}>
                {selectedOptions.map((opt) => (
                  <li key={opt.key}>{opt.label}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className={style.sidebarPrice}>
        <span>Итого</span>
        <strong>{formatPrice(price.total)}</strong>
        {!compact && <p>{config.count} тестируемых</p>}
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
        const isActive = stepNum <= wizardStep
        const isCurrent = stepNum === wizardStep
        const isClickable = stepNum <= wizardStep

        return (
          <button
            key={step}
            type="button"
            disabled={!isClickable}
            onClick={() => goToStep(stepNum)}
            className={`${style.progressStep} ${isActive ? style['progressStep--active'] : ''} ${isCurrent ? style['progressStep--current'] : ''} ${isClickable ? style['progressStep--clickable'] : ''}`}
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
                <Button onClick={nextStep}>{wizardStep === 4 ? 'Оплатить' : 'Далее'}</Button>
                <button className={style.consultLink} onClick={onConsultation}>
                  Параметры не подходят? Получить консультацию
                </button>
              </div>
            )}
          </div>

          {wizardStep < TOTAL_STEPS && (
            <>
              <aside className={style.wizard__sidebar}>{renderSummary()}</aside>
              <div className={style.wizard__mobilePrice}>{renderSummary(true)}</div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
