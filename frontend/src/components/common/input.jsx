// frontend/src/components/common/input.jsx
import React from 'react';

function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  ...rest
}) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={name} className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 rounded-xl border bg-neutral-900
          ${error ? 'border-red-500 focus:border-red-400' : 'border-neutral-800 focus:border-white'}
          text-white placeholder:text-neutral-500 text-sm
          focus:outline-none transition-colors duration-150
          ${className}
        `}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
