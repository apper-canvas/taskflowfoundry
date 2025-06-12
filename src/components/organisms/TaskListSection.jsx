import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskItem from '@/components/molecules/TaskItem';

const TaskListSection = ({ 
    filteredTasks, 
    searchQuery, 
    categories, 
    onAddTaskClick, 
    onToggleTaskComplete, 
    onDeleteTask,
    getPriorityColor, 
    getCategoryColor, 
    getDueDateDisplay
}) => {
    return (
        <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
                {filteredTasks.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No matching tasks' : 'No tasks yet'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                            {searchQuery 
                                ? 'Try adjusting your search terms or browse all tasks'
                                : 'Create your first task to get started with TaskFlow'
                            }
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={onAddTaskClick}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md"
                            >
                                Create Your First Task
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {filteredTasks.map((task, index) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                categories={categories}
                                onToggleComplete={onToggleTaskComplete}
                                onDelete={onDeleteTask}
                                getPriorityColor={getPriorityColor}
                                getCategoryColor={getCategoryColor}
                                getDueDateDisplay={getDueDateDisplay}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskListSection;