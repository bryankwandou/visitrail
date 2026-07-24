import { draftGroundedCareNote } from "./care-notes.ts";
import { demoCaregivers, demoVisit } from "./demo-data.ts";
import { evaluateVisitBillability } from "./evv.ts";
import { rankCaregivers } from "./matching.ts";
import { prepareEvidenceProof } from "./proof.ts";
export type AgentIntent = "verify_visit" | "draft_note" | "match_caregiver" | "prepare_proof" | "operations_summary";
export type AgentPlan = { intent: AgentIntent; scenario?: "valid" | "flagged"; explanation: string };
const validEvidence = { visitId: demoVisit.id, source: "device_gps" as const, checkInAt: "2026-07-24T09:02:00-05:00", checkOutAt: "2026-07-24T10:28:00-05:00", checkInLocation: { latitude: 30.2677, longitude: -97.743 }, checkOutLocation: { latitude: 30.26765, longitude: -97.74305 } };
const flaggedEvidence = { ...validEvidence, checkInAt: "2026-07-24T09:48:00-05:00", checkOutAt: "2026-07-24T10:12:00-05:00", checkInLocation: { latitude: 30.2708, longitude: -97.748 } };
export function executeAgentPlan(plan: AgentPlan) {
  if (plan.intent === "verify_visit") return { tool: "evaluateVisitBillability", data: evaluateVisitBillability(demoVisit, plan.scenario === "flagged" ? flaggedEvidence : validEvidence), authority: "deterministic" };
  if (plan.intent === "draft_note") return { tool: "draftGroundedCareNote", data: draftGroundedCareNote({ clientName: demoVisit.clientName, observations: demoVisit.tasks.map((task,index)=>({task,completed:index!==2,observation:index===3?"Client was alert and reported no new discomfort.":undefined})), generalObservation: "Breakfast intake was approximately 75 percent." }), authority: "human_review_required" };
  if (plan.intent === "match_caregiver") return { tool: "rankCaregivers", data: rankCaregivers(demoCaregivers,{skills:["Dementia","Medication"],languages:["English","Spanish"],preferredSlots:["Weekday morning"]}), authority: "coordinator_decision_required" };
  if (plan.intent === "prepare_proof") return { tool: "prepareEvidenceProof", data: prepareEvidenceProof({visitRecordId:"visit-record-2048",finalizedAt:"2026-07-24T15:28:00Z",evidenceDigest:{status:"verified",distanceMeters:9,durationMinutes:86,noteStatus:"finalized"}}), authority: "wallet_signature_required" };
  return { tool: "operationsSummary", data: { coveragePercent:94, verifiedVisits:18, openReviews:3, finalizedNotes:14, priority:"Resolve the oldest location exception before billing export." }, authority: "advisory_only" };
}
