# 스터디 모집 게시판

대학생들이 스터디 모집 글을 등록하고, 검색하고, 모집 상태를 관리할 수 있는 React 기반 프론트엔드 웹앱입니다.

## 시스템 소개

- Vite와 React로 만든 단일 페이지 웹앱입니다.
- 백엔드, DB, API 없이 브라우저에서만 동작합니다.
- 기본 더미 데이터로 시작하며, 사용자가 변경한 데이터는 `localStorage`에 저장됩니다.
- 저장 key는 `studyRecruitBoardData`입니다.

## 기술 스택

- Vite
- React
- JavaScript
- CSS
- localStorage

## 주요 기능

- 스터디 목록 카드 조회
- 스터디 등록
- 제목, 설명, 태그 기준 실시간 검색
- 분야별 필터
- 모집 상태 필터
- 신청하기 및 신청 인원 자동 증가
- 모집 인원 도달 시 자동 마감
- 모집 마감 / 모집 재개 상태 변경
- 스터디 삭제
- 전체 스터디, 모집 중, 마감, 전체 신청 인원 통계
- 초기 데이터 복원
- 모바일 반응형 UI

## 프로젝트 구조

```text
study-recruit-board/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    └── data.js
```

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 확인

```bash
npm run build
```

## 과제 1. GitHub Actions를 활용한 CI/CD 환경 구축

- AWS S3 배포 URL: http://mybucket-20263563.s3-website-us-east-1.amazonaws.com
- 시연 영상 링크: https://youtu.be/k4M_fjq4014?si=dIFS_PoUvSrz7RZo

---

## 과제 2. AWS Amplify 서비스를 활용한 호스팅

- 시연 영상 링크: https://youtu.be/UDnw6rVin7A?si=eu8_jNNIY9khboUM