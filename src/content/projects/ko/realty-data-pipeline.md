---
title: "Realty Data Pipeline — 무중단 부동산 ETL"
theme: reliability
kind: work
order: 8
positioning: "전국 부동산 데이터를 매월 무중단으로 갱신하는 Blue-Green ETL 파이프라인. 저는 크롤러 안정성과 중단 지점 재개(resume) 로직을 기여했습니다."
shows:
  - "크롤러 안정성"
  - "중단 지점 재개(checkpoint)"
  - "rate-limit·봇 차단 대응"
  - "데이터 신뢰성"
angle: "수집이 중간에 막히거나 끊겨도, 마지막 지점부터 다시 이어지게 만들었습니다."
problem: "외부 원천에서 전국 부동산 데이터를 매월 수집하는데, rate-limit·봇 차단·중단으로 크롤이 자주 깨지고 처음부터 다시 돌려야 했습니다."
role: "크롤러 안정성(재시도·서킷브레이커·rate-limit 대응)과 dong 단위 체크포인트·재개(resume) 로직을 기여했습니다."
decision: "행정동 단위로 진행 상태(마지막 위치)를 저장해, 차단이나 중단이 나도 처음이 아니라 마지막 지점부터 재개하게 했습니다. 접속 제한·오류 응답(429·403·5xx)에는 잠시 멈췄다가 요청 간격을 늘려 재시도하고(백오프·서킷브레이커), 차단 신호가 일정 수준 이상 쌓이면 크롤러가 스스로 수집을 멈추게 했습니다."
result: "크롤이 중간에 막혀도 무손실로 재개되고, rate-limit·차단에 견디는 수집 안정성을 확보했습니다."
learning: "대규모 외부 수집의 난이도는 파싱이 아니라, 막히고 끊길 때 어떻게 견디고 이어가느냐에 있었습니다."
decisionLog:
  - why: "매 dong 완료 시 체크포인트(heartbeat·last_dong)를 남겨, 중단돼도 처음이 아니라 마지막 지점부터 재개하게 했습니다."
  - why: "봇 차단(429/403) 신호를 누적해 임계치를 넘으면 스스로 요청을 중단·회피하게 했습니다."
    tradeoff: "수집 속도를 일부 늦추더라도 차단·재수집 비용을 줄였습니다."
stack: ["Python", "PostgreSQL", "requests", "Slack"]
period: "2026"
metrics: "기여 · 크롤러 안정성·재개 (13 커밋)"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-07-13"
---
