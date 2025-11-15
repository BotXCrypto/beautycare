import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to our online electronics store, where innovation meets quality. We are dedicated to bringing you the latest and most reliable electronic products at competitive prices.
              </p>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                  <p className="text-muted-foreground">
                    Founded with a passion for technology and customer service, we've grown from a small startup to a trusted destination for electronics enthusiasts. Our journey began with a simple mission: to make quality electronics accessible to everyone while providing exceptional customer support.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-semibold">Our Mission</h3>
                    </div>
                    <p className="text-muted-foreground">
                      To provide customers with cutting-edge electronics, exceptional value, and outstanding service that exceeds expectations.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-semibold">Our Vision</h3>
                    </div>
                    <p className="text-muted-foreground">
                      To become the most trusted and innovative online electronics retailer, setting new standards in quality and customer satisfaction.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Quality Guaranteed:</strong> We carefully select and test all products before offering them to our customers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Competitive Prices:</strong> We work directly with manufacturers to bring you the best prices without compromising quality.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Fast Delivery:</strong> Our efficient logistics network ensures your orders reach you quickly and safely.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Expert Support:</strong> Our knowledgeable team is always ready to help you make informed decisions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Warranty Protection:</strong> All products come with comprehensive warranty coverage for your peace of mind.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-semibold">Our Team</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Our dedicated team of electronics experts, customer service professionals, and logistics specialists work together to ensure your shopping experience is seamless and enjoyable. We're passionate about technology and committed to helping you find the perfect products for your needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
