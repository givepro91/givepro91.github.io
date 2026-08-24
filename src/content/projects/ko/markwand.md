---
title: "Markwand — AI 산출물 큐레이터"
theme: devtools
kind: work
order: 11
positioning: "AI 도구가 프로젝트 곳곳에 흩뿌린 마크다운 문서를, 한곳에서 찾고 읽고 다시 들어가게 해주는 macOS read-only 데스크톱 앱입니다."
shows:
  - "데스크톱 앱(Electron)"
  - "read-only by design"
  - "로컬 우선 · 무텔레메트리"
  - "문서 drift 감지"
angle: "AI가 밤새 만들어 둔 마크다운, 아침이면 어디 뒀는지 모릅니다."
problem: "Claude Code·Codex·Cursor로 일하면 PRD·계획 같은 .md가 수십 개 폴더에 흩어져, 다시 찾기 어려웠습니다."
role: "단독으로 설계·구현한 공개 OSS입니다."
decision: "<b>‘파일에 절대 쓰지 않는다(read-only)’</b>를 제품 정체성으로 못박았습니다. 편집은 사용자 에디터에 맡기고, 앱은 발견·열람·재진입에만 집중했습니다."
result: "흩어진 마크다운을 일급 지식 스트림으로 다루는 베타를 공개했습니다."
learning: "도구의 힘은 기능을 더하는 게 아니라, ‘하지 않을 일’을 정하는 데서 나왔습니다."
decisionLog:
  - why: "신뢰할 수 없는 문서가 raw HTML로 화면에 닿지 않게 sanitize를 기본값으로 뒀습니다."
  - why: "로컬 우선·무텔레메트리를 기본으로, 네트워크 I/O는 예외로만 열었습니다."
stack: ["Electron", "React", "TypeScript", "Zustand"]
period: "2026"
metrics: "공개 OSS · 225 커밋"
visibility: public
link: "https://github.com/givepro91/markwand"
riskChecked: true
riskCheckedBy: "장근식"
riskCheckedDate: "2026-06-04"
---
