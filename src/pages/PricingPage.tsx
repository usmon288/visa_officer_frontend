import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Clock, Sparkles, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  period: string;
  description: string;
  features: string[];
  bonus?: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    period: "per person / month",
    description: "Start your journey with basic practice",
    features: [
      "1 interview / month",
      "Basic AI feedback",
      "Visa & IELTS practice",
      "Email support",
    ],
  },
  {
    id: "starter",
    name: "Hobbyist",
    price: 16,
    yearlyPrice: 144,
    period: "per person / month",
    description: "Elevate your preparation",
    features: [
      "10 interviews / month",
      "Detailed AI feedback",
      "Interview transcripts",
      "Performance analytics",
      "Priority email support",
    ],
  },
  {
    id: "professional",
    name: "Creator",
    price: 24,
    yearlyPrice: 216,
    period: "per person / month",
    description: "Unlock advanced AI-powered practice",
    features: [
      "30 interviews / month",
      "Advanced AI coaching",
      "Full interview history",
      "Custom scenarios",
      "Priority 24/7 support",
    ],
    bonus: "+5 bonus interviews",
    popular: true,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (planId: string) => {
    if (isAuthenticated) {
      if (planId === "free") {
        navigate("/dashboard");
      } else {
        navigate("/subscription");
      }
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="text-xl font-bold text-black">
              prep<span className="text-emerald-500">AI</span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate("/")} className="text-gray-600 hover:text-black text-sm">
                Home
              </button>
              <button onClick={() => navigate("/visa")} className="text-gray-600 hover:text-black text-sm">
                Visa Prep
              </button>
              <span className="text-black text-sm font-medium">Pricing</span>
            </nav>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-600 hover:text-black text-sm"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-4">
              PRICING
            </p>
            <h1 className="text-5xl md:text-6xl font-light text-black mb-6">
              Surely there's one for you
            </h1>

            <div className="inline-flex items-center gap-3 mt-8">
              <span className={cn("text-sm", !isYearly ? "text-black" : "text-gray-400")}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  isYearly ? "bg-emerald-500" : "bg-gray-200"
                )}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  animate={{ left: isYearly ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={cn("text-sm", isYearly ? "text-black" : "text-gray-400")}>
                Yearly <span className="text-emerald-500 font-medium">-25%</span>
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border bg-white p-8",
                  plan.popular ? "border-emerald-500 border-2" : "border-gray-200"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-black mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-light text-black">
                      ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{plan.period}</p>
                </div>

                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={cn(
                    "w-full py-3 rounded-lg text-sm font-medium transition-colors mb-8",
                    plan.popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-black text-white hover:bg-gray-800"
                  )}
                >
                  Get started
                  <span className="ml-2">→</span>
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.includes("interview") ? (
                        <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : feature.includes("AI") ? (
                        <Sparkles className="w-5 h-5 text-gray-400 shrink-0" />
                      ) : (
                        <Zap className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                      <span className="text-sm text-gray-600">{feature}</span>
                      {plan.bonus && i === 0 && (
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-medium">
                          {plan.bonus}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-black mb-8">All plans include</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                "Real-time AI conversations",
                "Instant feedback & scoring",
                "Visa interview practice",
                "IELTS speaking prep",
                "Mobile & desktop access",
                "Secure private sessions",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-gray-400 text-sm">2024 prepAI</span>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/terms")} className="text-gray-400 text-sm hover:text-gray-600">
              Terms
            </button>
            <button onClick={() => navigate("/privacy")} className="text-gray-400 text-sm hover:text-gray-600">
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
