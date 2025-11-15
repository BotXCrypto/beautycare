import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: "smart-home-essentials-2024",
    title: "10 Smart Home Essentials You Need in 2024",
    excerpt: "Transform your living space with these must-have smart home devices that combine convenience, efficiency, and modern technology.",
    date: "2024-01-15",
    category: "Smart Home",
    image: "/placeholder.svg"
  },
  {
    id: "choosing-right-tv",
    title: "The Ultimate Guide to Choosing the Right TV",
    excerpt: "Navigate through screen sizes, resolutions, and features to find the perfect television for your entertainment needs and budget.",
    date: "2024-01-12",
    category: "TVs & Displays",
    image: "/placeholder.svg"
  },
  {
    id: "air-conditioner-maintenance",
    title: "Air Conditioner Maintenance Tips for Longevity",
    excerpt: "Learn essential maintenance practices to keep your AC running efficiently and extend its lifespan while reducing energy costs.",
    date: "2024-01-10",
    category: "Home Appliances",
    image: "/placeholder.svg"
  },
  {
    id: "wireless-earbuds-comparison",
    title: "Best Wireless Earbuds: A Complete Comparison",
    excerpt: "Compare the latest wireless earbuds based on sound quality, battery life, comfort, and features to find your perfect match.",
    date: "2024-01-08",
    category: "Audio",
    image: "/placeholder.svg"
  },
  {
    id: "energy-efficient-appliances",
    title: "How to Choose Energy-Efficient Appliances",
    excerpt: "Discover how to select appliances that save money on electricity bills while reducing your environmental footprint.",
    date: "2024-01-05",
    category: "Home Appliances",
    image: "/placeholder.svg"
  },
  {
    id: "gaming-console-guide",
    title: "Gaming Console Buying Guide 2024",
    excerpt: "Everything you need to know before purchasing a gaming console, from specs to exclusive games and online services.",
    date: "2024-01-03",
    category: "Gaming",
    image: "/placeholder.svg"
  },
  {
    id: "laptop-buying-guide",
    title: "How to Choose the Perfect Laptop for Your Needs",
    excerpt: "From processors to battery life, understand the key specifications that matter when selecting a laptop for work or play.",
    date: "2023-12-28",
    category: "Computers",
    image: "/placeholder.svg"
  },
  {
    id: "smartphone-camera-features",
    title: "Understanding Smartphone Camera Features",
    excerpt: "Decode camera specifications and learn which features truly matter for capturing stunning photos and videos.",
    date: "2023-12-25",
    category: "Smartphones",
    image: "/placeholder.svg"
  },
  {
    id: "smart-tv-streaming",
    title: "Maximizing Your Smart TV Streaming Experience",
    excerpt: "Get the most out of your smart TV with tips on apps, settings, and optimization for the best streaming quality.",
    date: "2023-12-22",
    category: "TVs & Displays",
    image: "/placeholder.svg"
  },
  {
    id: "kitchen-appliance-trends",
    title: "Top Kitchen Appliance Trends of 2024",
    excerpt: "Explore the latest innovations in kitchen technology that are making cooking easier, faster, and more enjoyable.",
    date: "2023-12-20",
    category: "Home Appliances",
    image: "/placeholder.svg"
  },
  {
    id: "home-security-systems",
    title: "Complete Guide to Home Security Systems",
    excerpt: "Learn about different types of security systems, installation options, and features to keep your home safe and secure.",
    date: "2023-12-18",
    category: "Smart Home",
    image: "/placeholder.svg"
  },
  {
    id: "wearable-tech-guide",
    title: "Wearable Technology: What's Worth Your Money",
    excerpt: "From smartwatches to fitness trackers, discover which wearable devices offer the best value and features for your lifestyle.",
    date: "2023-12-15",
    category: "Wearables",
    image: "/placeholder.svg"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest technology trends, product reviews, buying guides, and expert tips for all your electronics needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span className="text-primary">{post.category}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-primary font-medium">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
