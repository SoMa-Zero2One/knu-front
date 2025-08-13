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
  
  // 정규화된 타입으로 표시할 문자열 생성
  const displayString = languageScores.map(score => {
    if (score.type === 'UNKNOWN') {
      return score.originalString || '';
    }
    
    // 레벨과 점수가 있는 경우 함께 표시
    let result = score.type === 'CEFR' ? '영작문' : score.type;
    if (score.level) {
      result += ` ${score.level}`;
    }
    if (score.score) {
      result += ` ${score.score}`;
    }
    return result;
  }).join(', ');
  
  if (variant === 'mobile') {
    return (
      <div className="flex items-center space-x-1">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          hasUnknown ? 'bg-red-100 text-red-800' : getColorForValue(langString)
        }`}>
          {hasUnknown && '⚠️ '}
          {displayString}
        </span>
      </div>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      hasUnknown ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {hasUnknown && '⚠️ '}
      {displayString}
    </span>
  );
}