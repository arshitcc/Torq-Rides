import { Hero } from "./__components/hero";
import { AvailableMotorcycles } from "./__components/avaialable-motorcycles";
import { WhyUs } from "./__components/why-us";
import { Testimonials } from "./__components/testimonials";
import { Newsletter } from "./__components/newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AvailableMotorcycles />
      <WhyUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
