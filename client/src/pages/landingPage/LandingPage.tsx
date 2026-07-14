import { LandingSections } from './LandingSections'

interface LandingPageProps {
  onConsultation: () => void
}

export const LandingPage = ({ onConsultation }: LandingPageProps) => {
  return <LandingSections onConsultation={onConsultation} />
}
