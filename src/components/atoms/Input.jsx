import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', autoFocus = false, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
            autoFocus={autoFocus}
            {...props}
        />
    );
};

export default Input;