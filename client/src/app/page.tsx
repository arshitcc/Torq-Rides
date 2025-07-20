"use client";

import { Hero } from "./__components/hero";
import { AvailableMotorcycles } from "./__components/avaialable-motorcycles";
import { WhyUs } from "./__components/why-us";
import { Testimonials } from "./__components/testimonials";
import { Newsletter } from "./__components/newsletter";
import FeaturedBrands from "./__components/featured";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SignupDialog = ({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn">
      <div className="bg-white dark:bg-[#18181B] w-full max-w-md p-8 rounded-2xl shadow-2xl text-center transform scale-95 transition-transform duration-300 animate-scaleIn border border-gray-200 dark:border-gray-700 space-y-4">
        {/* Motorcycle Icon */}
        <div className="flex justify-center">
          <Image src={"/logo/logo.png"} alt="Logo" width={200} height={100} />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Unlock Your Next Ride
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sign in or create an account to manage your bookings and access
          exclusive member benefits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onLogin}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-lg"
          >
            Sign Up / Login
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold px-8 py-3 rounded-lg transition duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); } to { transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuthAndPrompt = () => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        setIsDialogOpen(true);
      }
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!user) {
      const TEN_MINUTES = 10 * 60 * 1000;
      intervalRef.current = setInterval(checkAuthAndPrompt, TEN_MINUTES);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  const handleLogin = () => {
    setIsDialogOpen(false);
    router.push("/login");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <div className="min-h-screen">
      <Hero />
      <AvailableMotorcycles />
      <FeaturedBrands />
      <WhyUs />
      <Testimonials />
      <Newsletter />
      <SignupDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onLogin={handleLogin}
      />
    </div>
  );
}
