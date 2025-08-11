import React, { useState } from 'react';
import { ChevronRight, Check, Star, Users, Zap, Shield, ArrowRight, Menu, X } from 'lucide-react';

// Data constants
const FEATURES_DATA = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized infrastructure."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure by Default",
    description: "Enterprise-grade security with end-to-end encryption and compliance."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Work seamlessly with your team in real-time with advanced collaboration tools."
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Sarah Johnson",
    role: "Chief Economist, Global Analytics",
    content: "This platform provided deep insights into market trends, transforming our economic forecasting accuracy.",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Financial Analyst, InvestCorp",
    content: "The best tool we've used for analyzing economic data and boosting our investment strategies.",
    rating: 5
  }
];

const PRICING_DATA = [
  {
    name: "Starter",
    price: "$0",
    period: "per month",
    features: ["Basic analytics", "chatbot economic analysis limited API","Email support"],
    popular: false
  },
  {
    name: "Professional",
    price: "$9",
    period: "per month",
    features: ["Advanced analytics", "Priority support", "Unlimited API access", "Custom integrations", "Advance Analytics AI models "],
    popular: true
  }
];

const NAVIGATION_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Calender", href: "/calender" }
];

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "API", href: "#" }
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" }
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Status", href: "#" }
  ]
};

// UI Components
const Logo = ({ className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold">S</span>
    </div>
    <span className="ml-3 text-xl font-bold text-gray-900">SaasApp</span>
  </div>
);

const Button = ({ variant = "primary", size = "md", className = "", children, ...props }) => {
  const baseClasses = "font-semibold transition-all duration-200 rounded-lg flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    secondary: "border border-gray-300 text-gray-700 hover:border-gray-400",
    outline: "border border-white text-white hover:bg-white hover:text-blue-600",
    ghost: "text-gray-700 hover:text-blue-600"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Section = ({ children, className = "", background = "default" }) => {
  const backgrounds = {
    default: "",
    white: "bg-white",
    gradient: "bg-gradient-to-br from-slate-50 to-blue-50",
    primary: "bg-gradient-to-r from-blue-600 to-purple-600",
    dark: "bg-gray-900"
  };
  
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${backgrounds[background]} ${className}`}>
      {children}
    </section>
  );
};

// Navigation Component
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAVIGATION_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700">
                Sign In
              </button>
              <button className="block w-full text-left px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-lg mt-2">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => (
  <Section>
    <Container>
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
          <span>✨ New: Advanced Analytics Dashboard</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build Your Business
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Faster</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The all-in-one platform that helps teams collaborate, analyze data, and scale their business with powerful tools and insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg">
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="secondary" size="lg">
            Watch Demo
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          {["14-day free trial", "No credit card required", "Cancel anytime"].map((text) => (
            <div key={text} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </Container>
  </Section>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-200">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg w-fit mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Features Section Component
const FeaturesSection = () => (
  <Section background="white" id="features">
    <Container>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything you need to succeed
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to help your team work more efficiently and grow your business.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES_DATA.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </Container>
  </Section>
);

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, rating }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm">
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-4 italic">"{content}"</p>
    <div>
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

// Testimonials Section Component
const TestimonialsSection = () => (
  <Section background="gradient">
    <Container>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trusted by thousands of teams
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TESTIMONIALS_DATA.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </Container>
  </Section>
);

// Pricing Card Component
const PricingCard = ({ name, price, period, features, popular }) => (
  <div className={`relative p-8 rounded-xl ${
    popular 
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200' 
      : 'bg-gray-50 border border-gray-200'
  }`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600 ml-2">{period}</span>
      </div>
    </div>
    
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      variant={popular ? "primary" : "secondary"}
      className="w-full"
    >
      Get Started
    </Button>
  </div>
);

// Pricing Section Component
const PricingSection = () => (
  <Section background="white" id="pricing">
    <Container>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-xl text-gray-600">
          Choose the plan that's right for your team
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_DATA.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </Container>
  </Section>
);

// CTA Section Component
const CTASection = () => (
  <Section background="primary">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ready to transform your workflow?
      </h2>
      <p className="text-xl text-blue-100 mb-8">
        Join thousands of teams who trust our platform to scale their business.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Start Free Trial
        </Button>
        <Button variant="outline" size="lg">
          Contact Sales
        </Button>
      </div>
    </div>
  </Section>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo className="mb-4 text-white" />
          <p className="text-gray-400">
            Building the future of team collaboration and business growth.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-400">
            {FOOTER_LINKS.product.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 SaasApp. All rights reserved.</p>
      </div>
    </Container>
  </footer>
);

// Main App Component
const SaasHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default SaasHomepage;
