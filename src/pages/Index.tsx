
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // How to use steps
  const howToUseSteps = [
    {
      title: 'Create an Account',
      description: 'Sign up for a Reworx account to get started with your shopping benefits journey.'
    },
    {
      title: 'Connect Your Platforms',
      description: 'Link your e-commerce shopping accounts like Amazon, Flipkart, and more.'
    },
    {
      title: 'Build Your Score',
      description: 'Your shopping patterns generate a trust score that unlocks exclusive benefits.'
    },
    {
      title: 'Enjoy the Benefits',
      description: 'Get access to special discounts, extended trial periods, and preferential rates.'
    },
  ];
  
  // Platform benefits data
  const benefits = [
    {
      title: 'Automatic Analysis',
      description: 'Automatically analyze your e-commerce order data to generate a trustworthiness score.'
    },
    {
      title: 'Exclusive Offers',
      description: 'Get access to exclusive offers, discounts, and perks from our partner companies.'
    },
    {
      title: 'Secure & Private',
      description: 'Your data is encrypted and only used to calculate your trust score, never shared.'
    },
  ];
  
  // Partner types
  const partnerTypes = [
    {
      name: 'E-commerce Platforms',
      description: 'Offer exclusive discounts to trustworthy customers and reduce fraudulent orders.'
    },
    {
      name: 'BNPL Services',
      description: 'Provide better interest rates to customers with high trust scores.'
    },
    {
      name: 'Subscription Services',
      description: 'Offer extended trial periods to users with proven purchasing history.'
    },
  ];
  
  // Handle get started click
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-0">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SlideIn className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Introducing Reworx
                </div>
              </SlideIn>
              
              <FadeIn delay={200}>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                  Your Shopping Habits, <br/>
                  <span className="text-primary">Rewarded</span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={400} className="mt-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
                  Reworx measures your e-commerce reliability, allowing partner companies to offer you exclusive benefits based on your shopping habits.
                </p>
              </FadeIn>
              
              <FadeIn delay={600} className="mt-8">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-8 py-6 h-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </FadeIn>
            </div>
            
            <FadeIn delay={300}>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full filter blur-2xl"></div>
                
                <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-primary/5 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">How To Use Reworx</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Simple steps to get started</p>
                      </div>
                      <img src="/lovable-uploads/4faf26ec-4a33-45c3-a3fe-964fab70e056.png" alt="Reworx" className="w-10 h-10" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-5">
                      {howToUseSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary text-sm font-semibold">{index + 1}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-base">{step.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Button 
                        onClick={handleGetStarted} 
                        className="w-full"
                      >
                        Start Now
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div className="container max-w-6xl mx-auto px-4 md:px-0">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Reworx Benefits You</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Leverage your shopping habits to unlock exclusive benefits and offers from our partner companies.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <FadeIn key={index} delay={index * 150} className="h-full">
                <div className="glass-card p-6 rounded-2xl h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      
      {/* Partner Companies Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 md:px-0">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">For Partner Companies</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Reworx helps businesses identify reliable customers, reducing fraud and enhancing user retention.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((partner, index) => (
              <FadeIn key={index} delay={index * 150} className="h-full">
                <div className="glass-card p-6 rounded-2xl h-full">
                  <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{partner.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4 md:px-0">
          <div className="text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
                Create your Reworx account and start connecting your e-commerce platforms to unlock exclusive benefits.
              </p>
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-8 py-6 h-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
