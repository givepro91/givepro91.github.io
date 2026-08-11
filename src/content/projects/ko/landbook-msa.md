---
title: "Landbook MSA 백엔드"
theme: backend
kind: work
order: 5
featured: true
positioning: "이미 마이크로서비스로 구성된 토지·부동산 플랫폼 백엔드에 합류해, 인증·결제·구독·필지정보·게이트웨이 서비스를 개발·운영했습니다."
shows:
  - "MSA 서비스 개발·운영"
  - "Kotlin/Spring · Coroutine"
  - "WebFlux · Coroutine · EKS"
  - "결제·구독·인증 도메인"
angle: "서비스가 실제로 돌아가게 만드는 일은, 기능을 더하는 게 아니라 장애를 격리하는 경계를 긋는 일이었습니다."
problem: "단일 서비스로 출발한 부동산 플랫폼이 인증·결제·구독·필지 데이터·외부 연동으로 커지면서, 한 곳의 장애가 전체로 번지고 배포가 서로를 막기 시작했습니다."
role: "이미 MSA로 나뉘어 있던 인증·결제·프리미엄·필지정보·게이트웨이 서비스에 합류해 개발·운영했습니다. 가로주택정비 백엔드는 최다 기여자로 주도했습니다."
decision: "이미 MSA로 나뉜 환경에서 제가 판단한 건, 서비스를 더 쪼개는 게 아니라 <b>무엇을 같은 트랜잭션에 둘지·어디서 장애를 격리할지</b>였습니다. 동기 호출을 Coroutine·WebFlux 비동기로 바꾸고, 매물 배치 알림을 순차에서 병렬 처리로 개선해 한 서비스의 지연·블로킹이 옆으로 번지지 않게 했습니다."
result: "결제·구독·인증을 독립 배포·확장 가능한 단위로 운영하고, 장애가 한 서비스 안에 갇히도록 만들었습니다."
learning: "마이크로서비스의 난이도는 분리 그 자체가 아니라 ‘무엇을 같은 트랜잭션에 둘 것인가’의 경계 결정에 있었습니다."
decisionLog:
  - why: "동기 호출을 Coroutine·WebFlux 비동기로 통일해 이벤트 루프 블로킹을 줄이고, 매물 배치 알림을 순차에서 병렬처리로 바꿔 한 흐름의 지연이 전체를 막지 않게 했습니다."
    tradeoff: "리액티브 경계를 일관되게 지켜야 하는 규율이 늘었습니다."
  - why: "전 구간을 리액티브(Coroutine·WebFlux)로 통일해, 비동기 경계가 서비스마다 달라지는 혼란을 없앴습니다."
stack: ["Kotlin", "Spring Boot", "WebFlux", "Coroutine", "PostgreSQL", "PostGIS", "AWS EKS", "ArgoCD"]
period: "2024–2026"
metrics: "기존 MSA 합류 · 서비스 개발·운영(가로주택정비 최다 기여)"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
