import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const blogContent: Record<string, any> = {
  "smart-home-essentials-2024": {
    title: "10 Smart Home Essentials You Need in 2024",
    date: "2024-01-15",
    category: "Smart Home",
    content: `
      <p>The smart home revolution continues to evolve, bringing unprecedented convenience and efficiency to our daily lives. In 2024, these ten essential devices stand out as must-haves for anyone looking to modernize their living space.</p>
      
      <h2>1. Smart Thermostat</h2>
      <p>A smart thermostat is the cornerstone of an energy-efficient home. These devices learn your preferences and automatically adjust temperatures throughout the day, potentially saving you hundreds of dollars annually on energy bills. Modern models integrate seamlessly with voice assistants and can be controlled remotely from anywhere.</p>
      
      <h2>2. Video Doorbell</h2>
      <p>Security meets convenience with video doorbells. Monitor your front door from anywhere, receive instant notifications when someone arrives, and communicate with visitors through two-way audio. Many models now feature advanced AI that can distinguish between people, packages, and pets.</p>
      
      <h2>3. Smart Lighting System</h2>
      <p>Transform the ambiance of your home with smart lighting. Set schedules, adjust brightness and color temperature, and create custom scenes for different activities. Smart bulbs can sync with your entertainment system for an immersive viewing experience.</p>
      
      <h2>4. Smart Speaker with Voice Assistant</h2>
      <p>Voice assistants have become central hubs for smart homes. Control all your connected devices, play music, set reminders, check weather, and get answers to questions—all hands-free. Choose from Alexa, Google Assistant, or Apple's Siri based on your ecosystem preference.</p>
      
      <h2>5. Smart Security Camera System</h2>
      <p>Keep your home secure with intelligent cameras that offer features like motion detection, night vision, and cloud storage. Modern systems use AI to reduce false alarms and can even recognize familiar faces.</p>
      
      <h2>6. Smart Lock</h2>
      <p>Ditch traditional keys with smart locks that offer keyless entry via smartphone, keypad codes, or biometric authentication. Grant temporary access to guests and receive notifications when doors are locked or unlocked.</p>
      
      <h2>7. Smart Plug</h2>
      <p>Make any standard appliance smart with intelligent plugs. Schedule devices to turn on or off automatically, monitor energy usage, and control appliances remotely. It's an affordable way to expand your smart home ecosystem.</p>
      
      <h2>8. Robot Vacuum</h2>
      <p>Keep your floors clean effortlessly with a robot vacuum that can map your home, avoid obstacles, and automatically return to its charging station. Advanced models now include mopping capabilities and can empty themselves.</p>
      
      <h2>9. Smart Smoke and CO Detector</h2>
      <p>Safety should never be compromised. Smart detectors not only alert you to dangers but also notify you on your smartphone and can pinpoint exactly which room needs attention. Some models even provide guidance on how to respond to emergencies.</p>
      
      <h2>10. Smart Hub</h2>
      <p>Tie everything together with a smart hub that allows different devices from various manufacturers to communicate and work in harmony. Create complex automation routines that make your home truly intelligent.</p>
      
      <h2>Conclusion</h2>
      <p>Investing in these smart home essentials will significantly enhance your lifestyle while improving energy efficiency and home security. Start with the devices that address your most pressing needs, then gradually expand your smart home ecosystem. The future of living is here, and it's smarter than ever.</p>
    `
  },
  "choosing-right-tv": {
    title: "The Ultimate Guide to Choosing the Right TV",
    date: "2024-01-12",
    category: "TVs & Displays",
    content: `
      <p>Selecting the perfect television can be overwhelming with so many options available. This comprehensive guide will help you navigate through technical specifications and features to find the ideal TV for your needs and budget.</p>
      
      <h2>Screen Size Matters</h2>
      <p>The right TV size depends on your viewing distance and room size. A general rule is that you should sit approximately 1.5 to 2.5 times the diagonal screen size away from the TV. For example, if you sit 8 feet from your TV, a 55-65 inch screen would be ideal.</p>
      
      <h2>Resolution: 4K or 8K?</h2>
      <p>4K (Ultra HD) is now the standard, offering four times the resolution of Full HD with 3840 x 2160 pixels. While 8K TVs are available, content is limited and the price premium is substantial. For most viewers, 4K provides exceptional picture quality.</p>
      
      <h2>Display Technology</h2>
      <p><strong>OLED:</strong> Offers perfect blacks, infinite contrast, and wide viewing angles. Ideal for dark room viewing and cinematic experiences.</p>
      <p><strong>QLED:</strong> Provides brighter images and better performance in well-lit rooms, with no risk of burn-in.</p>
      <p><strong>Mini-LED:</strong> Combines benefits of LED with improved contrast and local dimming for better picture quality.</p>
      
      <h2>HDR Support</h2>
      <p>High Dynamic Range (HDR) enhances contrast and color range. Look for support for HDR10, Dolby Vision, and HLG for the best compatibility with streaming services and gaming consoles.</p>
      
      <h2>Refresh Rate</h2>
      <p>For sports and gaming, a higher refresh rate (120Hz) provides smoother motion. Standard content typically uses 60Hz, which is sufficient for most viewing.</p>
      
      <h2>Smart TV Features</h2>
      <p>Modern TVs come with built-in streaming apps and voice control. Popular platforms include Roku, Android TV, webOS, and Tizen. Consider which ecosystem fits your preferences.</p>
      
      <h2>Gaming Features</h2>
      <p>Gamers should look for HDMI 2.1 support, low input lag (under 20ms), VRR (Variable Refresh Rate), and ALLM (Auto Low Latency Mode) for the best gaming experience.</p>
      
      <h2>Audio Quality</h2>
      <p>While TV speakers have improved, consider adding a soundbar or home theater system for truly immersive audio. Check for eARC support if you plan to use external audio equipment.</p>
      
      <h2>Connectivity</h2>
      <p>Ensure sufficient HDMI ports (at least 3-4) and support for the latest standards. Built-in Wi-Fi and Bluetooth are now standard features.</p>
      
      <h2>Conclusion</h2>
      <p>Balance your budget with your needs. Prioritize screen size and resolution first, then consider additional features based on your usage patterns. Research specific models and read reviews before making your final decision.</p>
    `
  }
  // More blog posts can be added here with similar structure
};

const BlogPost = () => {
  const { id } = useParams();
  const post = id ? blogContent[id] : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span className="text-primary">{post.category}</span>
                </div>

                <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link to="/blog">
                <Button>
                  Read More Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
