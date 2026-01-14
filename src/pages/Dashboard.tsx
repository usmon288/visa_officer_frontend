import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  GraduationCap,
  Trophy,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const interviewTypes = [
    {
      icon: Globe,
      title: "Visa Interview",
      description: "Practice for Work, Student, or Tourist visa interviews",
      color: "from-blue-500 to-blue-700",
      path: "/visa",
    },
    {
      icon: GraduationCap,
      title: "IELTS Speaking",
      description: "Prepare for your IELTS speaking test with AI examiner",
      color: "from-primary to-accent",
      path: "/chat/ielts",
    },
  ];

  const stats = [
    {
      label: "Interviews Completed",
      value: "0",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      label: "Average Score",
      value: "-",
      icon: Trophy,
      color: "text-primary",
    },
    {
      label: "Total Practice Time",
      value: "0 min",
      icon: Clock,
      color: "text-accent",
    },
    {
      label: "Improvement Rate",
      value: "-",
      icon: TrendingUp,
      color: "text-warning",
    },
  ];

  const recentActivity = [];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, {user?.username || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to practice and improve your interview skills?
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <Icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {interviewTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer" onClick={() => navigate(type.path)}>
                  <CardHeader>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                        type.color
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Start Practice
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interview practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No activity yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your first interview practice session to see your progress here
                  </p>
                  <Button onClick={() => navigate("/visa")}>
                    Start First Interview
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-muted-foreground">{activity.date}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
