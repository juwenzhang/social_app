"use client";
import React from "react";

const LoadingIndicator = ({ size = 40, color = "#4F46E5" }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h={size} w={size} border-t-4 border-b-4 border-primary-500"></div>
        <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping"></div>
      </div>
      <span className="ml-3 text-gray-500 font-medium">Loading more content...</span>
    </div>
  );
};

export default LoadingIndicator;