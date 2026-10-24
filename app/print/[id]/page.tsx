import type { Metadata } from "next";
import { Suspense } from "react";
import { PrintResume } from "@/components/templates/PrintResume";

export const metadata: Metadata = {
  title: "Print resume",
  robots: { index: false, follow: false },
};

export default function PrintPage({ params }: PageProps<"/print/[id]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ id }) => (
        <PrintResume id={id} />
      ))}
    </Suspense>
  );
}
