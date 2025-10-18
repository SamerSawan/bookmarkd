import React from 'react';

interface ButtonProps {
    Text: string;
    onPress: () => void; 
}

const Button: React.FC<ButtonProps> = ({ onPress, Text }) => {
    return (
        <div className="flex items-center justify-center">
            <button
            onClick={onPress}
            className="bg-primary text-secondary-dark font-semibold py-3 px-6 rounded-lg my-2
                       hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20
                       active:scale-95 transition-all duration-200"
            >
                {Text}
            </button>
        </div>
    );
};

export default Button;
