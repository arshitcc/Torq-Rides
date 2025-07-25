import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldIcon,
  UsersIcon,
  AwardIcon,
  ClockIcon,
  HeartIcon,
  TargetIcon,
} from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: ShieldIcon,
    title: "Safety First",
    description:
      "Your safety is our top priority. All our motorcycles undergo regular maintenance and safety checks.",
  },
  {
    icon: UsersIcon,
    title: "Customer Focused",
    description:
      "We put our customers at the heart of everything we do, ensuring exceptional service every time.",
  },
  {
    icon: AwardIcon,
    title: "Quality Assured",
    description:
      "We maintain the highest standards in our fleet and service delivery.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Support",
    description:
      "Round-the-clock assistance whenever you need help during your journey.",
  },
  {
    icon: HeartIcon,
    title: "Passion for Riding",
    description:
      "We share your passion for motorcycles and the freedom of the open road.",
  },
  {
    icon: TargetIcon,
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of our service and customer experience.",
  },
];

const team = [
  {
    name: "Mishu Ahluwalia",
    role: "Founder & CEO",
    image: "/home/team/mishu.jpeg",
    description: "Passionate Biker & Serial Entrepreneur with more than 25 years of experience",
  },
  {
    name: "Rishi Kochhar",
    role: "Co-Founder & COO",
    image: "/home/team/rishi.jpeg",
    description: "Passionate Biker & Dealer Principal for Suzuki Motorcycles, 15+ years of experience",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/home/img8.jpg"
          alt="About TORQ Rides"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About TORQ Rides
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Your trusted partner for premium motorcycle rentals
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2020, TORQ Rides was born from a simple passion - the
              love for motorcycles and the freedom they represent. What started
              as a small collection of bikes has grown into one of India's most
              trusted motorcycle rental services.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We believe that everyone deserves to experience the thrill of
              riding premium motorcycles, whether it's for a weekend getaway, a
              long road trip, or simply exploring the city. Our mission is to
              make quality motorcycles accessible to all riders, backed by
              exceptional service and support.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we serve thousands of customers across multiple cities,
              offering a diverse fleet of well-maintained motorcycles from
              leading brands. Every bike in our collection is carefully selected
              and regularly serviced to ensure your safety and enjoyment.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white dark:bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 border-yellow-300">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              The passionate people behind TORQ Rides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="relative w-70 h-100 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-fit rounded-xl"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white dark:bg-[#18181B]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg opacity-90">Motorcycles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-lg opacity-90">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-lg opacity-90">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
