import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                  <p className="text-muted-foreground mb-3">
                    Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license, you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to decompile or reverse engineer any software</li>
                    <li>Remove any copyright or proprietary notations</li>
                    <li>Transfer the materials to another person</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
                  <p className="text-muted-foreground">
                    We strive to provide accurate product descriptions, specifications, and pricing information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Pricing and Availability</h2>
                  <p className="text-muted-foreground">
                    All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. Product availability is subject to change, and we make no warranty that products will be available at any particular time or in any particular quantity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Orders and Payment</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>By placing an order, you represent that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You are legally capable of entering into binding contracts</li>
                      <li>You are at least 18 years of age</li>
                      <li>The information you provide is accurate and complete</li>
                      <li>You have authorization to use the payment method provided</li>
                    </ul>
                    <p className="mt-3">
                      We reserve the right to refuse or cancel any order for any reason, including suspected fraud or unauthorized transactions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
                  <p className="text-muted-foreground">
                    Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss and title for products pass to you upon delivery to the carrier.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
                  <p className="text-muted-foreground">
                    Our return policy allows returns within a specified period from the date of delivery, subject to certain conditions. Products must be unused, in original packaging, and in resalable condition. Some items may be non-returnable. Please refer to our Returns page for detailed information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Warranties</h2>
                  <p className="text-muted-foreground">
                    Products are covered by manufacturer warranties as specified. We make no additional warranties beyond those provided by manufacturers. Any warranty claims should be directed to the manufacturer in accordance with their warranty terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues. Our total liability shall not exceed the amount paid by you for the product in question.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                  <p className="text-muted-foreground mb-3">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide accurate and complete information</li>
                    <li>Update your information as needed</li>
                    <li>Notify us immediately of unauthorized access</li>
                    <li>Not share your account with others</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content on this website, including text, graphics, logos, images, and software, is our property or that of our licensors and is protected by copyright and intellectual property laws. Unauthorized use of any content may violate copyright, trademark, and other laws.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the appropriate courts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us through our Contact Us page.
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

export default Terms;
