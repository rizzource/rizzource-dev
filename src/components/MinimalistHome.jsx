"use client"

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Users2, 
  Clock, 
  Sparkles, 
  Target, 
  Zap,
  Star,
  Waves 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import logoLight from "@/assets/rizzource-logo-light.png";
import logoDark from "@/assets/rizzource-logo-dark.png";
import cravathLogo from "@/assets/firms/cravath.png";
import wachtellLogo from "@/assets/firms/wachtell.png";
import sullivanLogo from "@/assets/firms/sullivan-cromwell.png";
import davisPolkLogo from "@/assets/firms/davis-polk.jpg";
import kirklandLogo from "@/assets/firms/kirkland-ellis.jpg";
import skaddenLogo from "@/assets/firms/skadden.jpg";

const MinimalistHome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Parallax and scroll effects
  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroScale = 1 + scrollY / 2000;

  // Success metrics
  const metrics = [
    { icon: Users2, value: "847", label: "1Ls Placed", sublabel: "Summer 2024" },
    { icon: Clock, value: "12", label: "Days Average", sublabel: "To First Callback" },
    { icon: TrendingUp, value: "94%", label: "Success Rate", sublabel: "For Active Users" },
    { icon: Award, value: "V100", label: "Firm Placements", sublabel: "Including V10" }
  ];

  // Student testimonials with real outcomes
  const testimonials = [
    {
      name: "Sarah Chen",
      school: "Columbia Law '26",
      outcome: "Summer Associate at Cravath",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      quote: "RIZZource's AI tools helped me craft a cover letter that actually got me noticed. I had 3 callbacks within a week."
    },
    {
      name: "Marcus Johnson",
      school: "NYU Law '26",
      outcome: "1L SA at Sullivan & Cromwell",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote: "The resume builder caught details I would've missed. Worth every second of my time."
    },
    {
      name: "Natalie Brooks",
      school: "Harvard Law '26",
      outcome: "Summer at Wachtell",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      quote: "I was overwhelmed until I found RIZZource. The job aggregation saved me hours every day."
    }
  ];

  const heroTestimonials = [
    {
      name: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Emily Zhang",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      name: "Jordan Williams",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  ];

  // Top firm logos where students landed
  const firmLogos = [
    { name: "Cravath", logo: cravathLogo },
    { name: "Wachtell", logo: wachtellLogo },
    { name: "Sullivan & Cromwell", logo: sullivanLogo },
    { name: "Davis Polk", logo: davisPolkLogo },
    { name: "Kirkland & Ellis", logo: kirklandLogo },
    { name: "Skadden", logo: skaddenLogo },
  ];

  return (
    <div className="min-h-screen bg-warm-cream text-charcoal font-sans selection:bg-electric-teal/30 overflow-x-hidden">
      
      {/* Magical Background Elements */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${(mousePos.x - (typeof window !== "undefined" ? window.innerWidth : 1920) / 2) * 0.02}px, ${(mousePos.y - (typeof window !== "undefined" ? window.innerHeight : 1080) / 2) * 0.02}px)`,
        }}
      >
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-electric-teal/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-ai-violet/20 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10">
        
        {/* Immersive Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-12 px-6"
          style={{ opacity: heroOpacity, transform: `scale(${heroScale})` }}
        >
          <div className="container relative z-10 text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-soft-teal border border-electric-teal/20 text-deep-teal font-black uppercase tracking-[0.2em] text-[10px] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-3 w-3 animate-pulse" />
              The Law Student Meta
            </div>

            {/* Hero Title */}
            <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter text-charcoal mb-8 uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              LEGAL <br />
              <span className="relative inline-block">
                RIZZ
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-electric-teal/40"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
              OURCE
            </h1>

            {/* Hero Subtitle */}
            <p className="max-w-2xl mx-auto text-xl md:text-2xl font-medium text-warm-gray leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Stop grinding resumes. Start landing offers. The AI-powered edge for 1Ls who aim for BigLaw dominance.
            </p>

            {/* CTA Button + Social Proof */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Button
                onClick={() => navigate('/jobs')}
                size="xl"
                className="h-20 px-12 rounded-full bg-electric-teal hover:bg-deep-teal text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-electric-teal/30 transition-all hover:scale-110 active:scale-95 group"
              >
                Build Your Future
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
              
              <div className="flex -space-x-4">
                {heroTestimonials.map((t, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full border-4 border-warm-cream bg-soft-teal overflow-hidden"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-warm-cream bg-charcoal flex items-center justify-center text-[10px] font-black text-white">
                  +847
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Magic Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-warm-gray/50">
            {/* Scroll for Magic */}
            <div className="w-[1px] h-20 bg-gradient-to-b from-electric-teal to-transparent" />
          </div>
        </section>

        {/* Horizontal Scroll Firms Section */}
        <section className="py-24 overflow-hidden bg-charcoal text-warm-cream">
          <div className="flex whitespace-nowrap animate-infinite-scroll">
            {[...firmLogos, ...firmLogos].map((firm, idx) => (
              <div
                key={idx}
                className="flex items-center gap-20 px-10"
              >
                <img 
                  src={firm.logo} 
                  alt={firm.name}
                  className="h-12 w-auto grayscale brightness-200 opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* AI Magic Grid - Success Metrics */}
        <section className="py-32 px-6">
          <div className="container mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-xl">
                <Badge className="bg-ai-violet/10 text-ai-violet border-ai-violet/20 font-black uppercase tracking-widest px-4 py-1 mb-6">
                  AI-First Engineering
                </Badge>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase">
                  The Arsenal for <br />
                  <span className="text-electric-teal">BigLaw Dominance</span>
                </h2>
              </div>
              <p className="max-w-xs text-warm-gray font-bold text-sm uppercase tracking-wider leading-relaxed">
                Hand-built algorithms that parse firm culture, diversity metrics, and partner preferences in real-time.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Large Feature Card */}
              <div className="lg:col-span-8 group cursor-pointer">
                <Card className="h-full border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
                  <CardContent className="p-12 relative h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Target className="w-64 h-64 text-electric-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-3xl bg-soft-teal flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                        <Sparkles className="w-8 h-8 text-electric-teal" />
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tight mb-4">
                        Hyper-Personalized <br />
                        Resume Sync
                      </h3>
                      <p className="text-warm-gray text-lg max-w-md font-medium">
                        Our AI doesn't just check typos. It rewrites your academic wins to match the "Firm Vibe" of every Vault 100 office.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/jobs')}
                      variant="link"
                      className="p-0 text-electric-teal font-black uppercase tracking-widest text-xs w-fit group"
                    >
                      Explore Tech{" "}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Smaller Feature Card */}
              <div className="lg:col-span-4">
                <Card className="h-full border-none bg-charcoal text-warm-cream shadow-2xl rounded-[3rem] overflow-hidden group">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 rounded-3xl bg-electric-teal/20 flex items-center justify-center mb-8">
                      <Zap className="w-8 h-8 text-electric-teal" />
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight mb-4">
                      Auto <br />
                      Networking
                    </h3>
                    <p className="text-warm-cream/60 text-lg font-medium mb-8">
                      Instantly connect with alumni and generate high-conversion outreach that actually gets responses.
                    </p>
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-electric-teal w-3/4 animate-pulse" />
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-ai-violet w-1/2 animate-pulse delay-75" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Student Success Stories */}
        <section className="py-32 bg-butter-yellow overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <Waves className="w-full h-full text-charcoal/10" />
          </div>
          
          <div className="container mx-auto px-6 text-center">
            
            {/* Scrolling Background Text */}
            <h2
              className="text-8xl md:text-[15rem] font-black uppercase tracking-tighter text-charcoal/10 leading-none select-none transition-transform duration-100"
              style={{ transform: `translateX(${(scrollY - 2000) * 0.2}px)` }}
            >
              SUCCESS_LANDED_OFFERS_V10_MAGIC
            </h2>
            
            {/* Featured Testimonial */}
            <div className="relative -mt-10 md:-mt-32 z-10 bg-white p-12 md:p-24 rounded-[4rem] shadow-2xl max-w-4xl mx-auto border-8 border-charcoal">
              <div className="flex gap-1 mb-8 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-8 w-8 fill-charcoal text-charcoal" />
                ))}
              </div>
              <p className="text-2xl md:text-4xl font-black uppercase italic leading-tight text-charcoal mb-12">
                "I went from zero callbacks to 3 summer associate offers at V10 firms. RIZZource is literally the cheat code for BigLaw."
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-full bg-ai-violet border-4 border-charcoal overflow-hidden">
                  <img 
                    src={testimonials[0].image} 
                    alt={testimonials[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-black uppercase">{testimonials[0].name}</h4>
                  <p className="font-bold text-warm-gray uppercase tracking-widest text-xs">{testimonials[0].school}</p>
                </div>
              </div>
            </div>

            {/* Additional Testimonials Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
              {testimonials.slice(1).map((testimonial, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-4 border-charcoal/10 hover:border-electric-teal/50 bg-white rounded-3xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-electric-teal"
                      />
                      <div className="flex-1 text-left">
                        <h3 className="font-black text-lg uppercase">{testimonial.name}</h3>
                        <p className="text-sm text-warm-gray font-bold uppercase tracking-wider">{testimonial.school}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-soft-teal rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-electric-teal flex-shrink-0" />
                      <span className="text-sm font-black text-deep-teal uppercase tracking-wide">{testimonial.outcome}</span>
                    </div>

                    <p className="text-charcoal/70 italic leading-relaxed font-medium text-left">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 px-6">
          <div className="container mx-auto">
            
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
                Your Path to <span className="text-electric-teal">BigLaw</span>
              </h2>
              <p className="text-xl text-warm-gray font-bold uppercase tracking-wider max-w-2xl mx-auto">
                A proven system that works for 1Ls
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto relative">
              {[
                {
                  step: "1",
                  title: "Discover Opportunities",
                  description: "Access curated 1L positions from top firms, all in one place. No more endless searching.",
                  icon: "🎯"
                },
                {
                  step: "2",
                  title: "Perfect Your Materials",
                  description: "AI-powered resume and cover letter tools that highlight what firms actually want to see.",
                  icon: "✨"
                },
                {
                  step: "3",
                  title: "Land Your Offer",
                  description: "Join 847+ students who secured their dream 1L summer positions this cycle.",
                  icon: "🎉"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center space-y-4">
                    {/* Icon Circle */}
                    <div className="relative inline-block">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-electric-teal to-ai-violet flex items-center justify-center text-5xl shadow-2xl">
                        {item.icon}
                      </div>
                      {/* Step Number Badge */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-warm-cream border-4 border-charcoal flex items-center justify-center font-black text-xl shadow-md">
                        {item.step}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-8">
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                      <p className="text-warm-gray font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+48px)] w-[calc(100%-96px)] h-1 bg-gradient-to-r from-electric-teal via-ai-violet to-electric-teal/30 opacity-30"
                      style={{ zIndex: -1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Magical CTA */}
        <section id="cta" className="py-40 px-6 overflow-hidden">
          <div className="container mx-auto text-center relative">
            <div className="relative z-10">
              <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-charcoal mb-12 leading-[0.85]">
                Ready to <br />
                <span className="text-electric-teal inline-block hover:scale-110 transition-transform cursor-pointer">
                  LEVEL UP?
                </span>
              </h2>
              <p className="text-xl font-bold uppercase tracking-[0.2em] text-warm-gray mb-12">
                Join 847+ Law Students Coding Their Future.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <Button
                  onClick={() => navigate('/jobs')}
                  size="xl"
                  className="h-24 px-16 rounded-[2rem] bg-charcoal text-warm-cream font-black uppercase tracking-widest text-lg hover:bg-deep-teal transition-all hover:scale-105 shadow-2xl"
                >
                  Get Unlimited Access
                </Button>
                <span className="text-sm font-black uppercase tracking-widest text-warm-gray/40">
                  No Credit Card Needed / Cancel Anytime
                </span>
              </div>
            </div>

            {/* Background Text Effect */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
              <span className="text-[25rem] font-black uppercase">RIZZ</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MinimalistHome;