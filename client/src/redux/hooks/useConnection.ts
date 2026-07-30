import { useDispatch, useSelector } from 'react-redux'
import {
  resetWizard as resetWizardAction,
  setAudienceWithRecommendations as setAudienceWithRecommendationsAction,
  setContractAccepted as setContractAcceptedAction,
  setCount as setCountAction,
  setFormField as setFormFieldAction,
  setPayerType as setPayerTypeAction,
  setPaymentMethod as setPaymentMethodAction,
  setWizardStep as setWizardStepAction,
  toggleOption as toggleOptionAction,
} from '@/redux/slices/connectionSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import { scrollToSection } from '@/helpers/scrollToSection'
import type {
  AudienceType,
  ConnectionForm,
  ConnectionOptions,
  PayerType,
  PaymentMethod,
  WizardStep,
} from '@/types'

const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector = <T,>(selector: (state: RootState) => T) => useSelector(selector)

const scrollToWizard = () => {
  setTimeout(() => {
    scrollToSection('wizard')
  }, 50)
}

export const useConnection = () => {
  const dispatch = useAppDispatch()
  const { config, form, payerType, paymentMethod, wizardStep, contractAccepted } = useAppSelector(
    (state) => state.connection,
  )

  const openWizard = () => {
    if (wizardStep === 5) {
      dispatch(resetWizardAction())
    }

    scrollToWizard()
  }

  return {
    config,
    form,
    payerType,
    paymentMethod,
    wizardStep,
    contractAccepted,
    setCount: (count: number) => dispatch(setCountAction(count)),
    setAudienceWithRecommendations: (audience: AudienceType) =>
      dispatch(setAudienceWithRecommendationsAction(audience)),
    toggleOption: (key: keyof ConnectionOptions) => dispatch(toggleOptionAction(key)),
    setFormField: (field: keyof ConnectionForm, value: string | boolean) =>
      dispatch(setFormFieldAction({ field, value })),
    setPayerType: (type: PayerType) => dispatch(setPayerTypeAction(type)),
    setPaymentMethod: (method: PaymentMethod) => dispatch(setPaymentMethodAction(method)),
    setWizardStep: (step: WizardStep) => dispatch(setWizardStepAction(step)),
    setContractAccepted: (value: boolean) => dispatch(setContractAcceptedAction(value)),
    openWizard,
    resetWizard: () => dispatch(resetWizardAction()),
  }
}
