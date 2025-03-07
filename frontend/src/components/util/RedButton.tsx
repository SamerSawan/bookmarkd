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
            className="bg-danger text-secondary-dark py-2 px-4 rounded my-2 hover:bg-danger hover:opacity-80 transition"
            >
                {Text}
            </button>
        </div>
    );
};

export default RedButton;
