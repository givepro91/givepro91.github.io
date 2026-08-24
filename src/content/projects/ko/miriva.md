---
title: "MIRIVA — 운영 누락 방지 관제"
theme: reliability
kind: work
order: 10
positioning: "소규모 팀이 놓치면 사고 나는 운영 항목(클라우드 비용·SSL/도메인 만료·담당자 공백)을 외부 의존 없이 감지해, 매주 결정이 필요한 3건만 추려 보여주는 SaaS입니다."
shows:
  - "성공 확률 명시한 기획 검증"
  - "외부 서비스 의존 없는 설계"
  - "read-only 수집"
  - "측정 기반 의사결정"
angle: "기능보다 먼저 만든 건, 이 사업이 틀렸는지 확인하는 관문이었습니다."
problem: "전담 인프라·비용 담당자가 없는 소규모 팀은 카드·SSL·도메인 만료나 비용 누수 같은 운영 항목을 사람 속도로 못 따라가, 단발성 사고로 번졌습니다."
role: "단독으로 기획·설계·구현했습니다(직접 사용하며 검증 중)."
decision: "기획서(PRD)에 성공 확신 대신 <b>‘성공 확률 55%, 이런 조건이 확인되면 계속 진행’</b>이라는 판단 기준을 그대로 적고, 사업 전체를 이 단 하나의 GO/NO-GO 관문에 걸었습니다."
result: "외부 서비스 의존 없이(자체 호스팅, 클라우드는 읽기 전용) 수집·분석하는 초기 버전을 제가 첫 사용자로 직접 쓰며 검증하고 있습니다."
learning: "솔로 빌딩에서 가장 비싼 실수는, 검증 안 된 가설 위에 기능을 쌓는 것이었습니다."
decisionLog:
  - why: "클라우드별 자동 연동 개발을 일부러 미루고 수동 입력을 기본 지원으로 삼아, 연동 개발 없이 모든 클라우드를 즉시 커버했습니다."
    tradeoff: "자동 수집 범위 대신 검증 속도를 택했습니다."
stack: ["Python", "FastAPI", "boto3(read-only)", "Next.js", "SQLite"]
period: "2026"
metrics: "단독 · 570 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
