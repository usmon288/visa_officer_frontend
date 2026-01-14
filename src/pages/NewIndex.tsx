import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Trophy,
  Users,
  Zap,
  Shield,
  Target,
  MessageSquare,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function NewIndex() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Real-Time Voice Conversations",
      description:
        "Practice with AI interviewers that respond naturally to your answers, just like a real interview.",
    },
    {
      icon: BarChart3,
      title: "Detailed Performance Analytics",
      description:
        "Get comprehensive feedback with scoring, strengths analysis, and actionable improvement tips.",
    },
    {
      icon: Target,
      title: "Specialized Interview Types",
      description:
        "Choose from Visa interviews or IELTS Speaking tests, each with category-specific questions.",
    },
    {
      icon: Clock,
      title: "Practice Anytime, Anywhere",
      description:
        "24/7 availability means you can practice whenever suits your schedule, from any device.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your practice sessions and personal data are encrypted and completely confidential.",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description:
        "Receive immediate analysis after each session to quickly identify and improve weak areas.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Interview Type",
      description:
        "Select from Visa interviews (Work, Student, Tourist) or IELTS Speaking test preparation.",
      icon: Target,
    },
    {
      number: "02",
      title: "Start Your AI Interview",
      description:
        "Speak naturally with our AI interviewer. No typing required - just talk as you would in a real interview.",
      icon: MessageSquare,
    },
    {
      number: "03",
      title: "Get Expert Feedback",
      description:
        "Receive detailed analysis with scores, transcript review, and personalized recommendations for improvement.",
      icon: BarChart3,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Student Visa Applicant",
      content:
        "The AI interview prep was incredibly realistic. I felt so much more confident during my actual visa interview. Got approved!",
      rating: 5,
      country: "China → USA",
    },
    {
      name: "Raj Patel",
      role: "IELTS Candidate",
      content:
        "Practicing with AI helped me achieve band 8 in speaking. The instant feedback was exactly what I needed to improve.",
      rating: 5,
      country: "India",
    },
    {
      name: "Maria Garcia",
      role: "Work Visa Holder",
      content:
        "I was nervous about my H-1B interview, but this platform helped me practice hundreds of scenarios. Worth every penny!",
      rating: 5,
      country: "Mexico → USA",
    },
  ];

  const stats = [
    { value: "50K+", label: "Successful Interviews" },
    { value: "95%", label: "Approval Rate" },
    { value: "120+", label: "Countries" },
    { value: "4.9/5", label: "User Rating" },
  ];

  const faqs = [
    {
      question: "How realistic are the AI interviews?",
      answer:
        "Our AI interviewers are trained on thousands of real interview scenarios and use advanced natural language processing to provide realistic, context-aware conversations. They adapt to your answers and ask follow-up questions just like real interviewers.",
    },
    {
      question: "What types of interviews can I practice?",
      answer:
        "We currently offer Visa interviews (Work, Student, Tourist, and Work & Travel) and IELTS Speaking test preparation. Each category features specialized questions and evaluation criteria specific to that interview type.",
    },
    {
      question: "How does the scoring system work?",
      answer:
        "Our AI evaluates multiple factors including clarity, confidence, content relevance, grammar, and overall communication skills. You'll receive detailed scores in each category along with specific suggestions for improvement.",
    },
    {
      question: "Can I practice in different languages?",
      answer:
        "Currently, our platform supports English-language interviews, as this is the primary language used in visa and IELTS interviews. We're working on adding more languages in the future.",
    },
    {
      question: "How many practice sessions can I do?",
      answer:
        "It depends on your subscription plan. Free users get 1 interview per month, Starter plan includes 10 interviews monthly, and Professional plan offers unlimited practice sessions.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Absolutely. We use enterprise-grade encryption for all data transmission and storage. Your practice sessions, recordings, and personal information are completely confidential and never shared with third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

        <div className="section-container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Interview Practice</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Master Your Interview,
              <br />
              <span className="gradient-text">Achieve Your Goals</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Practice visa and IELTS interviews with AI. Get real-time feedback, boost your confidence, and increase your chances of success.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-glow transition-all"
                onClick={handleGetStarted}
              >
                Start Free Practice
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => navigate("/pricing")}>
                View Pricing
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>1 free interview</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-32">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you ace your interviews
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands who achieved their goals with AI Interview
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-sm text-primary mt-1">{testimonial.country}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-32 bg-muted/30">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about AI Interview
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who practiced with AI Interview. Start your free practice today.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl hover:shadow-glow transition-all"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
