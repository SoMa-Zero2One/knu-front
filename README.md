# 🎓 SOMA- 대학교 교환학생 지원 관리 시스템

**SOMA**는 대학교 교환학생 지원 과정을 체계적으로 관리하는 웹 플랫폼입니다.  
성적 인증, 대학교 지원, 경쟁률 분석 등 교환학생 준비에 필요한 모든 기능을 제공합니다.

## ✨ 주요 기능

### 👥 **사용자 기능**
- **🔐 간편 인증**: UUID 기반 원클릭 로그인
- **🏫 대학교 지원**: 검색 기반 대학교 추가 및 지망순위 관리
- **📈 경쟁률 분석**: 실시간 지원 현황 및 합격 예상 정보

### 🎯 **핵심 특징**
- **📱 반응형 네비게이션**: 데스크톱 헤더 + 모바일 하단 네비게이션
- **🖱️ 직관적 UI**: 모든 상호작용 요소에 적절한 커서 및 피드백
- **🎨 드래그 앤 드롭**: 지망순위 조정을 위한 직관적 인터페이스
- **🔍 실시간 검색**: 대학교 검색 및 자동완성 기능
- **📐 적응형 레이아웃**: 디바이스별 최적화된 UI/UX

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
- **김학생**: `http://localhost:3000/user-uuid-1`
- **이학생**: `http://localhost:3000/user-uuid-2` 

## 📱 페이지별 기능

### **🏠 홈페이지** (`/`)
- UUID 없이 접속 시 인증 링크 입력 안내
- 프로젝트 개요 및 주요 기능 안내

### **📊 대시보드** (`/dashboard`)
- 개인 성적 인증 상태 확인
- 지원한 대학교 목록 (지망순위 포함)
- 성적 수정 요청 상태 확인
- 빠른 액션 버튼 (인증, 지원, 수정)

### **🏫 대학교 지원** (`/applications/edit`)
- **검색 기반 추가**: 대학교 이름으로 검색 후 추가
- **실시간 미리보기**: 선택한 대학교 정보 확인
- **지원 현황**: 편집 횟수 및 마감일 제한 관리

### **🎓 대학교 상세** (`/university/[id]`)
- 대학교 상세 정보 및 지원 조건
- 현재 지원자 목록 (지망순위별)
- 경쟁률 및 합격 예상 분석

### **👤 프로필** (`/profile/[id]`)
- 개인 정보 및 성적 현황
- 지원한 대학교 목록 (순위별 정렬)

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
SOMA는 모바일과 데스크톱 환경에 최적화된 반응형 디자인을 제공합니다.

#### **🖥️ Desktop View (≥ 640px)**
- **Header Navigation**: 텍스트 기반 네비게이션 버튼
  - `뒤로 가기 | 메인으로` 형태의 구분선 스타일
  - 우측 상단에 "내 프로필" 버튼 배치
- **Content Layout**: 넓은 화면을 활용한 그리드 레이아웃
- **Table View**: 대학교 목록을 테이블 형태로 표시

![Desktop View](./screenshots/desktop-view.png)

#### **📱 Mobile View (< 640px)**
- **Clean Header**: 제목만 표시하는 깔끔한 헤더
- **Bottom Navigation**: 하단 고정 네비게이션 바
  - 🔙 **뒤로**: 이전 페이지로 이동
  - 🏠 **홈**: 대시보드로 이동  
  - 👤 **프로필**: 내 프로필로 이동
  - 현재 페이지는 파란색으로 하이라이트
- **Card Layout**: 모바일에 최적화된 카드형 레이아웃

![Mobile View](./screenshots/mobile-view.png)

### **🧭 Navigation System**

#### **Desktop Navigation**
```
Header: [뒤로 가기 | 메인으로] ────────── [내 프로필]
```

#### **Mobile Navigation** 
```
Header: [              제목만              ]
                    
Bottom: [뒤로] [홈] [프로필]
```

### **🖱️ 사용성 개선**
- **Cursor Styles**: 모든 상호작용 요소에 적절한 커서
- **Visual Feedback**: 호버, 포커스, 액티브 상태 표시
- **Loading States**: 비동기 작업 중 로딩 표시
- **Error Handling**: 명확한 에러 메시지 및 가이드
- **Safe Zone**: 모바일 하단 네비게이션을 위한 컨텐츠 여백 처리

### **🎯 인터랙션**
- **Drag & Drop**: 지망순위 조정
- **Search & Select**: 대학교 검색 및 선택
- **Modal Interactions**: 성적 검토 및 이미지 확인
- **Responsive Touch**: 모바일 터치 인터페이스 최적화

### **📐 Breakpoints**
- **Mobile**: `< 640px` - 카드 레이아웃, 하단 네비게이션
- **Tablet**: `640px - 1024px` - 하이브리드 레이아웃
- **Desktop**: `≥ 1024px` - 테이블 레이아웃, 헤더 네비게이션

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

