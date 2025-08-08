import { UniversityApplicant } from '@/types';
import { calculateConvertedScore } from '@/utils/scoreCalculation';
import { parseLangString } from '@/utils/languageParser';

interface ConvertedScoreDisplayProps {
  applicant: UniversityApplicant;
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export default function ConvertedScoreDisplay({ 
  applicant, 
  variant = 'desktop', 
  className = '' 
}: ConvertedScoreDisplayProps) {
  const convertedScore = calculateConvertedScore(applicant);
  const languageScores = parseLangString(applicant.lang);
  const hasUnknown = languageScores.some(score => score.type === 'UNKNOWN');
  
  if (variant === 'mobile') {
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${className}`}>
        환산점수 {convertedScore}점
        {convertedScore === 0 && hasUnknown && ' (관리자 처리 예정)'}
      </span>
    );
  }
  
  return (
    <span className={`font-semibold text-purple-600 ${className}`}>
      {convertedScore}점
      {convertedScore === 0 && hasUnknown && (
        <span className="text-xs text-red-600 ml-1">(관리자 처리 예정)</span>
      )}
    </span>
  );
}