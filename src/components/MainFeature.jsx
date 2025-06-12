import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    categoryId: 'work',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      if (completed) {
        toast.success('Task completed! 🎉', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const task = await taskService.create({
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
      });
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', categoryId: 'work', priority: 'medium', dueDate: '' });
      setShowQuickAdd(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Then by order
      return a.order - b.order;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#5B4EE5';
  };

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    
    if (isToday(date)) {
      return { text: 'Today', color: 'text-accent', urgent: true };
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'text-warning', urgent: false };
    } else if (isOverdue) {
      return { text: `Overdue`, color: 'text-accent', urgent: true };
    } else {
      return { text: format(date, 'MMM d'), color: 'text-gray-600', urgent: false };
    }
  };

  const getCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const filteredTasks = getFilteredTasks();
  const completionPercentage = getCompletionPercentage();

  if (loading) {
    return (
      <div className="h-screen flex">
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-96"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
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
                {tasks.filter(t => t.completed).length} of {tasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Categories</h3>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                <span className="font-medium">All Tasks</span>
              </div>
              <span className="text-xs opacity-75">{tasks.length}</span>
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-xs opacity-75">
                  {tasks.filter(t => t.categoryId === category.id).length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div 
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          className="bg-white border-b border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickAdd(true)}
              className="ml-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span className="font-medium">Add Task</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Task List */}
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuickAdd(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md"
                  >
                    Create Your First Task
                  </motion.button>
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
                {filteredTasks.map((task, index) => {
                  const dueDateInfo = getDueDateDisplay(task.dueDate);
                  return (
                    <motion.div
                      key={task.id}
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTaskComplete(task.id, !task.completed)}
                          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        />

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
                            <div 
                              className="px-2 py-1 rounded-full text-white text-xs font-medium"
                              style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                            >
                              {categories.find(c => c.id === task.categoryId)?.name}
                            </div>

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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-error transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowQuickAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900">Add New Task</h3>
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What needs to be done?"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newTask.categoryId}
                        onChange={(e) => setNewTask(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowQuickAdd(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!newTask.title.trim()}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Task
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;