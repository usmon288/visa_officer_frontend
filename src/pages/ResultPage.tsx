import { useParams, useNavigate } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ResultCard";

type ResultType = "ielts" | "job" | "visa";

// Simulated results - in real app, these would come from AI analysis
const mockResults: Record<ResultType, { score?: number; passed?: boolean; feedback: string }> = {
  ielts: {
    score: 7.5,
    feedback: "Excellent performance! You demonstrated strong fluency and coherence throughout the test. Your vocabulary range was impressive, and you used complex grammatical structures accurately. To improve further, focus on expanding idiomatic expressions and reducing minor hesitations.",
  },
  job: {
    passed: true,
    feedback: "Congratulations! Your interview performance was outstanding. You articulated your experiences clearly and demonstrated genuine enthusiasm for the role. Your answers showed strong problem-solving skills and cultural fit. We were particularly impressed by your concrete examples.",
  },
  visa: {
    passed: true,
    feedback: "Your visa application has been approved! You provided clear, consistent answers about your travel plans and demonstrated strong ties to your home country. Your documentation and purpose of visit were well-explained. Have a wonderful trip!",
  },
};

const ResultPage = () => {
  const { type } = useParams<{ type: ResultType }>();
  const navigate = useNavigate();
  const resultType = (type as ResultType) || "ielts";

  const result = mockResults[resultType];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="mb-8 text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Your Results</h1>
          <p className="mt-1 text-muted-foreground">Here's how you performed</p>
        </header>

        {/* Result Card */}
        <ResultCard
          type={resultType}
          score={result.score}
          passed={result.passed}
          feedback={result.feedback}
        />

        {/* Action Buttons */}
        <div 
          className="mt-8 flex flex-col gap-3 animate-fade-in"
          style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
        >
          <Button
            variant={resultType}
            size="lg"
            onClick={() => navigate(`/chat/${resultType}`)}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
