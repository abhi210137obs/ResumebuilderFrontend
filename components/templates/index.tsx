import type { ResumeData } from "@/lib/types";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ModernTemplate } from "./ModernTemplate";

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function ResumeTemplate({ resume }: { resume: ResumeData }) {
  const Template = templates[resume.template as keyof typeof templates] ?? ClassicTemplate;
  return <Template resume={resume} />;
}

export { ClassicTemplate, MinimalTemplate, ModernTemplate };
