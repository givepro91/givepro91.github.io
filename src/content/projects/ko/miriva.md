---
title: "MIRIVA — 운영 누락 방지 관제"
theme: reliability
kind: work
order: 9
positioning: "소규모 팀이 놓치면 사고 나는 운영 항목(클라우드 비용·SSL/도메인 만료·소유자 공백)을 외부 의존 없이 감지해, 매주 결정 3건만 들이대는 SaaS입니다."
shows:
  - "가설 검증 규율(적대적 PRD)"
  - "외부 의존 0 설계"
  - "read-only 수집"
  - "측정 기반 의사결정"
angle: "기능보다 먼저 만든 건, 이 사업이 틀렸는지 확인하는 게이트였습니다."
problem: "전담 SRE/FinOps가 없는 소규모 팀은 카드·SSL·도메인 만료나 비용 누수 같은 운영 항목을 사람 속도로 못 따라가, 단발성 사고로 번졌습니다."
role: "단독으로 기획·설계·구현했습니다(dogfooding 단계)."
decision: "PRD를 기획서가 아니라 <b>적대적으로 자기검증한 가설 문서</b>로 만들어, confidence 55%·conditional-go를 정직하게 박고 사업 전체를 단 하나의 GO/NO-GO 게이트에 걸었습니다."
result: "외부 SaaS 의존 0(자체 호스팅 · 클라우드는 read-only)으로 수집·분석하는 초기 버전을 dogfooding 중입니다."
learning: "솔로 빌딩에서 가장 비싼 실수는, 검증 안 된 가설 위에 기능을 쌓는 것이었습니다."
decisionLog:
  - why: "멀티클라우드 어댑터를 의도적으로 기각하고 ‘수동 입력 데이터모델’을 1급 시민으로 삼아, 어댑터 0으로 모든 클라우드를 즉시 커버했습니다."
    tradeoff: "자동 수집 범위 대신 검증 속도를 택했습니다."
stack: ["Python", "FastAPI", "boto3(read-only)", "Next.js", "SQLite"]
period: "2026"
metrics: "단독 · 570 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
