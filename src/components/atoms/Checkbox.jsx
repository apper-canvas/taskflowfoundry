import React from 'react';
import { motion } from 'framer-motion';

const Checkbox = ({ checked, onClick, className = '' }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                        ${checked 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white border-gray-300 hover:border-primary'
                        } ${className}`}
            aria-checked={checked}
            role="checkbox"
        >
            {checked && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-white"
                >
                    &#10003; {/* Checkmark icon */}
                </motion.span>
            )}
        </motion.button>
    );
};

export default Checkbox;