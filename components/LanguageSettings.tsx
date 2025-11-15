
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Input from './ui/Input';
import { Language } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSettingsProps {
  selectedLanguages: Language[];
  setSelectedLanguages: (languages: Language[]) => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ selectedLanguages, setSelectedLanguages }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleToggleLanguage = (language: Language) => {
    if (selectedLanguages.some(l => l.code === language.code)) {
      setSelectedLanguages(selectedLanguages.filter(l => l.code !== language.code));
    } else {
      setSelectedLanguages([...selectedLanguages, language].sort((a,b) => a.name.localeCompare(b.name)));
    }
  };

  const handleSelectAll = () => {
    setSelectedLanguages(LANGUAGES);
  };

  const handleDeselectAll = () => {
    setSelectedLanguages([]);
  };

  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">Select Target Languages</h2>
            <p className="text-gray-400">Choose one or more languages to translate your files into.</p>
        </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div className="flex-grow max-w-sm">
            <Input 
                icon={<Search size={20} className="text-gray-400" />}
                placeholder="Search for a language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-4">
            <button onClick={handleSelectAll} className="text-sm font-semibold text-purple-400 hover:text-purple-300">Select All</button>
            <span className="text-gray-600">|</span>
            <button onClick={handleDeselectAll} className="text-sm font-semibold text-purple-400 hover:text-purple-300">Deselect All</button>
        </div>
      </div>

       {selectedLanguages.length > 0 && (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Selected ({selectedLanguages.length})</h3>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-900/50 rounded-lg">
                {selectedLanguages.map(lang => (
                    <div key={lang.code} className="bg-purple-600/50 text-purple-200 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{lang.name}</span>
                        <button onClick={() => handleToggleLanguage(lang)} className="hover:bg-purple-500/50 rounded-full">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-4 max-h-[350px] overflow-y-auto pr-2">
        {filteredLanguages.map(language => (
          <div key={language.code} className="flex items-center">
            <input
              type="checkbox"
              id={`lang-${language.code}`}
              checked={selectedLanguages.some(l => l.code === language.code)}
              onChange={() => handleToggleLanguage(language)}
              className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-500 focus:ring-purple-600 cursor-pointer"
            />
            <label htmlFor={`lang-${language.code}`} className="ml-3 text-sm text-gray-300 cursor-pointer">
              {language.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;
