import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-blue hover:bg-brand-blueLight text-white shadow-lg shadow-brand-blue/20",
    secondary: "bg-white text-brand-black hover:bg-gray-100 border border-gray-200",
    outline: "border border-brand-blue text-brand-blue hover:bg-brand-blue/10",
    ghost: "text-brand-slate hover:text-white hover:bg-white/5",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SectionBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-blue uppercase bg-brand-blue/10 rounded-full border border-brand-blue/20">
    {children}
  </span>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass p-6 rounded-2xl ${className}`}>
    {children}
  </div>
);

export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
  title: string;
  maxWidth?: string;
  className?: string;
}> = ({ isOpen, onClose, children, title, maxWidth = 'max-w-lg', className = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-brand-dark">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        <div className={`p-6 max-h-[80vh] overflow-y-auto text-brand-black ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Produção',
    DELIVERED: 'Entregue',
    COMPLETED: 'Finalizado',
    CANCELLED: 'Cancelado',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};