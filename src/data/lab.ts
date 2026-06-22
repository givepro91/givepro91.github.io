// Lab 단일 소스 — 진행중/실험/도구 라인업.
// 예전엔 src/content/lab/ko/*.md 였으나, 본문이 없어 한 파일에서 일괄 관리하도록 통합.
// 추가/수정/상태변경은 이 배열에서만. (index.astro가 order로 정렬해 렌더)

export type LabStatus = "active" | "prototype" | "experiment" | "paused" | "side";
export type LabTheme = "backend" | "agentops" | "reliability" | "proptech" | "devtools";

export interface LabEntry {
  title: string;
  status: LabStatus;
  oneLiner: string;
  theme?: LabTheme;
  order: number;
  link?: string; // 공개 repo/서비스만
}

export const LAB: LabEntry[] = [
  {
    title: "Nova Orbit",
    status: "experiment",
    theme: "agentops",
    order: 2,
    oneLiner:
      "Claude 구독 하나로 AI 코더와 적대적 리뷰어를 분리 운영하는 솔로 창업자용 오케스트레이션 대시보드.",
  },
  {
    title: "Agent Work Memory",
    status: "prototype",
    theme: "agentops",
    order: 3,
    oneLiner:
      "AI 에이전트가 만든 코드·DB·인프라 변경을 팀이 검토·감사·복원하게 하는 Audit Trail.",
  },
  {
    title: "BizAssistAI",
    status: "prototype",
    theme: "agentops",
    order: 4,
    oneLiner:
      "이체·납부 같은 경영지원 업무를 위험도 기반 승인 게이트와 함께 자율 실행하는 AI 에이전트.",
  },
  {
    title: "cc-skills",
    status: "active",
    theme: "devtools",
    order: 6,
    oneLiner:
      "Claude Code 스킬 마켓플레이스 — CLAUDE.md 자동 생성(/claude-md)과 규칙을 스스로 축적하는 자기학습(/learn)을 묶은 스킬 모음.",
    link: "https://github.com/givepro91/cc-skills",
  },
  {
    title: "Draftly",
    status: "experiment",
    theme: "devtools",
    order: 9,
    oneLiner: "AI 초안 생성부터 한글 PDF 출력까지, 프레임워크 없는 vanilla TS로 엮은 문서 편집기.",
  },
  {
    title: "Tripnuri",
    status: "experiment",
    theme: "devtools",
    order: 10,
    oneLiner:
      "질문 몇 개로 AI가 일자별 여행 일정을 짜주는 PWA — 단순 래퍼가 아니라 비용 추적·크레딧 게이트까지.",
  },
  {
    title: "MK Jarvis",
    status: "prototype",
    theme: "agentops",
    order: 11,
    oneLiner:
      "Claude 구독을 두뇌로 쓰는 로컬 음성 비서 + 권한 분류·audit trail을 갖춘 작업 오퍼레이터.",
  },
  {
    title: "Insta Content Studio",
    status: "experiment",
    theme: "devtools",
    order: 14,
    oneLiner:
      "장소 URL 한 줄로 인스타그램 로컬 콘텐츠를 수집·검증·생성하고 사진 배치까지 자동화하는 콘텐츠 스튜디오.",
  },
];
