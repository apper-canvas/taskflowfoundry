import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';

const TaskItem = ({ task, categories, onToggleComplete, onDelete, getPriorityColor, getCategoryColor, getDueDateDisplay, index }) => {
const dueDateInfo = getDueDateDisplay(task.due_date || task.dueDate);
    const categoryName = categories.find(c => 
      (c.Id?.toString() === (task.category_id?.toString() || task.categoryId?.toString())) ||
      (c.id?.toString() === (task.category_id?.toString() || task.categoryId?.toString()))
    )?.Name || categories.find(c => 
      (c.Id?.toString() === (task.category_id?.toString() || task.categoryId?.toString())) ||
      (c.id?.toString() === (task.category_id?.toString() || task.categoryId?.toString()))
    )?.name;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all ${
                task.completed ? 'opacity-75' : ''
            }`}
        >
            <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <Checkbox checked={task.completed} onClick={() => onToggleComplete(task.id, !task.completed)} />

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`text-sm font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                            {task.title}
                        </h4>
                        
                        {/* Priority Badge */}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} ${
                            task.priority === 'high' && !task.completed ? 'animate-pulse-soft' : ''
                        }`} />
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                        {/* Category */}
                        {categoryName && (
<div 
                                className="px-2 py-1 rounded-full text-white text-xs font-medium"
                                style={{ backgroundColor: getCategoryColor(task.category_id || task.categoryId) }}
                            >
                                {categoryName}
                            </div>
                        )}

                        {/* Due Date */}
                        {dueDateInfo && (
                            <div className={`flex items-center space-x-1 ${dueDateInfo.color}`}>
                                <ApperIcon name="Calendar" className="w-3 h-3" />
                                <span className={dueDateInfo.urgent ? 'font-medium' : ''}>
                                    {dueDateInfo.text}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <Button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-error transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
};

export default TaskItem;