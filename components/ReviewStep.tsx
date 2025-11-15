
import React from 'react';
import { FileText, Languages, SlidersHorizontal, Bot } from 'lucide-react';
import { UploadedFile, Language, TranslationSettings } from '../types';
import { GEMINI_MODELS } from '../constants';

interface ReviewStepProps {
  files: UploadedFile[];
  languages: Language[];
  settings: TranslationSettings;
  model: string;
  setModel: (model: string) => void;
}

const ReviewCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; }> = ({ icon: Icon, title, children }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
            <Icon className="text-purple-400" size={20} />
            <h4 className="font-semibold text-gray-200">{title}</h4>
        </div>
        <div className="text-sm text-gray-300 pl-8">
            {children}
        </div>
    </div>
);

const ReviewStep: React.FC<ReviewStepProps> = ({ files, languages, settings, model, setModel }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Review & Confirm</h2>
        <p className="text-gray-400">Please review your settings before starting the translation.</p>
      </div>
      <div className="space-y-6">
        <ReviewCard icon={FileText} title={`Files to Translate (${files.length})`}>
            <ul className="list-disc list-inside max-h-24 overflow-y-auto">
                {files.map(f => <li key={f.id}>{f.name}</li>)}
            </ul>
        </ReviewCard>

        <ReviewCard icon={Languages} title={`Target Languages (${languages.length})`}>
             <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {languages.map(l => <span key={l.code} className="bg-gray-700 px-2 py-1 rounded text-xs">{l.name}</span>)}
            </div>
        </ReviewCard>

        <ReviewCard icon={SlidersHorizontal} title="Key Settings">
            <ul className="list-disc list-inside">
                <li>Style: {settings.style}, Tone: {settings.tone}</li>
                <li>Creativity: {settings.creativity}</li>
                <li>Chunk Size: {settings.chunkSize} values per request</li>
            </ul>
        </ReviewCard>
        
        <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-300 mb-1">AI Model</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Bot size={20}/>
                </div>
                <select 
                    id="model-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border-2 border-gray-600 text-white text-sm font-medium rounded-xl focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                    {GEMINI_MODELS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewStep;
