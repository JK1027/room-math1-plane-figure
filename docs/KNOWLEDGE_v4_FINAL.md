# KNOWLEDGE.md
# 통합 장애 사례 및 해결 경험 저장소 v4

## 목적

실패 사례와 해결 경험을 축적한다.

같은 실수를 두 번 하지 않는 것이 목표다.

본 문서는 다음 항목만 기록한다.

- 장애 사례
- 환경 문제
- 라이브러리 문제
- 배포 문제
- 데이터 손실 위험 사례
- 재발 가능성이 높은 기술적 이슈

기록하지 않는다.

- 단순 기능 추가
- UI 변경
- 일반 개발 진행 내용
- 작업 절차
- AI 운영 규칙

---

# 기록 템플릿

제목
프로젝트
발생일

문제
증상
원인
해결
재발 방지

관련 파일

---

# GitHub Actions

## UnicodeEncodeError

프로젝트: 공통

문제
빌드 실패

증상
GitHub Actions Windows 환경에서 UnicodeEncodeError 발생 후 빌드 중단

원인
CP1252 환경에서 한글 로그 출력

해결
모든 빌드 로그를 ASCII 기반 영문 로그로 변경

재발 방지
CI/CD 환경 로그는 영문 표준 사용

관련 파일
build_backend.py

---

## shell=False 실행 실패

프로젝트: 공통

문제
FileNotFoundError 발생

증상
subprocess 실행 즉시 실패

원인
PATH 탐색 실패

해결
sys.executable 사용

재발 방지
shell=False 사용 시 절대 경로 사용
subprocess 인자는 list 사용

관련 파일
process_launcher.py

---

# Electron

## HWP SaveAs 실패

프로젝트: CounselingLog_Electron

문제
HWP 저장 실패

증상
간헐적 저장 오류 발생

원인
OneDrive 또는 백신 충돌

해결
Atomic Save + Retry 적용

재발 방지
0.5초 간격 재시도 적용

관련 파일
hwp_service.py

---

# GAS

## 동시 저장 충돌

프로젝트: 공통

문제
데이터 덮어쓰기

증상
동시 저장 시 일부 데이터 유실

원인
LockService 미사용

해결
ScriptLock 적용

재발 방지
모든 쓰기 작업 LockService 사용

관련 파일
Code.gs

---

# attendance_mate

## React State Stale Closure

문제
전역 이벤트가 오래된 State 참조

증상
최신 상태가 UI에 반영되지 않음

원인
Closure에 의한 stale state

해결
useRef.current 사용

재발 방지
전역 이벤트 및 IPC 핸들러는 Ref 사용

---

## PowerShell Toast Notification Parsing Error

문제
토스트 알림 실행 실패

증상
ExpectedExpression 오류 발생

원인
PowerShell 인라인 문자열 파싱 오류

해결
임시 ps1 파일 생성 후 실행

재발 방지
복잡한 명령은 ps1 스크립트 방식 사용

---

# Edu_Pass

## Chromium 브라우저 제목 기반 탐색 실패

문제
브라우저 감지 실패

증상
Chrome/Edge 탐색 실패

원인
브라우저 제목 문자열이 환경에 따라 달라짐

해결
프로세스명 기반 탐색

재발 방지
창 제목 대신 프로세스명 사용

---

## Windows UIPI 권한 충돌

문제
키보드 입력 실패

증상
Ctrl+L, Ctrl+V 무반응

원인
권한 수준 불일치

해결
관리자 권한 실행 안내

재발 방지
권한 진단 루틴 포함

---

# excel_merge_cleaner

## Tkinter pack 옵션 오류

문제
UI 로딩 실패

증상
bad option 오류

원인
지원하지 않는 pack 옵션 사용

해결
padx/pady 사용

재발 방지
pack 공식 옵션만 사용

---

## 레거시 XLS 변환 서식 파괴

문제
스타일 손실

증상
테두리 및 서식 파괴

원인
xlrd → openpyxl 변환 과정

해결
xlsx 전용 정책

재발 방지
xls 지원 제거

---

# hwp_batch_printer

## EnsureDispatch 실패

문제
COM 생성 실패

증상
프로그램 시작 실패

원인
win32com 캐시 문제

해결
Dispatch 폴백

재발 방지
EnsureDispatch 실패 시 Dispatch 재시도

---

## XHwpWindows.Item(0) 초기화 타이밍 문제

문제
한글 창 제어 실패

증상
초기화 예외 발생

원인
윈도우 초기화 전 접근

해결
try/except 처리

재발 방지
초기화 여부 확인 후 접근

---

## COM 프로세스 강제 종료

문제
사용자 문서 종료 위험

증상
작업 중 문서까지 종료

원인
taskkill /im 사용

해결
PID 추적 후 개별 종료

재발 방지
프로세스 차집합 방식 사용

---

# Office_Utility_Hub

## Electron Preload API 누락

문제
Renderer 런타임 오류

증상
window.api.xxx is not a function

원인
preload.js 누락

해결
Preload API 추가

재발 방지
Main / Preload / Renderer 인터페이스 체크리스트 검증

---

# sg_cleaner

## MergedCell 접근 오류

문제
병합 셀 처리 실패

증상
예외 발생

원인
MergedCell 수정 시도

해결
대표 셀만 처리

재발 방지
MergedCell 타입 우선 검사

---

## Safe Save 4단계 파이프라인

문제
파일 손상 위험

증상
저장 실패 시 데이터 유실

원인
직접 저장

해결
임시 파일 → 무결성 검증 → 최종 저장

재발 방지
Safe Save 구조 유지

---

## 키워드 중복 매핑 불일치

문제
매핑 결과가 실행마다 달라짐

증상
학생1, 학생2 순서 변경

원인
Python set 사용

해결
list(dict.fromkeys()) 사용

재발 방지
순서 보존 자료구조 사용

---

## UUID 기반 상태 관리

문제
정렬/필터링 후 데이터 불일치

증상
선택 항목과 실제 데이터 불일치

원인
Row Index 의존

해결
UUID 기반 조회

재발 방지
item_id 기반 상태 관리

---

## HWP OLE 직접 치환 위험

문제
서식 파괴 가능성

증상
잘못된 위치 치환

원인
커서 기반 치환

해결
스캔 전용 정책

재발 방지
직접 쓰기 기능 비활성화

---

# 누적 규칙

새로운 장애 사례가 발생하면 반드시 추가한다.

반복 발생 가능성이 있는 문제만 기록한다.

문제 → 원인 → 해결 → 재발 방지 구조를 유지한다.
