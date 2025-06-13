import React from 'react';
import Button from '@/components/atoms/Button';

const CategoryButton = ({ category, count, isSelected, onClick }) => {
    return (
        <Button
            onClick={() => onClick(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all 
                ${isSelected 
                    ? 'bg-primary text-white shadow-md' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
<div className="flex items-center space-x-3">
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color || '#5B4EE5' }}
                ></div>
<span className="font-medium">{category.Name || category.name}</span>
            </div>
            <span className="text-xs opacity-75">{count}</span>
        </Button>
    );
};

export default CategoryButton;