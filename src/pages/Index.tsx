import { useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Plane, Sparkles, Mic, Brain, LogIn, UserPlus } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-2.5 animate-fade-in shadow-soft">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Interview Practice
            </span>
          </div>

          <h1 
            className="mb-5 text-5xl font-extrabold leading-tight text-foreground md:text-6xl animate-slide-up"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Welcome to{" "}
            <span className="gradient-text">AI Demo</span>
          </h1>

          <p 
            className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            Experience realistic interview simulations with our advanced AI interviewers. 
            Practice speaking, get instant feedback, and boost your confidence for the real thing.
          </p>

          {/* Feature badges */}
          <div 
            className="mt-6 flex flex-wrap justify-center gap-3 animate-slide-up"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
          >
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Real-time Voice Chat</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">AI Analysis & Scoring</span>
            </div>
          </div>
        </header>

        {/* Category Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          <CategoryCard
            title="IELTS Exam"
            description="Practice speaking test with realistic IELTS questions. Get band scores from 0-9."
            icon={<GraduationCap className="h-7 w-7 text-primary-foreground" />}
            variant="ielts"
            onClick={() => navigate("/chat/ielts")}
            delay={400}
          />

          <CategoryCard
            title="Job Interview"
            description="Prepare for HR interviews with common questions. Learn if you'd be hired!"
            icon={<Briefcase className="h-7 w-7 text-primary-foreground" />}
            variant="job"
            onClick={() => navigate("/chat/job")}
            delay={500}
          />

          <CategoryCard
            title="Visa Interview"
            description="Simulate visa officer interviews. Practice for approval success."
            icon={<Plane className="h-7 w-7 text-primary-foreground" />}
            variant="visa"
            onClick={() => navigate("/visa")}
            delay={600}
          />
        </div>

        {/* How it works */}
        <div 
          className="mt-16 animate-fade-in"
          style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
        >
          <h2 className="text-center text-2xl font-bold text-foreground mb-8">
            How It Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ielts to-ielts-dark shadow-medium">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Choose Interview Type</h3>
              <p className="text-sm text-muted-foreground">Select from IELTS, Job, or Visa interview categories</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-job to-job-dark shadow-medium">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Talk with AI</h3>
              <p className="text-sm text-muted-foreground">Have a real conversation with our AI interviewer</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-visa to-visa-dark shadow-medium">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Get Your Score</h3>
              <p className="text-sm text-muted-foreground">Receive detailed AI-powered feedback and scoring</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div 
          className="mt-16 grid gap-6 md:grid-cols-3 animate-fade-in"
          style={{ animationDelay: "800ms", animationFillMode: "backwards" }}
        >
          <div className="rounded-2xl border bg-card p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl">🎙️</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Voice-First Experience</h3>
            <p className="text-sm text-muted-foreground">
              Speak naturally with our AI. Just like a real interview, no typing required.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Smart AI Interviewers</h3>
            <p className="text-sm text-muted-foreground">
              Each interviewer is specialized: IELTS examiner, HR manager, or visa officer.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Detailed Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get comprehensive feedback with scores, strengths, and areas to improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
