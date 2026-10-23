// frontend/src/components/common/button.jsx
import React from 'react';

const variantStyles = {
  primary: 'bg-white text-black hover:bg-neutral-200 disabled:opacity-50',
  accent: 'bg-white text-black hover:bg-neutral-200 disabled:opacity-50 shadow-lg shadow-white/5',
  outline: 'bg-transparent border border-neutral-800 text-white hover:bg-neutral-900 hover:border-neutral-700 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
};

const sizeStyles = {
  sm: 'px-3.5 py-2 text-xs font-bold rounded-lg',
  md: 'px-5 py-3 text-sm font-bold rounded-xl',
  lg: 'px-7 py-3.5 text-base font-bold rounded-xl',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        transition-all duration-150 cursor-pointer border-none
        disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
