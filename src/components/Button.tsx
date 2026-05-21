import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const STYLES: Record<ButtonVariant, string> = {
  primary:   'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white',
  secondary: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700',
  danger:    'text-red-600 bg-white border border-red-300 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:bg-slate-800 dark:border-red-500/40 dark:hover:bg-red-500/20 dark:hover:text-red-300',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-3 py-1.5 text-xs lg:px-4 lg:py-2 lg:text-sm 2xl:px-5 2xl:py-2.5 2xl:text-base font-medium rounded-lg transition-colors ${STYLES[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
