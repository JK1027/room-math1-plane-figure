/**
 * Web App HTTP GET 요청 진입점.
 * Index.html 템플릿을 생성하고 iframe 보안 정책을 최소화하여 반환합니다.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("Index");
  return template.evaluate()
    .setTitle("Geometry Escape: 기하의 성")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
}

/**
 * subfolder를 포함하는 HTML 조각을 메인 파일에 포함시킵니다.
 * @param {String} filepath - 인클루드할 파일의 로컬 상대 경로 (예: 'engine/SceneEngine')
 * @returns {String} HTML 파일의 문자열 내용
 */
function include(filepath) {
  return HtmlService.createHtmlOutputFromFile(filepath).getContent();
}

/**
 * GameResult 스프레드시트 시트 인스턴스를 가져옵니다.
 * 없을 경우 시트와 헤더 컬럼을 자동 생성합니다.
 */
function getOrCreateResultSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "GameResult";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // 컬럼 헤더 초기화
    var headers = [
      "id", "studentNo", "name", "startTime", "endTime", 
      "playTime", "score", "correctCount", "wrongCount", "hintCount", 
      "cleared", "gameVersion", "browser", "device", "submitTime", "stageReached"
    ];
    sheet.appendRow(headers);
  }
  return sheet;
}

/**
 * 학생의 게임 완료 기록을 Google Sheets에 저장합니다.
 * LockService를 통해 동시 저장 충돌을 방지합니다.
 * @param {Object} resultDto - 저장 대상 데이터 객체
 * @returns {Object} { success: boolean, message: string }
 */
function saveGameResult(resultDto) {
  var lock = LockService.getScriptLock();
  var hasLock = false;
  
  try {
    // 최대 15초 대기하며 상호배제 락 획득 시도
    hasLock = lock.tryLock(15000);
    if (!hasLock) {
      return { success: false, message: "대기 시간 초과로 기록 저장에 실패했습니다. 다시 제출해주세요." };
    }
    
    var sheet = getOrCreateResultSheet();
    var uuid = Utilities.getUuid();
    
    // 데이터 로우 조합
    var rowData = [
      uuid,
      resultDto.studentNo || "",
      resultDto.name || "",
      resultDto.startTime || "",
      resultDto.endTime || "",
      Number(resultDto.playTime) || 0,
      Number(resultDto.score) || 0,
      Number(resultDto.correctCount) || 0,
      Number(resultDto.wrongCount) || 0,
      Number(resultDto.hintCount) || 0,
      resultDto.cleared === true || resultDto.cleared === "true",
      resultDto.gameVersion || "1.0.0",
      resultDto.browser || "",
      resultDto.device || "",
      resultDto.submitTime || new Date().toISOString(),
      Number(resultDto.stageReached) || 1
    ];
    
    sheet.appendRow(rowData);
    return { success: true, message: "탈출 기록이 안전하게 저장되었습니다!" };
  } catch (error) {
    Logger.log("saveGameResult 오류 발생: " + error.toString());
    return { success: false, message: "서버 오류로 저장에 실패했습니다: " + error.toString() };
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/**
 * 시트 전체 데이터를 파싱하여 미가공 리더보드 목록을 반환합니다.
 * @returns {Array<Object>} 랭킹 데이터 원본 목록
 */
function getLeaderboard() {
  try {
    var sheet = getOrCreateResultSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return []; // 헤더 외에 데이터가 없는 경우
    }
    
    // 전체 데이터 읽기 (헤더 제외)
    var range = sheet.getRange(2, 1, lastRow - 1, 16);
    var values = range.getValues();
    
    var rawList = [];
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      // cleared인 유저만 랭킹 대상
      if (row[10] === true || row[10] === "true") {
        rawList.push({
          studentNo: row[1].toString(),
          name: row[2].toString(),
          startTime: row[3].toString(),
          endTime: row[4].toString(),
          playTime: Number(row[5]),
          score: Number(row[6]),
          correctCount: Number(row[7]),
          wrongCount: Number(row[8]),
          hintCount: Number(row[9]),
          cleared: true,
          gameVersion: row[11].toString(),
          browser: row[12].toString(),
          device: row[13].toString(),
          submitTime: row[14].toString(),
          stageReached: Number(row[15])
        });
      }
    }
    return rawList;
  } catch (error) {
    Logger.log("getLeaderboard 오류 발생: " + error.toString());
    return [];
  }
}
