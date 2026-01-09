import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, RotateCcw, Loader2, Award, TrendingUp, AlertCircle, CheckCircle, XCircle, Plane, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interviewsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ResultType = "ielts" | "job" | "visa";

interface IELTSResult {
  overallScore: number;
  breakdown?: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  feedback: string;
  improvements?: string[];
}

interface JobResult {
  hired: boolean;
  score: number;
  strengths?: string[];
  concerns?: string[];
  feedback: string;
}

interface VisaResult {
  approved: boolean;
  confidence: number;
  positiveFactors?: string[];
  concerns?: string[];
  feedback: string;
}

const ResultPage = () => {
  const { type } = useParams<{ type: ResultType }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const resultType = (type as ResultType) || "ielts";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IELTSResult | JobResult | VisaResult | null>(null);

  const interviewId = location.state?.interviewId;
  const transcript = location.state?.transcript || "No transcript available. This is a demo result.";

  useEffect(() => {
    const analyzeInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!interviewId) {
          throw new Error('Interview ID not found');
        }

        // Wait for webhook to process (ElevenLabs sends webhook 2-3 seconds after call ends)
        // Retry up to 5 times with 3-second delays
        let data;
        let attempt = 0;
        const maxAttempts = 5;
        
        while (attempt < maxAttempts) {
          attempt++;
          
          try {
            // Analyze interview using Django backend
            data = await interviewsAPI.analyze(interviewId);
            break; // Success, exit retry loop
          } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || '';
            
            // If transcript is empty and we have retries left, wait and try again
            if (errorMessage.includes('transcript is empty') && attempt < maxAttempts) {
              console.log(`Transcript not ready yet, waiting 3 seconds... (attempt ${attempt}/${maxAttempts})`);
              await new Promise(resolve => setTimeout(resolve, 3000));
              continue;
            }
            
            // If it's another error or we're out of retries, throw
            throw err;
          }
        }

        // Map Django response to frontend format
        if (resultType === 'visa') {
          const visaResult: VisaResult = {
            approved: data.decision === 'approved',
            confidence: data.score || 0,
            positiveFactors: Array.isArray(data.feedback?.positive_factors) 
              ? data.feedback.positive_factors 
              : data.feedback?.positive_factors 
                ? [data.feedback.positive_factors] 
                : [],
            concerns: Array.isArray(data.feedback?.concerns) 
              ? data.feedback.concerns 
              : data.feedback?.concerns 
                ? [data.feedback.concerns] 
                : [],
            feedback: data.feedback?.feedback || data.feedback?.summary || 'No feedback available.',
          };
          setResult(visaResult);
        } else {
          // For other types, use the feedback structure
          setResult(data.feedback as IELTSResult | JobResult);
        }
      } catch (err) {
        console.error('Error analyzing interview:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze interview');
        
        // Set demo result on error
        if (resultType === 'ielts') {
          setResult({
            overallScore: 7.0,
            breakdown: {
              fluencyCoherence: 7.0,
              lexicalResource: 7.0,
              grammaticalRange: 7.0,
              pronunciation: 7.0,
            },
            feedback: "Demo result: Your speaking skills show good proficiency. Continue practicing for improvement.",
            improvements: ["Practice more complex vocabulary", "Work on pronunciation clarity"],
          });
        } else if (resultType === 'job') {
          setResult({
            hired: true,
            score: 75,
            strengths: ["Good communication", "Professional demeanor"],
            concerns: ["Could provide more specific examples"],
            feedback: "Demo result: You showed good potential. Keep practicing your interview skills.",
          });
        } else {
          setResult({
            approved: true,
            confidence: 80,
            positiveFactors: ["Clear purpose of visit", "Strong ties to home country"],
            concerns: ["Consider preparing more documentation"],
            feedback: "Demo result: Your visa application shows merit. Ensure all documents are prepared.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    analyzeInterview();
  }, [resultType, transcript]);

  const renderResult = () => {
    if (!result) return null;

    if (resultType === 'ielts') {
      const ieltsResult = result as IELTSResult;
      return (
        <div className="space-y-6">
          {/* Score display */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ielts to-ielts-dark p-8 text-center shadow-large">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5" />
            
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">IELTS Band Score</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-8xl font-extrabold text-primary-foreground">
                    {ieltsResult.overallScore.toFixed(1)}
                  </span>
                  <span className="absolute -right-8 top-4 text-3xl font-bold text-primary-foreground/60">/9</span>
                </div>
                
                <div className="mt-4 flex gap-1.5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2.5 w-8 rounded-full transition-all",
                        i < Math.round(ieltsResult.overallScore)
                          ? "bg-primary-foreground"
                          : "bg-primary-foreground/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          {ieltsResult.breakdown && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Fluency & Coherence", score: ieltsResult.breakdown.fluencyCoherence },
                { label: "Lexical Resource", score: ieltsResult.breakdown.lexicalResource },
                { label: "Grammar", score: ieltsResult.breakdown.grammaticalRange },
                { label: "Pronunciation", score: ieltsResult.breakdown.pronunciation },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-card p-4 shadow-soft border">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.score.toFixed(1)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (resultType === 'job') {
      const jobResult = result as JobResult;
      return (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-job to-job-dark p-8 text-center shadow-large">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
            
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Interview Result</span>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                {jobResult.hired ? (
                  <CheckCircle className="h-24 w-24 text-primary-foreground animate-fade-in" />
                ) : (
                  <XCircle className="h-24 w-24 text-primary-foreground/80 animate-fade-in" />
                )}
                <span className="text-4xl font-bold text-primary-foreground">
                  {jobResult.hired ? "Hired! 🎉" : "Keep Trying"}
                </span>
                <span className="text-lg text-primary-foreground/80">
                  Score: {jobResult.score}/100
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-success/10 p-4 border border-success/20">
              <p className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Strengths
              </p>
              <ul className="space-y-1">
                {jobResult.strengths?.map((s, i) => (
                  <li key={i} className="text-xs text-foreground">{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-accent/10 p-4 border border-accent/20">
              <p className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                To Improve
              </p>
              <ul className="space-y-1">
                {jobResult.concerns?.map((c, i) => (
                  <li key={i} className="text-xs text-foreground">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Visa result
    const visaResult = result as VisaResult;
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-visa to-visa-dark p-8 text-center shadow-large">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
          
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
              <Plane className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Visa Decision</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {visaResult.approved ? (
                <CheckCircle className="h-24 w-24 text-primary-foreground animate-fade-in" />
              ) : (
                <XCircle className="h-24 w-24 text-primary-foreground/80 animate-fade-in" />
              )}
              <span className="text-4xl font-bold text-primary-foreground">
                {visaResult.approved ? "Approved! ✈️" : "Rejected"}
              </span>
              <span className="text-lg text-primary-foreground/80">
                Confidence: {visaResult.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Factors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-success/10 p-4 border border-success/20">
            <p className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Positive Factors
            </p>
            <ul className="space-y-1">
              {visaResult.positiveFactors?.map((f, i) => (
                <li key={i} className="text-xs text-foreground">{f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 border border-accent/20">
            <p className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Concerns
            </p>
            <ul className="space-y-1">
              {visaResult.concerns?.map((c, i) => (
                <li key={i} className="text-xs text-foreground">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analyzing Your Interview</h2>
          <p className="text-muted-foreground">Our AI is evaluating your responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="mb-6 text-center animate-fade-in">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Results</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Interview Complete!</h1>
          {error && (
            <p className="text-sm text-muted-foreground mt-1">(Showing demo result)</p>
          )}
        </header>

        {/* Result */}
        <div className="animate-slide-up">
          {renderResult()}
        </div>

        {/* Feedback */}
        {result && (
          <div className="mt-6 rounded-2xl bg-card p-5 shadow-soft border animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="mb-3 font-semibold text-foreground flex items-center gap-2">
              <MessageIcon className="h-4 w-4 text-primary" />
              Detailed Feedback
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.feedback}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button
            size="lg"
            onClick={() => navigate(`/chat/${resultType}`)}
            className={cn(
              "w-full gap-2 bg-gradient-to-br shadow-medium",
              resultType === 'ielts' && "from-ielts to-ielts-dark",
              resultType === 'job' && "from-job to-job-dark",
              resultType === 'visa' && "from-visa to-visa-dark"
            )}
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

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default ResultPage;
