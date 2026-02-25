import React from 'react';

interface DemonLogoProps {
    className?: string;
    size?: number;
    color?: string;
}

const DemonLogo: React.FC<DemonLogoProps> = ({ className = '', size = 32, color = 'currentColor' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Faceless Demon Head Silhouette */}
            <path
                d="M50 15C50 15 42 25 35 30C28 35 20 45 20 60C20 75 30 85 50 85C70 85 80 75 80 60C80 45 72 35 65 30C58 25 50 15 50 15Z"
                fill={color}
            />
            {/* Horns */}
            <path
                d="M35 32C35 32 25 25 15 15C20 25 25 35 30 40"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M65 32C65 32 75 25 85 15C80 25 75 35 70 40"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DemonLogo;
