import type { ResumeData } from "./types";

export const sampleResume: ResumeData = {
  title: "Sample Resume",
  template: "modern",
  personal: {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 555 123 4567",
    location: "Berlin, Germany",
    links: [
      { label: "GitHub", url: "github.com/janedoe" },
      { label: "Portfolio", url: "janedoe.dev" },
    ],
  },
  summary:
    "Full-stack engineer with 6 years of experience building fast, accessible web products. Passionate about developer experience, clean architecture and shipping features users love.",
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Software Engineer",
      location: "Remote",
      startDate: "2021-03",
      endDate: "",
      current: true,
      bullets: [
        "Led the redesign of the customer dashboard, improving task completion by 32%.",
        "Designed REST APIs serving 2M requests per day with 99.98% uptime.",
        "Mentored 4 engineers and introduced a code review culture.",
      ],
    },
    {
      company: "Globex",
      role: "Frontend Engineer",
      location: "Munich, Germany",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      bullets: [
        "Built a component library used by 12 product teams.",
        "Cut bundle size by 45% through code splitting and lazy loading.",
      ],
    },
  ],
  education: [
    {
      school: "TU Berlin",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2018",
      grade: "1.7",
    },
  ],
  skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS"],
  projects: [
    {
      name: "Resume Builder",
      description: "A full-stack resume builder with live preview and PDF export.",
      link: "github.com/janedoe/resume-builder",
      techStack: ["Next.js", "Express", "MongoDB"],
    },
  ],
  certifications: [{ name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023-06" }],
};
