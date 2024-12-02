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
            className="bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition"
            >
                {Text}
            </button>
        </div>
    );
};

export default Button;
