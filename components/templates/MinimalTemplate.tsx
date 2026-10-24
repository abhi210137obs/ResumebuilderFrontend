import type { ReactNode } from "react";
import { displayUrl, formatDate, formatDateRange, prepareResume } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="text-[11pt] font-bold tracking-wide text-black uppercase">{title}</h2>
      <div className="mt-1.5 space-y-2.5">{children}</div>
    </section>
  );
}

export function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const r = prepareResume(resume);
  const contact = [
    r.email,
    r.phone,
    r.location,
    ...r.links.map((link) => (link.label ? `${link.label}: ${displayUrl(link.url)}` : displayUrl(link.url))),
  ].filter(Boolean);

  return (
    <article
      className="resume-page px-[18mm] py-[15mm] text-[10.5pt] leading-[1.4] text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {r.fullName && <h1 className="text-[20pt] leading-tight font-bold">{r.fullName}</h1>}
      {contact.length > 0 && <p className="mt-1 text-[10pt]">{contact.join(" | ")}</p>}

      {r.summary && (
        <Section title="Summary">
          <p className="whitespace-pre-line">{r.summary}</p>
        </Section>
      )}

      {r.experience.length > 0 && (
        <Section title="Experience">
          {r.experience.map((job, index) => {
            const dates = formatDateRange(job.startDate, job.endDate, job.current);
            return (
              <div key={index} className="resume-avoid-break">
                <p>
                  <strong>{[job.role, job.company].filter(Boolean).join(", ")}</strong>
                  {job.location && <span>, {job.location}</span>}
                </p>
                {dates && <p>{dates}</p>}
                {job.bullets.length > 0 && (
                  <ul className="mt-0.5 list-disc pl-5">
                    {job.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {r.education.length > 0 && (
        <Section title="Education">
          {r.education.map((edu, index) => {
            const dates = formatDateRange(edu.startDate, edu.endDate);
            return (
              <div key={index} className="resume-avoid-break">
                <p>
                  <strong>{[edu.degree, edu.field].filter(Boolean).join(", ") || edu.school}</strong>
                  {(edu.degree || edu.field) && edu.school && <span>, {edu.school}</span>}
                </p>
                {(dates || edu.grade) && <p>{[dates, edu.grade ? `Grade: ${edu.grade}` : ""].filter(Boolean).join(" | ")}</p>}
              </div>
            );
          })}
        </Section>
      )}

      {r.skills.length > 0 && (
        <Section title="Skills">
          <p>{r.skills.join(", ")}</p>
        </Section>
      )}

      {r.projects.length > 0 && (
        <Section title="Projects">
          {r.projects.map((project, index) => (
            <div key={index} className="resume-avoid-break">
              <p>
                <strong>{project.name}</strong>
                {project.link && <span>{project.name ? " | " : ""}{displayUrl(project.link)}</span>}
              </p>
              {project.description && <p className="whitespace-pre-line">{project.description}</p>}
              {project.techStack.length > 0 && <p>Technologies: {project.techStack.join(", ")}</p>}
            </div>
          ))}
        </Section>
      )}

      {r.certifications.length > 0 && (
        <Section title="Certifications">
          {r.certifications.map((cert, index) => {
            const details = [cert.issuer, formatDate(cert.date)].filter(Boolean).join(", ");
            return (
              <p key={index} className="resume-avoid-break">
                <strong>{cert.name}</strong>
                {details && `${cert.name ? ", " : ""}${details}`}
              </p>
            );
          })}
        </Section>
      )}
    </article>
  );
}
