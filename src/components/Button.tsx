import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  disabled,
  ...props
}) => {
  // Lineamientos de Accesibilidad WCAG AA y Anti-SaaS:
  // - Dimensiones mínimas de 44x44px
  // - Texto >= 16px para adultos mayores
  // - Diseño plano sin sombras flotantes ni gradientes SaaS
  const baseStyle: React.CSSProperties = {
    minHeight: '44px',
    minWidth: '44px',
    padding: size === 'lg' ? '12px 24px' : '10px 20px',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: '12px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: fullWidth ? '100%' : 'auto',
    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
    boxShadow: 'none',
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#1E6FB5', // Azul principal Senda
      color: '#FFFFFF',
      border: '1px solid #1E6FB5',
    },
    secondary: {
      backgroundColor: '#0D3B66', // Azul secundario Senda
      color: '#FFFFFF',
      border: '1px solid #0D3B66',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1.5px solid #1E6FB5',
      color: '#1E6FB5',
    },
    danger: {
      backgroundColor: '#E63950', // Emergencia Senda
      color: '#FFFFFF',
      border: '1px solid #E63950',
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
