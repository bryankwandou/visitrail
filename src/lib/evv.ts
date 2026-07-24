import type { Coordinates, EvvDecision, ScheduledVisit, VisitEvidence } from "./domain";
const EARTH_RADIUS_METERS = 6_371_000;
const toRadians = (value: number) => (value * Math.PI) / 180;
export function distanceInMeters(a: Coordinates, b: Coordinates) {
  const latitudeDelta = toRadians(b.latitude - a.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);
  const latitudeA = toRadians(a.latitude);
  const latitudeB = toRadians(b.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}
export function evaluateVisitBillability(visit: ScheduledVisit, evidence: VisitEvidence, options: { radiusMeters?: number; minimumRatio?: number } = {}): EvvDecision {
  const radiusMeters = options.radiusMeters ?? 150;
  const minimumRatio = options.minimumRatio ?? 0.8;
  const reasons: string[] = [];
  if (evidence.source !== "device_gps") reasons.push("Visit evidence must come from device GPS, not manual entry.");
  if (!evidence.checkInAt || !evidence.checkOutAt) reasons.push("Both check-in and check-out timestamps are required.");
  if (!evidence.checkInLocation || !evidence.checkOutLocation) reasons.push("Both check-in and check-out locations are required.");
  const distanceMeters = evidence.checkInLocation ? Math.round(distanceInMeters(visit.location, evidence.checkInLocation)) : null;
  if (distanceMeters !== null && distanceMeters > radiusMeters) reasons.push(`Check-in was ${distanceMeters}m from the service location; limit is ${radiusMeters}m.`);
  const checkoutDistance = evidence.checkOutLocation ? Math.round(distanceInMeters(visit.location, evidence.checkOutLocation)) : null;
  if (checkoutDistance !== null && checkoutDistance > radiusMeters) reasons.push(`Check-out was ${checkoutDistance}m from the service location; limit is ${radiusMeters}m.`);
  const durationMinutes = evidence.checkInAt && evidence.checkOutAt ? Math.round((Date.parse(evidence.checkOutAt) - Date.parse(evidence.checkInAt)) / 60_000) : null;
  if (durationMinutes !== null && durationMinutes <= 0) reasons.push("Check-out must occur after check-in.");
  else if (durationMinutes !== null && durationMinutes < visit.serviceMinutes * minimumRatio) reasons.push(`Recorded duration was ${durationMinutes} minutes; minimum supported duration is ${Math.ceil(visit.serviceMinutes * minimumRatio)} minutes.`);
  if (reasons.length) return { status: "flagged_unverified", billable: false, distanceMeters, durationMinutes, reasons };
  return { status: "verified", billable: true, distanceMeters, durationMinutes, reasons: ["Location, time, and source evidence passed deterministic verification."] };
}
export function resolveFlaggedVisit(decision: EvvDecision, reviewerRole: "care_coordinator" | "agency_admin" | "caregiver" | "family", reason: string, approveBilling: boolean): EvvDecision {
  if (decision.status !== "flagged_unverified") return decision;
  if (!["care_coordinator", "agency_admin"].includes(reviewerRole)) throw new Error("Only a coordinator or agency administrator can resolve flagged visits.");
  if (reason.trim().length < 12) throw new Error("A documented review reason of at least 12 characters is required.");
  return { ...decision, status: approveBilling ? "reviewed_billable" : "reviewed_non_billable", billable: approveBilling, reasons: [...decision.reasons, `Human review: ${reason.trim()}`] };
}
