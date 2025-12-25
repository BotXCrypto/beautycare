import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-skincare.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium women's skincare products and serums"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-accent/20 opacity-40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Radiant Beauty
            <span className="block beauty-gradient">
              For Every Woman
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            Discover premium skincare essentials crafted for women's unique beauty needs. 
            From serums to moisturizers, find everything for healthy, glowing, confident skin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="group hover:glow-pulse" asChild>
              <Link to="/shop">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-primary/10 transition-colors" asChild>
              <Link to="/shop">Browse Categories</Link>
            </Button>
          </div>

          {/* Stats with animations */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border/50">
            <div className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-3xl font-bold beauty-gradient">
                500+
              </div>
              <div className="text-sm text-muted-foreground">Beauty Products</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold beauty-gradient">
                10k+
              </div>
              <div className="text-sm text-muted-foreground">Women Love Us</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="text-3xl font-bold beauty-gradient">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
