import Link from "next/link";
import {
  BikeIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  YoutubeIcon,
  ZapIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo/logo.png" alt="Logo" width={150} height={100} />
            </div>
            <p className="text-muted-foreground mb-4">
              Premium motorcycle rentals for the ultimate riding experience.
            </p>
            <div className="flex space-x-4">
              <div className="p-2 rounded-full bg-yellow-primary/10 hover:bg-yellow-primary/20 transition-colors cursor-pointer">
                <FacebookIcon className="h-5 w-5 text-yellow-primary" />
              </div>
              <div className="p-2 rounded-full bg-yellow-primary/10 hover:bg-yellow-primary/20 transition-colors cursor-pointer">
                <TwitterIcon className="h-5 w-5 text-yellow-primary" />
              </div>
              <div className="p-2 rounded-full bg-yellow-primary/10 hover:bg-yellow-primary/20 transition-colors cursor-pointer">
                <InstagramIcon className="h-5 w-5 text-yellow-primary" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/motorcycles"
                  className="text-gray-400 hover:underline"
                >
                  Motorcycles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-primary">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Bike Rentals</span>
              </li>
              <li>
                <span className="text-muted-foreground">Long Term Rentals</span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Corporate Bookings
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">24/7 Support</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-primary">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-primary/10">
                  <PhoneIcon className="h-4 w-4 text-yellow-primary" />
                </div>
                <span className="text-muted-foreground">+91 95601 98483</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-primary/10">
                  <MailIcon className="h-4 w-4 text-yellow-primary" />
                </div>
                <span className="text-muted-foreground">
                  hello@torqrides.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-yellow-primary/10">
                  <MapPinIcon className="h-4 w-4 text-yellow-primary" />
                </div>
                <span className="text-muted-foreground">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-yellow-primary/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} TORQ Rides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
