"use client";
import { useMemo, useState } from "react";
import { draftGroundedCareNote } from "@/lib/care-notes";
import { demoCaregivers, demoVisit } from "@/lib/demo-data";
import { evaluateVisitBillability, resolveFlaggedVisit } from "@/lib/evv";
import { rankCaregivers } from "@/lib/matching";
import type { EvvDecision } from "@/lib/domain";

const cleanEvidence = { visitId: demoVisit.id, source: "device_gps" as const, checkInAt: "2026-07-24T09:02:00-05:00", checkOutAt: "2026-07-24T10:28:00-05:00", checkInLocation: { latitude: 30.2677, longitude: -97.743 }, checkOutLocation: { latitude: 30.26765, longitude: -97.74305 } };
const flaggedEvidence = { ...cleanEvidence, checkInAt: "2026-07-24T09:48:00-05:00", checkOutAt: "2026-07-24T10:12:00-05:00", checkInLocation: { latitude: 30.2708, longitude: -97.748 } };

export function OperationsWorkspace() {
  const [decision, setDecision] = useState<EvvDecision | null>(null);
  const [noteReady, setNoteReady] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const matches = useMemo(() => rankCaregivers(demoCaregivers, { skills: ["Dementia", "Medication"], languages: ["English", "Spanish"], preferredSlots: ["Weekday morning"] }), []);
  const note = draftGroundedCareNote({ clientName: demoVisit.clientName, observations: demoVisit.tasks.map((task, index) => ({ task, completed: index !== 2, observation: index === 3 ? "Client was alert, conversational, and reported no new discomfort." : undefined })), generalObservation: "Breakfast intake was approximately 75 percent." });
  const runVerified = () => { setDecision(evaluateVisitBillability(demoVisit, cleanEvidence)); setReviewed(false); };
  const runFlagged = () => { setDecision(evaluateVisitBillability(demoVisit, flaggedEvidence)); setReviewed(false); };
  const resolve = () => { if (!decision) return; setDecision(resolveFlaggedVisit(decision, "care_coordinator", "Traffic delay confirmed with client and GPS trail reviewed.", true)); setReviewed(true); };
  return <div className="dashboard-grid">
    <section className="metric-row">
      <article className="metric"><span>Today&apos;s coverage</span><strong>94%</strong><small>31 of 33 visits staffed</small></article>
      <article className="metric"><span>Verified visits</span><strong>18</strong><small>2 awaiting check-out</small></article>
      <article className="metric alert"><span>Review queue</span><strong>3</strong><small>Oldest open for 42 minutes</small></article>
      <article className="metric"><span>Notes finalized</span><strong>14</strong><small>Median review time 3m</small></article>
    </section>
    <section className="panel span-7"><div className="panel-head"><div><p className="eyebrow">Live verification lab</p><h2>Prove a visit before billing</h2></div><span className="status neutral">Deterministic</span></div>
      <div className="visit-card"><div className="time-tile"><strong>9:00</strong><span>AM</span><i /></div><div className="visit-copy"><strong>{demoVisit.clientName}</strong><span>{demoVisit.address}</span><small>{demoVisit.caregiverName} · Personal care · 90 min</small></div><span className="status scheduled">Scheduled</span></div>
      <div className="action-row"><button className="button primary" onClick={runVerified}>Run valid GPS proof</button><button className="button secondary" onClick={runFlagged}>Test weak evidence</button></div>
      {decision && <div className={`decision ${decision.billable?"pass":"flag"}`}><div className="decision-icon">{decision.billable?"✓":"!"}</div><div><strong>{decision.status.replaceAll("_", " ")}</strong><p>{decision.reasons[0]}</p><small>{decision.distanceMeters ?? "—"}m from address · {decision.durationMinutes ?? "—"} minutes recorded</small></div>{decision.status === "flagged_unverified" && <button onClick={resolve}>Document review</button>}</div>}
      {reviewed && <p className="audit-line">Review recorded by Care Coordinator · Billing exception now traceable</p>}
    </section>
    <section className="panel span-5"><div className="panel-head"><div><p className="eyebrow">Grounded drafting</p><h2>Care note evidence</h2></div><span className="status review">Review required</span></div>
      <div className="task-list">{demoVisit.tasks.map((task,index)=><div key={task}><span className={index!==2?"check done":"check"}>{index!==2?"✓":""}</span><p><strong>{task}</strong><small>{index===2?"Not confirmed — excluded from completed work":"Confirmed by caregiver"}</small></p></div>)}</div>
      <button className="button primary wide" onClick={()=>setNoteReady(true)}>Draft from recorded facts</button>
      {noteReady && <div className="note-preview"><p>{note.summary}</p><span>Human sign-off required before family visibility</span></div>}
    </section>
    <section className="panel span-7"><div className="panel-head"><div><p className="eyebrow">Continuity matching</p><h2>Best-fit caregivers</h2></div><button className="text-button">View methodology</button></div>
      <div className="match-list">{matches.map((match,index)=><div className="match" key={match.id}><span className="rank">0{index+1}</span><div className="person-avatar">{match.name.split(" ").map(v=>v[0]).join("")}</div><div><strong>{match.name}</strong><small>{match.reasons.slice(0,2).join(" · ")}</small></div><div className="score"><strong>{match.score}</strong><span>fit score</span></div></div>)}</div>
    </section>
    <section className="panel span-5 family-card"><div className="panel-head"><div><p className="eyebrow">Family visibility</p><h2>What families see</h2></div><span className="status verified">Finalized only</span></div><div className="family-update"><span className="pulse"/><p><strong>Visit completed</strong><small>Today at 10:28 AM</small></p></div><p className="family-note">Maya completed the medication reminder, breakfast preparation, and wellbeing check. Mobility support remains unconfirmed and is not shown as completed.</p><div className="privacy-rule">Draft and internal review details stay private.</div></section>
  </div>;
}
