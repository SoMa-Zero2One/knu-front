'use client';

import { useRouter } from 'next/navigation';
import { UniversityApplicant } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import ConvertedScoreDisplay from '@/components/ConvertedScoreDisplay';
import LanguageScoreBadge from '@/components/LanguageScoreBadge';
import { getColorForValue } from '@/utils/colorUtils';

interface ApplicantItemProps {
  applicant: UniversityApplicant;
  isMobile?: boolean;
  universityName: string;
}

export default function ApplicantItem({ applicant, isMobile = false, universityName }: ApplicantItemProps) {
  const router = useRouter();
  const { trackButtonClick } = useAnalytics();
  const { user } = useAuth();

  const handleClick = () => {
    const safeNickname = user?.nickname
      ?.replace(/\s+/g, '')
      ?.replace(/[^\w가-힣]/g, '') || user?.id;
    
    const safeApplicantNickname = applicant.nickname
      ?.replace(/\s+/g, '')
      ?.replace(/[^\w가-힣]/g, '') || applicant.id;
      
    const labelWithUser = `${safeApplicantNickname} 프로필 조회`;
    
    trackButtonClick(`사용자조회_${safeNickname}`, labelWithUser);
    router.push(`/profile/${applicant.id}`);
  };

  if (isMobile) {
    return (
      <div
        className={`p-4 cursor-pointer ${
          applicant.id === user?.id 
            ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
            : 'hover:bg-gray-50'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start space-x-3">
          {/* 지망순위 */}
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0 ${
            applicant.choice === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
            applicant.choice === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
            applicant.choice === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
            applicant.choice === 4 ? 'bg-blue-500 text-white shadow-sm' :
            applicant.choice === 5 ? 'bg-emerald-500 text-white shadow-sm' :
            'bg-gray-500 text-white'
          }`}>
            {applicant.choice}
          </span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-sm font-medium text-gray-900">
                {applicant.nickname}
              </div>
              {applicant.id === user?.id && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  내 정보
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 items-center">
              <ConvertedScoreDisplay 
                applicant={applicant}
                variant="mobile"
                className={getColorForValue('환산점수')}
              />
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(applicant.grade.toString())}`}>
                학점 {applicant.grade.toFixed(2)}
              </span>
              <LanguageScoreBadge 
                langString={applicant.lang}
                variant="mobile"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr
      className={`cursor-pointer ${
        applicant.id === user?.id 
          ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
            applicant.choice === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
            applicant.choice === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
            applicant.choice === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
            applicant.choice === 4 ? 'bg-blue-500 text-white shadow-sm' :
            applicant.choice === 5 ? 'bg-emerald-500 text-white shadow-sm' :
            'bg-gray-500 text-white'
          }`}>
            {applicant.choice}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {applicant.nickname}
          </div>
          {applicant.id === user?.id && (
            <div className="ml-2 flex items-center space-x-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                내 정보
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <ConvertedScoreDisplay applicant={applicant} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <span className="font-semibold text-blue-600">
            {applicant.grade.toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <LanguageScoreBadge langString={applicant.lang} />
      </td>
    </tr>
  );
}