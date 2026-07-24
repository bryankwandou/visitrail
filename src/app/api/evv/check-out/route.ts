import { NextResponse } from "next/server";
import { demoVisit } from "@/lib/demo-data";
import { evaluateVisitBillability } from "@/lib/evv";
import type { VisitEvidence } from "@/lib/domain";
export async function POST(request: Request){ const evidence=await request.json() as VisitEvidence; const decision=evaluateVisitBillability(demoVisit,evidence); return NextResponse.json(decision,{status:decision.billable?200:422}); }
