import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import CategoryButton from "@/components/molecules/CategoryButton";

const Sidebar = ({ tasks, categories, selectedCategory, onSelectCategory, completionPercentage }) => {
    const { logout } = useContext(AuthContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter(t => t.completed).length;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
        >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">TaskFlow</h1>
                
                {/* Progress Ring */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-200"
                            />
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={`${completionPercentage * 1.257} 125.7`}
                                className="text-primary transition-all duration-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Daily Progress</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {completedTasksCount} of {totalTasksCount}
                        </p>
</div>
                </div>
                
                {/* Logout Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ApperIcon 
                            name={isLoggingOut ? "Loader2" : "LogOut"} 
                            className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`}
                        />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Categories</h3>
                <div className="space-y-2">
                    <CategoryButton
                        category={{ id: 'all', name: 'All Tasks', color: 'transparent' }}
                        count={totalTasksCount}
                        isSelected={selectedCategory === 'all'}
                        onClick={onSelectCategory}
                    />

                    {categories.map((category) => (
                        <CategoryButton
                            key={category.Id || category.id}
                            category={category}
                            count={tasks.filter(t => 
                              (t.category_id?.toString() === ((category.Id || category.id)?.toString())) ||
                              (t.categoryId?.toString() === ((category.Id || category.id)?.toString()))
                            ).length}
                            isSelected={selectedCategory === ((category.Id || category.id)?.toString())}
                            onClick={onSelectCategory}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;