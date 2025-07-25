'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { languageTestTypes, getUserById } from '@/data/mockData';
import { LanguageTestType } from '@/types';

interface LanguageScoreForm {
  id: string;
  type: LanguageTestType | '';
  score: string;
  imageFile: File | null;
  existingImageUrl?: string;
}

export default function VerificationEditPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // 폼 상태
  const [gpa, setGpa] = useState('');
  const [gpaImageFile, setGpaImageFile] = useState<File | null>(null);
  const [languageScores, setLanguageScores] = useState<LanguageScoreForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [maxEditCount, setMaxEditCount] = useState(10);
  const [isDeadlineRestricted, setIsDeadlineRestricted] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = getUserById(user.id);
      if (userData) {
        // 기존 데이터로 폼 초기화
        setGpa(userData.gpa?.toString() || '');
        setEditCount(userData.editCount || 0);
        setMaxEditCount(userData.maxEditCount || 10);
        setIsDeadlineRestricted(userData.isDeadlineRestricted || false);
        setHasPendingRequest(!!userData.pendingEditRequest);
        
        if (userData.languageScores && userData.languageScores.length > 0) {
          const formattedScores = userData.languageScores.map(score => ({
            id: score.id,
            type: score.type,
            score: score.score,
            imageFile: null,
            existingImageUrl: score.imageUrl
          }));
          setLanguageScores(formattedScores);
        } else {
          setLanguageScores([{ id: '1', type: '', score: '', imageFile: null }]);
        }
      }
    }
  }, [user]);

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

  if (user.verificationStatus !== 'verified') {
    router.push('/dashboard');
    return null;
  }

  const canEdit = (!isDeadlineRestricted || editCount < maxEditCount) && !hasPendingRequest;

  const addLanguageScore = () => {
    const newId = Date.now().toString();
    setLanguageScores([...languageScores, { id: newId, type: '', score: '', imageFile: null }]);
  };

  const removeLanguageScore = (id: string) => {
    if (languageScores.length > 1) {
      setLanguageScores(languageScores.filter(score => score.id !== id));
    }
  };

  const updateLanguageScore = (id: string, field: keyof LanguageScoreForm, value: any) => {
    setLanguageScores(languageScores.map(score => 
      score.id === id ? { ...score, [field]: value } : score
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      alert('수정 횟수를 초과했거나 마감 기한이 지났습니다.');
      return;
    }

    setIsSubmitting(true);

    // 유효성 검사
    if (!gpa) {
      alert('학점을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    const validLanguageScores = languageScores.filter(score => 
      score.type && score.score && (score.imageFile || score.existingImageUrl)
    );

    if (validLanguageScores.length === 0) {
      alert('최소 하나의 어학 성적을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제로는 API로 전송
      console.log('수정할 데이터:', {
        gpa: parseFloat(gpa),
        gpaImage: gpaImageFile,
        languageScores: validLanguageScores,
        currentEditCount: editCount
      });

      // Mock: 수정 요청 제출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('성적 수정 요청이 제출되었습니다!\n관리자 검토 후 승인되면 성적이 업데이트됩니다.');
      router.push('/dashboard');
    } catch (error) {
      console.error('수정 오류:', error);
      alert('수정 중 오류가 발생했습니다.');
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
                성적 정보 수정
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 수정 요청 상태 안내 */}
        {hasPendingRequest && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-blue-400 text-xl mr-3">⏳</div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">수정 요청 확인 중</h3>
                <p className="text-sm text-blue-700">
                  이전에 요청하신 성적 수정이 관리자 검토 중입니다. 
                  새로운 수정 요청은 현재 요청이 처리된 후에 가능합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 수정 제한 안내 */}
        {isDeadlineRestricted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-yellow-400 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">수정 제한 안내</h3>
                <p className="text-sm text-yellow-700">
                  마감 3일 전부터는 수정 횟수가 제한됩니다. 
                  현재 {editCount}/{maxEditCount}번 수정하셨습니다.
                  {!canEdit && ' 더 이상 수정할 수 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              성적 정보 수정 요청
            </h2>
            <p className="text-gray-600">
              인증된 성적 정보의 수정을 요청할 수 있습니다. 
              수정 요청은 관리자 검토를 거쳐 승인되며, 승인 전까지는 기존 성적이 유지됩니다.
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
                    disabled={!canEdit}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !canEdit ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="예: 3.85"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성적표 이미지 {user.gpaImageUrl && '(기존 파일 교체)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGpaImageFile(e.target.files?.[0] || null)}
                    disabled={!canEdit}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !canEdit ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                  />
                  {user.gpaImageUrl && !gpaImageFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ 기존 파일 유지됨
                    </p>
                  )}
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
                                 {canEdit && (
                   <button
                     type="button"
                     onClick={addLanguageScore}
                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                   >
                     + 어학 성적 추가
                   </button>
                 )}
              </div>

              <div className="space-y-4">
                {languageScores.map((languageScore, index) => (
                  <div key={languageScore.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">
                        어학 성적 #{index + 1}
                      </h4>
                                             {canEdit && languageScores.length > 1 && (
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
                          disabled={!canEdit}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !canEdit ? 'bg-gray-100 text-gray-500' : ''
                          }`}
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
                          disabled={!canEdit}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !canEdit ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                          placeholder="예: 850, N2, 7.0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          성적표 이미지 {languageScore.existingImageUrl && '(기존 파일 교체)'}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateLanguageScore(languageScore.id, 'imageFile', e.target.files?.[0] || null)}
                          disabled={!canEdit}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !canEdit ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                        />
                        {languageScore.existingImageUrl && !languageScore.imageFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✅ 기존 파일 유지됨
                          </p>
                        )}
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
                disabled={isSubmitting || !canEdit}
                className={`px-6 py-2 rounded-md transition-colors ${
                  isSubmitting || !canEdit
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {isSubmitting ? '요청 제출 중...' : 
                 hasPendingRequest ? '검토 중' :
                 !canEdit ? '요청 불가' : '수정 요청하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 