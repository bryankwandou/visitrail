import test from "node:test";
import assert from "node:assert/strict";
import { prepareEvidenceProof } from "../src/lib/proof.ts";
test("proof hash is stable and memo excludes care fields",()=>{ const first=prepareEvidenceProof({visitRecordId:"vr-1",finalizedAt:"2026-07-24T10:30:00Z",evidenceDigest:{duration:86,distance:9}}); const second=prepareEvidenceProof({visitRecordId:"vr-1",finalizedAt:"2026-07-24T10:30:00Z",evidenceDigest:{distance:9,duration:86}}); assert.equal(first.recordHash,second.recordHash); assert.match(first.memoText,/^VisitRail:v1:[a-f0-9]{64}$/); assert.equal(first.memoText.includes("duration"),false); assert.equal(first.personalFieldsExcluded,true); });
