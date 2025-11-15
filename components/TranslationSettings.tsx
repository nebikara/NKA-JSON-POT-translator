
import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, BookText, BrainCircuit } from 'lucide-react';
import { TranslationSettings as TSettings } from '../types';

interface AccordionItemProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <div className="flex items-center gap-3">
                    <Icon className="text-purple-400" size={20} />
                    <span className="font-semibold text-gray-200">{title}</span>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-6 pt-2 px-2 text-gray-300">
                    {children}
                </div>
            )}
        </div>
    );
};

interface TranslationSettingsProps {
  settings: TSettings;
  setSettings: React.Dispatch<React.SetStateAction<TSettings>>;
}

const TranslationSettings: React.FC<TranslationSettingsProps> = ({ settings, setSettings }) => {
    
  const handleSettingChange = <K extends keyof TSettings>(key: K, value: TSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">Fine-Tune Translation Settings</h2>
            <p className="text-gray-400">Customize the rules and options for the AI translator.</p>
        </div>
      
      <AccordionItem title="Basic Rules" icon={SlidersHorizontal}>
        <div className="space-y-4">
            <div className="flex items-center">
                <input type="checkbox" id="preserveFormatting" checked={settings.preserveFormatting} onChange={e => handleSettingChange('preserveFormatting', e.target.checked)} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-500 focus:ring-purple-600" />
                <label htmlFor="preserveFormatting" className="ml-3 text-sm">Preserve formatting (HTML, Markdown etc.)</label>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="preserveCase" checked={settings.preserveCase} onChange={e => handleSettingChange('preserveCase', e.target.checked)} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-500 focus:ring-purple-600" />
                <label htmlFor="preserveCase" className="ml-3 text-sm">Preserve letter casing</label>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="excludeNumbers" checked={settings.excludeNumbers} onChange={e => handleSettingChange('excludeNumbers', e.target.checked)} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-500 focus:ring-purple-600" />
                <label htmlFor="excludeNumbers" className="ml-3 text-sm">Do not translate numbers</label>
            </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Advanced Options" icon={BrainCircuit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="style" className="block text-sm font-medium mb-1">Style</label>
                <select id="style" value={settings.style} onChange={e => handleSettingChange('style', e.target.value as TSettings['style'])} className="w-full p-2 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Standard</option><option>Formal</option><option>Informal</option><option>Technical</option><option>Simple</option>
                </select>
            </div>
             <div>
                <label htmlFor="tone" className="block text-sm font-medium mb-1">Tone</label>
                <select id="tone" value={settings.tone} onChange={e => handleSettingChange('tone', e.target.value as TSettings['tone'])} className="w-full p-2 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Neutral</option><option>Friendly</option><option>Professional</option><option>Excited</option><option>Confident</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="creativity" className="block text-sm font-medium mb-1">Creativity: {settings.creativity}</label>
                <input type="range" id="creativity" min="0" max="1" step="0.1" value={settings.creativity} onChange={e => handleSettingChange('creativity', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="chunkSize" className="block text-sm font-medium mb-1">Chunk Size (values per request): {settings.chunkSize}</label>
                <input type="range" id="chunkSize" min="10" max="200" step="10" value={settings.chunkSize} onChange={e => handleSettingChange('chunkSize', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
        </div>
      </AccordionItem>
      
      <AccordionItem title="Custom Instructions & Glossary" icon={BookText}>
        <div className="space-y-6">
            <div>
                 <label htmlFor="customInstructions" className="block text-sm font-medium mb-1">Custom Instructions</label>
                 <textarea id="customInstructions" value={settings.customInstructions} onChange={e => handleSettingChange('customInstructions', e.target.value)} rows={3} className="w-full p-2 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Translate in a playful way for children."></textarea>
            </div>
            <div>
                <label htmlFor="glossary" className="block text-sm font-medium mb-1">Glossary</label>
                <textarea id="glossary" value={settings.glossary} onChange={e => handleSettingChange('glossary', e.target.value)} rows={4} className="w-full p-2 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Define terms that should not be translated or have a specific translation.&#10;Format: term:translation&#10;Example:&#10;React:React&#10;AppName:AppName"></textarea>
                <p className="text-xs text-gray-400 mt-1">One term per line. For terms to not be translated, use the same word for term and translation (e.g., `BrandName:BrandName`).</p>
            </div>
        </div>
      </AccordionItem>

    </div>
  );
};

export default TranslationSettings;
