"use client";

import { JSX, useState } from "react";
import Head from "next/head";
import {
  ChevronRight,
  Globe,
  Truck,
  TrendingUp,
  Award,
  MessageCircle,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

// Define TypeScript interfaces
interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  role: string;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: JSX.Element;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Mwangi",
      location: "Kenya",
      quote:
        "This platform has increased my income by 40% by connecting me directly with buyers who pay fair prices for my produce.",
      role: "Vegetable Farmer",
    },
    {
      id: 2,
      name: "Raj Patel",
      location: "India",
      quote:
        "The market pricing data helps me know when to sell my crops for maximum profit. I can now afford to send my children to school.",
      role: "Rice Farmer",
    },
    {
      id: 3,
      name: "Maria Gonzalez",
      location: "Colombia",
      quote:
        "The offline capabilities allow me to use the service even with limited connectivity in my rural area.",
      role: "Coffee Grower",
    },
  ];

  // Feature cards data
  const features: FeatureCard[] = [
    {
      title: "Direct Market Access",
      description:
        "Connect directly with buyers and eliminate costly middlemen to increase your profits.",
      icon: <Globe className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Logistics Coordination",
      description:
        "Simplified transportation and delivery coordination to get your produce to market.",
      icon: <Truck className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Real-time Market Pricing",
      description:
        "Access up-to-date market prices to make informed decisions about when to sell.",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Quality Certification",
      description:
        "Get your produce certified to command premium prices from quality-conscious buyers.",
      icon: <Award className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Multilingual Support",
      description:
        "Use the platform in your local language with voice interface options for limited literacy.",
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Seasonal Planning",
      description:
        "Plan your planting and harvesting based on historical market data and predictions.",
      icon: <Calendar className="h-8 w-8 text-green-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>FarmConnect | Digital Agricultural Marketplace</title>
        <meta
          name="description"
          content="Empowering smallholder farmers through direct market access and fair prices"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-green-600 rounded-full mr-2"></div>
                <span className="text-xl font-bold text-gray-900">
                  FarmConnect
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sticky md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium"
              >
                Success Stories
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium"
              >
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium"
              >
                Login
              </a>
              <a
                href="#"
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700"
              >
                Sign Up
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
              >
                Success Stories
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
              >
                Contact
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
              >
                Login
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700 text-center my-2"
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Empowering Farmers, Connecting Markets
                </h1>
                <p className="mt-4 text-lg md:text-xl text-green-100 max-w-lg">
                  A digital marketplace that connects smallholder farmers
                  directly with buyers, eliminating middlemen and increasing
                  farmer income.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-green-800 rounded-lg opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Image src="/hero.jpg" width={500} height={500} alt="hero" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-16 bg-wave-pattern bg-repeat-x"></div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  40%
                </div>
                <div className="text-gray-600">
                  Average Increase in Farmer Income
                </div>
              </div>

              <div className="text-center p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  12,000+
                </div>
                <div className="text-gray-600">Farmers Connected</div>
              </div>

              <div className="text-center p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  250+
                </div>
                <div className="text-gray-600">Buyers on Platform</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Platform Features
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform is designed specifically for the unique needs of
                smallholder farmers in developing regions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                FarmConnect makes it easy to sell your produce directly to
                buyers at fair prices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Register & List Produce
                </h3>
                <p className="mt-2 text-gray-600">
                  Create your account and list your available produce with
                  details about quantity and quality.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Connect with Buyers
                </h3>
                <p className="mt-2 text-gray-600">
                  Buyers browse listings and contact you directly through the
                  platform with offers.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  Get Paid & Deliver
                </h3>
                <p className="mt-2 text-gray-600">
                  Accept offers, coordinate delivery, and receive secure
                  payments through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Success Stories
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from farmers who have transformed their livelihoods using
                our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0 flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <span className="text-green-600 font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="italic text-gray-600">
                    `&quot{testimonial.quote}&quot`
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Farming Business?
            </h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
              Join thousands of farmers who are selling directly to buyers and
              increasing their income.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
              >
                Sign Up Now
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions or need help? Get in touch with our team.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <form className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-green-600 rounded-full mr-2"></div>
                <span className="text-xl font-bold text-white">
                  FarmConnect
                </span>
              </div>
              <p className="text-gray-300">
                Empowering smallholder farmers with direct market access and
                fair prices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Farmer Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Buyer Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 mb-4 md:mb-0">
                © 2025 FarmConnect. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
