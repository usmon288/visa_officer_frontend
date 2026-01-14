import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Shield,
  Globe2,
  Mic,
  FileCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MagneticButton } from '@/components/MagneticButton';
import { VideoHero } from '@/components/VideoHero';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { PassportStamp } from '@/components/PassportStamp';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useAuth } from '@/contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicIndex() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });

      gsap.from('.journey-step', {
        scrollTrigger: {
          trigger: '.journey-section',
          start: 'top 70%',
        },
        x: -100,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  return (
    <div className="min-h-screen bg-secondary text-foreground overflow-hidden">
      <Navbar transparent />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <VideoHero variant="embassy" />
        <FloatingOrbs />
        <PassportStamp />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.03) 2px, rgba(6,182,212,0.03) 4px)',
          }}
        />

        <motion.div
          className="relative z-10 section-container text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Embassy + IELTS Excellence</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="block text-foreground">Your Visa.</span>
            <span className="block text-foreground">Your Score.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Your Future.
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Master your interview with AI that understands embassy protocols and IELTS standards.
            Practice until perfect.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <MagneticButton>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl hover:shadow-primary/50 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Practice
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </MagneticButton>

            <MagneticButton>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="text-lg px-10 py-7 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 backdrop-blur-xl"
              >
                View Plans
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Free interview</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Instant access</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section className="stats-section relative py-20 bg-card/30 backdrop-blur-xl border-y border-border/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Candidates Prepared' },
              { value: '95%', label: 'Success Rate' },
              { value: '120+', label: 'Countries' },
              { value: '8.5', label: 'Avg IELTS Score' },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="section-container relative z-10">
          <motion.div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Embassy-Grade Preparation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed for visa approval and IELTS excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Visa Interview Mastery',
                description:
                  'Practice with AI trained on real embassy procedures. Work, Student, Tourist - all visa types covered.',
                accent: 'from-primary to-accent',
              },
              {
                icon: Mic,
                title: 'IELTS Speaking Excellence',
                description:
                  'Real-time voice practice with AI examiners. Get band scores and detailed feedback instantly.',
                accent: 'from-accent to-primary',
              },
              {
                icon: FileCheck,
                title: 'Document Review System',
                description:
                  'Prepare answers aligned with your documentation. Consistency checking and red flag detection.',
                accent: 'from-primary/80 to-accent/80',
              },
              {
                icon: TrendingUp,
                title: 'Performance Analytics',
                description:
                  'Track improvement over time. Identify weak areas and optimize your preparation strategy.',
                accent: 'from-accent/80 to-primary/80',
              },
              {
                icon: Globe2,
                title: 'Multi-Country Support',
                description:
                  'USA, UK, Canada, Australia, Schengen - practice for any destination with specific protocols.',
                accent: 'from-primary to-accent',
              },
              {
                icon: MessageSquare,
                title: 'Natural Conversation',
                description:
                  'No scripts. No templates. Real dialogue that adapts to your answers like actual interviews.',
                accent: 'from-accent to-primary',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card group relative"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 100%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.accent} mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="journey-section relative py-32 bg-gradient-to-b from-secondary to-background">
        <div className="section-container">
          <motion.div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Your Journey to Success</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three steps. Unlimited practice. One goal: approval.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-16">
            {[
              {
                step: '01',
                title: 'Choose Your Path',
                description:
                  'Select Visa interview or IELTS Speaking. Pick your specific category - we have scenarios for every situation.',
              },
              {
                step: '02',
                title: 'Practice with AI',
                description:
                  'Speak naturally. Get interrupted. Handle follow-up questions. Experience real interview pressure in a safe environment.',
              },
              {
                step: '03',
                title: 'Master & Succeed',
                description:
                  'Review detailed feedback. Repeat until confident. Walk into your real interview prepared and unstoppable.',
              },
            ].map((item, i) => (
              <div key={i} className="journey-step flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/30">
                      {item.step}
                    </div>
                    {i < 2 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                    )}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <FloatingOrbs />

        <div className="section-container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Ready for Your Interview?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands who transformed nervousness into confidence. Start practicing today.
            </p>

            <MagneticButton>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl hover:shadow-primary/50 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Begin Your Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
