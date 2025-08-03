'use client';

import { useRouter } from 'next/navigation';
import { University } from '@/types';
import { getCountryFlag } from '@/utils/countryFlags';

interface AppliedUniversityItemProps {
  university: University & { rank: number };
}

export default function AppliedUniversityItem({ university }: AppliedUniversityItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/university/${university.id}`);
  };

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
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
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-2xl mr-3">
            {getCountryFlag(university.country)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {university.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {university.country}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {university.applicantCount}명
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
          {university.slot}명
        </span>
      </td>
    </tr>
  );
}