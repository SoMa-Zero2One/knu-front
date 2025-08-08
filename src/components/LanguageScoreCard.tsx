import { LanguageScore } from '@/types';

interface LanguageScoreCardProps {
  score: LanguageScore;
}

export default function LanguageScoreCard({ score }: LanguageScoreCardProps) {
  return (
    <div className="bg-green-50 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <span className="font-medium text-green-900">
          {score.type === 'UNKNOWN' ? '⚠️ 인식되지 않은 어학성적' : score.type}
        </span>
        <span className="font-semibold text-green-700">
          {score.type === 'UNKNOWN' 
            ? score.originalString 
            : (score.level ? `${score.level}${score.score ? ` (${score.score})` : ''}` : score.score)
          }
        </span>
      </div>
      {score.type === 'UNKNOWN' && (
        <div className="mt-1 text-xs text-red-600">
          관리자 처리 예정
        </div>
      )}
    </div>
  );
}