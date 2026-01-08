# 🔗 Notion-Slack Integration

> **실시간 업무 완료 알림 시스템**  
> Notion 데이터베이스의 업무 상태 변경을 자동으로 감지하여 Slack으로 알림을 전송하는 서버리스 웹훅 시스템

## 📋 프로젝트 개요

ACG HR Tech에서 사용하는 업무 관리 시스템으로, Notion 데이터베이스와 Slack을 연동하여 팀원들의 업무 완료 상황을 실시간으로 공유합니다. Firebase Cloud Functions를 활용한 서버리스 아키텍처로 구축되었습니다.

## ✨ 주요 기능

### 🎯 실시간 업무 상태 추적
- Notion 데이터베이스의 "진행상황" 필드 변경 감지
- 업무 완료 시 자동 Slack 알림 발송
- 담당자별 개인화된 멘션 기능

### 💬 풍부한 Slack 메시지 포맷
- **Slack Block Kit** 활용한 구조화된 메시지
- 담당자 아바타 이미지 표시
- 업무 제목, 상태, Notion 페이지 링크 포함
- 반응형 메시지 디자인

### ⚡ 서버리스 아키텍처
- Firebase Cloud Functions 기반 무서버 처리
- 자동 스케일링 및 비용 최적화
- 높은 가용성과 안정성 보장

## 🛠 기술 스택

### Backend
- ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white) **Firebase Cloud Functions** - 서버리스 백엔드
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js 18** - 런타임 환경
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript** - 프로그래밍 언어

### APIs & Integrations
- ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=flat&logo=notion&logoColor=white) **Notion API** - 데이터베이스 웹훅
- ![Slack](https://img.shields.io/badge/Slack-4A154B?style=flat&logo=slack&logoColor=white) **Slack Webhook API** - 메시지 발송
- **Axios** - HTTP 클라이언트

## 🚀 설치 및 실행

### 사전 준비
```bash
# Node.js 18+ 필수
node --version  # v18.0.0+

# Firebase CLI 설치
npm install -g firebase-tools
firebase login
```

### 로컬 개발 환경
```bash
# 의존성 설치
cd functions
npm install

# Firebase 에뮬레이터 실행
npm run serve

# 대화형 셸 모드
npm run shell
```

### 배포
```bash
# Firebase에 배포
npm run deploy

# 함수 로그 확인
npm run logs
```

## ⚙️ 환경 설정

### 환경 변수 설정
```bash
# functions/.env 파일 생성 (functions/.env.example 참고)
cd functions
cp .env.example .env

# Slack 사용자 매핑 정보 입력
GITHUB_TO_SLACK_MAP={"김현민":"<@YOUR_SLACK_ID>"}
```

### Firebase 구성
```bash
# Slack 웹훅 URL 설정
firebase functions:config:set slack.webhook_url="https://hooks.slack.com/..."

# 구성 확인
firebase functions:config:get
```

### Notion 웹훅 설정
1. Notion 통합 생성 및 데이터베이스 권한 부여
2. 웹훅 엔드포인트를 Firebase Function URL로 설정
3. 데이터베이스 속성 변경 이벤트 구독

## 🔧 핵심 구현 기능

### 1. 웹훅 데이터 처리
```javascript
// Notion 페이로드에서 필요한 데이터 추출
const completedItem = {
  title: notionPayload.data.properties["업무 제목"].title[0].plain_text,
  status: notionPayload.data.properties["진행상황"],
  assignee: notionPayload.data.properties["개발자/담당자"],
  url: notionPayload.data.url
};
```

### 2. 사용자 매핑 시스템
```javascript
// .env 파일에서 Slack 사용자 매핑 로드
// GITHUB_TO_SLACK_MAP={"이름":"<@SLACK_USER_ID>", ...}
const githubToSlackMap = JSON.parse(process.env.GITHUB_TO_SLACK_MAP || "{}");
```

### 3. Slack Block Kit 메시지 구성
- 사용자 아바타와 멘션이 포함된 컨텍스트 블록
- 업무 제목과 Notion 링크가 포함된 섹션 블록
- 진행상황 표시 블록
- 브랜드 식별 컨텍스트

## 📱 사용 예시

### 업무 완료 알림 메시지
```
👤 @김현민
📋 업무명: 사용자 인증 시스템 구현
✅ 진행상황: 완료
🔗 [Notion에서 보기]
```

## 🎯 프로젝트 성과

- ⚡ **자동화 효율성**: 수동 업무 공유 프로세스를 100% 자동화
- 📈 **팀 커뮤니케이션 개선**: 실시간 진행상황 공유로 투명성 증대
- 💰 **비용 최적화**: 서버리스 아키텍처로 운영비용 최소화
- 🔧 **확장성**: 새로운 팀원 추가 시 매핑 테이블만 업데이트로 간편 확장

## 📂 프로젝트 구조

```
ACG-SLACK-NOTION/
├── firebase.json              # Firebase 프로젝트 설정
└── functions/
    ├── package.json          # 의존성 및 스크립트
    ├── index.js              # 메인 웹훅 핸들러
    └── assets/
        └── avatar.png        # 기본 아바타 이미지
```
