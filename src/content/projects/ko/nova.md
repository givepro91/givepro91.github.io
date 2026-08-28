---
title: "Nova — AI Agent Ops 품질 게이트"
theme: agentops
kind: work
order: 6
featured: true
positioning: "AI가 짠 코드를, 그 코드를 짠 AI가 아닌 독립 평가자가 커밋 전에 검증하게 만드는 Claude Code 플러그인입니다."
shows:
  - "생성–검증 역할 분리"
  - "하네스(실행 규칙) 설계"
  - "품질 게이트 설계"
  - "맥락 연속성(텍스트 기반)"
angle: "AI에게 코드를 맡기되, 그 코드를 절대 같은 AI가 승인하지 못하게 했습니다."
problem: "AI 코딩은 타이핑 속도는 올려도, 자기 코드를 자기가 검토하는 함정과 1주차의 잘못된 결정이 4주차 전면 재작성으로 번지는 문제가 있었습니다."
role: "방법론과 플러그인을 단독 설계·구현했습니다."
decision: "‘품질은 더 똑똑한 모델의 문제가 아니라 <b>생성과 검증을 분리하는 구조</b>의 문제’라고 봤습니다. 모델을 바꾸는 대신 Claude Code의 훅·커맨드·에이전트 기능을 조합해, 독립 평가자를 통과하지 못한 코드는 커밋되지 않게 만들었습니다."
result: "AI가 자기 코드를 스스로 승인하는 일이 구조적으로 불가능해졌고, 작업 맥락은 별도 DB 없이 사람이 읽을 수 있는 텍스트로 이어집니다."
learning: "모델이 ‘아는 것’을 바꾸려 하기보다, ‘언제·어떻게·어떤 규칙으로 움직일지’의 하네스를 설계하는 게 훨씬 큰 레버였습니다."
decisionLog:
  - why: "맥락 연속성을 외부 임베딩 API 없이 텍스트(상태 파일 + 로그)로 구현해 의존성을 0으로 유지했습니다."
    tradeoff: "검색의 정교함 대신 이식성과 투명성을 택했습니다."
stack: ["Claude Code Plugin", "MCP", "TypeScript", "Bash"]
period: "2026"
metrics: "단독 · 공개 OSS"
visibility: public
link: "https://github.com/jay-swk/nova-landing"
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
