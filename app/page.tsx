import { ArrowRight, Download, Eye, GripVertical, LayoutTemplate, Save, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScaledResume } from "@/components/templates/ScaledResume";
import { ButtonLink } from "@/components/ui/Button";
import { sampleResume } from "@/lib/sampleResume";

const features = [
  {
    icon: Eye,
    title: "Live preview",
    description: "See every change on a pixel-perfect A4 page the moment you type.",
  },
  {
    icon: LayoutTemplate,
    title: "Three polished templates",
    description: "Switch between Classic, Modern and Minimal at any time without losing content.",
  },
  {
    icon: Save,
    title: "Autosave",
    description: "Your work is saved automatically in the background, so nothing gets lost.",
  },
  {
    icon: Download,
    title: "One-click PDF export",
    description: "Download a crisp, print-ready PDF that looks exactly like the preview.",
  },
  {
    icon: GripVertical,
    title: "Drag and drop",
    description: "Reorder jobs, projects and skills by dragging them where they belong.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-friendly",
    description: "The Minimal template uses plain, parseable text that applicant tracking systems love.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Free resume builder
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Build a resume that <span className="text-indigo-600">gets you hired.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
                Fill in a simple form, watch your resume come to life in real time, and export a beautiful PDF in one
                click. No design skills required.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/register" size="lg">
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/login" size="lg" variant="outline">
                  Login
                </ButtonLink>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-indigo-200/60 to-sky-100/40 blur-2xl" />
              <div className="pointer-events-none mx-auto max-w-[440px] select-none">
                <ScaledResume resume={sampleResume} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24" aria-labelledby="features-heading">
          <div className="max-w-2xl">
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-zinc-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-zinc-600">
              A focused editor designed to help you write a great resume quickly.
            </p>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-600">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-zinc-900 px-8 py-10 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Ready to land your next role?</h2>
              <p className="mt-1 text-zinc-300">Create your first resume in under five minutes.</p>
            </div>
            <ButtonLink href="/register" size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Get Started
            </ButtonLink>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
        ResumeBuilder · Craft your story, land your next role.
      </footer>
    </div>
  );
}
