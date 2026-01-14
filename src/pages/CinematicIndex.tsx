import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Shield,
  Globe2,
  Mic,
  FileCheck,
  TrendingUp,
  CheckCircle2,
  Play,
  Star,
  Zap,
  Award,
  Users,
  Target,
  Sparkles,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { PremiumLogo } from '@/components/PremiumLogo';
import { MagneticButton } from '@/components/MagneticButton';
import { Footer } from '@/components/layout/Footer';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useAuth } from '@/contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

function GlowingCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.15), transparent 40%)`,
        }}
      />
      <div className="relative h-full rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {children}
      </div>
    </motion.div>
  );
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function CinematicIndex() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -100]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        rotateX: 15,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.stat-box', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });

      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  const features = [
    {
      icon: Shield,
      title: 'Visa Interview Mastery',
      description: 'Practice with AI trained on real embassy procedures. H-1B, F-1, B1/B2 - all visa types.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Mic,
      title: 'IELTS Speaking Excellence',
      description: 'Real-time voice practice with AI examiners. Target Band 7, 8, or 9 with precision.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Target,
      title: 'Smart Analysis Engine',
      description: 'AI-powered feedback on fluency, vocabulary, grammar, and pronunciation.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Globe2,
      title: 'Multi-Country Support',
      description: 'USA, UK, Canada, Australia, Schengen - protocols for every destination.',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics and improvement graphs. Watch yourself get better.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'No waiting. Get scores, feedback, and recommendations immediately.',
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-foreground overflow-x-hidden">
      <AnimatedBackground />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-xl border-b border-white/5" />
        <div className="relative section-container">
          <div className="flex items-center justify-between h-20">
            <Link to="/">
              <PremiumLogo size="md" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Pricing', 'Success Stories'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <MagneticButton>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                  >
                    Dashboard
                  </Button>
                </MagneticButton>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <MagneticButton>
                    <Button
                      onClick={() => navigate('/register')}
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 shadow-lg shadow-cyan-500/25"
                    >
                      Get Started Free
                    </Button>
                  </MagneticButton>
                </>
              )}
            </div>

            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div
          className="relative z-10 section-container text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.5)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Interview Excellence
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-[0.9]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.span
              className="block"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Visa.
            </motion.span>
            <motion.span
              className="block"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your Score.
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              Your Future.
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Master your interview with AI that understands{' '}
            <span className="text-cyan-400 font-semibold">embassy protocols</span> and{' '}
            <span className="text-purple-400 font-semibold">IELTS standards</span>.
            Practice until perfect.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <MagneticButton>
              <motion.button
                onClick={handleGetStarted}
                className="relative group px-10 py-5 rounded-2xl text-lg font-semibold text-white overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-3">
                  Start Free Practice
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </MagneticButton>

            <MagneticButton>
              <motion.button
                onClick={() => navigate('/pricing')}
                className="group px-10 py-5 rounded-2xl text-lg font-semibold border-2 border-white/20 hover:border-cyan-500/50 bg-white/5 backdrop-blur-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-cyan-400" />
                  See How It Works
                </span>
              </motion.button>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              { icon: CheckCircle2, text: 'No credit card' },
              { icon: Zap, text: 'Instant access' },
              { icon: Award, text: '1 free interview' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <item.icon className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-cyan-400/50" />
        </motion.div>
      </section>

      <section className="stats-section relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="section-container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 50000, suffix: '+', label: 'Candidates Prepared', icon: Users },
              { value: 95, suffix: '%', label: 'Success Rate', icon: Award },
              { value: 120, suffix: '+', label: 'Countries', icon: Globe2 },
              { value: 8.5, suffix: '', label: 'Avg IELTS Score', icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-box relative group"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <stat.icon className="w-8 h-8 text-cyan-400 mb-4" />
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="relative py-32 overflow-hidden">
        <div className="section-container relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            >
              Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed for visa approval and IELTS excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <GlowingCard key={i} delay={i * 0.1} className="feature-card">
                <div className="p-8">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="section-container relative">
          <motion.div className="text-center mb-20">
            <motion.span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6">
              Success Stories
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                50,000+
              </span>{' '}
              Students
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'F-1 Visa Approved',
                content: 'The AI interview prep was incredibly realistic. Got approved on my first try!',
                avatar: 'SC',
                rating: 5,
              },
              {
                name: 'Ahmed Hassan',
                role: 'IELTS Band 8.5',
                content: 'From Band 6.5 to 8.5 in just 3 weeks of practice. The feedback was spot-on.',
                avatar: 'AH',
                rating: 5,
              },
              {
                name: 'Maria Garcia',
                role: 'H-1B Approved',
                content: 'Practiced every possible question. Felt completely prepared for my interview.',
                avatar: 'MG',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                whileHover={{ y: -10 }}
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-cyan-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="section-container relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Ready to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join 50,000+ successful candidates. Start practicing today.
            </p>

            <MagneticButton>
              <motion.button
                onClick={handleGetStarted}
                className="relative group px-12 py-6 rounded-2xl text-xl font-bold text-white overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center gap-3">
                  Begin Your Journey
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
