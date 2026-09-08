import { Footer } from "@/components/footer";
import { ScrollExperience } from "@/components/scroll-experience";
import { FinalCta, Hero, HowItWorks, ImmediateProof, Inside, Pricing, Protection, Selection, SocialProof } from "@/sections/home";

export default function HomePage() {
  return <><main id="contenido" className="home-page"><Hero /><ImmediateProof /><HowItWorks /><Selection /><Inside /><SocialProof /><Protection /><Pricing /><FinalCta /></main><Footer /><ScrollExperience /></>;
}
