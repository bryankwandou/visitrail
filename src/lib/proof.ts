import { createHash } from "node:crypto";
function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonicalize(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
export function prepareEvidenceProof(input: { visitRecordId: string; finalizedAt: string; evidenceDigest: Record<string, unknown> }) {
  const canonical = canonicalize({ visitRecordId: input.visitRecordId, finalizedAt: input.finalizedAt, evidenceDigest: input.evidenceDigest });
  const recordHash = createHash("sha256").update(canonical).digest("hex");
  return { recordHash, memoText: `VisitRail:v1:${recordHash}`, cluster: "devnet" as const, personalFieldsExcluded: true };
}
