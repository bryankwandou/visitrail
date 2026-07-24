import test from "node:test";
import assert from "node:assert/strict";
import { executeAgentPlan } from "../src/lib/agent-tools.ts";
test("agent routes valid EVV through deterministic verifier",()=>{const result=executeAgentPlan({intent:"verify_visit",scenario:"valid",explanation:"test"});assert.equal(result.tool,"evaluateVisitBillability");assert.equal((result.data as {billable:boolean}).billable,true);assert.equal(result.authority,"deterministic")});
test("agent cannot silently approve flagged evidence",()=>{const result=executeAgentPlan({intent:"verify_visit",scenario:"flagged",explanation:"test"});assert.equal((result.data as {billable:boolean}).billable,false)});
test("agent note and matching retain human decision boundaries",()=>{assert.equal(executeAgentPlan({intent:"draft_note",explanation:"test"}).authority,"human_review_required");assert.equal(executeAgentPlan({intent:"match_caregiver",explanation:"test"}).authority,"coordinator_decision_required")});
