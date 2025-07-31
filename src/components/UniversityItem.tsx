'use client';

import { useRouter } from 'next/navigation';

interface University {
  id: string;
  name: string;
  country: string;
  flag: string;
  applicantCount: number;
  duration?: string;
  competitionRatio: {
    level1: number;
    level2: number;
  };
}

interface UniversityItemProps {
  university: University;
  isMobile?: boolean;
}

export default function UniversityItem({ university, isMobile = false }: UniversityItemProps) {
  const getColorForValue = (value: string): string => {

  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-red-100 text-red-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700',
    'bg-gray-100 text-gray-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-lime-100 text-lime-700',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-amber-100 text-amber-700',
    'bg-slate-100 text-slate-700',
    'bg-zinc-100 text-zinc-700',
  ];


  const hash = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};

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
          <span className="text-2xl">{university.flag}</span>
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
                {university.applicantCount}명 지원
              </span>
              <span className="text-gray-400">•</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.duration || '기간 미정')}`}>
                {university.duration || '기간 미정'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                1학기: {university.competitionRatio.level1}명
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                2학기: {university.competitionRatio.level2}명
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr
      className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      onClick={handleClick}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{university.flag}</span>
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
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.duration || '파견기간 미정2')}`}>
          {university.duration || '파견기간 미정'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">1학기:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
              {university.competitionRatio.level1}명
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">2학기:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
              {university.competitionRatio.level2}명
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}