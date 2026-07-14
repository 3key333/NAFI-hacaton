import { Wizard } from '@/components/wizard/Wizard'
import { AudienceSection } from '@/pages/landingPage/sections/AudienceSection'
import { BenefitsSection } from '@/pages/landingPage/sections/BenefitsSection'
import { CasesSection } from '@/pages/landingPage/sections/CasesSection'
import { CompetenciesSection } from '@/pages/landingPage/sections/CompetenciesSection'
import { ContactsSection } from '@/pages/landingPage/sections/ContactsSection'
import { CtaBannerSection } from '@/pages/landingPage/sections/CtaBannerSection'
import { FaqSection } from '@/pages/landingPage/sections/FaqSection'
import { FeaturesSection } from '@/pages/landingPage/sections/FeaturesSection'
import { HeroSection } from '@/pages/landingPage/sections/HeroSection'
import { StepsSection } from '@/pages/landingPage/sections/StepsSection'
import { TrustSection } from '@/pages/landingPage/sections/TrustSection'
import { WhyNafiSection } from '@/pages/landingPage/sections/WhyNafiSection'

interface LandingSectionsProps {
  onConsultation: () => void
}

export const LandingSections = ({ onConsultation }: LandingSectionsProps) => (
  <>
    <HeroSection onConsultation={onConsultation} />
    <TrustSection />
    <BenefitsSection />
    <StepsSection />
    <Wizard onConsultation={onConsultation} />
    <WhyNafiSection />
    <AudienceSection onConsultation={onConsultation} />
    <FeaturesSection />
    <CompetenciesSection />
    <CasesSection />
    <FaqSection />
    <CtaBannerSection onConsultation={onConsultation} />
    <ContactsSection />
  </>
)
