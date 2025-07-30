"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MenuIcon,
  UserPlusIcon,
  UserIcon,
  MapPinIcon,
  ArrowUpRightIcon,
  ShoppingCartIcon,
  ArrowUpRightFromSquare,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/store/auth-store";
import { UserRolesEnum } from "@/types";
import Image from "next/image";
import { ThemeToggle } from "@/app/__components/theme-toggle";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  bikeCategories,
  carCategories,
  tourCategories,
  offRoadCategories,
} from "@/data";
import { useMotorcycleStore } from "@/store/motorcycle-store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getAllFilters } = useMotorcycleStore();
  const { cart, pickupLocation } = useCartStore();
  const { filters } = useMotorcycleStore();

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    router.push("/");
  };

  const branches = filters.distinctCities;

  useEffect(() => {
    getAllFilters();
  }, []);

  const getInitials = (fullname: string) => {
    const names = fullname?.split(" ");
    return names?.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names?.[0][0]?.toUpperCase();
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/motorcycles", label: "Motorcycles" },
    { href: "/cars", label: "Cars" },
    { href: "/tours", label: "Tours" },
    { href: "/off-road", label: "Off-Road" },
    { href: "/blogs", label: "Blogs" },
    ...(user?.role === UserRolesEnum.CUSTOMER
      ? [{ href: "/my-bookings", label: "My Bookings" }]
      : []),
    ...(user?.role === UserRolesEnum.ADMIN
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/all-bookings", label: "All Bookings" },
        ]
      : []),
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  const cartItemsCount = cart?.items?.length || 0;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:dark:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 mr-8">
              <Image src="/logo/logo.png" alt="logo" width={150} height={100} />
            </Link>
            <NavigationMenu
              className="hidden lg:flex items-center space-x-8"
              viewport={false}
              suppressHydrationWarning
            >
              <NavigationMenuList>
                {/* Bikes Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-yellow-primary">
                    <NavigationMenuLink
                      href="/motorcycles"
                      className="hover:text-yellow-primary"
                    >
                      Bikes
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 w-[500px] gap-3 p-4">
                      {bikeCategories.map((category) => (
                        <NavigationMenuLink key={category.href} asChild>
                          <Link
                            target="_blank"
                            href={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-yellow-primary/10 hover:text-yellow-primary focus:bg-yellow-primary/10 focus:text-yellow-primary"
                          >
                            <div className="text-sm font-medium leading-none flex gap-2">
                              <ArrowUpRightIcon className="hover:text-yellow-primary" />
                              {category.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Cars Menu */}
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-yellow-primary">
                    <NavigationMenuLink
                      href="/cars"
                      className="hover:text-yellow-primary"
                    >
                      Cars
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 w-[300px] gap-3 p-4">
                      {carCategories.map((category) => (
                        <NavigationMenuLink key={category.href} asChild>
                          <Link
                            href={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-yellow-primary/10 hover:text-yellow-primary focus:bg-yellow-primary/10 focus:text-yellow-primary"
                          >
                            <div className="text-sm font-medium leading-none flex gap-2">
                              <ArrowUpRightIcon className="hover:text-yellow-primary" />
                              {category.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* Tours Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-yellow-primary">
                    <NavigationMenuLink
                      href="/tours"
                      className="hover:text-yellow-primary"
                    >
                      Tours
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      {tourCategories.map((category) => (
                        <NavigationMenuLink key={category.href} asChild>
                          <Link
                            href={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-yellow-primary/10 hover:text-yellow-primary focus:bg-yellow-primary/10 focus:text-yellow-primary"
                          >
                            <div className="text-sm font-medium leading-none flex gap-2">
                              <ArrowUpRightIcon className="hover:text-yellow-primary" />
                              {category.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Off-road Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-yellow-primary">
                    <NavigationMenuLink
                      href="/off-roads"
                      className="hover:text-yellow-primary"
                    >
                      Off-Road
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      {offRoadCategories.map((category) => (
                        <NavigationMenuLink key={category.href} asChild>
                          <Link
                            href={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-yellow-primary/10 hover:text-yellow-primary focus:bg-yellow-primary/10 focus:text-yellow-primary"
                          >
                            <div className="text-sm font-medium leading-none flex gap-2">
                              <ArrowUpRightIcon className="hover:text-yellow-primary" />
                              {category.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <Link
                  href={"/blogs"}
                  className="flex items-center gap-2 font-medium hover:bg-accent py-1 px-4 rounded-md hover:bg-yellow-primary/10 hover:text-yellow-primary"
                >
                  <ArrowUpRightFromSquare className="h-3 w-3" />
                  Blogs
                </Link>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Location */}
            {/* <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Select defaultValue={pickupLocation}>
                <SelectTrigger className="w-[200px] text-black dark:text-white">
                  <MapPinIcon className="h-4 w-4 text-yellow-primary" />
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="z-60">
                  {branches &&
                    branches.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div> */}

            <ThemeToggle />

            {/* Cart */}
            {user && user.role === UserRolesEnum.CUSTOMER && (
              <Button
                variant="outline"
                asChild
                className="relative hover:bg-yellow-primary/10"
              >
                <Link href="/cart">
                  <ShoppingCartIcon className="h-5 w-5 text-yellow-primary" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-yellow-primary text-white text-xs font-bold">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Auth Section */}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-yellow-primary/10"
                    >
                      <Avatar className="h-8 w-8 ring-1 ring-yellow-primary/20">
                        <AvatarImage
                          src={user?.avatar?.url || "/placeholder.svg"}
                          alt={user.fullname}
                        />
                        <AvatarFallback>
                          {getInitials(user?.fullname)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="hover:bg-yellow-primary/10"
                      >
                        <UserIcon className="mr-2 h-4 w-4 text-yellow-primary" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    {user.role === UserRolesEnum.CUSTOMER && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-bookings"
                          className="hover:bg-yellow-primary/10"
                        >
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === UserRolesEnum.ADMIN && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            className="hover:bg-yellow-primary/10"
                          >
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/all-bookings"
                            className="hover:bg-yellow-primary/10"
                          >
                            All Bookings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="hover:bg-yellow-primary/10"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  className="bg-yellow-primary hover:bg-yellow-600 text-white font-semibold"
                >
                  <Link href="/signup">
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    Sign-Up
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}

          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-yellow-primary/10"
                >
                  <MenuIcon className="h-5 w-5 text-yellow-primary" />
                </Button>
              </SheetTrigger>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
                <div className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-yellow-primary p-2 rounded-md hover:bg-yellow-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <div className="pt-4 border-t border-yellow-primary/20">
                      <Link
                        href="/profile"
                        className="text-sm font-medium transition-colors hover:text-yellow-primary block mb-2 p-2 rounded-md hover:bg-yellow-primary/10"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      {user.role === UserRolesEnum.CUSTOMER && (
                        <Link
                          href="/cart"
                          className="flex w-full items-center justify-center py-3 px-4 mb-2 rounded-md text-base font-medium transition-colors hover:text-yellow-600 hover:bg-yellow-600/10"
                          onClick={() => setIsOpen(false)}
                        >
                          <ShoppingCartIcon className="mr-2 h-4 w-4" />
                          Cart ({cartItemsCount})
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full border-yellow-primary/20 hover:bg-yellow-primary/10 hover:border-yellow-primary bg-transparent"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      className="mt-4 bg-yellow-primary hover:bg-yellow-600 text-white font-semibold"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
