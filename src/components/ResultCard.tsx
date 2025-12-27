import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Award } from "lucide-react";

interface ResultCardProps {
  type: "ielts" | "job" | "visa";
  score?: number;
  passed?: boolean;
  feedback: string;
}

const typeConfig = {
  ielts: {
    title: "IELTS Score",
    gradient: "from-ielts to-ielts-dark",
    maxScore: 9,
  },
  job: {
    title: "Interview Result",
    gradient: "from-job to-job-dark",
    labels: { pass: "Hired! 🎉", fail: "Keep Trying" },
  },
  visa: {
    title: "Visa Decision",
    gradient: "from-visa to-visa-dark",
    labels: { pass: "Approved! ✈️", fail: "Rejected" },
  },
};

export function ResultCard({ type, score, passed, feedback }: ResultCardProps) {
  const config = typeConfig[type];

  const renderResult = () => {
    if (type === "ielts" && score !== undefined) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="text-7xl font-extrabold text-primary-foreground">
              {score.toFixed(1)}
            </span>
            <span className="absolute -right-6 top-2 text-2xl font-bold text-primary-foreground/60">
              /9
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-6 rounded-full transition-all",
                  i < Math.round(score)
                    ? "bg-primary-foreground"
                    : "bg-primary-foreground/20"
                )}
              />
            ))}
          </div>
        </div>
      );
    }

    const labels = type === "job" ? typeConfig.job.labels : typeConfig.visa.labels;
    const resultText = passed ? labels.pass : labels.fail;

    return (
      <div className="flex flex-col items-center gap-3">
        {passed ? (
          <CheckCircle className="h-20 w-20 text-primary-foreground animate-fade-in" />
        ) : (
          <XCircle className="h-20 w-20 text-primary-foreground/80 animate-fade-in" />
        )}
        <span className="text-3xl font-bold text-primary-foreground">{resultText}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      {/* Main result card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-center shadow-large",
          config.gradient
        )}
      >
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
            <Award className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">{config.title}</span>
          </div>

          {renderResult()}
        </div>
      </div>

      {/* Feedback section */}
      <div className="mt-4 rounded-2xl bg-card p-5 shadow-soft">
        <h4 className="mb-2 font-semibold text-foreground">Feedback</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{feedback}</p>
      </div>
    </div>
  );
}
