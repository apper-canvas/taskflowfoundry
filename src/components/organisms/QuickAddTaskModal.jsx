import React from 'react';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const QuickAddTaskModal = ({ show, onClose, newTask, onNewTaskChange, categories, onSubmit }) => {
    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));
    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    return (
        <Modal show={show} onClose={onClose} title="Add New Task">
            <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                    label="Task Title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => onNewTaskChange('title', e.target.value)}
                    placeholder="What needs to be done?"
                    autoFocus
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Category"
                        type="select"
                        value={newTask.categoryId}
                        onChange={(e) => onNewTaskChange('categoryId', e.target.value)}
                        options={categoryOptions}
                    />

                    <FormField
                        label="Priority"
                        type="select"
                        value={newTask.priority}
                        onChange={(e) => onNewTaskChange('priority', e.target.value)}
                        options={priorityOptions}
                    />
                </div>

                <FormField
                    label="Due Date (Optional)"
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => onNewTaskChange('dueDate', e.target.value)}
                />

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!newTask.title.trim()}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Task
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default QuickAddTaskModal;