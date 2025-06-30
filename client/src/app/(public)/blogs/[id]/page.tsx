"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  Share2Icon,
  BookmarkPlusIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

const getBlogPost = (id: string) => {
  const posts = [
    {
      id: "1",
      title: "Essential Motorcycle Safety Tips for New Riders",
      content: `
        <h2>Introduction</h2>
        <p>Starting your motorcycle journey is an exciting adventure, but safety should always be your top priority. Whether you're a complete beginner or someone who's just getting back on two wheels, these essential safety tips will help ensure your rides are both enjoyable and secure.</p>
        
        <h2>1. Invest in Quality Protective Gear</h2>
        <p>Your safety gear is your first line of defense against injuries. Never compromise on quality when it comes to:</p>
        <ul>
          <li><strong>Helmet:</strong> Choose a DOT or ECE certified helmet that fits properly</li>
          <li><strong>Jacket:</strong> Leather or textile with armor at elbows, shoulders, and back</li>
          <li><strong>Gloves:</strong> Full-finger gloves with knuckle protection</li>
          <li><strong>Pants:</strong> Reinforced riding pants or jeans with knee protection</li>
          <li><strong>Boots:</strong> Over-the-ankle boots with non-slip soles</li>
        </ul>
        
        <h2>2. Master the Basics Before Hitting the Road</h2>
        <p>Before you venture into traffic, make sure you're comfortable with:</p>
        <ul>
          <li>Starting and stopping smoothly</li>
          <li>Turning and cornering techniques</li>
          <li>Emergency braking</li>
          <li>Slow-speed maneuvering</li>
          <li>Proper clutch and throttle control</li>
        </ul>
        
        <h2>3. Stay Visible on the Road</h2>
        <p>Visibility is crucial for motorcycle safety. Many accidents happen because other drivers simply don't see motorcyclists. Here's how to stay visible:</p>
        <ul>
          <li>Wear bright, reflective clothing</li>
          <li>Use your headlight during the day</li>
          <li>Position yourself in the lane where you're most visible</li>
          <li>Avoid riding in blind spots</li>
          <li>Use turn signals early and clearly</li>
        </ul>
        
        <h2>4. Maintain Your Motorcycle Regularly</h2>
        <p>A well-maintained motorcycle is a safe motorcycle. Regular maintenance checks should include:</p>
        <ul>
          <li>Tire pressure and tread depth</li>
          <li>Brake fluid levels and brake pad condition</li>
          <li>Chain tension and lubrication</li>
          <li>Oil levels and quality</li>
          <li>Light functionality</li>
        </ul>
        
        <h2>5. Ride Within Your Limits</h2>
        <p>Know your skill level and don't exceed it. This means:</p>
        <ul>
          <li>Starting with shorter, familiar routes</li>
          <li>Avoiding challenging conditions until you gain experience</li>
          <li>Taking breaks when you feel tired</li>
          <li>Never riding under the influence of alcohol or drugs</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Motorcycle safety is an ongoing commitment that requires constant attention and practice. By following these essential tips and continuing to educate yourself about safe riding practices, you'll be well on your way to enjoying many years of safe and exciting motorcycle adventures.</p>
        
        <p>Remember, the best riders are those who never stop learning and always prioritize safety over speed or showing off. Ride safe, and enjoy the journey!</p>
      `,
      category: "Safety",
      author: {
        name: "Rajesh Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Safety Expert",
        bio: "Rajesh has been riding motorcycles for over 15 years and is a certified motorcycle safety instructor.",
      },
      publishedAt: new Date("2024-01-15"),
      readTime: "5 min read",
      image: "/placeholder.svg?height=400&width=800",
      tags: ["Safety", "Beginner", "Tips"],
    },
    // Add more blog posts here...
  ];

  return posts.find((post) => post.id === id);
};

export default function BlogPostPage() {
  const params = useParams();
  const post = getBlogPost(params.id as string);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Button asChild>
          <Link href="/blogs">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/blogs">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Card className="mb-8">
            <div className="relative h-96">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-8">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={post.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-gray-600">{post.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(post.publishedAt, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-6">
                <Button variant="outline" size="sm">
                  <ThumbsUpIcon className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkPlusIcon className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2Icon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {post.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{post.author.role}</p>
                  <p className="text-sm text-gray-700">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex space-x-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Related article"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Top 10 Scenic Routes for Motorcycle Tours
                    </h4>
                    <p className="text-xs text-gray-600">
                      Discover breathtaking routes across India
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Related article"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Motorcycle Maintenance Guide
                    </h4>
                    <p className="text-xs text-gray-600">
                      Keep your bike in perfect condition
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
