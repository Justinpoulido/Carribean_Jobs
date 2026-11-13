export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

const RESUME_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

type ResumeExtension = keyof typeof RESUME_TYPES;

export function resumeFileProblem(file: { name: string; size: number; type: string }) {
  if (file.size <= 0) {
    return "Choose a CV file to upload.";
  }
  if (file.size > RESUME_MAX_BYTES) {
    return "CV must be 5 MB or smaller.";
  }
  if (!resumeContentType(file.name, file.type)) {
    return "CV must be a PDF, DOC, or DOCX file.";
  }
  return null;
}

export function resumeContentType(fileName: string, mimeType: string) {
  const extension = fileExtension(fileName);
  if (!extension) {
    return null;
  }
  const expected = RESUME_TYPES[extension];
  const provided = mimeType.trim().toLowerCase();
  if (provided && provided !== expected && provided !== "application/octet-stream") {
    return null;
  }
  return expected;
}

export function resumeObjectName(fileName: string) {
  const extension = fileExtension(fileName);
  const base = fileName
    .split(/[/\\]/)
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 60);
  const stem = base || "cv";
  return `${crypto.randomUUID()}-${stem}.${extension}`;
}

function fileExtension(fileName: string): ResumeExtension | null {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  const extension = match?.[1]?.toLowerCase();
  if (extension === "pdf" || extension === "doc" || extension === "docx") {
    return extension;
  }
  return null;
}
