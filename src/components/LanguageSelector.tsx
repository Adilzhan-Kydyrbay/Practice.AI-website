import { motion } from 'motion/react';
import { LanguageCode } from '../types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  label?: string;
  mini?: boolean;
}

const languages: { code: LanguageCode; name: string; localName: string; flag: string }[] = [
  { code: 'kk', name: 'Kazakh', localName: 'Қазақ тілі', flag: '🇰🇿' },
  { code: 'uz', name: 'Uzbek', localName: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'ky', name: 'Kyrgyz', localName: 'Кыргызча', flag: '🇰🇬' },
  { code: 'en', name: 'English', localName: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector({ currentLanguage, onChange, label, mini = false }: LanguageSelectorProps) {
  if (mini) {
    return (
      <div className="relative inline-block text-left" id="mini-lang-selector">
        <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-indigo-500" />
          <span>{languages.find(l => l.code === currentLanguage)?.flag}</span>
          <select
            value={currentLanguage}
            onChange={(e) => onChange(e.target.value as LanguageCode)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
            aria-label="Select Practice Language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.localName}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline-block">
            {languages.find(l => l.code === currentLanguage)?.localName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-105 shadow-sm space-y-3" id="main-lang-selector">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {languages.map((lang) => {
          const isSelected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => onChange(lang.code)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className="text-3xl mb-1.5 filter drop-shadow-sm">{lang.flag}</span>
              <span className="text-sm font-bold block">{lang.localName}</span>
              <span className="text-[10px] text-slate-400 font-medium">{lang.name}</span>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
