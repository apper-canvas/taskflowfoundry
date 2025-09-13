import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { categoryService, taskService } from "@/services";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import MainContentHeader from "@/components/organisms/MainContentHeader";
import QuickAddTaskModal from "@/components/organisms/QuickAddTaskModal";
import Sidebar from "@/components/organisms/Sidebar";
import TaskListSection from "@/components/organisms/TaskListSection";


const HomePage = () => {
const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    categoryId: 'general',
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
        (task.Id || task.id) === taskId ? updatedTask : task
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
        categoryId: newTask.categoryId,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
      });
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', categoryId: 'general', priority: 'medium', dueDate: '' });
      setShowQuickAdd(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

const handleDeleteTask = async (taskId) => {
try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => (task.Id || task.id) !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
};

  const getFilteredTasks = () => {
    let filtered = tasks;

if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => 
        task.category_id?.toString() === selectedCategory || 
        task.categoryId?.toString() === selectedCategory
      );
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
    const category = categories.find(c => 
      (c.Id?.toString() || c.id?.toString()) === categoryId?.toString()
    );
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
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        tasks={tasks}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        completionPercentage={completionPercentage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MainContentHeader
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onAddTaskClick={() => setShowQuickAdd(true)}
        />

        <TaskListSection
          filteredTasks={filteredTasks}
          searchQuery={searchQuery}
          categories={categories}
          onAddTaskClick={() => setShowQuickAdd(true)}
          onToggleTaskComplete={handleTaskComplete}
          onDeleteTask={handleDeleteTask}
          getPriorityColor={getPriorityColor}
          getCategoryColor={getCategoryColor}
          getDueDateDisplay={getDueDateDisplay}
        />
      </div>

      <QuickAddTaskModal
        show={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        newTask={newTask}
        onNewTaskChange={handleNewTaskChange}
        categories={categories}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default HomePage;