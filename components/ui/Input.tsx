
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          {...props}
          className={`
            w-full px-4 py-2.5 
            ${icon ? 'pl-10' : ''}
            bg-gray-700 border-2 border-gray-600 
            text-white text-sm font-medium
            rounded-xl 
            focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all duration-200
            placeholder:text-gray-400
          `}
        />
      </div>
    </div>
  );
};

export default Input;
