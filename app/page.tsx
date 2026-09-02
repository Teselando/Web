import { FinalCtaSection, HeroSection, HowItWorksSection, ImmediateProofSection, PriceSection, ProfessorsSection, ProtectionSection, SelectionSection, SocialProofSection } from "@/components/home/HomepageSections";
import { HomepageRail } from "@/components/home/HomepageRail";

export default function Home() {
  return <div className="homepage"><HomepageRail /><HeroSection /><ImmediateProofSection /><HowItWorksSection /><SelectionSection /><ProfessorsSection /><SocialProofSection /><ProtectionSection /><PriceSection /><FinalCtaSection /></div>;
}
