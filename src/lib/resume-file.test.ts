import assert from "node:assert/strict";
import { test } from "node:test";
import {
  RESUME_MAX_BYTES,
  resumeContentType,
  resumeFileProblem,
  resumeObjectName,
} from "./resume-file.ts";

test("accepts a pdf under 5 MB and rejects other files", () => {
  assert.equal(
    resumeFileProblem({ name: "CV.pdf", size: 1024, type: "application/pdf" }),
    null,
  );
  assert.match(
    resumeFileProblem({
      name: "notes.txt",
      size: 100,
      type: "text/plain",
    }) ?? "",
    /PDF, DOC, or DOCX/,
  );
  assert.match(
    resumeFileProblem({
      name: "CV.pdf",
      size: RESUME_MAX_BYTES + 1,
      type: "application/pdf",
    }) ?? "",
    /5 MB/,
  );
});

test("stores a unique sanitised object name", () => {
  const name = resumeObjectName("My CV (final).docx");
  assert.match(name, /^[0-9a-f-]{36}-my-cv-final\.docx$/);
  const dotted = resumeObjectName("Jane..Smith.pdf");
  assert.doesNotMatch(dotted, /\.\./);
  assert.match(dotted, /^[0-9a-f-]{36}-jane\.smith\.pdf$/);
  assert.equal(
    resumeContentType("letter.doc", ""),
    "application/msword",
  );
});
