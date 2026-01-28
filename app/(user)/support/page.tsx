"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, select your desired items, add them to your cart, and proceed to checkout. You'll be redirected to WhatsApp to complete your order with our team.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We coordinate payment details through WhatsApp after you place your order. Our team will guide you through the available payment options including bank transfer and e-wallet.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 2-5 business days depending on your location. Express shipping options are available for faster delivery.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Yes! Contact us immediately through WhatsApp after placing your order. We can modify or cancel orders that haven't been processed yet.",
  },
  {
    question: "Do you offer refunds or exchanges?",
    answer:
      "We offer exchanges and refunds within 7 days of delivery for products in original condition. Please contact our support team to initiate the process.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking number via WhatsApp. You can use this to track your delivery status.",
  },
  {
    question: "What if I receive a defective product?",
    answer:
      "We apologize for any inconvenience! Contact us immediately with photos of the defect. We'll arrange for a replacement or full refund.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we only ship within Indonesia. Stay tuned for international shipping updates!",
  },
];

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoLink;
    toast.success("Opening your email client...");
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Support Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions or send us a message
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-stretch">
          {/* FAQ Section */}
          <section className="h-full">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl font-bold">FAQ</CardTitle>
                </div>
                <CardDescription>Commonly asked questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Contact Form */}
          <section className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Still need help?
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you shortly
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <form
                  onSubmit={handleContact}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      className="min-h-[120px] flex-1 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full mt-auto">
                    <Mail className="mr-2 h-4 w-4" />
                    Open Email Client
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
