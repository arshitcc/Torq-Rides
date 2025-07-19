import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgd-ct.aeplcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgd.aeplcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.hyundai.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "auto.mahindra.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jeep.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w0.peakpx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.wanderon.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
