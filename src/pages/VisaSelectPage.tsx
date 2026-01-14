import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { subscriptionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";

interface VisaType {
  id: string;
  title: string;
  description: string;
  icon: string;
  visaCodes: string;
}

const visaTypes: VisaType[] = [
  {
    id: "work",
    title: "Work Visa",
    description: "Practice for H-1B, L-1, work permit interviews. Questions about employment, qualifications, and job offers.",
    icon: "💼",
    visaCodes: "H-1B, L-1, O-1",
  },
  {
    id: "student",
    title: "Student Visa",
    description: "Prepare for F-1, J-1, student visa interviews. Questions about education plans, finances, and ties to home.",
    icon: "📚",
    visaCodes: "F-1, J-1, M-1",
  },
  {
    id: "worktravel",
    title: "Work & Travel",
    description: "Practice for J-1 Summer Work Travel interviews. Questions about program plans and return intentions.",
    icon: "🌍",
    visaCodes: "J-1 Summer",
  },
  {
    id: "travel",
    title: "Tourist Visa",
    description: "Simulate B-1/B-2 tourist visa interviews. Questions about travel plans, finances, and home ties.",
    icon: "✈️",
    visaCodes: "B-1, B-2",
  },
];

function VisaCard({ visa, onClick, index }: { visa: VisaType; onClick: () => void; index: number }) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full text-left"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 h-full transition-colors hover:bg-white/[0.05]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between mb-6">
          <span className="text-5xl">{visa.icon}</span>
          <motion.div
            className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs font-medium"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {visa.visaCodes}
          </motion.div>
        </div>

        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {visa.title}
        </h3>
        <p className="text-white/50 text-base leading-relaxed">
          {visa.description}
        </p>

        <motion.div
          className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          Start Practice
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}

const VisaSelectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [usage, setUsage] = useState<{ can_start_interview: boolean } | null>(null);

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const usageData = await subscriptionsAPI.getUsage();
        setUsage(usageData);
      } catch (error) {
        console.error('Failed to check usage:', error);
      }
    };
    checkUsage();
  }, []);

  const handleVisaTypeClick = (visaType: string) => {
    if (usage && !usage.can_start_interview) {
      toast({
        variant: 'destructive',
        title: 'Interview Limit Reached',
        description: 'You\'ve used all your interviews for this month. Please upgrade your plan.',
      });
      navigate('/subscription');
      return;
    }
    navigate(`/chat/visa-${visaType}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-emerald-400 text-sm font-medium tracking-[0.2em] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              US EMBASSY INTERVIEW
            </motion.p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              Select Your<br />
              <span className="text-white/40">Visa Type</span>
            </h1>

            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Choose the type of visa interview you want to practice. Each session simulates real embassy questions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {visaTypes.map((visa, index) => (
              <VisaCard
                key={visa.id}
                visa={visa}
                onClick={() => handleVisaTypeClick(visa.id)}
                index={index}
              />
            ))}
          </div>

          <motion.div
            className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Interview Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Be honest and consistent with all your answers",
                "Speak clearly and confidently, maintain eye contact",
                "Keep your answers brief but complete",
                "Have all supporting documents ready",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-white/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisaSelectPage;
