---
title: "PlanNext Retail — AI 매장 설계 콘솔"
theme: proptech
kind: work
order: 1
featured: true
positioning: "위치만 고르면 입지·유동인구 분석부터 전략 제안, 2D·3D 자동 설계, AI 포토리얼 렌더, DXF 익스포트까지 대화로 잇는 AI 리테일 매장 설계 콘솔입니다."
shows:
  - "LLM 기반 제품 풀스택 빌드업"
  - "데이터 기반 입지·전략 분석"
  - "AI 자동 설계 + 검증·익스포트"
  - "기획·UI/UX·백엔드·인프라·LLM Serving"
angle: "LLM이 그린 평면을 ‘말’로 남겨두면 제품이 아닙니다. 검증하고 익스포트할 수 있는 설계 데이터로 떨어뜨려야 합니다."
problem: "매장 평면 설계는 입지 분석부터 존 구획, 집기 배치, 시각화까지 전문 툴과 사람 손이 필요했습니다. 비전문가가 위치만 고르면 AI가 분석·전략·배치·렌더까지 이어주는 콘솔이 필요했습니다."
role: "AI Native 전환 이후, 제품 기획부터 UI/UX, 프론트엔드, 백엔드, 인프라, LLM Serving까지 풀스택으로 초기 제품을 빌드업했습니다."
decision: "LLM 대화 레이어와 결정론적인 설계 데이터 모델(존·집기·치수)을 분리했습니다. 대화는 의도와 전략을 받고, 평면은 검증 가능한 구조화 데이터로 두어 2D·3D 렌더와 DXF 익스포트가 같은 진실원에서 나오게 했습니다. 전략도 하나로 단정하지 않고 여러 안을 근거와 함께 제시해 사람이 고르게 했습니다."
result: "위치를 고르면 유동인구·참고사례 분석으로 전략 후보를 여러 안(Balanced·Focused·Exploratory) 근거와 함께 제시하고, 고른 방향을 2D 평면·3D 매장·AI 포토리얼 렌더로 자동 생성합니다. 존·집기 검증을 통과한 설계를 DXF로 내보내 실제 산출물까지 연결했습니다."
learning: "AI 제품의 신뢰는 그럴듯한 출력이 아니라, 그 출력이 검증·익스포트되는 구조화 데이터인지에서 갈렸습니다."
decisionLog:
  - why: "대화(생성)와 설계 데이터(상태)를 분리해, LLM이 다시 그려도 평면의 진실원을 한 곳으로 유지하고 존·집기 수를 검증할 수 있게 했습니다."
    tradeoff: "대화 자유도는 데이터 모델 제약 안으로 좁아지지만, 산출물이 검증·측정·익스포트 가능해집니다."
  - why: "전략을 하나로 단정하지 않고 Balanced·Focused·Exploratory 여러 안을 근거와 함께 펼쳐, 마지막 판단은 사람이 하도록 설계했습니다."
stack: ["LLM Serving", "대화형 설계 UX", "2D·3D 렌더", "DXF Export"]
period: "2026"
metrics: "AI Native 제품 · 풀스택 빌드업"
visibility: public
link: "https://retail.plannext.ai/ko"
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-30"
---
