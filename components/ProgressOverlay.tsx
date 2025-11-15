
import React from 'react';

interface ProgressOverlayProps {
  progress: number;
  message: string;
}

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ progress, message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Translation in Progress...</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="gradient-bg h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xl font-semibold text-white mt-4">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default ProgressOverlay;
