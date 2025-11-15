
import React, { useState, useEffect } from 'react';
// FIX: Import X icon
import { FileText, Languages, SlidersHorizontal, CheckCircle, PackageCheck, Repeat, ArrowRight, ArrowLeft, X } from 'lucide-react';
import FileManagement from './components/FileManagement';
// FIX: Remove unused import
import LanguageSettings from './components/LanguageSettings';
import TranslationSettings from './components/TranslationSettings';
import ProgressOverlay from './components/ProgressOverlay';
import ResultsView from './components/ResultsView';
import ReviewStep from './components/ReviewStep';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TranslationSettings as TSettings, UploadedFile, Language, TranslationJob, TranslationResult } from './types';
import { GEMINI_MODELS } from './constants';
import { processTranslationQueue } from './services/translationService';

const STEPS = [
  { id: 'files', name: 'Upload Files', icon: FileText },
  { id: 'languages', name: 'Select Languages', icon: Languages },
  { id: 'settings', name: 'Fine-Tune', icon: SlidersHorizontal },
  { id: 'review', name: 'Review & Translate', icon: CheckCircle },
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useLocalStorage<UploadedFile[]>('uploaded-files', []);
  const [results, setResults] = useState<TranslationResult[]>([]);

  const [selectedModel, setSelectedModel] = useLocalStorage('gemini-model', GEMINI_MODELS[0].id);
  const [selectedLanguages, setSelectedLanguages] = useLocalStorage<Language[]>('selected-languages', []);
  const [settings, setSettings] = useLocalStorage<TSettings>('translation-settings', {
    preserveFormatting: true,
    preserveCase: true,
    excludeNumbers: true,
    style: 'Standard',
    tone: 'Neutral',
    creativity: 0.5,
    customInstructions: '',
    glossary: '',
    chunkSize: 50,
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState({ percentage: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep === 0 && files.length === 0) {
      setError("Please upload at least one JSON file to continue.");
      return;
    }
    if (currentStep === 1 && selectedLanguages.length === 0) {
      setError("Please select at least one language to continue.");
      return;
    }
    setError(null);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTranslate = async () => {
    if (files.length === 0 || selectedLanguages.length === 0) {
        setError("Missing files or languages. Please go back and check.");
        return;
    }

    setError(null);
    setIsTranslating(true);
    setResults([]);
    setProgress({ percentage: 0, message: 'Preparing translation jobs...' });

    const jobs: TranslationJob[] = files.flatMap(file =>
      selectedLanguages.map(lang => ({
        file,
        language: lang,
      }))
    );

    try {
        const translationResults = await processTranslationQueue(jobs, { model: selectedModel, ...settings }, (p) => {
            setProgress(p);
        });
        setResults(translationResults);
        setIsFinished(true);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred during translation.");
    } finally {
        setIsTranslating(false);
    }
  };
  
  const handleStartNew = () => {
      setFiles([]);
      setResults([]);
      setSelectedLanguages([]);
      setIsFinished(false);
      setCurrentStep(0);
      setError(null);
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <FileManagement files={files} setFiles={setFiles} />;
      case 1:
        return <LanguageSettings selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages} />;
      case 2:
        return <TranslationSettings settings={settings} setSettings={setSettings} />;
      case 3:
        // FIX: Pass setModel to ReviewStep
        return <ReviewStep files={files} languages={selectedLanguages} settings={settings} model={selectedModel} setModel={setSelectedModel} />;
      default:
        return null;
    }
  };

  if (isFinished) {
      return <ResultsView results={results} onStartNew={handleStartNew} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 md:p-8">
      {isTranslating && <ProgressOverlay progress={progress.percentage} message={progress.message} />}
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
                <PackageCheck className="gradient-text" size={36}/>
                <h1 className="text-4xl font-bold text-gray-100">NKA Json&pot translator</h1>
            </div>
          <p className="text-gray-400">AI-Powered Translation Wizard</p>
        </header>

        {/* Wizard Steps */}
        <div className="mb-10">
          <ol className="flex items-center w-full">
            {STEPS.map((step, index) => (
              <li key={step.id} className={`flex w-full items-center ${index < STEPS.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ""} ${index <= currentStep ? 'after:border-purple-500' : 'after:border-gray-700'}`}>
                <span className={`flex items-center justify-center w-12 h-12 rounded-full lg:h-14 lg:w-14 shrink-0 transition-colors duration-300 ${index <= currentStep ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  <step.icon className="w-6 h-6 text-white lg:w-8 lg:h-8" />
                </span>
              </li>
            ))}
          </ol>
        </div>
        
        {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex justify-between items-center" role="alert">
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-800">
                    <X size={20} />
                </button>
            </div>
        )}

        <main className="bg-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[400px]">
          {renderStepContent()}
        </main>

        <footer className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
             <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-full gradient-bg text-white shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Start Translation <ArrowRight size={16} />
            </button>
          ) : (
            <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-full gradient-bg text-white shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
                Next Step <ArrowRight size={16} />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default App;
