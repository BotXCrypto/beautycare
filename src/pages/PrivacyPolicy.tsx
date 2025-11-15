import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p className="text-muted-foreground">
                    We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website and make purchases from our online store.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong>Personal Information:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Name, email address, and phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through our payment partners)</li>
                      <li>Order history and purchase preferences</li>
                    </ul>
                    <p className="mt-4"><strong>Technical Information:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and deliveries</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send promotional emails and special offers (with your consent)</li>
                    <li>Improve our website and shopping experience</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                  <p className="text-muted-foreground mb-3">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Shipping companies to deliver your orders</li>
                    <li>Payment processors to handle transactions securely</li>
                    <li>Service providers who help us operate our business</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
                  <p className="text-muted-foreground">
                    Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser, but disabling cookies may affect website functionality.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                  <p className="text-muted-foreground mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access your personal data we hold</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Withdraw consent for marketing communications</li>
                    <li>Request data portability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy or our data practices, please contact us through our Contact Us page or email our support team.
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

export default PrivacyPolicy;
