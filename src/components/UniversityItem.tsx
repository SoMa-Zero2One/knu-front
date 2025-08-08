'use client';

import { useRouter } from 'next/navigation';
import Twemoji from 'react-twemoji';
import { University } from '@/types';
import { getCountryFlag } from '@/utils/countryFlags';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { getColorForValue } from '@/utils/colorUtils';

interface UniversityItemProps {
  university: University & { rank?: number };
  isMobile?: boolean;
  showRank?: boolean;
}

export default function UniversityItem({ university, isMobile = false, showRank = false }: UniversityItemProps) {

  const router = useRouter();
  const { trackButtonClick } = useAnalytics();
  const { user } = useAuth();

  const handleClick = () => {
    const safeEventName = `${university.country}-${university.name}`
      .replace(/\s+/g, '')
      .replace(/[^\w가-힣-]/g, '');
    
    const safeNickname = user?.nickname
      ?.replace(/\s+/g, '')
      ?.replace(/[^\w가-힣]/g, '') || user?.id;
      
    const labelWithUser = `${university.name} 상세보기로 이동_클릭자_${safeNickname}`;
    
    trackButtonClick(labelWithUser, `대학상세페이지_이동_${safeEventName}`);
    router.push(`/university/${university.id}`);
  };

  if (isMobile) {
    return (
      <div
        className="p-4 hover:bg-gray-50 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start space-x-3">
          {showRank && university.rank && (
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white flex-shrink-0 ${
              university.rank === 1 ? 'bg-yellow-500' :
              university.rank === 2 ? 'bg-gray-400' :
              university.rank === 3 ? 'bg-amber-600' :
              'bg-blue-500'
            }`}>
              {university.rank}
            </span>
          )}
          <Twemoji options={{ className: 'twemoji text-2xl' }}>
            <span>{getCountryFlag(university.country)}</span>
          </Twemoji>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {university.name}
            </div>
            <div className="text-xs mb-2 flex flex-wrap gap-1 items-center">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.country)}`}>
                {university.country}
              </span>
              <span className="text-gray-400">•</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.applicantCount.toString())}`}>
                지원자 {university.applicantCount}명
              </span>
              <span className="text-gray-400">•</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.slot.toString())}`}>
                모집 {university.slot}명
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr
      className={`cursor-pointer ${showRank ? 'hover:bg-gray-50' : 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl'}`}
      onClick={handleClick}
    >
      {showRank && university.rank && (
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
            university.rank === 1 ? 'bg-yellow-500' :
            university.rank === 2 ? 'bg-gray-400' :
            university.rank === 3 ? 'bg-amber-600' :
            'bg-blue-500'
          }`}>
            {university.rank}
          </span>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Twemoji options={{ className: 'twemoji text-2xl mr-3' }}>
            <span>{getCountryFlag(university.country)}</span>
          </Twemoji>
          <div>
            <div className="text-sm font-medium text-gray-900 overflow-hidden whitespace-nowrap">
              {university.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.country)}`}>
          {university.country}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.applicantCount.toString())}`}>
          {university.applicantCount}명
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.slot.toString())}`}>
          {university.slot}명
        </span>
      </td>
    </tr>
  );
}