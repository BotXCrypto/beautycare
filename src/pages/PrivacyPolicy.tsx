import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Database, Share2, Lock, Cookie, UserCheck, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              How Pure & Peak protects your personal information<br />
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Our Commitment</h2>
                  </div>
                  <p className="text-muted-foreground">
                    At Pure & Peak, we respect your privacy and are committed to protecting your personal data. 
                    This privacy policy explains how we collect, use, and safeguard your information when you shop with us. 
                    We operate from Dera Ghazi Khan, Pakistan and serve customers nationwide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Information We Collect</h2>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-2">Personal Information:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Full name and phone number</li>
                        <li>Email address (if provided)</li>
                        <li>Delivery address (complete address with city and postal code)</li>
                        <li>Order history and purchase details</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Payment Information:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Transaction IDs for EasyPaisa/Bank payments</li>
                        <li>Payment method preferences</li>
                        <li>We do NOT store bank account numbers or EasyPaisa PINs</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Technical Information:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Device type and browser information</li>
                        <li>IP address for security purposes</li>
                        <li>Pages visited on our website</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Order Processing:</strong> To process and deliver your orders</li>
                    <li><strong className="text-foreground">Communication:</strong> To contact you about orders, delivery status, and support</li>
                    <li><strong className="text-foreground">WhatsApp Updates:</strong> To send order confirmations and tracking via WhatsApp</li>
                    <li><strong className="text-foreground">Customer Support:</strong> To respond to your queries and resolve issues</li>
                    <li><strong className="text-foreground">Improvement:</strong> To improve our products and services</li>
                    <li><strong className="text-foreground">Marketing:</strong> To send promotional offers (only with your consent)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Share2 className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Information Sharing</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="font-semibold text-foreground">We do NOT sell or rent your personal information to anyone.</p>
                    <p>We may share your information only with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong className="text-foreground">Delivery Partners:</strong> To deliver your orders (name, phone, address only)</li>
                      <li><strong className="text-foreground">Payment Verification:</strong> To verify EasyPaisa/Bank transactions</li>
                      <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Data Security</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p>We take your data security seriously:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your data is stored securely with encryption</li>
                      <li>We use secure connections (HTTPS) for all transactions</li>
                      <li>Access to your data is limited to authorized personnel only</li>
                      <li>We regularly update our security measures</li>
                      <li>Payment screenshots are stored securely and deleted after verification</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cookie className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Cookies</h2>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Our website uses cookies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Remember your cart items</li>
                      <li>Keep you logged in</li>
                      <li>Remember your currency preference</li>
                      <li>Improve website performance</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      You can disable cookies in your browser settings, but this may affect website functionality.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                      <li><strong className="text-foreground">Correction:</strong> Ask us to correct inaccurate information</li>
                      <li><strong className="text-foreground">Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                      <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications</li>
                    </ul>
                    <p className="mt-4">
                      To exercise these rights, contact us via WhatsApp or through our Contact page.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are intended for users 18 years and older. We do not knowingly collect personal 
                    information from children under 18. If you believe we have collected information from a minor, 
                    please contact us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of significant changes 
                    via WhatsApp or website notification. We encourage you to review this page periodically. 
                    Continued use of our services after changes constitutes acceptance of the updated policy.
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
                    <p className="mb-4">For any privacy-related questions or concerns:</p>
                    <div className="space-y-2">
                      <p><strong className="text-foreground">WhatsApp:</strong> 0310-1362920</p>
                      <p><strong className="text-foreground">Business:</strong> Pure & Peak</p>
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

export default PrivacyPolicy;
