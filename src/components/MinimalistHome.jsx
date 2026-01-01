import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, TrendingUp, Award, Users2, Clock } from "lucide-react";
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
    <div className="relative min-h-screen bg-background">
      {/* Hero Section with Aspirational Imagery */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
          </div>
          <div className="absolute bottom-40 right-20 animate-float-delayed">
            <div className="w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="RIZZource"
              className="w-auto"
              style={{ height: 200 }}
            />
          </div>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              <span>Trusted by 1Ls at Top Law Schools</span>
            </div> */}

            <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              Land Your{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Dream 1L Summer
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join hundreds of 1Ls who secured BigLaw positions using AI-powered tools and curated opportunities
            </p>

            {/* Hero Image - Aspirational */}
            <div className="relative mx-auto max-w-4xl mt-12 mb-12">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=600&fit=crop"
                alt="Law students celebrating success"
                className="rounded-2xl shadow-2xl w-full h-[300px] sm:h-[400px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-background/95 backdrop-blur-sm rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex -space-x-3">
                    {heroTestimonials.map((t, i) => (
                      <img
                        key={i}
                        src={t.image}
                        alt={t.name}
                        className="w-10 h-10 rounded-full border-2 border-background"
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">847+ 1Ls placed this cycle</p>
                    <p className="text-xs text-muted-foreground">Including V10 firms</p>
                  </div>
                </div>
              </div>
            </div>


            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate('/jobs')}
                size="lg"
                className="relative overflow-hidden group px-8 py-6 text-lg font-bold rounded-xl
                           bg-gradient-to-r from-primary to-accent text-white shadow-lg 
                           transition-all duration-300 ease-out
                           hover:shadow-xl hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
              </Button>

              {/* <Button
                onClick={() => navigate('/jobs')}
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 w-full sm:w-auto hover:bg-accent/10"
              >
                See Success Stories
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="relative py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center space-y-2">
                <metric.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Firm Logos - Where Our Students Landed */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {/* <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
              Trusted By Students At
            </p> */}
            <h2 className="text-2xl lg:text-3xl font-bold">
              Where RIZZource Students Landed
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16 max-w-6xl mx-auto">
            {firmLogos.map((firm, index) => (
              <div
                key={index}
                className="transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={firm.logo}
                  alt={`${firm.name} logo`}
                  className="h-16 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              + Many more V100 firms
            </p>
          </div>
        </div>
      </section>




      {/* Student Testimonials with Outcomes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real Students. Real Outcomes.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how 1Ls just like you landed their dream positions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-primary">{testimonial.outcome}</span>
                  </div>

                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Outcome Focused */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Your Path to BigLaw
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-lg">
                      {item.icon}
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-lg shadow-md">
                      {item.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-6">
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-1 bg-gradient-to-r from-primary via-accent to-primary/30 opacity-30"
                    style={{ zIndex: -1 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Land Your 1L Summer?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the 1Ls who are already securing callbacks at V100 firms
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate('/jobs')}
                size="lg"
                className="relative overflow-hidden group px-10 py-6 text-lg font-bold rounded-xl
                           bg-gradient-to-r from-primary to-accent text-white shadow-lg 
                           transition-all duration-300 ease-out
                           hover:shadow-xl hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinimalistHome;