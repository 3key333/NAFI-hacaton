import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { WizardStep1 } from '@/components/wizard/steps/WizardStep1'
import { WizardStep2 } from '@/components/wizard/steps/WizardStep2'
import { WizardStep3 } from '@/components/wizard/steps/WizardStep3'
import { WizardStep4 } from '@/components/wizard/steps/WizardStep4'
import { WizardStep5 } from '@/components/wizard/steps/WizardStep5'
import { WizardStep6 } from '@/components/wizard/steps/WizardStep6'
import { WizardStep7 } from '@/components/wizard/steps/WizardStep7'
import { WIZARD_STEPS } from '@/data/landingData'
import { calculatePrice, formatPrice } from '@/helpers/priceCalculator'
import { validateConnectionForm } from '@/helpers/validateForm'
import { useConnection } from '@/redux/hooks/useConnection'
import type { WizardStep } from '@/types'
import style from './wizard.module.scss'

interface WizardProps {
  onConsultation: () => void
}

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
    if (wizardStep === 4) {
      const validation = validateConnectionForm(form)
      if (Object.keys(validation).length) {
        setErrors(validation)
        return
      }
      setErrors({})
    }
    if (wizardStep === 5 && !contractAccepted) {
      setErrors({ contract: 'Необходимо принять условия договора' })
      return
    }
    setErrors({})
    if (wizardStep < 7) setWizardStep((wizardStep + 1) as WizardStep)
  }

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep((wizardStep - 1) as WizardStep)
      setErrors({})
    }
  }

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <WizardStep1 />
      case 2:
        return <WizardStep2 config={config} price={price} />
      case 3:
        return <WizardStep3 payerType={payerType} onPayerTypeChange={setPayerType} />
      case 4:
        return (
          <WizardStep4
            form={form}
            errors={errors}
            onUpdateField={updateFormField}
            onSetField={setFormField}
          />
        )
      case 5:
        return (
          <WizardStep5
            config={config}
            price={price}
            contractAccepted={contractAccepted}
            errors={errors}
            onContractChange={handleContractChange}
          />
        )
      case 6:
        return (
          <WizardStep6
            payerType={payerType}
            paymentMethod={paymentMethod}
            price={price}
            onPaymentMethodChange={setPaymentMethod}
          />
        )
      case 7:
        return <WizardStep7 email={form.email} onReset={handleWizardReset} />
      default:
        return null
    }
  }

  return (
    <section id="wizard" className={style.wizard}>
      <div className="container">
        <div className={style.wizard__header}>
          <h2>Конфигуратор подключения</h2>
          <p>Выберите параметры, оформите подключение и получите доступ к платформе</p>
        </div>

        <div className={style.wizard__progress}>
          {WIZARD_STEPS.map((step, i) => (
            <div
              key={step}
              className={`${style.progressStep} ${i + 1 <= wizardStep ? style['progressStep--active'] : ''} ${i + 1 === wizardStep ? style['progressStep--current'] : ''}`}
            >
              <span>{i + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className={style.wizard__body}>
          <div className={style.wizard__content}>{renderStep()}</div>

          {wizardStep < 7 && (
            <>
              <aside className={style.wizard__sidebar}>
                <div className={style.sidebarPrice}>
                  <span>Итого</span>
                  <strong>{formatPrice(price.total)}</strong>
                  <p>{config.count} тестируемых</p>
                </div>
              </aside>
              <div className={style.wizard__mobilePrice}>
                <div className={style.sidebarPrice}>
                  <span>Итого</span>
                  <strong>{formatPrice(price.total)}</strong>
                  <p>{config.count} тестируемых</p>
                </div>
              </div>
            </>
          )}
        </div>

        {wizardStep < 7 && (
          <div className={style.wizard__actions}>
            {wizardStep > 1 && <Button variant="secondary" onClick={prevStep}>Назад</Button>}
            <Button onClick={nextStep}>{wizardStep === 6 ? 'Оплатить' : 'Далее'}</Button>
            <button className={style.consultLink} onClick={onConsultation}>
              Параметры не подходят? Получить консультацию
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
