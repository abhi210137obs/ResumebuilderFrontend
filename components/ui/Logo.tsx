import { FileText } from "lucide-react";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <FileText className="size-4.5" aria-hidden="true" />
      </span>
      ResumeBuilder
    </Link>
  );
}
