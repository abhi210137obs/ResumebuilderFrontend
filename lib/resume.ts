import type {
  Certification,
  Education,
  Experience,
  Project,
  ResumeData,
  ResumeLink,
} from "./types";

export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column with serif headings. Timeless and traditional.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two columns with a colored sidebar for contact details and skills.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Plain, ATS-friendly single column with no icons or graphics.",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export function getTemplateName(id: string) {
  return TEMPLATES.find((template) => template.id === id)?.name ?? "Classic";
}

const str = (value: unknown) => (typeof value === "string" ? value : "");
const strList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const list = <T>(value: unknown, map: (item: Record<string, unknown>) => T): T[] =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "object" && item !== null).map((item) => map(item))
    : [];

export const emptyLink = (): ResumeLink => ({ label: "", url: "" });

export const emptyExperience = (): Experience => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [""],
});

export const emptyEducation = (): Education => ({
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  grade: "",
});

export const emptyProject = (): Project => ({ name: "", description: "", link: "", techStack: [] });

export const emptyCertification = (): Certification => ({ name: "", issuer: "", date: "" });

export function normalizeResume(raw: Partial<Record<keyof ResumeData, unknown>>): ResumeData {
  const personal = (typeof raw.personal === "object" && raw.personal !== null ? raw.personal : {}) as Record<
    string,
    unknown
  >;
  return {
    title: str(raw.title),
    template: str(raw.template) || "classic",
    personal: {
      fullName: str(personal.fullName),
      email: str(personal.email),
      phone: str(personal.phone),
      location: str(personal.location),
      links: list(personal.links, (link) => ({ label: str(link.label), url: str(link.url) })),
    },
    summary: str(raw.summary),
    experience: list(raw.experience, (item) => ({
      company: str(item.company),
      role: str(item.role),
      location: str(item.location),
      startDate: str(item.startDate),
      endDate: str(item.endDate),
      current: item.current === true,
      bullets: strList(item.bullets),
    })),
    education: list(raw.education, (item) => ({
      school: str(item.school),
      degree: str(item.degree),
      field: str(item.field),
      startDate: str(item.startDate),
      endDate: str(item.endDate),
      grade: str(item.grade),
    })),
    skills: strList(raw.skills),
    projects: list(raw.projects, (item) => ({
      name: str(item.name),
      description: str(item.description),
      link: str(item.link),
      techStack: strList(item.techStack),
    })),
    certifications: list(raw.certifications, (item) => ({
      name: str(item.name),
      issuer: str(item.issuer),
      date: str(item.date),
    })),
  };
}

export const serializeResume = (resume: ResumeData) => JSON.stringify(resume);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value: string) {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(trimmed);
  if (match) {
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return `${MONTHS[month - 1]} ${match[1]}`;
  }
  return trimmed;
}

export function formatDateRange(start: string, end: string, current = false) {
  const from = formatDate(start);
  const to = current ? "Present" : formatDate(end);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

export function toHref(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const displayUrl = (url: string) => url.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

const filled = (...values: string[]) => values.some((value) => value.trim() !== "");

export function prepareResume(resume: ResumeData) {
  const personal = resume.personal;
  return {
    fullName: personal.fullName.trim(),
    email: personal.email.trim(),
    phone: personal.phone.trim(),
    location: personal.location.trim(),
    links: personal.links
      .filter((link) => filled(link.url))
      .map((link) => ({ label: link.label.trim(), url: link.url.trim() })),
    summary: resume.summary.trim(),
    experience: resume.experience
      .map((item) => ({ ...item, bullets: item.bullets.map((b) => b.trim()).filter(Boolean) }))
      .filter((item) => filled(item.company, item.role, item.location, item.startDate, item.endDate) || item.bullets.length > 0),
    education: resume.education.filter((item) =>
      filled(item.school, item.degree, item.field, item.startDate, item.endDate, item.grade),
    ),
    skills: resume.skills.map((skill) => skill.trim()).filter(Boolean),
    projects: resume.projects
      .map((item) => ({ ...item, techStack: item.techStack.map((t) => t.trim()).filter(Boolean) }))
      .filter((item) => filled(item.name, item.description, item.link) || item.techStack.length > 0),
    certifications: resume.certifications.filter((item) => filled(item.name, item.issuer, item.date)),
  };
}

export type PreparedResume = ReturnType<typeof prepareResume>;

export function isResumeEmpty(prepared: PreparedResume) {
  return (
    !prepared.fullName &&
    !prepared.email &&
    !prepared.phone &&
    !prepared.location &&
    prepared.links.length === 0 &&
    !prepared.summary &&
    prepared.experience.length === 0 &&
    prepared.education.length === 0 &&
    prepared.skills.length === 0 &&
    prepared.projects.length === 0 &&
    prepared.certifications.length === 0
  );
}

export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
