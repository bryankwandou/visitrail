import test from "node:test";
import assert from "node:assert/strict";
import { demoVisit } from "../src/lib/demo-data.ts";
import { evaluateVisitBillability, resolveFlaggedVisit } from "../src/lib/evv.ts";
const base={visitId:demoVisit.id,source:"device_gps" as const,checkInAt:"2026-07-24T09:00:00-05:00",checkOutAt:"2026-07-24T10:12:00-05:00",checkInLocation:demoVisit.location,checkOutLocation:demoVisit.location};
test("accepts exact minimum duration and radius",()=>{ const edge={...base,checkInLocation:{latitude:demoVisit.location.latitude+0.001349,longitude:demoVisit.location.longitude}}; const result=evaluateVisitBillability(demoVisit,edge,{radiusMeters:151}); assert.equal(result.billable,true); });
test("rejects manual duration bypass",()=>{ const result=evaluateVisitBillability(demoVisit,{...base,source:"manual"}); assert.equal(result.status,"flagged_unverified"); assert.equal(result.billable,false); });
test("rejects missing checkout",()=>{ const result=evaluateVisitBillability(demoVisit,{...base,checkOutAt:undefined,checkOutLocation:undefined}); assert.equal(result.billable,false); });
test("requires privileged documented review",()=>{ const flagged=evaluateVisitBillability(demoVisit,{...base,source:"manual"}); assert.throws(()=>resolveFlaggedVisit(flagged,"caregiver","I approve this",true)); assert.throws(()=>resolveFlaggedVisit(flagged,"care_coordinator","short",true)); assert.equal(resolveFlaggedVisit(flagged,"agency_admin","Client confirmed service and evidence was reviewed.",true).billable,true); });
