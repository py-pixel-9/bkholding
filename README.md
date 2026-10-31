# BK Holdings 랜딩페이지

- 라이브 주소(예정): https://bkholding.co.kr (www 포함)
- 호스팅: GitHub Pages (무료, HTTPS 자동) — 레포 `py-pixel-9/bkholding`
- 문의 폼 → Google Apps Script 웹앱 → Google Sheet "BK Holdings 문의" (leads 시트)
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
   - A 레코드 (호스트 빈칸) 4개: 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
   - CNAME: `www` → `py-pixel-9.github.io`
   - 기존 메일 레코드(MX, webmail A, SPF, _dmarc)는 그대로 둠

## 수정
- 문구·섹션: `index.html` 편집 후 push → 1~2분 내 반영
- 시트 열 추가: `apps_script.gs` HEADERS + appendRow 둘 다 수정 후 "새 버전으로 배포"
