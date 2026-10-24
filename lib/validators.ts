import { z } from "zod";

const text = (max: number) => z.string().max(max, `Must be at most ${max} characters`);
const isEmail = (value: string) => z.email().safeParse(value).success;

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const linkSchema = z.object({
  label: text(50),
  url: text(500),
});

export const personalSchema = z.object({
  fullName: text(100),
  email: text(254).refine(
    (value) => value.trim() === "" || isEmail(value.trim()),
    "Enter a valid email address",
  ),
  phone: text(30),
  location: text(100),
  links: z.array(linkSchema).max(10, "At most 10 links allowed"),
});

export const experienceSchema = z.object({
  company: text(100),
  role: text(100),
  location: text(100),
  startDate: text(30),
  endDate: text(30),
  current: z.boolean(),
  bullets: z.array(text(500)).max(20, "At most 20 bullet points allowed"),
});

export const educationSchema = z.object({
  school: text(150),
  degree: text(100),
  field: text(100),
  startDate: text(30),
  endDate: text(30),
  grade: text(30),
});

export const projectSchema = z.object({
  name: text(100),
  description: text(1000),
  link: text(500),
  techStack: z.array(text(50)).max(30, "At most 30 technologies allowed"),
});

export const certificationSchema = z.object({
  name: text(150),
  issuer: text(150),
  date: text(30),
});

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title must be at most 100 characters");

export const resumeSchema = z.object({
  title: titleSchema,
  template: z.string().min(1, "Choose a template"),
  personal: personalSchema,
  summary: text(2000),
  experience: z.array(experienceSchema).max(30, "At most 30 positions allowed"),
  education: z.array(educationSchema).max(20, "At most 20 education entries allowed"),
  skills: z.array(text(50)).max(100, "At most 100 skills allowed"),
  projects: z.array(projectSchema).max(30, "At most 30 projects allowed"),
  certifications: z.array(certificationSchema).max(30, "At most 30 certifications allowed"),
});

export const createResumeSchema = z.object({
  title: titleSchema,
  template: z.string().min(1, "Choose a template"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CreateResumeValues = z.infer<typeof createResumeSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
export type ResumeLink = z.infer<typeof linkSchema>;
export type PersonalInfo = z.infer<typeof personalSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
