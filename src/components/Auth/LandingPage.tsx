'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Scissors, ShoppingCart, Heart, Star, Shield, Clock, CreditCard } from 'lucide-react';

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Simple redirect for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 Redirecting authenticated user to dashboard...');
      switch (user.role) {
        case 'admin':
          router.push('/admin-dashboard');
          break;
        case 'provider':
          router.push('/provider-dashboard');
          break;
        case 'user':
        default:
          router.push('/user-dashboard');
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  // If authenticated user somehow reaches here, show loading
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    );
  }

  const services = [
    {
      icon: Home,
      title: "Home Repair",
      description: "Professional handymen for all your home maintenance needs",
      providers: "250+ providers",
      rating: 4.8
    },
    {
      icon: Scissors,
      title: "Beauty & Salon",
      description: "Hair, nails, makeup, and wellness services at your doorstep",
      providers: "180+ providers",
      rating: 4.9
    },
    {
      icon: ShoppingCart,
      title: "Grocery & Delivery",
      description: "Fresh groceries and essentials delivered to your door",
      providers: "320+ providers",
      rating: 4.7
    },
    {
      icon: Heart,
      title: "Pet Care",
      description: "Loving care for your furry friends when you're away",
      providers: "150+ providers",
      rating: 4.9
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Trusted Providers",
      description: "All service providers are verified and background-checked"
    },
    {
      icon: Clock,
      title: "Book Anytime",
      description: "24/7 booking system for your convenience"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple options"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              ServiceHub
            </h1>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-xs sm:text-sm"
              onClick={() => router.push('/register')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              Your One-Stop Service Platform
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
              Connect with trusted professionals for home repair, beauty services, grocery delivery, and pet care. 
              Book instantly, pay securely, and get the job done right.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('#')}
                className="text-base sm:text-lg px-6 sm:px-8 py-3 border-2 border-blue-200 hover:bg-blue-50 w-full sm:w-auto"
              >
                Browse Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">Popular Services</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Discover our most requested services with verified professionals ready to help
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-teal-50">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4">
                  <CardDescription className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      {service.providers}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-700">{service.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">Why Choose ServiceHub?</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We make finding and booking services simple, safe, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to Get Started?
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who trust ServiceHub for their service needs
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/register')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto max-w-xs mx-auto"
          >
            Sign Up Now - It&apos;s Free!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
            <h4 className="text-xl sm:text-2xl font-bold">ServiceHub</h4>
          </div>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Connecting communities through trusted services
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2024 ServiceHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;