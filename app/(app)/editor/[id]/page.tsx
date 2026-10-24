import type { Metadata } from "next";
import { Suspense } from "react";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { FullPageSpinner } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Editor" };

export default function EditorPage({ params }: PageProps<"/editor/[id]">) {
  return (
    <Suspense fallback={<FullPageSpinner label="Loading editor" />}>
      {params.then(({ id }) => (
        <ResumeEditor key={id} id={id} />
      ))}
    </Suspense>
  );
}
