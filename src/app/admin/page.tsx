'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, mockUniversities } from '@/data/mockData';
import { User, VerificationStatus } from '@/types';

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{[userId: string]: Partial<User>}>({});

  useEffect(() => {
    // 관리자가 아닌 사용자는 일반 사용자만 필터링
    const filteredUsers = mockUsers.filter(u => u.role === 'user');
    setUsers(filteredUsers);
    
    // 수정 요청이 있는 사용자 필터링
    const usersWithPendingRequests = filteredUsers.filter(u => 
      u.pendingEditRequest && u.pendingEditRequest.status === 'pending'
    );
    setPendingRequests(usersWithPendingRequests);
    
    // 성적 인증 대기 중인 사용자 필터링 (최초 인증)
    const usersWithPendingVerifications = filteredUsers.filter(u => 
      u.verificationStatus === 'pending' && !u.pendingEditRequest
    );
    setPendingVerifications(usersWithPendingVerifications);

    // URL 쿼리 파라미터에서 userId가 있으면 해당 사용자를 검색
    const userId = searchParams.get('userId');
    if (userId) {
      const targetUser = filteredUsers.find(u => u.id === userId);
      if (targetUser) {
        // 해당 사용자의 이름으로 검색 설정
        setSearchTerm(targetUser.name);
        // URL에서 쿼리 파라미터 제거
        router.replace('/admin');
      }
    }
  }, [searchParams, router]);

  // 인라인 편집 시작
  const startEditing = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingData({
        ...editingData,
        [userId]: {
          editCount: user.editCount,
          verificationStatus: user.verificationStatus,
          isDeadlineRestricted: user.isDeadlineRestricted
        }
      });
      setEditingUserId(userId);
    }
  };

  // 편집 데이터 업데이트
  const updateEditingData = (userId: string, field: string, value: any) => {
    setEditingData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  // 인라인 편집 저장
  const saveUser = async (userId: string) => {
    setSavingUserId(userId);
    
    try {
      // 백엔드 요청 시뮬레이션 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = users.find(u => u.id === userId);
      const editData = editingData[userId];
      
      if (currentUser && editData) {
        const updatedUser: User = {
          ...currentUser,
          editCount: editData.editCount || currentUser.editCount,
          verificationStatus: editData.verificationStatus || currentUser.verificationStatus,
          isDeadlineRestricted: editData.isDeadlineRestricted !== undefined ? editData.isDeadlineRestricted : currentUser.isDeadlineRestricted,
          maxEditCount: editData.isDeadlineRestricted ? 3 : 10
        };
        
        // 사용자 목록 업데이트
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        
        alert(`${updatedUser.name}님의 정보가 수정되었습니다.`);
      }
      
      // 편집 모드 종료
      setEditingUserId(null);
      setEditingData(prev => {
        const newData = { ...prev };
        delete newData[userId];
        return newData;
      });
      
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setSavingUserId(null);
    }
  };

  // 인라인 편집 취소
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingData(prev => {
      if (editingUserId) {
        const newData = { ...prev };
        delete newData[editingUserId];
        return newData;
      }
      return prev;
    });
  };

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
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, verificationStatus: newStatus } : u
    );
    setUsers(updatedUsers);
    
    // 성적 인증 대기 목록 업데이트
    const newPendingVerifications = updatedUsers.filter(user => 
      user.verificationStatus === 'pending' && !user.pendingEditRequest
    );
    setPendingVerifications(newPendingVerifications);
    
    alert(`사용자 ${userId}의 인증 상태가 ${newStatus}로 변경되었습니다.`);
  };

  // 임시 편집 데이터 저장 (실제 저장 전까지)
  const updateTempUserData = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
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
    
    // 성적 인증 대기 목록도 업데이트
    const newPendingVerifications = updatedUsers.filter(user => 
      user.verificationStatus === 'pending' && !user.pendingEditRequest
    );
    setPendingVerifications(newPendingVerifications);
    
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
        {/* 성적 인증 확인 요청 목록 */}
        {pendingVerifications.length > 0 && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              📋 성적 인증 확인 요청 ({pendingVerifications.length}건)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingVerifications.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      인증 대기
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>학점: {user.gpa || '미제출'}</p>
                    <p>어학성적: {user.languageScores.length}개</p>
                  </div>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    인증 처리
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    검토하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              <div className="text-3xl mr-4">📝</div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.pendingEditRequest && u.pendingEditRequest.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">수정 요청</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증 상태 필터
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                      {editingUserId === userData.id ? (
                        <div className="flex space-x-1">
                                                     <button
                                                           onClick={() => saveUser(userData.id)}
                              disabled={savingUserId === userData.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50 text-sm cursor-pointer"
                           >
                             {savingUserId === userData.id ? '저장중...' : '저장'}
                           </button>
                          <button
                            onClick={cancelEditing}
                            disabled={savingUserId === userData.id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 text-sm cursor-pointer"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(userData.id)}
                          className="text-green-600 hover:text-green-700 text-sm cursor-pointer"
                        >
                          수정
                        </button>
                      )}
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
                        {editingUserId === userData.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                max={userData.maxEditCount}
                                value={editingData[userData.id]?.editCount ?? userData.editCount}
                                onChange={(e) => updateEditingData(userData.id, 'editCount', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-xs border border-blue-300 rounded bg-blue-50 cursor-text"
                              />
                              <span className="text-gray-500">/ {userData.maxEditCount}</span>
                            </div>
                            <label className="flex items-center text-xs">
                              <input
                                type="checkbox"
                                checked={editingData[userData.id]?.isDeadlineRestricted ?? userData.isDeadlineRestricted}
                                onChange={(e) => updateEditingData(userData.id, 'isDeadlineRestricted', e.target.checked)}
                                className="mr-1 cursor-pointer"
                              />
                              마감 제한
                            </label>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{userData.editCount}</span>
                              <span className="text-gray-500 text-xs">/ {userData.maxEditCount}</span>
                            </div>
                            {userData.isDeadlineRestricted && (
                              <span className="text-xs text-amber-600">마감 제한</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === userData.id ? (
                        <select
                          value={editingData[userData.id]?.verificationStatus ?? userData.verificationStatus}
                          onChange={(e) => updateEditingData(userData.id, 'verificationStatus', e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-blue-300 bg-blue-50 cursor-pointer"
                        >
                          <option value="not_verified">미인증</option>
                          <option value="pending">인증 대기</option>
                          <option value="verified">인증 완료</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userData.verificationStatus === 'verified' 
                            ? 'bg-green-100 text-green-800'
                            : userData.verificationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userData.verificationStatus === 'verified' ? '인증 완료' : 
                           userData.verificationStatus === 'pending' ? '인증 대기' : '미인증'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/profile/${userData.id}`)}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          프로필
                        </button>
                        {editingUserId === userData.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => saveUser(userData.id)}
                              disabled={savingUserId === userData.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50 text-xs cursor-pointer"
                            >
                              {savingUserId === userData.id ? '저장중...' : '저장'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={savingUserId === userData.id}
                              className="text-gray-600 hover:text-gray-900 disabled:opacity-50 text-xs cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(userData.id)}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                          >
                            수정
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 성적 수정 요청 검토 모달 - 특별한 검토가 필요한 경우만 */}
        {editingUser && editingUser.pendingEditRequest?.status === 'pending' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUser.name} 수정 요청 검토
              </h3>
                {/* 수정 요청 검토 화면 */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">📋 수정 요청 정보</h4>
                    <p className="text-sm text-yellow-700">
                      요청일: {editingUser.pendingEditRequest!.requestDate}
                    </p>
                  </div>
                  
                                     {/* 현재 vs 요청 비교 */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <h4 className="font-medium text-gray-900 mb-3">현재 성적</h4>
                       <div className="bg-gray-50 p-4 rounded-lg">
                         <div className="mb-4">
                           <span className="text-sm font-medium">학점:</span>
                           <span className="ml-2 text-blue-600 font-semibold">
                             {editingUser.gpa || '미입력'}
                           </span>
                           {editingUser.gpaImageUrl && (
                             <div className="mt-2">
                               <img 
                                 src={editingUser.gpaImageUrl} 
                                 alt="현재 성적표" 
                                 className="w-full max-w-48 h-32 object-cover border border-gray-300 rounded cursor-pointer hover:opacity-90"
                                 onClick={() => window.open(editingUser.gpaImageUrl, '_blank')}
                               />
                               <p className="text-xs text-gray-500 mt-1 cursor-pointer">클릭하면 확대</p>
                             </div>
                           )}
                         </div>
                         <div>
                           <span className="text-sm font-medium">어학 성적:</span>
                           <div className="mt-2 space-y-2">
                             {editingUser.languageScores?.length > 0 ? (
                               editingUser.languageScores.map((score, index) => (
                                 <div key={index} className="border border-gray-200 p-2 rounded">
                                   <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block mb-2">
                                     {score.type}: {score.score}
                                   </div>
                                   {score.imageUrl && (
                                     <img 
                                       src={score.imageUrl} 
                                       alt={`${score.type} 성적표`}
                                       className="w-full max-w-32 h-20 object-cover border border-gray-300 rounded cursor-pointer hover:opacity-90"
                                       onClick={() => window.open(score.imageUrl, '_blank')}
                                     />
                                   )}
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
                         <div className="mb-4">
                           <span className="text-sm font-medium">학점:</span>
                           <span className="ml-2 text-blue-600 font-semibold">
                             {editingUser.pendingEditRequest.requestedGpa || '변경 없음'}
                           </span>
                           {editingUser.pendingEditRequest?.requestedGpaImageUrl && (
                             <div className="mt-2">
                               <img 
                                 src={editingUser.pendingEditRequest.requestedGpaImageUrl} 
                                 alt="요청 성적표" 
                                 className="w-full max-w-48 h-32 object-cover border border-blue-300 rounded cursor-pointer hover:opacity-90"
                                 onClick={() => editingUser.pendingEditRequest?.requestedGpaImageUrl && window.open(editingUser.pendingEditRequest.requestedGpaImageUrl, '_blank')}
                               />
                               <p className="text-xs text-blue-600 mt-1 cursor-pointer">클릭하면 확대</p>
                             </div>
                           )}
                         </div>
                         <div>
                           <span className="text-sm font-medium">어학 성적:</span>
                           <div className="mt-2 space-y-2">
                             {editingUser.pendingEditRequest.requestedLanguageScores && editingUser.pendingEditRequest.requestedLanguageScores.length > 0 ? (
                               editingUser.pendingEditRequest.requestedLanguageScores.map((score, index) => (
                                 <div key={index} className="border border-blue-200 p-2 rounded">
                                   <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mb-2">
                                     {score.type}: {score.score}
                                   </div>
                                   {score.imageUrl && (
                                     <img 
                                       src={score.imageUrl} 
                                       alt={`${score.type} 요청 성적표`}
                                       className="w-full max-w-32 h-20 object-cover border border-blue-300 rounded cursor-pointer hover:opacity-90"
                                       onClick={() => window.open(score.imageUrl, '_blank')}
                                     />
                                   )}
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                      placeholder="승인/거부 사유를 입력하세요..."
                      id="adminComment"
                    />
                  </div>
                  
                  {/* 결정 버튼 */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => {
                        const comment = (document.getElementById('adminComment') as HTMLTextAreaElement)?.value;
                        handleEditRequestDecision(editingUser.id, 'rejected', comment);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      거부
                    </button>
                    <button
                      onClick={() => {
                        const comment = (document.getElementById('adminComment') as HTMLTextAreaElement)?.value;
                        handleEditRequestDecision(editingUser.id, 'approved', comment);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      승인
                    </button>
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AdminPageContent />
    </Suspense>
  );
} 