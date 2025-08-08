/**
 * 문자열 값을 기반으로 일관된 색상 클래스를 반환하는 함수
 * @param value 색상을 결정할 문자열
 * @returns Tailwind CSS 색상 클래스 문자열
 */
export const getColorForValue = (value: string): string => {
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