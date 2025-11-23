# Google OAuth 로그인 기능 구현 완료

## ✅ 구현 완료 내용

### 1. 파일 구조

```
Frontend/
├── src/
│   ├── api/
│   │   └── auth.ts                 # Google OAuth API 함수
│   ├── components/
│   │   └── LoginButton.tsx         # Google 로그인 버튼 컴포넌트
│   ├── pages/
│   │   ├── Login.tsx               # 로그인 페이지
│   │   ├── CallbackPage.tsx        # OAuth 콜백 처리 페이지
│   │   ├── WebUpload.tsx           # 메인 업로드 페이지
│   │   └── ...
│   ├── types/
│   │   └── auth.ts                 # 타입 정의
│   ├── store/
│   │   └── authStore.ts            # Zustand 인증 스토어
│   └── App.tsx                     # React Router 설정
├── public/
│   └── _redirects                  # Netlify SPA 라우팅 설정
└── .env                            # 환경변수 (수동 생성 필요)
```

---

## 🔧 구현 상세

### 1. Google OAuth URL 생성 (`src/api/auth.ts`)

```typescript
export const startGoogleLogin = (): void => {
  const googleURL =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=133050396922-856c4qtiu21ta4h3s9j2tbua02kk1c23.apps.googleusercontent.com` +
    `&redirect_uri=https://sketchcheck.shop/auth/callback` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;
  
  window.location.href = googleURL;
};
```

### 2. 로그인 버튼 컴포넌트 (`src/components/LoginButton.tsx`)

- Google 아이콘이 포함된 버튼
- 클릭 시 `startGoogleLogin()` 호출
- 사용법: `<LoginButton />`

### 3. 콜백 페이지 (`src/pages/CallbackPage.tsx`)

**주요 기능:**
- URL에서 `code` 파라미터 추출
- 백엔드 API 호출: `GET https://sketchcheck.shop/auth/callback?code=XXXX`
- **localStorage에 토큰 저장**:
  ```typescript
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  ```
- 성공 시 홈(`/`)으로 리다이렉트
- 실패 시 로그인 페이지로 리다이렉트

### 4. React Router 설정 (`src/App.tsx`)

**라우트 구조:**
- `/login` - 로그인 페이지
- `/auth/callback` - OAuth 콜백 처리
- `/callback` - OAuth 콜백 처리 (대체 경로)
- `/` - 메인 페이지 (로그인 필요)
- `*` - 모든 기타 경로는 홈으로 리다이렉트

**인증 체크:**
```typescript
const checkAuth = () => {
  return isAuthenticated || !!localStorage.getItem('accessToken');
};
```

### 5. Netlify 배포 설정 (`public/_redirects`)

```
/* /index.html 200
```

SPA 라우팅을 위해 모든 경로를 `index.html`로 리다이렉트합니다.

---

## 🚀 사용 방법

### 로컬 개발 환경

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저 접속**
   ```
   http://localhost:5177
   ```

### 프로덕션 배포 (Netlify)

1. **빌드**
   ```bash
   npm run build
   ```

2. **Netlify 배포**
   - `dist` 폴더를 Netlify에 배포
   - `_redirects` 파일이 자동으로 포함됨

---

## 🔄 전체 로그인 플로우

```
1. 사용자가 /login 페이지 접속
   ↓
2. "Continue with Google" 버튼 클릭
   ↓
3. Google OAuth 페이지로 리다이렉트
   (https://accounts.google.com/o/oauth2/v2/auth?...)
   ↓
4. 사용자가 Google 계정 선택 및 권한 동의
   ↓
5. Google이 https://sketchcheck.shop/auth/callback?code=XXXX 로 리다이렉트
   ↓
6. CallbackPage에서 code 추출
   ↓
7. 백엔드 API 호출: GET /auth/callback?code=XXXX
   ↓
8. 백엔드에서 JWT 토큰 + 사용자 정보 반환
   ↓
9. localStorage에 토큰 저장:
   - accessToken
   - user (JSON)
   ↓
10. 홈(/) 페이지로 리다이렉트
   ↓
11. 메인 업로드 페이지 표시
```

---

## 📦 설치된 패키지

- `zustand@^5.0.8` - 상태 관리
- `react-router-dom@^6.x` - 라우팅
- `axios@^1.13.2` - HTTP 클라이언트

---

## 🔐 localStorage 저장 항목

### 로그인 성공 시
```javascript
localStorage.setItem('accessToken', 'jwt-token-here');
localStorage.setItem('user', JSON.stringify({
  id: 'user-id',
  email: 'user@example.com',
  name: 'User Name',
  picture: 'https://...'
}));
```

### 로그아웃 시
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
```

---

## 🐛 트러블슈팅

### 문제: "Page not found" 계속 표시
**해결**: 브라우저 캐시 완전 삭제
1. F12 → Application → Storage → Clear site data
2. 시크릿 모드로 테스트

### 문제: 콜백 페이지에서 에러
**해결**: 
1. 백엔드 서버 상태 확인
2. Google Cloud Console에서 redirect_uri 확인
3. Network 탭에서 API 응답 확인

### 문제: 로그인 후 메인 페이지 안 보임
**해결**: localStorage에 토큰이 저장되었는지 확인
```javascript
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('user'));
```

---

## ✨ 특징

### 로컬 + 프로덕션 모두 지원
- 로컬 개발: `http://localhost:5177`
- 프로덕션: `https://sketchcheck.shop`

### Netlify SPA 라우팅
- `_redirects` 파일로 404 에러 방지
- 모든 경로가 React Router로 처리됨

### 타입 안정성
- TypeScript로 전체 구현
- 모든 API 응답에 타입 정의
- Lint 에러 없음

---

## 📝 백엔드 API 요구사항

### GET /auth/callback

**요청:**
```
GET https://sketchcheck.shop/auth/callback?code=XXXX
```

**응답:**
```json
{
  "user": {
    "id": "google-user-id",
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "https://..."
  },
  "accessToken": "jwt-token-here"
}
```

---

## 🎉 구현 완료!

모든 요구사항이 충족되었습니다:
- ✅ Google OAuth URL 직접 생성
- ✅ /callback 페이지에서 code 추출
- ✅ 백엔드로 code 전달
- ✅ localStorage에 토큰 저장
- ✅ React Router 설정
- ✅ Netlify 환경 지원
- ✅ 타입 정의 완료
- ✅ Lint 에러 없음

**브라우저에서 http://localhost:5177 접속하여 테스트하세요!** 🚀

