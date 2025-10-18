import React from 'react';

interface ButtonProps {
    Text: string;
    onPress: () => void; 
}

const RedButton: React.FC<ButtonProps> = ({ onPress, Text }) => {
    return (
        <div className="flex items-center justify-center">
            <button
            onClick={onPress}
            className="bg-danger text-secondary-strong font-semibold py-3 px-6 rounded-lg my-2
                       hover:bg-red-600 hover:shadow-lg hover:shadow-danger/20
                       active:scale-95 transition-all duration-200"
            >
                {Text}
            </button>
        </div>
    );
};

export default RedButton;
