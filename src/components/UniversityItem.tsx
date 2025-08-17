'use client';

import { useRouter } from 'next/navigation';
import Twemoji from 'react-twemoji';
import { University } from '@/types';
import { getCountryFlag } from '@/utils/countryFlags';
import { getColorForValue } from '@/utils/colorUtils';

interface UniversityItemProps {
  university: University & { rank?: number; admissionProbability?: string };
  isMobile?: boolean;
  showRank?: boolean;
  showAdmissionProbability?: boolean;
}

export default function UniversityItem({ university, isMobile = false, showRank = false, showAdmissionProbability = false }: UniversityItemProps) {

  const router = useRouter();

  const handleClick = () => {
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
              {showAdmissionProbability && university.admissionProbability && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    parseInt(university.admissionProbability) >= 70 ? 'bg-green-100 text-green-800' :
                    parseInt(university.admissionProbability) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    parseInt(university.admissionProbability) >= 30 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    합격가능성 {university.admissionProbability}
                  </span>
                </>
              )}
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
      {showAdmissionProbability && (
        <td className="px-6 py-4 whitespace-nowrap">
          {university.admissionProbability ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              parseInt(university.admissionProbability) >= 70 ? 'bg-green-100 text-green-800' :
              parseInt(university.admissionProbability) >= 50 ? 'bg-yellow-100 text-yellow-800' :
              parseInt(university.admissionProbability) >= 30 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {university.admissionProbability}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      )}
    </tr>
  );
}