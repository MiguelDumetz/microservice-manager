import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const STYLES: Record<ButtonVariant, string> = {
  primary:   'text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:text-white',
  secondary: 'text-slate-400 hover:text-white hover:bg-slate-700',
  danger:    'text-red-400 bg-slate-800 border border-red-500/40 hover:bg-red-500/20 hover:text-red-300',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button className={`px-4 py-2 text-sm font-medium rounded-lg ${STYLES[variant]} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
