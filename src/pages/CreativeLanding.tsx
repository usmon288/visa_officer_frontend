import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VideoStyleAvatar } from '@/components/VideoStyleAvatar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LiveVideoDemo() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 dark:from-transparent dark:via-black/40 dark:to-black/80 z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="https://images.pexels.com/photos/7709219/pexels-photo-7709219.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Interview"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img
              src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Examiner"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-emerald-400 rounded-full"
                animate={{
                  height: isSpeaking ? ["8px", "24px", "8px"] : "8px",
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  repeat: isSpeaking ? Infinity : 0
                }}
              />
            ))}
          </div>
          <span className="text-white/60 text-xs">LIVE</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-2xl">
            <img
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-black/60 dark:bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/90 text-sm md:text-base">
          {isSpeaking ? '"Tell me about yourself..."' : '"I am a student from..."'}
        </p>
      </motion.div>
    </div>
  );
}

function TalkButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-12 py-6 rounded-full bg-[#f5f5dc] text-black font-semibold text-lg tracking-wide overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center gap-4">
        START PRACTICE
        <motion.span
          className="flex items-center gap-1"
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 bg-black rounded-full"
              animate={{
                scale: isHovered ? [1, 1.5, 1] : 1,
                opacity: isHovered ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                repeat: isHovered ? Infinity : 0,
              }}
            />
          ))}
        </motion.span>
      </span>
    </motion.button>
  );
}

function CompanyLogos() {
  const companies = [
    { name: 'Harvard', text: 'HARVARD' },
    { name: 'Stanford', text: 'STANFORD' },
    { name: 'MIT', text: 'MIT' },
    { name: 'Oxford', text: 'OXFORD' },
    { name: 'Cambridge', text: 'CAMBRIDGE' },
  ];

  return (
    <div className="flex items-center justify-center gap-12 py-6 border-y border-gray-200 dark:border-white/10 bg-white dark:bg-black">
      {companies.map((company, index) => (
        <motion.div
          key={company.name}
          className="text-gray-400 dark:text-white/30 font-semibold text-sm tracking-[0.2em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {company.text}
        </motion.div>
      ))}
    </div>
  );
}

function CategoryCard({
  title,
  description,
  icon,
  color,
  image,
  onClick,
  delay,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] h-full transition-colors">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="text-4xl">{icon}</span>
          </div>
        </div>

        <div className="p-6">
          <div
            className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          />

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-white/50 text-sm leading-relaxed">{description}</p>

          <div className="mt-4 flex items-center gap-2 text-emerald-500 dark:text-emerald-400 text-sm font-medium">
            Start Practice
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function FeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      title: 'US Visa Interview',
      description: 'Practice with AI that simulates real embassy officers. Get feedback on your answers and improve your confidence.',
      icon: '🛂',
      color: '#10b981',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      path: '/visa',
    },
    {
      title: 'IELTS Speaking',
      description: 'Prepare for all three parts of the IELTS speaking test. Get band score predictions and detailed feedback.',
      image: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: '🎓',
      color: '#3b82f6',
      path: '/chat/ielts',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-emerald-500 dark:text-emerald-400 text-sm font-medium tracking-[0.2em] mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          CHOOSE YOUR PATH
        </motion.p>

        <h2 className="feature-title text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-16 leading-tight">
          Master your interview<br />
          <span className="text-gray-500 dark:text-white/40">with AI-powered practice</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.title}
              {...cat}
              onClick={() => navigate(cat.path)}
              delay={0.2 + index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '50K+', label: 'Students Prepared' },
    { value: '94%', label: 'Success Rate' },
    { value: '150+', label: 'Countries' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <section className="py-24 px-6 border-y border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-500 dark:text-white/40 text-sm tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "This AI helped me prepare for my F1 visa interview. I got approved on my first attempt!",
      name: "Aziza K.",
      role: "Student, Tashkent",
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      quote: "The IELTS practice was incredibly realistic. I improved from Band 6 to 7.5 in just 2 weeks.",
      name: "Rustam M.",
      role: "Professional, Samarkand",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      quote: "Finally, an AI that understands context and gives meaningful feedback. Highly recommended!",
      name: "Nilufar S.",
      role: "Teacher, Bukhara",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];

  return (
    <section className="py-32 px-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-emerald-500 dark:text-emerald-400 text-sm font-medium tracking-[0.2em] mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          SUCCESS STORIES
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted by thousands
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <p className="text-gray-600 dark:text-white/70 text-lg leading-relaxed mb-8">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-500 dark:text-white/40 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 bg-gray-50 dark:bg-black/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to succeed?
        </motion.h2>

        <motion.p
          className="text-gray-600 dark:text-white/50 text-xl mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Start practicing today and join thousands of students who have achieved their dreams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <TalkButton onClick={() => navigate('/register')} />
        </motion.div>
      </div>
    </section>
  );
}


export default function CreativeLanding() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-500">
      <Navbar />

      <motion.section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-950 transition-colors duration-500"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60 dark:from-black/40 dark:via-transparent dark:to-black/60 z-10" />

        <LiveVideoDemo />

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 dark:text-white mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            AI Interview<br />
            <span className="text-gray-500 dark:text-white/60">Practice Platform</span>
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-white/50 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Prepare for visa interviews and IELTS speaking tests with realistic AI conversations.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold tracking-wide hover:shadow-lg hover:scale-105 transition-all"
            >
              START FREE
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-semibold tracking-wide border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              VIEW PRICING
            </button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-12 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <TalkButton onClick={() => navigate('/visa')} />
        </motion.div>
      </motion.section>

      <CompanyLogos />
      <FeatureSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
