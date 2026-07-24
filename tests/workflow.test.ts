import test from "node:test";
import assert from "node:assert/strict";
import { draftGroundedCareNote } from "../src/lib/care-notes.ts";
import { demoCaregivers } from "../src/lib/demo-data.ts";
import { rankCaregivers } from "../src/lib/matching.ts";
test("draft never marks unsupported tasks complete",()=>{ const note=draftGroundedCareNote({clientName:"Evelyn",observations:[{task:"Medication",completed:true},{task:"Mobility",completed:false}]}); assert.deepEqual(note.completedTasks,["Medication"]); assert.deepEqual(note.unconfirmedTasks,["Mobility"]); assert.match(note.summary,/Not confirmed as completed: Mobility/); assert.equal(note.requiresReview,true); });
test("matching ranks strongest skill language and schedule fit first",()=>{ const results=rankCaregivers(demoCaregivers,{skills:["Dementia","Medication"],languages:["English","Spanish"],preferredSlots:["Weekday morning"]}); assert.equal(results[0].name,"Maya Thompson"); assert.ok(results[0].score>results[1].score); });
