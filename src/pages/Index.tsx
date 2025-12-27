import { useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Plane } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 animate-fade-in">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-primary">AI Interview Practice</span>
          </div>

          <h1 
            className="mb-4 text-4xl font-extrabold leading-tight text-foreground md:text-5xl animate-slide-up"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Welcome to{" "}
            <span className="gradient-text">AI Demo</span>
          </h1>

          <p 
            className="mx-auto max-w-lg text-lg text-muted-foreground animate-slide-up"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            Practice your English speaking skills with our AI-powered interview simulations. 
            Get instant feedback and improve your confidence.
          </p>
        </header>

        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <CategoryCard
            title="IELTS Exam"
            description="Practice speaking test with realistic IELTS questions"
            icon={<GraduationCap className="h-7 w-7 text-primary-foreground" />}
            variant="ielts"
            onClick={() => navigate("/chat/ielts")}
            delay={300}
          />

          <CategoryCard
            title="Job Interview"
            description="Prepare for job interviews with common HR questions"
            icon={<Briefcase className="h-7 w-7 text-primary-foreground" />}
            variant="job"
            onClick={() => navigate("/chat/job")}
            delay={400}
          />

          <CategoryCard
            title="Visa Interview"
            description="Simulate visa interviews for better preparation"
            icon={<Plane className="h-7 w-7 text-primary-foreground" />}
            variant="visa"
            onClick={() => navigate("/chat/visa")}
            delay={500}
          />
        </div>

        {/* Features */}
        <div 
          className="mt-12 grid gap-6 md:grid-cols-3 animate-fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "backwards" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Smart responses and realistic conversations</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">Get scores and detailed analysis</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Track Progress</h3>
              <p className="text-sm text-muted-foreground">See your improvement over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
