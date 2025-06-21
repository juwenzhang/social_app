"use client";
import React, { useState, useEffect } from 'react';

const gradients = [
  { class: 'bg-gradient-to-br from-green-300 via-pink-300 to-yellow-300' },
  { class: 'bg-gradient-to-tl from-yellow-500 via-orange-500 to-red-500' },
  { class: 'bg-gradient-to-tr from-orange-600 via-yellow-600 to-brown-600' },
  { class: 'bg-gradient-to-bl from-blue-300 via-sky-300 to-white' },
];

const StarBackground: React.FC = () => {
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradientIndex(prev => (prev + 1) % gradients.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[-1] transition-colors duration-3000 ${gradients[currentGradientIndex].class}`}
    >
      <div className="star-pattern absolute inset-0 opacity-70"></div>
      <style jsx global>
        {
          `
            .star-pattern {
              background-image: 
                radial-gradient(circle, rgba(255,255,255,0.8) 8px, transparent 8px),
                radial-gradient(circle, rgba(255,255,255,0.5) 7px, transparent 7px),
                radial-gradient(circle, rgba(255,255,255,0.3) 6px, transparent 6px);
              background-size: 400px 400px, 300px 300px, 200px 200px;
                transform: translateZ(0);
                will-change: transform;
                contain: strict;
                backface-visibility: hidden;
                pointer-events: none;
                animation: twinkle 8s infinite alternate, starMove 20s linear infinite;
            }

            @keyframes twinkle {
              0% { opacity: 0.5; }
              100% { opacity: 1; }
            }

            @keyframes starMove {
              0% {
                background-position: 0 0, 10px 10px, 25px 25px;
              }
              100% {
                background-position: 800px 800px, 500px 500px, 300px 300px;
              }
            }
          `
        }
      </style>
    </div>
  );
};

export default StarBackground;