import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant: "ielts" | "job" | "visa";
  onClick: () => void;
  delay?: number;
}

const variantStyles = {
  ielts: {
    gradient: "from-ielts to-ielts-dark",
    iconBg: "bg-ielts/20",
    shadow: "hover:shadow-[0_20px_50px_-12px_hsl(200_90%_50%/0.4)]",
  },
  job: {
    gradient: "from-job to-job-dark",
    iconBg: "bg-job/20",
    shadow: "hover:shadow-[0_20px_50px_-12px_hsl(150_70%_45%/0.4)]",
  },
  visa: {
    gradient: "from-visa to-visa-dark",
    iconBg: "bg-visa/20",
    shadow: "hover:shadow-[0_20px_50px_-12px_hsl(280_70%_55%/0.4)]",
  },
};

export function CategoryCard({ title, description, icon, variant, onClick, delay = 0 }: CategoryCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-500",
        "bg-gradient-to-br",
        styles.gradient,
        styles.shadow,
        "hover:-translate-y-2 hover:scale-[1.02]",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10 transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary-foreground/5 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={cn(
            "mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl",
            styles.iconBg,
            "transition-transform duration-300 group-hover:scale-110"
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <h3 className="mb-2 text-xl font-bold text-primary-foreground">{title}</h3>
        <p className="text-sm text-primary-foreground/80">{description}</p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-foreground/90">
          <span>Start Practice</span>
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </button>
  );
}
