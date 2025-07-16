import { Shield, Clock, Award, Users, Zap, Heart, ZapIcon, StarIcon } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "All our motorcycles are regularly maintained and insured for your safety",
    color: "text-yellow-primary",
  },
  {
    icon: Clock,
    title: "Wide Inventory Fleet",
    description: "Choose the motorcycle that suits you best",
    color: "text-yellow-primary",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the best motorcycles from top brands in our fleet",
    color: "text-yellow-primary",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Join thousands of satisfied customers who trust TORQ Rides",
    color: "text-yellow-primary",
  },
];

export function WhyUs() {
  return (
    <section className="py-16 dark:bg-[#18181B] bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ZapIcon className="h-6 w-6 text-yellow-primary mr-2" />
            <span className="text-yellow-primary font-semibold">
              Why Choose Us
            </span>
            <ZapIcon className="h-6 w-6 text-yellow-primary ml-2" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Why Choose Torq Rides?</h2>
          <p className="text-xl text-muted-foreground">
            Experience the difference with our premium service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-primary/10 rounded-full mb-4 group-hover:bg-yellow-primary/20 transition-colors">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-primary mb-2">
                5000+
              </div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-primary mb-2">
                100+
              </div>
              <div className="text-muted-foreground">Premium Bikes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-primary mb-2">
                99%+
              </div>
              <div className="text-muted-foreground">Up-Time rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-3xl font-bold text-yellow-primary mb-2">
                4.9
                <StarIcon className="h-6 w-6 ml-1 fill-current" />
              </div>
              <div className="text-muted-foreground">Google Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
