---
title: "Landbook MSA 백엔드"
theme: backend
kind: work
order: 5
featured: true
positioning: "토지·부동산 플랫폼의 인증·결제·구독·필지정보·게이트웨이를 Kotlin/Spring 마이크로서비스로 설계·운영했습니다."
shows:
  - "MSA 설계·운영"
  - "Kotlin/Spring · Coroutine"
  - "Kafka · Redis · EKS"
  - "결제·구독·인증 도메인"
angle: "서비스가 실제로 돌아가게 만드는 일은, 기능을 더하는 게 아니라 장애를 격리하는 경계를 긋는 일이었습니다."
problem: "단일 서비스로 출발한 부동산 플랫폼이 인증·결제·구독·필지 데이터·외부 연동으로 커지면서, 한 곳의 장애가 전체로 번지고 배포가 서로를 막기 시작했습니다."
role: "인증·결제·프리미엄·필지정보·API 게이트웨이 등 핵심 서비스의 설계와 구현을 주도했습니다(lead committer)."
decision: "MSA는 서비스를 잘게 쪼개는 일이 아니라 <b>장애와 배포의 경계를 긋는 일</b>이라고 봤습니다. 무거운 작업은 Kafka로 떼어내 격리하고, 인증·사용량·캐시는 Redis로, 동기 호출을 Coroutine 비동기로 바꿔 한 서비스의 지연이 옆 서비스를 잡아먹지 않게 했습니다."
result: "결제·구독·인증을 독립 배포·확장 가능한 단위로 운영하고, 장애가 한 서비스 안에 갇히도록 만들었습니다."
learning: "마이크로서비스의 난이도는 분리 그 자체가 아니라 ‘무엇을 같은 트랜잭션에 둘 것인가’의 경계 결정에 있었습니다."
decisionLog:
  - why: "Kafka 도입은 ‘큐를 붙이는 일’이 아니라, 결제·알림 같은 작업을 본 흐름에서 떼어내 장애를 격리하려는 결정이었습니다."
    tradeoff: "즉시 일관성 대신 결과적 일관성을 받아들였습니다."
  - why: "전 구간을 리액티브(Coroutine·WebFlux)로 통일해, 비동기 경계가 서비스마다 달라지는 혼란을 없앴습니다."
stack: ["Kotlin", "Spring Boot", "Coroutine", "Kafka", "Redis", "PostgreSQL", "AWS EKS", "ArgoCD"]
period: "2024–2026"
metrics: "lead committer · 합산 ~1,800 커밋"
visibility: anon
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
