import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Starter",
      description: "Perfect for trying out our platform",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Zap,
      features: [
        "1 interview per month",
        "Basic AI feedback",
        "Visa & IELTS practice",
        "Email support",
        "Access to all interview types",
      ],
      notIncluded: [
        "Detailed analytics",
        "Priority support",
        "Interview history",
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-500 to-gray-700",
    },
    {
      id: "starter",
      name: "Professional",
      description: "For serious interview preparation",
      monthlyPrice: 14.99,
      yearlyPrice: 149,
      icon: TrendingUp,
      features: [
        "10 interviews per month",
        "Advanced AI feedback",
        "Detailed performance analytics",
        "Interview history & transcripts",
        "Priority email support",
        "Progress tracking",
        "All interview types",
      ],
      notIncluded: ["Custom scenarios"],
      cta: "Start 7-Day Trial",
      popular: true,
      gradient: "from-primary to-accent",
    },
    {
      id: "professional",
      name: "Enterprise",
      description: "Unlimited practice for maximum success",
      monthlyPrice: 39.99,
      yearlyPrice: 399,
      icon: Crown,
      features: [
        "Unlimited interviews",
        "Premium AI feedback",
        "Advanced analytics & insights",
        "Full interview history",
        "Priority 24/7 support",
        "Custom practice scenarios",
        "Early access to new features",
        "Export results & certificates",
      ],
      notIncluded: [],
      cta: "Start 14-Day Trial",
      popular: false,
      gradient: "from-accent to-primary",
    },
  ];

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

  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    const percentSaved = Math.round((savings / monthlyCost) * 100);
    return percentSaved;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="section-container">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start free, upgrade when you're ready. All plans include visa and IELTS interview practice.
            </p>

            <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
              <span className={cn("text-sm font-medium px-4 transition-colors", !isYearly && "text-foreground")}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={cn("text-sm font-medium px-4 transition-colors", isYearly && "text-foreground")}>
                Yearly
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Save up to 25%
                </span>
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const savingsPercent = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(plan.popular && "lg:-mt-4")}
                >
                  <Card
                    className={cn(
                      "relative h-full",
                      plan.popular && "border-2 border-primary shadow-xl"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <CardHeader className="pb-8">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                          plan.gradient
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>

                      <div className="mt-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">${price}</span>
                          {price > 0 && (
                            <span className="text-muted-foreground">
                              / {isYearly ? "year" : "month"}
                            </span>
                          )}
                        </div>
                        {isYearly && price > 0 && (
                          <p className="text-sm text-primary mt-2">
                            Save {savingsPercent}% with yearly billing
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 opacity-50">
                            <Check className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm line-through">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        size="lg"
                        className={cn(
                          "w-full",
                          plan.popular &&
                            "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        )}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  All Plans Include
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Visa interview practice (Work, Student, Tourist)",
                    "IELTS Speaking test preparation",
                    "Real-time AI conversations",
                    "Instant feedback and scoring",
                    "Mobile and desktop access",
                    "Secure and private sessions",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground mb-2">
              Have questions about our plans?
            </p>
            <Button variant="link" onClick={() => navigate("/#faq")}>
              View FAQ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
