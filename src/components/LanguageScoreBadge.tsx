import { parseLangString } from '@/utils/languageParser';
import { getColorForValue } from '@/utils/colorUtils';

interface LanguageScoreBadgeProps {
  langString: string;
  variant?: 'mobile' | 'desktop';
}

export default function LanguageScoreBadge({ 
  langString, 
  variant = 'desktop' 
}: LanguageScoreBadgeProps) {
  const languageScores = parseLangString(langString);
  const hasUnknown = languageScores.some(score => score.type === 'UNKNOWN');
  
  if (variant === 'mobile') {
    return (
      <div className="flex items-center space-x-1">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          hasUnknown ? 'bg-red-100 text-red-800' : getColorForValue(langString)
        }`}>
          {hasUnknown && '⚠️ '}
          {langString}
        </span>
      </div>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      hasUnknown ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {hasUnknown && '⚠️ '}
      {langString}
    </span>
  );
}