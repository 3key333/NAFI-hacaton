import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_CONNECTION_CONFIG,
  DEFAULT_CONNECTION_FORM,
  DEFAULT_PAYER_TYPE,
  DEFAULT_PAYMENT_METHOD,
  getDefaultPaymentMethodForPayer,
  MAX_USER_COUNT,
  MIN_USER_COUNT,
} from '@/config/connectionConfig'
import type {
  AudienceType,
  ConnectionConfig,
  ConnectionForm,
  ConnectionOptions,
  PayerType,
  PaymentMethod,
  WizardStep,
} from '@/types'

interface ConnectionState {
  config: ConnectionConfig
  form: ConnectionForm
  payerType: PayerType
  paymentMethod: PaymentMethod
  wizardStep: WizardStep
  contractAccepted: boolean
}

const initialState: ConnectionState = {
  config: {
    ...DEFAULT_CONNECTION_CONFIG,
    options: { ...DEFAULT_CONNECTION_CONFIG.options },
  },
  form: { ...DEFAULT_CONNECTION_FORM },
  payerType: DEFAULT_PAYER_TYPE,
  paymentMethod: DEFAULT_PAYMENT_METHOD,
  wizardStep: 1,
  contractAccepted: false,
}

const resetWizardState = (state: ConnectionState) => {
  state.wizardStep = 1
  state.contractAccepted = false
  state.form = { ...DEFAULT_CONNECTION_FORM }
  state.payerType = DEFAULT_PAYER_TYPE
  state.paymentMethod = DEFAULT_PAYMENT_METHOD
}

const connectionSlice = createSlice({
  name: 'connectionSlice',
  initialState,
  reducers: {
    setCount(state, action: PayloadAction<number>) {
      state.config.count = Math.min(MAX_USER_COUNT, Math.max(MIN_USER_COUNT, action.payload))
    },
    setAudienceWithRecommendations(state, action: PayloadAction<AudienceType>) {
      state.config.audience = action.payload
    },
    toggleOption(state, action: PayloadAction<keyof ConnectionOptions>) {
      const key = action.payload
      state.config.options[key] = !state.config.options[key]
    },
    setFormField(
      state,
      action: PayloadAction<{ field: keyof ConnectionForm; value: string | boolean }>,
    ) {
      const { field, value } = action.payload
      ;(state.form as Record<keyof ConnectionForm, string | boolean>)[field] = value
    },
    setPayerType(state, action: PayloadAction<PayerType>) {
      state.payerType = action.payload
      state.paymentMethod = getDefaultPaymentMethodForPayer(action.payload)
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload
    },
    setWizardStep(state, action: PayloadAction<WizardStep>) {
      state.wizardStep = action.payload
    },
    setContractAccepted(state, action: PayloadAction<boolean>) {
      state.contractAccepted = action.payload
    },
    resetWizard(state) {
      resetWizardState(state)
    },
  },
})

export const {
  setCount,
  setAudienceWithRecommendations,
  toggleOption,
  setFormField,
  setPayerType,
  setPaymentMethod,
  setWizardStep,
  setContractAccepted,
  resetWizard,
} = connectionSlice.actions

export default connectionSlice.reducer
