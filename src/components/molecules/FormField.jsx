import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, type = 'text', value, onChange, placeholder, options, autoFocus = false, ...props }) => {
    const commonProps = { value, onChange, placeholder, className: 'mt-2', autoFocus, ...props };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            {type === 'select' ? (
                <Select options={options} {...commonProps} />
            ) : (
                <Input type={type} {...commonProps} />
            )}
        </div>
    );
};

export default FormField;