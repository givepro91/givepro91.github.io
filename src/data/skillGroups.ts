// 이력서용 스킬 묶음 — /cv/print(인라인 나열)와 /cv/resume(알약 뱃지)가 같은 목록을 공유한다.
// cv.json 의 SKILLS 는 문장형 서술("AI 모델을 붙인 API 서비스 설계·운영 (PlanNext.AI)")이라
// 상세 위키(/cv)용이고, 이력서는 짧은 키워드 단위가 필요해 여기서 따로 관리한다.
//
// ⚠️ items 를 " · " 로 join 하면 /cv/print 의 기존 출력과 문자 단위로 같아야 한다.
//    항목 안에 " · "(양쪽 공백 포함)를 넣지 말 것 — "데이터 수집·적재"처럼 공백 없는 중간점은 OK.

export interface SkillGroup {
  cat: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    cat: "AI · 에이전트 운영",
    items: [
      "AI 모델 API 연동",
      "AI가 일을 처리하는 흐름 설계",
      "사람이 승인하는 지점 설계",
      "결과를 검사해 통과시키는 절차",
      "만드는 역할과 검사하는 역할 분리",
      "운영 자동화",
    ],
  },
  {
    cat: "백엔드",
    items: [
      "Kotlin",
      "Java",
      "Ruby",
      "PHP",
      "Spring Boot",
      "Spring Cloud",
      "WebFlux",
      "Coroutine",
      "JPA",
      "QueryDSL",
      "R2DBC",
      "MSA",
      "Flyway",
    ],
  },
  {
    cat: "인프라 · 데이터",
    items: [
      "AWS",
      "AWS EKS",
      "Spot Ocean",
      "Argo CD",
      "Argo Workflows",
      "Docker",
      "Kubernetes",
      "Linux",
      "Kafka",
      "Redis",
      "PostgreSQL",
      "PostGIS",
      "MariaDB",
      "MySQL",
      "DynamoDB",
    ],
  },
  {
    cat: "신뢰성 · 운영",
    items: [
      "데이터 수집·적재의 신뢰성",
      "아무 표시 없이 지나가는 실패 방지",
      "작업 성공과 데이터 성공을 따로 확인",
      "대시보드에서 불러오는 중 / 대체 표시 / 실패 구분",
      "인덱스 설계",
      "쿼리 최적화",
      "성능 튜닝",
    ],
  },
  {
    cat: "검색 · 도구",
    items: [
      "ElasticSearch",
      "OpenSearch",
      "Meilisearch",
      "Git",
      "GitHub",
      "Notion",
      "Jira",
      "Confluence",
      "Slack",
      "Google Workspace",
    ],
  },
  {
    cat: "리딩 · 협업",
    items: ["Agile/Scrum", "코드 리뷰", "기술 의사결정", "문서화", "절차 문서로 정리"],
  },
];

// ── 이력서(/cv/resume) 알약 뱃지용 — 위 목록에서 "키워드"만 추린 부분집합.
// 알약에는 문장이 아니라 스캔되는 낱말이 들어가야 한다("대시보드에서 불러오는 중 / 대체 표시 /
// 실패 구분" 같은 서술은 뱃지로 읽히지 않는다). 여기서 뺀 서술형 역량은 핵심 역량·경력·
// 일하는 방식에서 이미 문장으로 말하고 있으므로 정보 손실이 아니다.
// Git·GitHub·Notion·Jira·Slack 같은 협업 도구는 뺐다 — 이 연차에서 스킬로 읽히지 않는다.
// ⚠️ 위 SKILL_GROUPS 에 없는 항목을 새로 만들지 말 것 — 검증된 주장만 남기는 부분집합이다.
export const SKILL_CHIPS: SkillGroup[] = [
  {
    cat: "백엔드",
    items: [
      "Kotlin",
      "Java",
      "Ruby",
      "Spring Boot",
      "Spring Cloud",
      "WebFlux",
      "Coroutine",
      "JPA",
      "QueryDSL",
      "R2DBC",
      "MSA",
    ],
  },
  {
    cat: "인프라 · 데이터 · 검색",
    items: [
      "AWS",
      "AWS EKS",
      "Kubernetes",
      "Docker",
      "Argo CD",
      "Argo Workflows",
      "Kafka",
      "Redis",
      "PostgreSQL",
      "PostGIS",
      "MySQL",
      "DynamoDB",
      "ElasticSearch",
      "OpenSearch",
      "Meilisearch",
    ],
  },
  {
    cat: "AI · 운영 · 성능",
    items: [
      "AI 모델 API 연동",
      "사람이 승인하는 지점 설계",
      "운영 자동화",
      "인덱스 설계",
      "쿼리 최적화",
      "성능 튜닝",
    ],
  },
];
