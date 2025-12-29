import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, GraduationCap, Palmtree, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VisaTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  visaType: string;
  onClick: () => void;
  delay?: number;
}

function VisaTypeCard({ title, description, icon, visaType, onClick, delay = 0 }: VisaTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-4 rounded-2xl border bg-card p-6 text-left shadow-soft transition-all duration-300",
        "hover:shadow-large hover:scale-[1.02] hover:border-visa/50",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-visa to-visa-dark shadow-medium">
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-visa transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowLeft className="h-5 w-5 text-visa rotate-180" />
      </div>
    </button>
  );
}

const VisaSelectPage = () => {
  const navigate = useNavigate();

  const visaTypes = [
    {
      id: "work",
      title: "Work Visa",
      description: "Practice for H-1B, L-1, work permit interviews. Questions about employment, qualifications, and job offers.",
      icon: <Briefcase className="h-7 w-7 text-primary-foreground" />,
    },
    {
      id: "student",
      title: "Student Visa",
      description: "Prepare for F-1, J-1, student visa interviews. Questions about education plans, finances, and ties to home.",
      icon: <GraduationCap className="h-7 w-7 text-primary-foreground" />,
    },
    {
      id: "worktravel",
      title: "Work & Travel Visa",
      description: "Practice for J-1 Summer Work Travel interviews. Questions about program plans and return intentions.",
      icon: <Palmtree className="h-7 w-7 text-primary-foreground" />,
    },
    {
      id: "travel",
      title: "Tourist Visa",
      description: "Simulate B-1/B-2 tourist visa interviews. Questions about travel plans, finances, and home ties.",
      icon: <Plane className="h-7 w-7 text-primary-foreground" />,
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div 
            className="text-center animate-fade-in"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-visa/20 to-visa-dark/20 px-4 py-2">
              <Plane className="h-5 w-5 text-visa" />
              <span className="text-sm font-semibold text-visa">Visa Interview Practice</span>
            </div>

            <h1 className="text-4xl font-extrabold text-foreground mb-3">
              Select Visa Type
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Choose the type of visa interview you want to practice. Each interview 
              will have specific questions based on real embassy interviews.
            </p>
          </div>
        </header>

        {/* Visa Type Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {visaTypes.map((visa, index) => (
            <VisaTypeCard
              key={visa.id}
              title={visa.title}
              description={visa.description}
              icon={visa.icon}
              visaType={visa.id}
              onClick={() => navigate(`/chat/visa-${visa.id}`)}
              delay={100 + index * 100}
            />
          ))}
        </div>

        {/* Info section */}
        <div 
          className="mt-12 rounded-2xl border bg-muted/30 p-6 animate-fade-in"
          style={{ animationDelay: "500ms", animationFillMode: "backwards" }}
        >
          <h2 className="font-bold text-foreground mb-3">💡 Interview Tips</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-visa mt-2" />
              Be honest and consistent with all your answers
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-visa mt-2" />
              Speak clearly and confidently, maintain eye contact
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-visa mt-2" />
              Keep your answers brief but complete - don't over-explain
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-visa mt-2" />
              Have all supporting documents ready to reference
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisaSelectPage;
