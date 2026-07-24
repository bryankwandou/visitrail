import { NextResponse } from "next/server";
import { draftGroundedCareNote } from "@/lib/care-notes";
import type { TaskObservation } from "@/lib/domain";
export async function POST(request: Request){ const body=await request.json() as {clientName?:string;observations?:TaskObservation[];generalObservation?:string}; if(!body.clientName||!Array.isArray(body.observations)) return NextResponse.json({error:"clientName and observations are required"},{status:400}); return NextResponse.json(draftGroundedCareNote({clientName:body.clientName,observations:body.observations,generalObservation:body.generalObservation})); }
