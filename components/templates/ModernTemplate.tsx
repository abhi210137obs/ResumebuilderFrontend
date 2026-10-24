import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { displayUrl, formatDate, formatDateRange, prepareResume, toHref } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 first:mt-0">
      <h2 className="text-[9pt] font-semibold tracking-[0.18em] text-indigo-200 uppercase">{title}</h2>
      <div className="mt-3 space-y-2.5">{children}</div>
    </section>
  );
}

function MainSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="flex items-center gap-3 text-[10pt] font-bold tracking-[0.16em] text-indigo-700 uppercase">
        {title}
        <span className="h-px flex-1 bg-indigo-100" />
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-[9pt] leading-snug text-slate-100">
      <span className="mt-[1px] shrink-0 text-indigo-300">{icon}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

export function ModernTemplate({ resume }: { resume: ResumeData }) {
  const r = prepareResume(resume);
  const hasContact = Boolean(r.email || r.phone || r.location || r.links.length);
  const iconClass = "size-3.5";

  return (
    <article className="resume-page flex font-sans text-[10pt] leading-[1.5]">
      <aside className="w-[68mm] shrink-0 bg-slate-800 px-[8mm] py-[14mm] text-white">
        {hasContact && (
          <SidebarSection title="Contact">
            {r.email && (
              <ContactItem icon={<Mail className={iconClass} aria-hidden="true" />}>
                <a href={`mailto:${r.email}`}>{r.email}</a>
              </ContactItem>
            )}
            {r.phone && <ContactItem icon={<Phone className={iconClass} aria-hidden="true" />}>{r.phone}</ContactItem>}
            {r.location && (
              <ContactItem icon={<MapPin className={iconClass} aria-hidden="true" />}>{r.location}</ContactItem>
            )}
            {r.links.map((link, index) => (
              <ContactItem key={index} icon={<Globe className={iconClass} aria-hidden="true" />}>
                {link.label && <span className="block text-[8pt] text-slate-400">{link.label}</span>}
                <a href={toHref(link.url)}>{displayUrl(link.url)}</a>
              </ContactItem>
            ))}
          </SidebarSection>
        )}

        {r.skills.length > 0 && (
          <SidebarSection title="Skills">
            <ul className="flex flex-wrap gap-1.5">
              {r.skills.map((skill, index) => (
                <li key={index} className="rounded bg-slate-700 px-2 py-0.5 text-[8.5pt] text-slate-100">
                  {skill}
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {r.certifications.length > 0 && (
          <SidebarSection title="Certifications">
            {r.certifications.map((cert, index) => (
              <div key={index} className="resume-avoid-break text-[9pt] leading-snug">
                {cert.name && <p className="font-semibold text-white">{cert.name}</p>}
                {(cert.issuer || cert.date) && (
                  <p className="text-slate-300">{[cert.issuer, formatDate(cert.date)].filter(Boolean).join(" · ")}</p>
                )}
              </div>
            ))}
          </SidebarSection>
        )}
      </aside>

      <div className="min-w-0 flex-1 px-[10mm] py-[14mm]">
        {r.fullName && (
          <header className="mb-6">
            <h1 className="text-[26pt] leading-[1.1] font-bold tracking-tight text-slate-900">{r.fullName}</h1>
            <div className="mt-3 h-1 w-14 rounded-full bg-indigo-600" />
          </header>
        )}

        {r.summary && (
          <MainSection title="Profile">
            <p className="whitespace-pre-line text-slate-700">{r.summary}</p>
          </MainSection>
        )}

        {r.experience.length > 0 && (
          <MainSection title="Experience">
            {r.experience.map((job, index) => (
              <div key={index} className="resume-avoid-break">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[11pt] font-semibold text-slate-900">{job.role || job.company}</h3>
                  <span className="shrink-0 text-[8.5pt] font-medium text-slate-500">
                    {formatDateRange(job.startDate, job.endDate, job.current)}
                  </span>
                </div>
                {(job.role && job.company) || job.location ? (
                  <p className="text-[9.5pt] font-medium text-indigo-700">
                    {[job.role ? job.company : "", job.location].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {job.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-slate-700">
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className="relative pl-3.5">
                        <span className="absolute top-[0.6em] left-0 size-1.5 rounded-full bg-indigo-400" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {r.projects.length > 0 && (
          <MainSection title="Projects">
            {r.projects.map((project, index) => (
              <div key={index} className="resume-avoid-break">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[11pt] font-semibold text-slate-900">{project.name}</h3>
                  {project.link && (
                    <a href={toHref(project.link)} className="shrink-0 text-[8.5pt] text-indigo-700">
                      {displayUrl(project.link)}
                    </a>
                  )}
                </div>
                {project.description && <p className="whitespace-pre-line text-slate-700">{project.description}</p>}
                {project.techStack.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-1">
                    {project.techStack.map((tech, i) => (
                      <li key={i} className="rounded border border-indigo-100 bg-indigo-50 px-1.5 text-[8pt] text-indigo-700">
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {r.education.length > 0 && (
          <MainSection title="Education">
            {r.education.map((edu, index) => (
              <div key={index} className="resume-avoid-break">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[11pt] font-semibold text-slate-900">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ") || edu.school}
                  </h3>
                  <span className="shrink-0 text-[8.5pt] font-medium text-slate-500">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                {((edu.degree || edu.field) && edu.school) || edu.grade ? (
                  <p className="text-[9.5pt] font-medium text-indigo-700">
                    {[edu.degree || edu.field ? edu.school : "", edu.grade ? `Grade: ${edu.grade}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </article>
  );
}
