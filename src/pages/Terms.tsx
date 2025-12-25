import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Package, CreditCard, Truck, Users, Scale, Phone } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">
              Terms and conditions for Pure & Peak & Beauty Products<br />
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
                  </div>
                  <p className="text-muted-foreground">
                    By accessing and using Pure & Peak website and placing orders, you agree to be bound by these Terms of Service. 
                    These terms apply to all customers, visitors, and others who access our services. 
                    If you disagree with any part of these terms, please do not use our website or services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Products & Ordering</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Product Information:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>We sell authentic cosmetics and beauty products</li>
                      <li>Product images are for illustration; actual colors may vary slightly</li>
                      <li>We strive for accuracy but cannot guarantee all descriptions are error-free</li>
                      <li>Products are subject to availability and may be discontinued without notice</li>
                    </ul>
                    <p className="mt-4"><strong className="text-foreground">Placing Orders:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>By placing an order, you confirm you are 18 years or older</li>
                      <li>You agree to provide accurate contact and delivery information</li>
                      <li>We reserve the right to refuse or cancel any order</li>
                      <li>Order confirmation does not guarantee product availability</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Pricing & Payment</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Prices:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All prices are in Pakistani Rupees (PKR)</li>
                      <li>Prices include applicable taxes unless stated otherwise</li>
                      <li>We reserve the right to change prices without prior notice</li>
                      <li>Price at time of order placement will be honored</li>
                    </ul>
                    <p className="mt-4"><strong className="text-foreground">Payment Methods:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Cash on Delivery (COD):</strong> Pay when you receive your order. Extra COD charges apply (PKR 150 in Dera Ghazi Khan, varies for other cities)</li>
                      <li><strong>EasyPaisa:</strong> Transfer to our EasyPaisa account before dispatch</li>
                      <li><strong>Bank Transfer (SadaPay):</strong> Transfer to our bank account before dispatch</li>
                    </ul>
                    <p className="mt-4 text-sm bg-amber-50 text-amber-800 p-3 rounded-lg">
                      <strong>Note:</strong> For EasyPaisa and Bank payments, orders are processed after payment verification. 
                      Please send transaction ID or screenshot for faster processing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Shipping & Delivery</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Delivery Times (Estimated):</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Dera Ghazi Khan:</strong> 1-2 business days</li>
                      <li><strong>Major Punjab Cities:</strong> 3-4 business days</li>
                      <li><strong>Other Cities:</strong> 4-7 business days</li>
                    </ul>
                    <p className="mt-4"><strong className="text-foreground">Delivery Conditions:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Delivery times are estimates and not guaranteed</li>
                      <li>Delays may occur due to weather, holidays, or other circumstances</li>
                      <li>You must be available to receive the order at the provided address</li>
                      <li>If unavailable, delivery will be attempted again (additional charges may apply)</li>
                    </ul>
                    <p className="mt-4"><strong className="text-foreground">Free Shipping:</strong></p>
                    <p>Orders above PKR 100,000 qualify for free shipping nationwide.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Returns & Refunds</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Our return policy is designed to protect both customers and maintain product hygiene standards for cosmetics.</p>
                    <p className="mt-2"><strong className="text-foreground">Returns Accepted For:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wrong product delivered</li>
                      <li>Damaged or broken products</li>
                      <li>Defective or quality issues</li>
                    </ul>
                    <p className="mt-4"><strong className="text-foreground">Returns NOT Accepted For:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Change of mind</li>
                      <li>Opened or used products (hygiene reasons)</li>
                      <li>Requests after 24 hours of delivery</li>
                      <li>Orders refused at delivery</li>
                    </ul>
                    <p className="mt-4 text-sm">
                      Please visit our <a href="/returns" className="text-primary hover:underline">Returns & Refunds</a> page for complete policy details.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">User Accounts</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p>When you create an account with us:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You must provide accurate and complete information</li>
                      <li>You are responsible for maintaining your account security</li>
                      <li>You must notify us of any unauthorized access</li>
                      <li>One account per person/household</li>
                      <li>We may suspend accounts for policy violations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Products should be used as directed on packaging</li>
                      <li>We are not responsible for allergic reactions; please check ingredients</li>
                      <li>Always perform a patch test for new skincare products</li>
                      <li>Our liability is limited to the value of the product purchased</li>
                      <li>We are not liable for indirect or consequential damages</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                    Continued use of our services constitutes acceptance of modified terms. 
                    We recommend reviewing this page periodically for updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Contact Us</h2>
                  </div>
                  <div className="text-muted-foreground">
                    <p className="mb-4">If you have questions about these Terms of Service, please contact us:</p>
                    <div className="space-y-2">
                      <p><strong className="text-foreground">WhatsApp:</strong> 0310-1362920</p>
                      <p><strong className="text-foreground">Location:</strong> Dera Ghazi Khan, Punjab, Pakistan</p>
                    </div>
                  </div>
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

export default Terms;
