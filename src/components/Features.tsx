import { Truck, Shield, Leaf, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over ₨10,000",
    emoji: "🚚",
  },
  {
    icon: Shield,
    title: "Dermatologist Tested",
    description: "Safe for all skin types",
    emoji: "✓",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "Clean beauty formulas",
    emoji: "🌿",
  },
  {
    icon: Headphones,
    title: "Beauty Consultation",
    description: "Expert skincare advice",
    emoji: "💬",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-2">
            Why Women Choose <span className="beauty-gradient">Pure & Peak</span>
          </h2>
          <p className="text-muted-foreground">Premium beauty care tailored for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer animate-fade-in-up border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 mb-4 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
