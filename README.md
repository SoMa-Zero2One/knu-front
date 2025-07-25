# 🎓 건대 합격 예상 정리본 (경쟁률 확인 서비스)

건국대학교 교환학생 합격 예상 정리본 및 경쟁률 확인 서비스입니다.  
성적 인증을 통해 대학교별 지원 현황과 경쟁률을 확인할 수 있습니다.

## 📱 주요 기능

### 👥 사용자 기능
- **성적 인증**: 학점, 어학성적 등록 및 관리자 승인
- **대학교 정보**: 교환학생 지원 가능한 대학교 목록 및 경쟁률 확인
- **지원 현황**: 실시간 지원자 수 및 합격 예상 정보
- **모바일 최적화**: 모바일 퍼스트 반응형 디자인

### 👨‍💼 관리자 기능
- **사용자 관리**: 전체 사용자 목록 및 정보 수정
- **인증 승인**: 성적 인증 요청 검토 및 승인/거부
- **통계 관리**: 대학교별 지원 현황 모니터링

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/soma.git
cd soma
```

### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 3. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### 4. 브라우저 접속
```
http://localhost:3000
```

## 🔑 JWT 토큰 관리

### JWT 토큰 삭제 방법

#### 🌐 브라우저에서 삭제 (권장)
1. **개발자 도구** 열기 (`F12` 또는 `Ctrl+Shift+I`)
2. **Application** 탭 클릭
3. **Local Storage** → `localhost:3000` 선택
4. `authToken` 키 삭제
5. 페이지 새로고침

#### 📱 모바일에서 삭제
1. **브라우저 설정** → **사이트 데이터 삭제**
2. 또는 **시크릿/프라이빗 브라우징** 모드 사용

#### 💻 프로그래밍 방식
```javascript
// 브라우저 콘솔에서 실행
localStorage.removeItem('authToken');
location.reload();
```

### 세션 초기화가 필요한 경우
- 로그인 오류 발생시
- 권한 오류 발생시  
- 다른 사용자로 테스트시
- 인증 상태가 이상할 때

## 🧪 테스트용 계정

프로젝트에는 테스트용 UUID 기반 계정들이 준비되어 있습니다:

### 👤 일반 사용자
- **사용자 1 (인증 완료)**: `/auth/user-uuid-1`
- **사용자 2 (인증 완료)**: `/auth/user-uuid-2`  
- **사용자 4 (미인증)**: `/auth/user-uuid-4`

### 👨‍💼 관리자
- **관리자**: `/auth/admin-uuid-1`

## 📁 프로젝트 구조

```
soma/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 라우트
│   │   │   ├── auth/          # 인증 관련 API
│   │   │   └── verify-token/  # 토큰 검증 API
│   │   ├── admin/             # 관리자 페이지
│   │   ├── auth/              # 인증 페이지
│   │   ├── dashboard/         # 대시보드
│   │   ├── profile/           # 사용자 프로필
│   │   ├── university/        # 대학교 상세 정보
│   │   └── verification/      # 성적 인증
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx   # 인증 컨텍스트
│   ├── data/                  # Mock 데이터
│   ├── lib/                   # 유틸리티 함수
│   └── types/                 # TypeScript 타입 정의
├── package.json
└── README.md
```

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Backend
- **API**: Next.js API Routes
- **Authentication**: JWT (JSON Web Token)
- **Data**: Mock 데이터 (향후 DB 연동 예정)

### UI/UX
- **Design System**: Tailwind CSS
- **Responsive**: Mobile-First 디자인
- **Icons**: Unicode Emoji + CSS

## 📋 페이지별 기능

### 🏠 홈페이지 (`/`)
- 서비스 소개
- 테스트용 UUID 링크 제공

### 🔐 인증 페이지 (`/auth/[uuid]`)
- UUID 기반 자동 로그인
- JWT 토큰 발급 및 저장

### 📊 대시보드 (`/dashboard`)
- 개인 인증 상태 확인
- 대학교 목록 및 경쟁률
- 성적 인증 버튼

### 📝 성적 인증 (`/verification`)
- 학점 정보 입력
- 어학성적 등록 (복수 가능)
- 관리자 승인 대기

### 🏫 대학교 상세 (`/university/[id]`)
- 대학교 정보 및 지원 조건
- 현재 지원자 목록
- 경쟁률 분석

### 👥 관리자 (`/admin`)
- 사용자 목록 및 관리
- 인증 요청 승인/거부
- 통계 및 모니터링

## 🎨 디자인 특징

### 📱 모바일 퍼스트
- 모든 페이지가 모바일 우선으로 설계
- 테이블 → 카드 형태로 자동 변환
- 터치 친화적 UI 요소

### 🖱 사용성 개선
- 클릭 가능한 모든 요소에 `cursor: pointer`
- 직관적인 호버 효과
- 명확한 시각적 피드백

### 🎯 반응형 브레이크포인트
- **Mobile**: `< 640px` (기본)
- **Tablet**: `≥ 640px` (sm)
- **Desktop**: `≥ 1024px` (lg)

## 🔧 개발 환경

### 요구사항
- **Node.js**: 18.0.0 이상
- **npm**: 8.0.0 이상 또는 **yarn**: 1.22.0 이상

### 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅 검사
npm run lint
```