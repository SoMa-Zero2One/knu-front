'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, mockUniversities } from '@/data/mockData';
import { User, VerificationStatus } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  useEffect(() => {
    // 관리자가 아닌 사용자는 일반 사용자만 필터링
    const filteredUsers = mockUsers.filter(u => u.role === 'user');
    setUsers(filteredUsers);
    
    // 수정 요청이 있는 사용자 필터링
    const usersWithPendingRequests = filteredUsers.filter(u => 
      u.pendingEditRequest && u.pendingEditRequest.status === 'pending'
    );
    setPendingRequests(usersWithPendingRequests);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || u.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: VerificationStatus) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, verificationStatus: newStatus } : u
    ));
    alert(`사용자 ${userId}의 인증 상태가 ${newStatus}로 변경되었습니다.`);
  };

  const handleEditCountChange = (userId: string, newCount: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, editCount: newCount } : u
    ));
    alert(`사용자 ${userId}의 수정 횟수가 ${newCount}으로 변경되었습니다.`);
  };

  const handleDeadlineRestrictionChange = (userId: string, isRestricted: boolean) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isDeadlineRestricted: isRestricted, maxEditCount: isRestricted ? 3 : 10 } : u
    ));
    alert(`사용자 ${userId}의 마감 제한이 ${isRestricted ? '활성화' : '비활성화'}되었습니다.`);
  };

  const handleEditRequestDecision = (userId: string, decision: 'approved' | 'rejected', comment?: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId && user.pendingEditRequest && user.pendingEditRequest.status === 'pending') {
        const updatedUser = { ...user };
        const pendingRequest = updatedUser.pendingEditRequest!;
        
        if (decision === 'approved') {
          // 수정 요청 승인: 기존 성적을 요청된 성적으로 교체
          if (pendingRequest.requestedGpa !== undefined) {
            updatedUser.gpa = pendingRequest.requestedGpa;
            updatedUser.gpaImageUrl = pendingRequest.requestedGpaImageUrl;
          }
          if (pendingRequest.requestedLanguageScores) {
            updatedUser.languageScores = pendingRequest.requestedLanguageScores;
          }
        }
        
        // 요청 상태 업데이트
        updatedUser.pendingEditRequest = {
          id: pendingRequest.id,
          requestDate: pendingRequest.requestDate,
          status: decision,
          requestedGpa: pendingRequest.requestedGpa,
          requestedGpaImageUrl: pendingRequest.requestedGpaImageUrl,
          requestedLanguageScores: pendingRequest.requestedLanguageScores,
          adminComment: comment,
          adminId: user.id,
          adminReviewDate: new Date().toISOString()
        };
        
        return updatedUser;
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // 대기 중인 요청 목록 업데이트
    const newPendingRequests = updatedUsers.filter(user => 
      user.pendingEditRequest && user.pendingEditRequest.status === 'pending'
    );
    setPendingRequests(newPendingRequests);
    
    setEditingUser(null);
    alert(`수정 요청이 ${decision === 'approved' ? '승인' : '거부'}되었습니다.`);
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
                ← 대시보드
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                🔧 관리자 페이지
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name}님 (관리자)
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 수정 요청 대기 목록 */}
        {pendingRequests.length > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-4">
              ⏳ 성적 수정 요청 대기 중 ({pendingRequests.length}건)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      대기 중
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    요청일: {user.pendingEditRequest?.requestDate}
                  </p>
                  {user.pendingEditRequest?.requestedGpa && (
                    <p className="text-sm text-blue-600 mb-3">
                      학점 변경: {user.gpa} → {user.pendingEditRequest.requestedGpa}
                    </p>
                  )}
                  <button
                    onClick={() => setEditingUser(user)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    검토하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">총 사용자</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.verificationStatus === 'verified').length}
                </p>
                <p className="text-sm text-gray-600">인증 완료</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏳</div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.verificationStatus === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">인증 대기</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏫</div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{mockUniversities.length}</p>
                <p className="text-sm text-gray-600">대학교 수</p>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용자 검색
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름 또는 ID로 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증 상태 필터
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="not_verified">미인증</option>
                <option value="pending">인증 대기</option>
                <option value="verified">인증 완료</option>
              </select>
            </div>
          </div>
        </div>

        {/* 사용자 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              사용자 목록 ({filteredUsers.length}명)
            </h2>
          </div>
          
          {/* 모바일 카드 뷰 */}
          <div className="block lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((userData) => (
                <div key={userData.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{userData.name}</div>
                        <div className="text-xs text-gray-500">ID: {userData.id}</div>
                        <div className="text-xs text-gray-500">
                          지원: {userData.appliedUniversities.length}개 대학
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userData.verificationStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : userData.verificationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.verificationStatus === 'verified' 
                          ? '인증 완료' 
                          : userData.verificationStatus === 'pending'
                          ? '인증 대기'
                          : '미인증'
                        }
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">학점:</span>
                        {userData.gpa ? (
                          <span className="ml-1 font-semibold text-blue-600">
                            {userData.gpa.toFixed(2)}
                          </span>
                        ) : (
                          <span className="ml-1 text-gray-400">미제출</span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500">수정:</span>
                        <span className="ml-1">{userData.editCount}/{userData.maxEditCount}</span>
                      </div>
                    </div>
                    
                    {userData.languageScores.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {userData.languageScores.map((score) => (
                          <span
                            key={score.id}
                            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {score.type}: {score.score}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => router.push(`/profile/${userData.id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                      >
                        프로필
                      </button>
                      <button
                        onClick={() => setEditingUser(userData)}
                        className="text-green-600 hover:text-green-700 text-sm cursor-pointer"
                      >
                        수정
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    학점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    어학 성적
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수정 횟수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    인증 상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {userData.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {userData.id} | UUID: {userData.uuid}
                        </div>
                        <div className="text-xs text-gray-500">
                          지원: {userData.appliedUniversities.length}개 대학
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userData.gpa ? (
                        <div className="text-sm">
                          <span className="font-semibold text-blue-600">
                            {userData.gpa.toFixed(2)}
                          </span>
                          <span className="text-gray-500"> / 4.5</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">미제출</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userData.languageScores.length > 0 ? (
                        <div className="space-y-1">
                          {userData.languageScores.map((score) => (
                            <div
                              key={score.id}
                              className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1"
                            >
                              {score.type}: {score.score}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">없음</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={userData.maxEditCount}
                            value={userData.editCount}
                            onChange={(e) => handleEditCountChange(userData.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <span className="text-gray-500">/ {userData.maxEditCount}</span>
                        </div>
                        <div className="mt-1">
                          <label className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={userData.isDeadlineRestricted}
                              onChange={(e) => handleDeadlineRestrictionChange(userData.id, e.target.checked)}
                              className="mr-1"
                            />
                            마감 제한
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userData.verificationStatus}
                        onChange={(e) => handleStatusChange(userData.id, e.target.value as VerificationStatus)}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          userData.verificationStatus === 'verified' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : userData.verificationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="not_verified">미인증</option>
                        <option value="pending">인증 대기</option>
                        <option value="verified">인증 완료</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => router.push(`/profile/${userData.id}`)}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        프로필
                      </button>
                      <button
                        onClick={() => setEditingUser(userData)}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 편집 모달 */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUser.name} {editingUser.pendingEditRequest ? '수정 요청 검토' : '사용자 수정'}
              </h3>
              
              {editingUser.pendingEditRequest && editingUser.pendingEditRequest.status === 'pending' ? (
                // 수정 요청 검토 화면
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">📋 수정 요청 정보</h4>
                    <p className="text-sm text-yellow-700">
                      요청일: {editingUser.pendingEditRequest.requestDate}
                    </p>
                  </div>
                  
                  {/* 현재 vs 요청 비교 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">현재 성적</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <span className="text-sm font-medium">학점:</span>
                          <span className="ml-2 text-blue-600 font-semibold">
                            {editingUser.gpa || '미입력'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">어학 성적:</span>
                          <div className="mt-1 space-y-1">
                            {editingUser.languageScores?.length > 0 ? (
                              editingUser.languageScores.map((score, index) => (
                                <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block mr-1">
                                  {score.type}: {score.score}
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">요청 성적</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <span className="text-sm font-medium">학점:</span>
                          <span className="ml-2 text-blue-600 font-semibold">
                            {editingUser.pendingEditRequest.requestedGpa || '변경 없음'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">어학 성적:</span>
                                                     <div className="mt-1 space-y-1">
                             {editingUser.pendingEditRequest.requestedLanguageScores && editingUser.pendingEditRequest.requestedLanguageScores.length > 0 ? (
                               editingUser.pendingEditRequest.requestedLanguageScores.map((score, index) => (
                                <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mr-1">
                                  {score.type}: {score.score}
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-blue-600">변경 없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 관리자 코멘트 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관리자 코멘트 (선택사항)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="승인/거부 사유를 입력하세요..."
                      id="adminComment"
                    />
                  </div>
                  
                  {/* 결정 버튼 */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => {
                        const comment = (document.getElementById('adminComment') as HTMLTextAreaElement)?.value;
                        handleEditRequestDecision(editingUser.id, 'rejected', comment);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      거부
                    </button>
                    <button
                      onClick={() => {
                        const comment = (document.getElementById('adminComment') as HTMLTextAreaElement)?.value;
                        handleEditRequestDecision(editingUser.id, 'approved', comment);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      승인
                    </button>
                  </div>
                </div>
              ) : (
                // 기존 사용자 정보 수정 화면
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      수정 횟수
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={editingUser.maxEditCount}
                      value={editingUser.editCount}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        editCount: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      인증 상태
                    </label>
                    <select
                      value={editingUser.verificationStatus}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        verificationStatus: e.target.value as VerificationStatus
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="not_verified">미인증</option>
                      <option value="pending">인증 대기</option>
                      <option value="verified">인증 완료</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingUser.isDeadlineRestricted}
                        onChange={(e) => setEditingUser({
                          ...editingUser,
                          isDeadlineRestricted: e.target.checked,
                          maxEditCount: e.target.checked ? 3 : 10
                        })}
                        className="mr-2"
                      />
                      마감 3일 전 제한 활성화
                    </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
                        setEditingUser(null);
                        alert('사용자 정보가 수정되었습니다.');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      저장
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 