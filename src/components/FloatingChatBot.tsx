import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-bounce-subtle hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Open AI Chat Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity" />
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <MessageCircle className="w-6 h-6 relative z-10 group-hover:animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-48px)] animate-slide-up">
          <Card className="shadow-2xl rounded-2xl overflow-hidden border-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
              <h3 className="text-lg font-bold mb-1">Pure & Peak Assistant</h3>
              <p className="text-sm text-white/90">
                Get personalized beauty recommendations
              </p>
            </div>

            {/* Chat Content */}
            <div className="p-6 bg-background">
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    P
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">
                      Hi! 👋 I'm your Pure & Peak beauty assistant. How can I help you find the perfect skincare products today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Quick questions:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-2 hover:bg-primary hover:text-white transition-colors"
                  asChild
                >
                  <Link to="/chatbot">
                    ✨ Skincare Routine Recommendations
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-2 hover:bg-accent hover:text-white transition-colors"
                  asChild
                >
                  <Link to="/chatbot">
                    💝 Gift Set Suggestions
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-2 hover:bg-primary/80 hover:text-white transition-colors"
                  asChild
                >
                  <Link to="/chatbot">
                    🎁 First-Time Buyer Deals
                  </Link>
                </Button>
              </div>

              {/* Open Full Chat */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity"
                asChild
              >
                <Link to="/chatbot">Open Full Chat</Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
