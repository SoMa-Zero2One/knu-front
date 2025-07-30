# 🎓 SOMA - 대학교 교환학생 지원 관리 시스템

**SOMA**는 대학교 교환학생 지원 과정을 체계적으로 관리하는 웹 플랫폼입니다.  
성적 인증, 대학교 지원, 경쟁률 분석 등 교환학생 준비에 필요한 모든 기능을 제공합니다.

## ✨ 주요 기능

### 👥 **사용자 기능**
- **🔐 간편 인증**: UUID 기반 원클릭 로그인
- **📊 성적 관리**: 학점/어학성적 등록 및 이미지 업로드
- **🏫 대학교 지원**: 검색 기반 대학교 추가 및 지망순위 관리
- **📈 경쟁률 분석**: 실시간 지원 현황 및 합격 예상 정보
- **✏️ 성적 수정**: 인증 후 성적 정보 수정 요청 시스템

### 🎯 **핵심 특징**
- **📱 모바일 퍼스트**: 반응형 디자인으로 모든 기기 지원
- **🖱️ 직관적 UI**: 모든 상호작용 요소에 적절한 커서 및 피드백
- **🎨 드래그 앤 드롭**: 지망순위 조정을 위한 직관적 인터페이스
- **🔍 실시간 검색**: 대학교 검색 및 자동완성 기능

## 🚀 설치 및 실행

### **Prerequisites**
- Node.js 18.0.0 이상
- npm 8.0.0 이상 또는 yarn 1.22.0 이상

### **설치**
```bash
# 저장소 클론
git clone https://github.com/your-username/soma.git
cd soma

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### **브라우저 접속**
```
http://localhost:3000
```

## 🧪 테스트 계정

UUID 기반 자동 로그인으로 바로 테스트 가능합니다:

### **👤 일반 사용자**
- **김학생** (인증 완료): `http://localhost:3000/user-uuid-1`
- **이학생** (인증 완료): `http://localhost:3000/user-uuid-2` 
- **박학생** (미인증): `http://localhost:3000/user-uuid-4`

## 📱 페이지별 기능

### **🏠 홈페이지** (`/`)
- UUID 없이 접속 시 인증 링크 입력 안내
- 프로젝트 개요 및 주요 기능 안내

### **📊 대시보드** (`/dashboard`)
- 개인 성적 인증 상태 확인
- 지원한 대학교 목록 (지망순위 포함)
- 성적 수정 요청 상태 확인
- 빠른 액션 버튼 (인증, 지원, 수정)

### **📝 성적 인증** (`/verification`)
- **최초 인증**: 학점 및 어학성적 등록
- **수정 요청**: 기존 성적 정보 수정 신청
- **상태 확인**: 인증 진행 상황 모니터링
- **이미지 업로드**: 성적표 이미지 첨부

### **🏫 대학교 지원** (`/applications/edit`)
- **검색 기반 추가**: 대학교 이름으로 검색 후 추가
- **지망순위 관리**: 드래그 앤 드롭으로 순위 조정
- **실시간 미리보기**: 선택한 대학교 정보 확인
- **지원 현황**: 편집 횟수 및 마감일 제한 관리

### **🎓 대학교 상세** (`/university/[id]`)
- 대학교 상세 정보 및 지원 조건
- 현재 지원자 목록 (지망순위별)
- 경쟁률 및 합격 예상 분석

### **👤 프로필** (`/profile/[id]`)
- 개인 정보 및 성적 현황
- 지원한 대학교 목록 (순위별 정렬)

## 🛠 기술 스택

### **Frontend**
- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **UI Components**: Custom Components

### **Backend**
- **API**: Next.js API Routes
- **Authentication**: JWT (JSON Web Token)
- **Data Storage**: Mock Data (향후 DB 연동 예정)
- **File Upload**: Base64 이미지 처리

### **Development**
- **React**: 19.1.0
- **Node.js**: 18+ 
- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📁 프로젝트 구조

```
soma/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── auth/[uuid]/    # UUID 기반 인증
│   │   │   └── verify-token/   # JWT 토큰 검증
│   │   ├── [uuid]/             # UUID 인증 페이지
│   │   ├── applications/       # 대학교 지원 관리
│   │   │   └── edit/          # 지원 대학교 편집
│   │   ├── dashboard/          # 사용자 대시보드
│   │   ├── profile/[id]/       # 사용자 프로필
│   │   ├── university/[id]/    # 대학교 상세
│   │   └── verification/       # 성적 인증
│   │       ├── edit/          # 성적 수정 요청
│   │       └── status/        # 인증 상태 확인
│   ├── contexts/               # React Context
│   │   └── AuthContext.tsx   # 사용자 인증 상태
│   ├── data/                   # Mock Data
│   │   └── mockData.ts        # 사용자/대학교 데이터
│   ├── lib/                    # 유틸리티
│   │   └── auth.ts            # JWT 인증 로직
│   └── types/                  # TypeScript Types
│       └── index.ts           # 타입 정의
├── public/                     # 정적 파일
├── package.json               # 프로젝트 설정
├── tsconfig.json              # TypeScript 설정
├── tailwind.config.js         # Tailwind 설정
└── README.md                  # 프로젝트 문서
```

## 🎨 UI/UX 특징

### **📱 반응형 디자인**
- **Mobile First**: 모바일 우선 설계
- **Breakpoints**: 
  - Mobile: `< 640px`
  - Tablet: `640px - 1024px` 
  - Desktop: `≥ 1024px`
- **Dynamic Layouts**: 테이블 ↔ 카드 자동 전환

### **🖱️ 사용성 개선**
- **Cursor Styles**: 모든 상호작용 요소에 적절한 커서
- **Visual Feedback**: 호버, 포커스, 액티브 상태 표시
- **Loading States**: 비동기 작업 중 로딩 표시
- **Error Handling**: 명확한 에러 메시지 및 가이드

### **🎯 인터랙션**
- **Drag & Drop**: 지망순위 조정
- **Search & Select**: 대학교 검색 및 선택
- **Modal Interactions**: 성적 검토 및 이미지 확인

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행  
npm start

# 코드 린팅
npm run lint
```

## 🔑 JWT 인증 관리

### **토큰 저장 위치**
- **Local Storage**: `authToken` 키
- **자동 만료**: 24시간 후 자동 로그아웃

### **토큰 초기화 방법**
```javascript
// 브라우저 콘솔에서 실행
localStorage.removeItem('authToken');
location.reload();
```

### **개발자 도구로 삭제**
1. `F12` → **Application** → **Local Storage**
2. `localhost:3000` → `authToken` 삭제
3. 페이지 새로고침
