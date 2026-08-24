---
title: "Markbrief — 양식 보고서 컴파일러"
theme: devtools
kind: work
order: 12
positioning: "Markdown 한 장을 등록된 양식 템플릿에 맞춰 DOCX·HWPX·PDF 보고서로 자동 컴파일하는 SaaS·API입니다."
shows:
  - "도메인 무지 변환 엔진"
  - "HWPX(한글) 정식 지원"
  - "단일 백엔드 아키텍처"
  - "API · SDK 제품화"
angle: "‘양식’과 ‘내용’을 분리하면, 사람은 내용만 쓰면 됩니다."
problem: "공공·법무·금융처럼 고정 양식으로 보고서를 반복 작성하는 환경에서, 양식과 내용이 엉켜 매번 수작업이 들었습니다."
role: "단독으로 설계·구현했습니다."
decision: "변환 엔진을 <b>특정 도메인에 묶이지 않는 공용 코어</b>로 분리하고, API·콘솔·SDK 모든 진입점이 단일 백엔드를 호출하게 했습니다. 한국 시장을 위해 HWPX를 정식 출력 형식으로 지원했습니다."
result: "코어 이식·REST API·웹 콘솔을 완성하고 SDK 단계로 진행했습니다."
learning: "직접 써보려고 SDK보다 콘솔을 먼저 만든 결정이, 제품의 실제 구멍을 더 빨리 드러냈습니다."
decisionLog:
  - why: "한글 PDF의 변환 비호환을 자동 패처로 격리해, 변환 난점을 별도 파이프라인으로 떼어냈습니다."
    tradeoff: "파이프라인이 하나 늘었지만, 본 엔진은 깨끗하게 유지됐습니다."
stack: ["Python", "FastAPI", "python-docx", "python-hwpx", "Next.js"]
period: "2026"
metrics: "단독 · 116 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
