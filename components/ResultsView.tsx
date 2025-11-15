
import React from 'react';
import { CheckCircle, Download, Repeat } from 'lucide-react';
import { TranslationResult } from '../types';
import { createZip } from '../services/zipService';

interface ResultsViewProps {
  results: TranslationResult[];
  onStartNew: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onStartNew }) => {

  const handleDownload = async () => {
    if (results.length > 0) {
      await createZip(results);
    }
  };
    
  const totalFiles = new Set(results.map(r => r.fileName)).size;
  const totalLanguages = new Set(results.map(r => r.languageCode)).size;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <CheckCircle className="text-green-400 w-20 h-20 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Translation Complete!</h1>
        <p className="text-gray-400 text-lg mb-8">
            Successfully translated <span className="font-bold text-purple-400">{totalFiles}</span> file(s) into <span className="font-bold text-purple-400">{totalLanguages}</span> language(s).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={handleDownload}
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-full gradient-bg text-white shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
                <Download size={18} />
                Download Results (.zip)
            </button>
            <button
                onClick={onStartNew}
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all"
            >
                <Repeat size={16} />
                Start New Translation
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
