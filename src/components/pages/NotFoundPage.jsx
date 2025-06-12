import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back to your tasks.
        </p>
        
        <Button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md inline-flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Go Home</span>
        </Button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;