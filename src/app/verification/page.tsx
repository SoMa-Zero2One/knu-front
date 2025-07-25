'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { languageTestTypes } from '@/data/mockData';
import { LanguageTestType, LanguageScore } from '@/types';

interface LanguageScoreForm {
  id: string;
  type: LanguageTestType | '';
  score: string;
  imageFile: File | null;
}

export default function VerificationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // 폼 상태
  const [gpa, setGpa] = useState('');
  const [gpaImageFile, setGpaImageFile] = useState<File | null>(null);
  const [languageScores, setLanguageScores] = useState<LanguageScoreForm[]>([
    { id: '1', type: '', score: '', imageFile: null }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  if (user.verificationStatus !== 'not_verified') {
    router.push('/dashboard');
    return null;
  }

  const addLanguageScore = () => {
    const newId = Date.now().toString();
    setLanguageScores([...languageScores, { id: newId, type: '', score: '', imageFile: null }]);
  };

  const removeLanguageScore = (id: string) => {
    if (languageScores.length > 1) {
      setLanguageScores(languageScores.filter(score => score.id !== id));
    }
  };

  const updateLanguageScore = (id: string, field: keyof LanguageScoreForm, value: string | number | File | null) => {
    setLanguageScores(languageScores.map(score => 
      score.id === id ? { ...score, [field]: value } : score
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 유효성 검사
    if (!gpa || !gpaImageFile) {
      alert('학점과 성적표 이미지를 모두 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    const validLanguageScores = languageScores.filter(score => 
      score.type && score.score && score.imageFile
    );

    if (validLanguageScores.length === 0) {
      alert('최소 하나의 어학 성적을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제로는 API로 전송
      console.log('제출할 데이터:', {
        gpa: parseFloat(gpa),
        gpaImage: gpaImageFile,
        languageScores: validLanguageScores
      });

      // Mock: 인증 진행 중 상태로 변경
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('성적 인증 신청이 완료되었습니다!');
      router.push('/verification/status');
    } catch (error) {
      console.error('인증 신청 오류:', error);
      alert('인증 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ← 돌아가기
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                성적 인증
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name}님
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              성적 정보 입력
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              교환학생 신청을 위한 성적 정보를 입력해주세요. 모든 정보는 관리자 검토 후 승인됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 학점 입력 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📊 학점 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점 (4.5 만점)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.5"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 3.85"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성적표 이미지
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGpaImageFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {gpaImageFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ {gpaImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 어학 성적 입력 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  🌐 어학 성적
                </h3>
                <button
                  type="button"
                  onClick={addLanguageScore}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  + 어학 성적 추가
                </button>
              </div>

              <div className="space-y-4">
                {languageScores.map((languageScore, index) => (
                  <div key={languageScore.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">
                        어학 성적 #{index + 1}
                      </h4>
                      {languageScores.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguageScore(languageScore.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          ✕ 삭제
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          어학 시험 종류
                        </label>
                        <select
                          value={languageScore.type}
                          onChange={(e) => updateLanguageScore(languageScore.id, 'type', e.target.value as LanguageTestType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">선택해주세요</option>
                          {languageTestTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          점수/급수
                        </label>
                        <input
                          type="text"
                          value={languageScore.score}
                          onChange={(e) => updateLanguageScore(languageScore.id, 'score', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="예: 850, N2, 7.0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          성적표 이미지
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateLanguageScore(languageScore.id, 'imageFile', e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        {languageScore.imageFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✅ {languageScore.imageFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {isSubmitting ? '제출 중...' : '인증 신청하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 