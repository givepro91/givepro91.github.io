// CV 데이터의 단일 소스 = ./cv.json (로컬 admin `npm run admin` 이 R/W).
// 이 파일은 cv.json 에 타입을 붙여 re-export 만 한다 — 기존 import 경로( "../data/cv" )는 그대로 유지.
// 상세 위키(/cv)와 압축 이력서(/cv/print)가 모두 여기서 렌더.
import cv from "./cv.json";

export interface CareerEntry {
  company: string;
  period: string;
  duration?: string;
  role: string;
  current?: boolean;
  featured?: boolean; // PDF(print)에서 풀 디테일로 보일 대표 경력 (나머지는 1줄 mini)
  summary?: string;
  highlights: string[];
  stack?: string[];
}

export interface ProjectEntry {
  name: string;
  tagline: string;
  period: string;
  overview: string;
  stack: string[];
  achievements: string[];
  metrics?: string; // 규모/역할 한 줄 (예: "단독 · 441 커밋 · 공개 OSS")
  link?: string;
  linkLabel?: string;
  workSlug?: string; // Keunsik Works /work/{slug} 상호링크
  // 공개 제품 화면(이미지/갤러리)은 src/data/galleries.json 으로 분리 (로컬 admin이 R/W, key = name)
}

export interface CaseEntry {
  title: string;
  situation: string[];
  approach: string[];
  result: string[];
}

export const PROFILE = cv.PROFILE;
export const HIGHLIGHTS = cv.HIGHLIGHTS;
export const CAREER = cv.CAREER as CareerEntry[];
export const EDUCATION = cv.EDUCATION;
export const SKILLS = cv.SKILLS;
export const PROJECTS = cv.PROJECTS as ProjectEntry[];
export const AX_PROJECTS = cv.AX_PROJECTS as ProjectEntry[];
export const CASES = cv.CASES as CaseEntry[];
export const AWARDS = cv.AWARDS;
export const VALUES = cv.VALUES;
export const VISION = cv.VISION;
