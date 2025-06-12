import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const MainContentHeader = ({ searchQuery, onSearchChange, onAddTaskClick }) => {
    return (
        <motion.div 
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            className="bg-white border-b border-gray-200 p-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="pl-10" // Adjust padding for icon
                        />
                    </div>
                </div>
                
                <Button
                    onClick={onAddTaskClick}
                    className="ml-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md flex items-center space-x-2"
                >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span className="font-medium">Add Task</span>
                </Button>
            </div>
        </motion.div>
    );
};

export default MainContentHeader;