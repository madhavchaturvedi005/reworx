
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const navigate = useNavigate();
  
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
    navigate('/dashboard');
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
                  Introducing TrustScore
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
                  TrustScore measures your e-commerce reliability, allowing partner companies to offer you exclusive benefits based on your shopping habits.
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
                
                <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl animate-float">
                  <div className="bg-primary/5 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Trust Score</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account overview</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">TS</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your Score</p>
                        <p className="text-4xl font-bold">85</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">Excellent</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Top 15%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center shadow-sm">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" 
                              alt="Amazon" 
                              className="w-6 h-auto object-contain"
                            />
                          </div>
                          <span className="font-medium">Amazon</span>
                        </div>
                        <span className="text-green-600 text-sm">Connected</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center shadow-sm">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flipkart_logo.svg/1920px-Flipkart_logo.svg.png"
                              alt="Flipkart" 
                              className="w-6 h-auto object-contain"
                            />
                          </div>
                          <span className="font-medium">Flipkart</span>
                        </div>
                        <Button size="sm" className="h-7 text-xs px-3 rounded-full">Connect</Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Master Key</span>
                        <span className="font-mono text-sm">XXXX-XXXX-XXXX</span>
                      </div>
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
            <h2 className="text-3xl font-bold mb-4">How TrustScore Benefits You</h2>
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
              TrustScore helps businesses identify reliable customers, reducing fraud and enhancing user retention.
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
                Create your TrustScore account and start connecting your e-commerce platforms to unlock exclusive benefits.
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
