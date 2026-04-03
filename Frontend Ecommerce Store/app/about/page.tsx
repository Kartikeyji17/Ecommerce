'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Heart, Zap, Users } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'Every product is carefully curated and tested to ensure the highest standards',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously explore new products and technologies to serve you better',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority, backed by exceptional support and service',
    },
  ]

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Products' },
    { number: '15+', label: 'Years Experience' },
    { number: '99.8%', label: 'Satisfaction Rate' },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-pretty">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Founded with a passion for quality and customer excellence, we&apos;ve grown into a trusted 
            destination for premium products. Our journey is built on integrity, innovation, and a 
            genuine commitment to your satisfaction.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide exceptional products and services that enhance the lives of our customers. 
                  We believe in creating meaningful experiences through quality, reliability, and 
                  outstanding customer care that goes beyond expectations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and beloved brand in our industry, recognized for our 
                  commitment to excellence, innovation, and sustainability. We aspire to create 
                  a positive impact on our customers, communities, and the planet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-0">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            What Sets Us Apart
          </h2>
          <div className="space-y-4">
            {[
              'Carefully curated product selection',
              'Competitive pricing without compromising quality',
              'Fast and reliable shipping worldwide',
              'Hassle-free returns and exchanges',
              '24/7 customer support team',
              'Sustainable and ethical sourcing',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Our diverse team of passionate professionals is dedicated to delivering excellence every day. 
            From product sourcing to customer service, each member brings expertise and care to ensure 
            your experience is exceptional.
          </p>
          <Card>
            <CardContent className="pt-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe that great customer experiences come from a team that truly cares. 
                Our culture emphasizes collaboration, continuous learning, and a commitment to 
                making a positive difference.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explore our collection and discover why customers trust us with their needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
