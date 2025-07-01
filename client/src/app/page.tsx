import { Hero } from "./__components/hero";
import { AvailableMotorcycles } from "./__components/avaialable-motorcycles";
import { WhyUs } from "./__components/why-us";
import { Testimonials } from "./__components/testimonials";
import { Newsletter } from "./__components/newsletter";
import FeaturedBrands from "./__components/featured";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AvailableMotorcycles />
      <FeaturedBrands />
      <WhyUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
