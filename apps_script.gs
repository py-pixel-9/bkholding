/**
 * BK Holdings 랜딩 문의 수집 → Google Sheet
 *
 * 설치 (1회, 구글 계정 로그인 상태에서):
 *  1. 새 Google 스프레드시트 생성 → 이름 "BK Holdings 문의"
 *  2. 확장 프로그램 > Apps Script → 기본 Code.gs 내용을 이 파일로 교체 → 저장
 *  3. 배포 > 새 배포 > 유형 "웹 앱"
 *     - 실행 사용자: 나
 *     - 액세스 권한: 모든 사용자
 *     → 배포 → 권한 승인 → "웹 앱 URL" 복사
 *  4. index.html 의 CONFIG.ENDPOINT 에 그 URL 붙여넣기
 *  5. 테스트: 브라우저에서 웹 앱 URL 열면 {"ok":true} 가 보이면 정상
 *
 * 시트 1행 헤더는 첫 수신 시 자동 생성됨.
 */

const SHEET_NAME = "leads";
const HEADERS = [
  "접수시각", "이름", "연락처", "관심분야", "메모",
  "광고(ad)", "광고세트(adset)", "캠페인(campaign)",
  "utm_source", "utm_medium", "utm_content",
  "유입경로(referrer)", "첫 랜딩 URL", "제출 페이지", "기기(UA)", "클라이언트 시각"
];

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: "bkholding-leads" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    let p = {};
    try { p = JSON.parse(e.postData.contents || "{}"); }
    catch (err) { p = e.parameter || {}; } // x-www-form-urlencoded fallback

    if (!p.name || !p.phone) {
      return json({ ok: false, error: "name/phone required" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
    }
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#E8EDF3");
      sh.setFrozenRows(1);
    }

    const phone = String(p.phone).replace(/[^0-9]/g, "")
      .replace(/^(01[016789])(\d{3,4})(\d{4})$/, "$1-$2-$3");

    sh.appendRow([
      new Date(), p.name, phone, p.interest || "", p.memo || "",
      p.ad || "", p.adset || "", p.campaign || "",
      p.utm_source || "", p.utm_medium || "", p.utm_content || "",
      p.referrer || "", p.landing || "", p.page || "", p.ua || "", p.ts || ""
    ]);
    // 연락처 열을 텍스트로 유지 (앞자리 0 보존)
    sh.getRange(sh.getLastRow(), 3).setNumberFormat("@");

    notify_(p, phone);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 접수 알림 메일 (원치 않으면 NOTIFY_TO 를 빈 문자열로) */
const NOTIFY_TO = "bkholding@bkholding.co.kr";
function notify_(p, phone) {
  if (!NOTIFY_TO) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: `[BK Holdings 문의] ${p.name} / ${p.ad || p.utm_source || "직접유입"}`,
      body:
        `이름: ${p.name}\n연락처: ${phone}\n관심분야: ${p.interest || "-"}\n메모: ${p.memo || "-"}\n` +
        `광고: ${p.ad || "-"} / 세트: ${p.adset || "-"} / 캠페인: ${p.campaign || "-"}\n` +
        `유입: ${p.utm_source || "-"} / ${p.referrer || "-"}\n랜딩: ${p.landing || "-"}\n`
    });
  } catch (err) { /* 알림 실패는 접수에 영향 없음 */ }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
