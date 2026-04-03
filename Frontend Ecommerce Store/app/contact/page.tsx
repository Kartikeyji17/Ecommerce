'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@store.com',
      description: 'We&apos;ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (800) 123-4567',
      description: 'Mon-Fri, 9am-6pm EST',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Commerce Street',
      description: 'New York, NY 10001',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9am-6pm',
      description: 'Sat-Sun: 10am-4pm EST',
    },
  ]

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day money-back guarantee on all products. Items must be in original condition with packaging.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 150 countries. International shipping times vary, typically 10-21 business days.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You&apos;ll receive a tracking number via email once your order ships. You can track it on our website anytime.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay for your convenience and security.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-leading encryption and security measures to protect your data.',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-pretty">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond 
            as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="border-0 text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {method.title}
                    </h3>
                    <p className="font-medium text-sm mb-1 text-foreground">
                      {method.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground">
                Send us a Message
              </h2>
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Thank you! We&apos;ve received your message and will get back to you soon.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1.5 min-h-32 resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                We&apos;re here to help with any inquiries about our products and services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Response Time
                </h4>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to all inquiries within 24 hours. If your matter is urgent, 
                  please call us directly during business hours.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Office Location
                </h4>
                <p className="text-sm text-muted-foreground">
                  123 Commerce Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Connect With Us
                </h4>
                <p className="text-sm text-muted-foreground">
                  Follow us on social media for updates, promotions, and customer stories.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
