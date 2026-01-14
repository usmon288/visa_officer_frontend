import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, TrendingUp, CheckCircle2, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const interviewTypes = [
    {
      icon: "🛂",
      title: "Visa Interview",
      description: "Practice for Work, Student, or Tourist visa interviews",
      color: "emerald",
      path: "/visa",
    },
    {
      icon: "🎓",
      title: "IELTS Speaking",
      description: "Prepare for your IELTS speaking test with AI examiner",
      color: "blue",
      path: "/chat/ielts",
    },
  ];

  const stats = [
    { label: "Interviews", value: "0", icon: CheckCircle2 },
    { label: "Avg Score", value: "-", icon: TrendingUp },
    { label: "Practice Time", value: "0 min", icon: Clock },
  ];

  const quickActions = [
    { label: "Account", icon: User, path: "/account" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-emerald-400 text-sm font-medium tracking-[0.2em] mb-2">
              DASHBOARD
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
              Welcome back, {user?.username || user?.email?.split("@")[0]}
            </h1>
            <p className="text-white/50 text-lg">
              Ready to practice and improve your interview skills?
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="text-3xl font-light text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-medium text-white mb-6">Start Practice</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {interviewTypes.map((type, index) => (
                <motion.button
                  key={type.title}
                  onClick={() => navigate(type.path)}
                  className="group relative text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 transition-colors hover:bg-white/[0.05]">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${type.color}-500/0 via-${type.color}-500 to-${type.color}-500/0 opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <span className="text-5xl mb-6 block">{type.icon}</span>
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-white/50 mb-6">{type.description}</p>

                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      Start Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-medium text-white mb-6">Recent Activity</h2>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No activity yet</h3>
              <p className="text-white/40 mb-6 max-w-sm mx-auto">
                Start your first interview practice session to see your progress here
              </p>
              <button
                onClick={() => navigate("/visa")}
                className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
              >
                Start First Interview
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 flex items-center justify-between pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
