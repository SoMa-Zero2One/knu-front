'use client';

import { useRouter } from 'next/navigation';

interface UnauthorizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  universityName: string;
}

export default function UnauthorizedModal({ isOpen, onClose, universityName }: UnauthorizedModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleChangeApplication = () => {
    router.push('/applications/edit');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            접근 권한이 없습니다
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            <strong>{universityName}</strong>는 지원하지 않은 대학입니다.<br />
            지원 대학을 변경한 후 세부내용을 확인해주세요.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleChangeApplication}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              지원 대학 변경하기
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              확인했습니다
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}