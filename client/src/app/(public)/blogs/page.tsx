"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  MapPin,
  Wrench,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Sample blog data
const blogPosts = [
  {
    id: "1",
    title: "Essential Motorcycle Safety Tips for New Riders",
    excerpt:
      "Starting your motorcycle journey? Here are the most important safety tips every new rider should know before hitting the road.",
    content: "Full article content here...",
    category: "Safety",
    author: {
      name: "Rajesh Kumar",
      avatar: "",
      role: "Safety Expert",
    },
    publishedAt: new Date("2024-01-15"),
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/2611684/pexels-photo-2611684.jpeg",
    tags: ["Safety", "Beginner", "Tips"],
    featured: true,
  },
  {
    id: "2",
    title: "Top 10 Scenic Routes for Motorcycle Tours in India",
    excerpt:
      "Discover the most breathtaking motorcycle routes across India, from the Himalayas to coastal highways.",
    content: "Full article content here...",
    category: "Travel",
    author: {
      name: "Priya Sharma",
      avatar: "",
      role: "Travel Writer",
    },
    publishedAt: new Date("2024-01-12"),
    readTime: "8 min read",
    image: "https://images.pexels.com/photos/5207010/pexels-photo-5207010.jpeg",
    tags: ["Travel", "Routes", "Adventure"],
    featured: true,
  },
  {
    id: "3",
    title: "Motorcycle Maintenance: A Complete Guide",
    excerpt:
      "Keep your bike in perfect condition with our comprehensive maintenance guide covering everything from basic care to advanced repairs.",
    content: "Full article content here...",
    category: "Maintenance",
    author: {
      name: "Arjun Patel",
      avatar: "",
      role: "Mechanic",
    },
    publishedAt: new Date("2024-01-10"),
    readTime: "12 min read",
    image: "https://images.pexels.com/photos/1915149/pexels-photo-1915149.jpeg",
    tags: ["Maintenance", "DIY", "Guide"],
    featured: false,
  },
  {
    id: "4",
    title: "Best Motorcycle Gear for Different Weather Conditions",
    excerpt:
      "From scorching summers to monsoon rains, here's how to gear up for any weather condition while riding.",
    content: "Full article content here...",
    category: "Gear",
    author: {
      name: "Sneha Reddy",
      avatar: "",
      role: "Gear Specialist",
    },
    publishedAt: new Date("2024-01-08"),
    readTime: "6 min read",
    image: "https://images.pexels.com/photos/356289/pexels-photo-356289.jpeg",
    tags: ["Gear", "Weather", "Equipment"],
    featured: false,
  },
  {
    id: "5",
    title: "Electric Motorcycles: The Future of Two-Wheeler Transportation",
    excerpt:
      "Explore the growing world of electric motorcycles and how they're revolutionizing urban transportation.",
    content: "Full article content here...",
    category: "Technology",
    author: {
      name: "Vikram Singh",
      avatar: "",
      role: "Tech Analyst",
    },
    publishedAt: new Date("2024-01-05"),
    readTime: "7 min read",
    image: "https://images.pexels.com/photos/2820885/pexels-photo-2820885.jpeg",
    tags: ["Electric", "Technology", "Future"],
    featured: false,
  },
  {
    id: "6",
    title: "Group Riding Etiquette: Rules Every Rider Should Follow",
    excerpt:
      "Planning a group ride? Learn the essential etiquette and safety rules for riding in groups.",
    content: "Full article content here...",
    category: "Safety",
    author: {
      name: "Amit Gupta",
      avatar: "",
      role: "Riding Instructor",
    },
    publishedAt: new Date("2024-01-03"),
    readTime: "4 min read",
    image: "https://images.pexels.com/photos/2745827/pexels-photo-2745827.jpeg",
    tags: ["Safety", "Group Riding", "Etiquette"],
    featured: false,
  },
];

const categories = [
  "All",
  "Safety",
  "Travel",
  "Maintenance",
  "Gear",
  "Technology",
];

const featuredTips = [
  {
    icon: Shield,
    title: "Always Wear Protective Gear",
    description: "Helmet, gloves, and protective clothing can save your life",
  },
  {
    icon: Wrench,
    title: "Regular Maintenance Checks",
    description:
      "Check tire pressure, brakes, and oil levels before every ride",
  },
  {
    icon: MapPin,
    title: "Plan Your Route",
    description: "Know your destination and have backup routes planned",
  },
  {
    icon: TrendingUp,
    title: "Improve Your Skills",
    description: "Take advanced riding courses to enhance your abilities",
  },
];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen dark:bg-[#18181B] bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r dark:from-[#18181B] dark:to-[#18181B]/80 dark:text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">TORQ Rides Blog</h1>
            <p className="text-xl mb-8 opacity-90">
              Your ultimate destination for motorcycle tips, travel guides, and
              industry insights
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className=""
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Featured Articles */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow py-0"
                    >
                      <div className="relative h-64">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          className="absolute top-4 left-4"
                          variant="secondary"
                        >
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={post.author.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {post.author.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {post.author.role}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {format(post.publishedAt, "MMM dd, yyyy")}
                            </p>
                            <p className="text-xs text-gray-400">
                              {post.readTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          asChild
                          className="mt-4 dark:text-white bg-yellow-primary hover:bg-yellow-primary/80"
                        >
                          <Link href={`/blogs/${post.id}`}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Articles */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow py-0"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className="absolute top-3 left-3"
                        variant="secondary"
                      >
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={post.author.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {post.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">
                          {post.author.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {post.readTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="w-fit mx-auto py-4 dark:text-white bg-yellow-primary hover:bg-yellow-primary/80"
                      >
                        <Link href={`/blogs/${post.id}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Quick Tips Tab */}
          <TabsContent value="tips">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Quick Riding Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredTips.map((tip, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <tip.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {tip.title}
                          </h3>
                          <p className="text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Tips */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>More Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">
                          Check Weather Conditions
                        </h4>
                        <p className="text-sm text-gray-600">
                          Always check weather forecasts before long rides
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Stay Hydrated</h4>
                        <p className="text-sm text-gray-600">
                          Carry water and take regular breaks on long journeys
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Maintain Safe Distance</h4>
                        <p className="text-sm text-gray-600">
                          Keep at least 3-second following distance from
                          vehicles
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Use Hand Signals</h4>
                        <p className="text-sm text-gray-600">
                          Communicate your intentions clearly to other road
                          users
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Latest Motorcycle News
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=96&width=96"
                          alt="News"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          Industry News
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2">
                          New Electric Motorcycle Charging Stations Announced
                          Across Major Cities
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Government announces plans to install 500 new charging
                          stations for electric motorcycles across 10 major
                          cities by end of 2024...
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>January 20, 2024</span>
                          <User className="h-3 w-3 ml-2" />
                          <span>TORQ News Team</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=96&width=96"
                          alt="News"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          Safety Update
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2">
                          New Helmet Safety Standards Implemented
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Updated safety standards for motorcycle helmets come
                          into effect, ensuring better protection for riders...
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>January 18, 2024</span>
                          <User className="h-3 w-3 ml-2" />
                          <span>Safety Department</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=96&width=96"
                          alt="News"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          Event
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2">
                          Annual Motorcycle Expo 2024 Dates Announced
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          The biggest motorcycle exhibition of the year will be
                          held from March 15-17, 2024, featuring latest models
                          and technology...
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>January 15, 2024</span>
                          <User className="h-3 w-3 ml-2" />
                          <span>Event Team</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter Subscription */}
      <section className="bg-gray-50 dark:bg-[#18181B] dark:text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 opacity-90">
            Subscribe to our newsletter for the latest articles, tips, and
            motorcycle news
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              placeholder="Enter your email"
              className="bg-white text-black"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
