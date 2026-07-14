import { useDispatch, useSelector } from 'react-redux'
import {
  applyAudienceRecommendations as applyAudienceRecommendationsAction,
  resetWizard as resetWizardAction,
  setAudience as setAudienceAction,
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
import type {
  AudienceType,
  ConnectionConfig,
  ConnectionForm,
  ConnectionOptions,
  PayerType,
  PaymentMethod,
  WizardStep,
} from '@/types'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T,>(selector: (state: RootState) => T) => useSelector(selector)

const scrollToWizard = () => {
  setTimeout(() => {
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' })
  }, 50)
}

export const useConnection = () => {
  const dispatch = useAppDispatch()
  const {
    config,
    form,
    payerType,
    paymentMethod,
    wizardStep,
    contractAccepted,
    wizardResetVersion,
  } = useAppSelector((state) => state.connection)

  return {
    config,
    form,
    payerType,
    paymentMethod,
    wizardStep,
    contractAccepted,
    wizardResetVersion,
    setCount: (count: number) => dispatch(setCountAction(count)),
    setAudience: (audience: ConnectionConfig['audience']) => dispatch(setAudienceAction(audience)),
    setAudienceWithRecommendations: (audience: AudienceType) =>
      dispatch(setAudienceWithRecommendationsAction(audience)),
    applyAudienceRecommendations: (audience: AudienceType) =>
      dispatch(applyAudienceRecommendationsAction(audience)),
    toggleOption: (key: keyof ConnectionOptions) => dispatch(toggleOptionAction(key)),
    setFormField: (field: keyof ConnectionForm, value: string | boolean) =>
      dispatch(setFormFieldAction({ field, value })),
    setPayerType: (type: PayerType) => dispatch(setPayerTypeAction(type)),
    setPaymentMethod: (method: PaymentMethod) => dispatch(setPaymentMethodAction(method)),
    setWizardStep: (step: WizardStep) => dispatch(setWizardStepAction(step)),
    setContractAccepted: (value: boolean) => dispatch(setContractAcceptedAction(value)),
    openWizard: scrollToWizard,
    resetWizard: () => dispatch(resetWizardAction()),
  }
}
