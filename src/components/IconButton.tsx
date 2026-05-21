import { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger";

const STYLES: Record<ButtonVariant, string> = {
  primary:
    "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white",
  secondary:
    "text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700",
  danger:
    "text-red-500 bg-white hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:bg-slate-800 dark:border-red-500/40 dark:hover:bg-red-500/20 dark:hover:text-red-300",
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: ButtonVariant;
}

function IconButton({
  icon: Icon,
  label,
  variant = "primary",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`size-8 lg:size-10 2xl:size-12 flex items-center justify-center rounded-full transition-colors ${STYLES[variant]} ${className ?? ""}`}
      {...props}
    >
      <Icon className="size-4 lg:size-5 2xl:size-6" />
    </button>
  );
}

export default IconButton;
