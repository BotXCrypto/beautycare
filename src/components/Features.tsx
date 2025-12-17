import { Truck, Shield, Leaf, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over ₨10,000",
  },
  {
    icon: Shield,
    title: "Dermatologist Tested",
    description: "Safe for all skin types",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "Clean beauty formulas",
  },
  {
    icon: Headphones,
    title: "Skin Consultation",
    description: "Expert beauty advice",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-medium transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
