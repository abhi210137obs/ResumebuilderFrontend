import type { ReactNode } from "react";
import { displayUrl, formatDate, formatDateRange, prepareResume, toHref } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-zinc-800 pb-1 font-serif text-[12.5pt] font-bold tracking-[0.12em] text-zinc-900 uppercase">
        {title}
      </h2>
      <div className="mt-2.5 space-y-3">{children}</div>
    </section>
  );
}

function EntryHeader({ title, subtitle, meta, metaRight }: { title: string; subtitle?: string; meta?: string; metaRight?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-[11pt] font-bold text-zinc-900">{title}</h3>
        {metaRight && <span className="shrink-0 text-[9.5pt] text-zinc-600">{metaRight}</span>}
      </div>
      {(subtitle || meta) && (
        <div className="flex items-baseline justify-between gap-4 text-[10pt] text-zinc-700 italic">
          <span>{subtitle}</span>
          {meta && <span className="shrink-0">{meta}</span>}
        </div>
      )}
    </div>
  );
}

export function ClassicTemplate({ resume }: { resume: ResumeData }) {
  const r = prepareResume(resume);
  const contact = [r.email, r.phone, r.location].filter(Boolean);

  return (
    <article className="resume-page px-[18mm] py-[16mm] font-serif text-[10.5pt] leading-[1.45]">
      {(r.fullName || contact.length > 0 || r.links.length > 0) && (
        <header className="text-center">
          {r.fullName && <h1 className="font-serif text-[24pt] leading-tight font-bold tracking-wide text-zinc-900">{r.fullName}</h1>}
          {(contact.length > 0 || r.links.length > 0) && (
            <p className="mt-1.5 text-[9.5pt] text-zinc-700">
              {[
                ...contact.map((item) =>
                  item === r.email ? (
                    <a key="email" href={`mailto:${item}`}>
                      {item}
                    </a>
                  ) : (
                    <span key={item}>{item}</span>
                  ),
                ),
                ...r.links.map((link, index) => (
                  <a key={`link-${index}`} href={toHref(link.url)}>
                    {link.label ? `${link.label}: ${displayUrl(link.url)}` : displayUrl(link.url)}
                  </a>
                )),
              ].map((node, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-1.5 text-zinc-400">•</span>}
                  {node}
                </span>
              ))}
            </p>
          )}
        </header>
      )}

      {r.summary && (
        <Section title="Summary">
          <p className="whitespace-pre-line text-zinc-800">{r.summary}</p>
        </Section>
      )}

      {r.experience.length > 0 && (
        <Section title="Experience">
          {r.experience.map((job, index) => (
            <div key={index} className="resume-avoid-break">
              <EntryHeader
                title={job.role || job.company}
                metaRight={formatDateRange(job.startDate, job.endDate, job.current)}
                subtitle={job.role ? job.company : undefined}
                meta={job.location}
              />
              {job.bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-zinc-800">
                  {job.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {r.education.length > 0 && (
        <Section title="Education">
          {r.education.map((edu, index) => (
            <div key={index} className="resume-avoid-break">
              <EntryHeader
                title={edu.school || [edu.degree, edu.field].filter(Boolean).join(", ")}
                metaRight={formatDateRange(edu.startDate, edu.endDate)}
                subtitle={edu.school ? [edu.degree, edu.field].filter(Boolean).join(", ") : undefined}
                meta={edu.grade ? `Grade: ${edu.grade}` : undefined}
              />
            </div>
          ))}
        </Section>
      )}

      {r.skills.length > 0 && (
        <Section title="Skills">
          <p className="text-zinc-800">{r.skills.join(" • ")}</p>
        </Section>
      )}

      {r.projects.length > 0 && (
        <Section title="Projects">
          {r.projects.map((project, index) => (
            <div key={index} className="resume-avoid-break">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[11pt] font-bold text-zinc-900">{project.name}</h3>
                {project.link && (
                  <a href={toHref(project.link)} className="shrink-0 text-[9.5pt] text-zinc-600">
                    {displayUrl(project.link)}
                  </a>
                )}
              </div>
              {project.description && <p className="whitespace-pre-line text-zinc-800">{project.description}</p>}
              {project.techStack.length > 0 && (
                <p className="text-[9.5pt] text-zinc-600 italic">Technologies: {project.techStack.join(", ")}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {r.certifications.length > 0 && (
        <Section title="Certifications">
          {r.certifications.map((cert, index) => (
            <div key={index} className="resume-avoid-break flex items-baseline justify-between gap-4">
              <p>
                <span className="font-bold text-zinc-900">{cert.name}</span>
                {cert.issuer && <span className="text-zinc-700 italic">{cert.name ? ` — ${cert.issuer}` : cert.issuer}</span>}
              </p>
              {cert.date && <span className="shrink-0 text-[9.5pt] text-zinc-600">{formatDate(cert.date)}</span>}
            </div>
          ))}
        </Section>
      )}
    </article>
  );
}
