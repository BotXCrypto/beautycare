import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about our products, ordering, shipping, and more.
          </p>

          <div className="space-y-6">
            {/* Delivery & Shipping */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Delivery & Shipping</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does delivery take to DG Khan?</AccordionTrigger>
                  <AccordionContent>
                    For customers in Dera Ghazi Khan (DG Khan) and surrounding areas, we offer express delivery 
                    within <strong>2 business days</strong>. We process orders same-day if placed before 2 PM. 
                    You'll receive tracking information via SMS and email once your order is dispatched.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What about delivery outside DG Khan?</AccordionTrigger>
                  <AccordionContent>
                    For deliveries to other cities across Pakistan, delivery typically takes <strong>3-4 business days</strong>. 
                    This includes major cities like Lahore, Karachi, Islamabad, Multan, Faisalabad, and more. Remote areas 
                    may take slightly longer. All orders are shipped via trusted courier services with full tracking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Do you offer free shipping?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer free shipping on all orders above PKR 10,000. For orders below this amount, 
                    a standard shipping fee of PKR 500 applies for DG Khan and PKR 800 for other cities in Pakistan.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I track my order?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! Once your order is shipped, you'll receive a tracking number via email and SMS. 
                    You can also track your order anytime by visiting the "My Orders" section in your account. 
                    You'll see real-time updates on your delivery status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What if I'm not home during delivery?</AccordionTrigger>
                  <AccordionContent>
                    Our courier partner will attempt delivery up to 3 times. If you're unavailable, they'll leave a 
                    notice with alternative pickup options. You can also coordinate delivery timing by contacting 
                    our customer support with your tracking number.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept two convenient payment methods:
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li><strong>Cash on Delivery (COD)</strong> - Pay when you receive your order</li>
                      <li><strong>Online Banking / Stripe</strong> - Secure online payment via bank transfer or credit/debit card</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-2">
                  <AccordionTrigger>Is Cash on Delivery available everywhere?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Cash on Delivery (COD) is available across all areas we deliver to in Pakistan, 
                    including DG Khan and other major cities. Simply select "Cash on Delivery" at checkout 
                    and pay the courier when your order arrives.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-3">
                  <AccordionTrigger>Is online payment secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, absolutely! We use Stripe, a globally trusted payment processor with bank-level security. 
                    All transactions are encrypted with SSL/TLS technology. We never store your credit card information 
                    on our servers. Your payment details are handled directly by Stripe's secure infrastructure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-4">
                  <AccordionTrigger>Can I pay with multiple currencies?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We accept payments in multiple currencies including PKR, USD, EUR, GBP, AED, SAR, and INR. 
                    Prices are displayed in your selected currency, and payments are processed using real-time exchange rates. 
                    Select your preferred currency from the currency selector in the navigation bar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Orders & Returns */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Orders & Returns</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="order-1">
                  <AccordionTrigger>How do I cancel my order?</AccordionTrigger>
                  <AccordionContent>
                    You can cancel your order within 2 hours of placing it by contacting our customer support. 
                    Once an order is dispatched, cancellation is not possible, but you can refuse the delivery 
                    or initiate a return within 7 days of receiving the product.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order-2">
                  <AccordionTrigger>What is your return policy?</AccordionTrigger>
                  <AccordionContent>
                    We offer a <strong>7-day return policy</strong> from the date of delivery. Products must be unused, 
                    in original packaging, with all accessories and tags intact. To initiate a return, visit the 
                    "Returns" page or contact customer support. Note that shipping charges are non-refundable 
                    unless the product is defective.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order-3">
                  <AccordionTrigger>How long does a refund take?</AccordionTrigger>
                  <AccordionContent>
                    Once we receive and inspect your returned item, refunds are processed within 3-5 business days. 
                    For COD orders, refunds are issued via bank transfer. For online payments, refunds are credited 
                    back to your original payment method within 7-10 business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order-4">
                  <AccordionTrigger>What if my product is damaged or defective?</AccordionTrigger>
                  <AccordionContent>
                    If you receive a damaged or defective product, contact us immediately with photos of the damage. 
                    We'll arrange a free pickup and replacement or full refund including shipping charges. 
                    All products come with manufacturer warranties - details are included with each product.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Products & Warranty */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Products & Warranty</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="product-1">
                  <AccordionTrigger>Are all products brand new?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All our products are 100% authentic, brand new, and come in original sealed packaging 
                    from authorized distributors. We never sell refurbished or used items unless explicitly mentioned.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="product-2">
                  <AccordionTrigger>Do products come with warranty?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All electronic products come with official manufacturer warranty. Warranty period varies 
                    by product and brand (typically 1-2 years). Warranty details are mentioned on each product page. 
                    Keep your invoice and warranty card safe for warranty claims.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="product-3">
                  <AccordionTrigger>How do I claim warranty?</AccordionTrigger>
                  <AccordionContent>
                    For warranty claims, contact the manufacturer's service center directly with your invoice and 
                    warranty card. Service center details are provided with the product. You can also reach out to 
                    our customer support, and we'll assist you with the warranty claim process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="product-4">
                  <AccordionTrigger>How can I check product availability?</AccordionTrigger>
                  <AccordionContent>
                    Product availability is shown in real-time on each product page. If a product shows "In Stock", 
                    you can add it to your cart and complete the purchase. Out of stock items cannot be purchased, 
                    but you can add them to your wishlist to receive notifications when they're back in stock.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Account & Support */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Account & Support</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="account-1">
                  <AccordionTrigger>Do I need an account to order?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you need to create an account to place orders. This allows you to track orders, 
                    save your wishlist, view order history, and enjoy a faster checkout experience. 
                    Creating an account is quick, free, and secure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-2">
                  <AccordionTrigger>I forgot my password. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    Click on "Forgot Password" on the login page. Enter your registered email address, 
                    and we'll send you a password reset link. Follow the link to create a new password. 
                    If you don't receive the email within 5 minutes, check your spam folder.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-3">
                  <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
                  <AccordionContent>
                    You can reach our customer support team via:
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Contact form on our "Contact Us" page</li>
                      <li>Email: support@electroshop.com</li>
                      <li>Phone: +92 300 1234567 (Mon-Sat, 9 AM - 6 PM)</li>
                      <li>WhatsApp: +92 300 1234567</li>
                    </ul>
                    Our team typically responds within 24 hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="account-4">
                  <AccordionTrigger>Can I change my delivery address after ordering?</AccordionTrigger>
                  <AccordionContent>
                    Yes, but only before the order is dispatched. Contact our customer support immediately 
                    with your order number and new address. Once the order is shipped, the delivery address 
                    cannot be changed. You can then refuse delivery and place a new order with the correct address.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>

          {/* Still have questions */}
          <Card className="p-8 text-center mt-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
