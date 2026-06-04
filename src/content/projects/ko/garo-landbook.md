---
title: "가로주택정비 사업성 분석 백엔드"
theme: proptech
kind: work
order: 4
positioning: "필지(PNU) 하나로 규제·시세·건축 가능 규모·수익성까지 자동 산출하는 도시정비사업 분석 백엔드입니다."
shows:
  - "PostGIS 공간 연산"
  - "외부 설계 엔진 연동"
  - "Rails API 설계"
  - "공공기관 환경 대응"
angle: "복잡한 건 계산이 아니라, 흩어진 공공 데이터를 하나의 좌표계로 모으는 일이었습니다."
problem: "소규모 정비사업의 필지 병합·규제 검토·수익성 분석은 수작업으로 느리고 오류가 잦았습니다."
role: "백엔드 설계·구현을 주도했습니다(lead committer)."
decision: "건축 계산은 직접 구현하지 않고 <b>외부 설계 엔진에 위임</b>하고, 백엔드는 데이터 통합·좌표계 변환·규제 조회에 집중했습니다. ‘잘하는 곳에 맡기되 경계를 분명히 한다’는 판단이었습니다."
result: "PNU 한 줄로 분석을 자동화했고, production 서비스로 운영했습니다."
learning: "공간 데이터는 좌표계(WGS84↔TM127) 경계에서 대부분의 버그가 났습니다 — 변환을 한 곳에 모으는 게 핵심이었습니다."
decisionLog:
  - why: "동기 처리를 비동기로 전환해, 무거운 분석이 다른 요청을 막지 않게 했습니다."
  - why: "기본 DB와 외부 빌드 DB를 상속 클래스로 분리해, 데이터 출처를 코드 구조로 드러냈습니다."
stack: ["Ruby", "Rails", "PostgreSQL", "PostGIS", "Elasticsearch", "Redis"]
period: "2025–2026"
metrics: "lead committer · 722 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
