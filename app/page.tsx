import { Footer } from "@/components/footer";
import { ScrollExperience } from "@/components/scroll-experience";
import { FinalCta, Fit, Hero, HowItWorks, ImmediateProof, Pricing, Professors, Protection, SocialProof } from "@/sections/home";

export default function HomePage() {
  return <><main id="contenido"><Hero /><ImmediateProof /><HowItWorks /><Fit /><Professors /><SocialProof /><Protection /><Pricing /><FinalCta /></main><Footer /><ScrollExperience /></>;
}
