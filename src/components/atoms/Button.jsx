import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', type = 'button', disabled = false, whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 } }) => {
    return (
        <motion.button
            whileHover={whileHover}
            whileTap={whileTap}
            onClick={onClick}
            className={className}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;