# BK Holdings 랜딩페이지

- 라이브 주소(예정): https://bkholding.co.kr (www 포함)
- 호스팅: GitHub Pages (무료, HTTPS 자동) — 레포 `py-pixel-9/bkholding`
- 문의 폼 → Google Apps Script 웹앱 → Google Sheet "BK Holdings 문의" (leads 시트)
  - 시트: https://docs.google.com/spreadsheets/d/1C3Qjlog77cZPt15Pp7HG4uGayRDSJ6WDczFcDqYX0EM/edit
  - Apps Script 프로젝트: "BK Holdings Leads" (시트에 종속, 확장 프로그램 > Apps Script)
  - 웹앱 배포 버전 2 (2026-11-02, 스크립트 v2). 코드 수정 후에는 배포 > 배포 관리 > 새 버전으로 재배포해야 반영됨
  - 시트 구성(v2): `leads`(접수일·접수시각·채널·광고·이름·연락처·메모·상태 드롭다운·담당 메모…) / `요약`(전체·오늘·7일·구매, 채널별·광고별·날짜별 집계+차트) / `leads_v1_1102`(구버전 테스트 행)
  - 채널 자동 분류: utm_source·ad·referrer 기준 인스타그램/유튜브/메타광고/네이버/구글/텔레그램/카카오/직접
  - 서식 재적용·탭 재생성: Apps Script에서 `setupSheet` 실행
- 광고 출처: URL 파라미터로 자동 기록 (`ad`, `adset`, `campaign`, `utm_*`)

## 파일
| 파일 | 용도 |
|---|---|
| `index.html` | 페이지 본체 (내용 `{{ }}` 자리 채우면 됨) + 폼 + 출처 추적 JS |
| `apps_script.gs` | 구글 시트에 붙이는 수신 스크립트 (설치 절차는 파일 상단 주석) |
| `CNAME` | GitHub Pages 커스텀 도메인 지정 |

## 광고별 구분 방법
- 메타 광고 → 광고 설정의 "URL 매개변수" 칸에 아래 한 줄 (광고마다 자동으로 이름이 들어감):
  `ad={{ad.name}}&adset={{adset.name}}&campaign={{campaign.name}}&utm_source=meta`
- 유튜브·수동 링크 → 링크에 직접: `https://bkholding.co.kr/?ad=달러투자&utm_source=youtube`
- 시트의 `광고(ad)` 열로 필터·피벗하면 영상별 문의 수가 나옴
- 사용자가 첫 방문 후 다른 페이지로 갔다가 신청해도 첫 유입값이 유지됨 (localStorage)

## 배포 절차
1. 레포 생성 → 이 폴더 push (`main` 브랜치 루트)
2. Settings > Pages > Source: Deploy from a branch, `main` / `/ (root)`
3. Settings > Pages > Custom domain: `bkholding.co.kr` → Enforce HTTPS 체크 (인증서 발급 수 분)
4. 카페24 DNS 관리 (아이디 dbgusgh123 > 도메인관리 > DNS 관리 > bkholding.co.kr)
   - A 레코드 (루트): 185.199.108.153 (카페24는 루트 A 1개만 허용. GitHub는 1개로도 동작)
   - CNAME: `www` → `py-pixel-9.github.io`
   - 기존 메일 레코드(MX, webmail A, SPF, _dmarc)는 그대로 둠

## 수정
- 문구·섹션: `index.html` 편집 후 push → 1~2분 내 반영
- 시트 열 추가: `apps_script.gs` HEADERS + appendRow 둘 다 수정 후 "새 버전으로 배포"
