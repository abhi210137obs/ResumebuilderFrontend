"use client";

import { useElementHeight, useScaleToFit } from "@/hooks/useScaleToFit";
import { cn } from "@/lib/cn";
import type { ResumeData } from "@/lib/types";
import { ResumeTemplate } from ".";

const MM_TO_PX = 96 / 25.4;
export const A4_WIDTH_PX = 210 * MM_TO_PX;
export const A4_HEIGHT_PX = 297 * MM_TO_PX;

interface ScaledResumeProps {
  resume: ResumeData;
  padding?: number;
  maxScale?: number;
  className?: string;
}

export function ScaledResume({ resume, padding = 0, maxScale = 1, className }: ScaledResumeProps) {
  const { ref, scale } = useScaleToFit<HTMLDivElement>(A4_WIDTH_PX, padding, maxScale);
  const { ref: pageRef, height } = useElementHeight<HTMLDivElement>(A4_HEIGHT_PX);
  const appliedScale = scale ?? maxScale;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div
        className="relative mx-auto"
        style={{
          width: A4_WIDTH_PX * appliedScale,
          height: height * appliedScale,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        <div
          ref={pageRef}
          className="absolute top-0 left-0 overflow-hidden rounded-sm shadow-xl ring-1 ring-black/5"
          style={{ width: A4_WIDTH_PX, transform: `scale(${appliedScale})`, transformOrigin: "top left" }}
        >
          <ResumeTemplate resume={resume} />
        </div>
      </div>
    </div>
  );
}
